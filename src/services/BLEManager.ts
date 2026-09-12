/**
 * Godzilla Banker — BLE Manager
 *
 * Wraps react-native-ble-plx with a seamless simulator fallback when running inside Expo Go.
 * Talks to the ESP32 Super Mini firmware in firmware/godzilla_banker_esp32.ino over a custom GATT service:
 * one WRITE characteristic for commands, one NOTIFY characteristic for
 * status frames. Wire format: RELAY:1\n, RELAY:0\n, CTRL:PLAY\n, CTRL:STOP\n.
 */
import { BleManager, Device, Subscription, State as BtState } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import {
  BeatPattern,
  BleConnectionStatus,
  DeviceStatusFrame,
  BeatState,
  BLEDeviceItem,
  BluetoothPowerState,
} from '../types';

export const GODZILLA_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
export const COMMAND_CHAR_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // write
export const STATUS_CHAR_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // notify

const SAFE_CHUNK_BYTES = 180;

type StatusListener = (frame: DeviceStatusFrame) => void;
type ConnectionListener = (status: BleConnectionStatus, device?: BleDeviceLite) => void;
type RssiListener = (rssi: number | null) => void;
type DevicesListener = (devices: BLEDeviceItem[]) => void;
type BtPowerListener = (state: BluetoothPowerState) => void;

export interface BleDeviceLite {
  id: string;
  name: string | null;
}

export class GodzillaBLEManager {
  private manager: BleManager | null = null;
  private device: Device | null = null;
  private statusSub: Subscription | null = null;
  private rssiInterval: ReturnType<typeof setInterval> | null = null;
  public isSimulator = false;

  private connectionListeners = new Set<ConnectionListener>();
  private statusListeners = new Set<StatusListener>();
  private rssiListeners = new Set<RssiListener>();
  private devicesListeners = new Set<DevicesListener>();
  private btPowerListeners = new Set<BtPowerListener>();

  private scannedDevicesMap = new Map<string, BLEDeviceItem>();
  private status: BleConnectionStatus = 'disconnected';
  private connectedDevice: BleDeviceLite | null = null;
  private btPowerState: BluetoothPowerState = 'Unknown';

  constructor() {
    try {
      this.manager = new BleManager();
      // Listen to real mobile Bluetooth adapter state changes
      this.manager.onStateChange((state: BtState) => {
        this.handleBtStateChange(state);
      }, true);
    } catch {
      // In standard Expo Go or unsupported environments, native BLE is unavailable
      this.isSimulator = true;
      this.manager = null;
      this.btPowerState = 'Unsupported';
    }
  }

  private handleBtStateChange(state: BtState) {
    let mapped: BluetoothPowerState = 'Unknown';
    if (state === BtState.PoweredOn) mapped = 'PoweredOn';
    else if (state === BtState.PoweredOff) mapped = 'PoweredOff';
    else if (state === BtState.Unauthorized) mapped = 'Unauthorized';
    else if (state === BtState.Unsupported) mapped = 'Unsupported';

    this.btPowerState = mapped;
    this.btPowerListeners.forEach((cb) => cb(mapped));
  }

  onBtPowerChange(cb: BtPowerListener): () => void {
    this.btPowerListeners.add(cb);
    cb(this.btPowerState);
    return () => this.btPowerListeners.delete(cb);
  }

  getBtPowerState(): BluetoothPowerState {
    return this.btPowerState;
  }

  /**
   * Prompts the mobile device to turn ON Bluetooth.
   * On Android, triggers the native system enable prompt.
   */
  async requestEnableBluetooth(): Promise<boolean> {
    if (this.isSimulator || !this.manager) {
      Alert.alert(
        'Expo Go Environment',
        'Native Bluetooth is disabled in Expo Go. Run with `npx expo run:android` to access physical Bluetooth hardware.'
      );
      return false;
    }

    try {
      if (Platform.OS === 'android') {
        await this.manager.enable();
        const newState = await this.manager.state();
        this.handleBtStateChange(newState);
        return newState === BtState.PoweredOn;
      } else {
        Alert.alert(
          'Turn ON Bluetooth',
          'Please turn ON Bluetooth in your phone settings to connect to your ESP32 Super Mini.'
        );
        return false;
      }
    } catch (err) {
      console.warn('Could not auto-enable Bluetooth:', err);
      Alert.alert(
        'Turn ON Bluetooth',
        'Please turn ON Bluetooth in your phone settings to connect to your ESP32 Super Mini.'
      );
      return false;
    }
  }

  // ---------- Public event subscriptions ----------

  onConnectionChange(cb: ConnectionListener): () => void {
    this.connectionListeners.add(cb);
    return () => this.connectionListeners.delete(cb);
  }

  onStatusFrame(cb: StatusListener): () => void {
    this.statusListeners.add(cb);
    return () => this.statusListeners.delete(cb);
  }

  onRssi(cb: RssiListener): () => void {
    this.rssiListeners.add(cb);
    return () => this.rssiListeners.delete(cb);
  }

  onDevicesDiscovered(cb: DevicesListener): () => void {
    this.devicesListeners.add(cb);
    return () => this.devicesListeners.delete(cb);
  }

  private notifyDevices(list: BLEDeviceItem[]) {
    this.devicesListeners.forEach((cb) => cb(list));
  }

  // ---------- Permission helper ----------

  private async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;
    try {
      if (Platform.Version >= 31) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return (
          result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
          result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch {
      return false;
    }
  }

  // ---------- Scan / connect lifecycle ----------

  async startScan(timeoutMs = 12000): Promise<void> {
    if (this.isSimulator || !this.manager) {
      // Running in environment without native BLE driver (e.g. Expo Go)
      this.scannedDevicesMap.clear();
      this.notifyDevices([]);
      Alert.alert(
        'Native Bluetooth Unavailable in Expo Go',
        'Physical Bluetooth scanning requires an Expo Development Build (npx expo run:android). No fake devices will be shown.'
      );
      this.setStatus('disconnected');
      return;
    }

    // 1. Check if Mobile Bluetooth is OFF
    try {
      const state = await this.manager.state();
      this.handleBtStateChange(state);
      if (state === BtState.PoweredOff) {
        this.setStatus('disconnected');
        Alert.alert(
          'Mobile Bluetooth is OFF',
          'Your phone\'s Bluetooth is currently turned OFF. Please turn ON Bluetooth to search for your ESP32 Super Mini.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Turn ON Bluetooth',
              onPress: async () => {
                const turnedOn = await this.requestEnableBluetooth();
                if (turnedOn) {
                  this.startScan();
                }
              },
            },
          ]
        );
        return;
      }
    } catch {
      // Proceed if state check not available
    }

    const hasPermissions = await this.requestPermissions();
    if (!hasPermissions) {
      this.setStatus('error');
      Alert.alert(
        'Permissions Needed',
        'Bluetooth and Location permissions are required to scan for nearby ESP32 Super Mini boards.'
      );
      return;
    }

    this.setStatus('scanning');
    this.scannedDevicesMap.clear();
    this.notifyDevices([]);

    try {
      this.manager.startDeviceScan(
        null, // scan without UUID filter so 31-byte advertising packet limits don't drop ESP32 broadcasts
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            console.warn('BLE Scan error:', error);
            this.setStatus('error');
            return;
          }

          if (device && device.id) {
            const rawName = device.name || device.localName || '';
            const name = rawName.trim();

            // Check if device advertises our Godzilla service UUID
            const hasGodzillaService = !!(
              device.serviceUUIDs &&
              device.serviceUUIDs.some((uuid) =>
                uuid.toLowerCase().includes('6e400001')
              )
            );

            // Detect ESP32 Super Mini boards specifically
            const isEsp32 =
              hasGodzillaService ||
              /godzilla|supermini|super-mini|esp32|c3|mini-relay/i.test(name);

            // Enlist all real devices that have a broadcast name OR advertise our service
            if (name.length > 0 || hasGodzillaService) {
              const displayName =
                name.length > 0
                  ? name
                  : `ESP32 Super Mini (${device.id.slice(-5)})`;

              const item: BLEDeviceItem = {
                id: device.id,
                name: displayName,
                rssi: device.rssi ?? -70,
                isConnectable: device.isConnectable ?? true,
                isEsp32: isEsp32,
                serviceUUIDs: device.serviceUUIDs,
              };

              this.scannedDevicesMap.set(device.id, item);

              // Sort:
              // 1. ESP32 Super Mini target boards first
              // 2. Highest signal strength (RSSI dBm)
              const sorted = Array.from(this.scannedDevicesMap.values()).sort((a, b) => {
                if (a.isEsp32 && !b.isEsp32) return -1;
                if (!a.isEsp32 && b.isEsp32) return 1;
                return (b.rssi ?? -999) - (a.rssi ?? -999);
              });

              this.notifyDevices(sorted);
            }
          }
        }
      );

      setTimeout(() => {
        this.stopScan();
      }, timeoutMs);
    } catch {
      this.setStatus('disconnected');
    }
  }

  stopScan(): void {
    this.manager?.stopDeviceScan();
    if (this.status === 'scanning') {
      this.setStatus('disconnected');
    }
  }

  async connect(deviceId: string): Promise<BleDeviceLite> {
    this.setStatus('connecting');
    this.manager?.stopDeviceScan();

    if (this.isSimulator || !this.manager) {
      this.setStatus('error');
      throw new Error(
        'Native BLE hardware driver is unavailable in Expo Go. Please run in an Expo Development Build (npx expo run:android) to link physical hardware.'
      );
    }

    try {
      const connected = await this.manager.connectToDevice(deviceId, {
        requestMTU: 185,
      });
      await connected.discoverAllServicesAndCharacteristics();
      this.device = connected;

      this.statusSub = connected.monitorCharacteristicForService(
        GODZILLA_SERVICE_UUID,
        STATUS_CHAR_UUID,
        (error, characteristic) => {
          if (error || !characteristic?.value) return;
          const frame = decodeStatusFrame(characteristic.value);
          if (frame) this.statusListeners.forEach((cb) => cb(frame));
        }
      );

      this.startRssiPolling();

      connected.onDisconnected(() => {
        this.cleanupAfterDisconnect();
      });

      const selected = this.scannedDevicesMap.get(deviceId);
      const lite: BleDeviceLite = {
        id: connected.id,
        name: connected.name || selected?.name || 'ESP32 Super Mini',
      };
      this.connectedDevice = lite;
      this.setStatus('connected', lite);
      return lite;
    } catch (err) {
      this.setStatus('error');
      throw err;
    }
  }

  async disconnect(): Promise<void> {
    if (this.device) {
      try {
        await this.sendRelayOverride(0);
        await this.device.cancelConnection();
      } catch {
        // ignore
      }
    }
    this.cleanupAfterDisconnect();
  }

  getConnectedDevice(): BleDeviceLite | null {
    return this.connectedDevice;
  }

  private cleanupAfterDisconnect() {
    this.stopRssiPolling();
    this.statusSub?.remove();
    this.statusSub = null;
    this.device = null;
    this.connectedDevice = null;
    this.setStatus('disconnected');
  }

  private startRssiPolling() {
    this.rssiInterval = setInterval(async () => {
      if (!this.device) return;
      try {
        const updated = await this.device.readRSSI();
        this.rssiListeners.forEach((cb) => cb(updated.rssi));
      } catch {
        this.rssiListeners.forEach((cb) => cb(null));
      }
    }, 2000);
  }

  private stopRssiPolling() {
    if (this.rssiInterval) clearInterval(this.rssiInterval);
    this.rssiInterval = null;
  }

  private setStatus(status: BleConnectionStatus, device?: BleDeviceLite) {
    this.status = status;
    this.connectionListeners.forEach((cb) => cb(status, device));
  }

  getStatus(): BleConnectionStatus {
    return this.status;
  }

  // ---------- Commands (see docs/DATA_PROTOCOL.md) ----------

  async sendRelayOverride(state: BeatState): Promise<void> {
    if (this.isSimulator || !this.device) {
      // Mock status frame emission
      this.statusListeners.forEach((cb) =>
        cb({
          relay: state,
          playing: false,
          nextIndex: -1,
          deviceMillis: Date.now(),
        })
      );
      return;
    }
    await this.writeCommand(`RELAY:${state}\n`);
  }

  async sendPlay(): Promise<void> {
    if (this.isSimulator || !this.device) return;
    await this.writeCommand('CTRL:PLAY\n');
  }

  async sendPause(): Promise<void> {
    if (this.isSimulator || !this.device) return;
    await this.writeCommand('CTRL:PAUSE\n');
  }

  async sendStop(): Promise<void> {
    if (this.isSimulator || !this.device) return;
    await this.writeCommand('CTRL:STOP\n');
    await this.sendRelayOverride(0);
  }

  async syncPattern(pattern: BeatPattern): Promise<void> {
    const currentDevice = this.device ? { id: this.device.id, name: this.device.name } : undefined;
    this.setStatus('syncing', currentDevice);

    if (this.isSimulator || !this.device) {
      await new Promise((res) => setTimeout(res, 500));
      this.setStatus('connected', currentDevice);
      return;
    }

    const payload = JSON.stringify({
      bpm: pattern.bpm,
      durationMs: pattern.durationMs,
      triggers: pattern.triggers.map((t) => [t.t, t.state]),
    });

    const chunks = chunkString(payload, SAFE_CHUNK_BYTES);
    await this.writeCommand(`SYNC:BEGIN:${chunks.length}\n`);
    for (let i = 0; i < chunks.length; i++) {
      await this.writeCommand(`SYNC:CHUNK:${i}:${chunks[i]}\n`);
    }
    await this.writeCommand('SYNC:END\n');

    this.setStatus('connected', currentDevice);
  }

  private async writeCommand(command: string): Promise<void> {
    if (!this.device) return;
    try {
      const base64 = Buffer.from(command, 'utf-8').toString('base64');
      await this.device.writeCharacteristicWithResponseForService(
        GODZILLA_SERVICE_UUID,
        COMMAND_CHAR_UUID,
        base64
      );
    } catch (e) {
      console.warn('BLE write error:', e);
    }
  }

  /**
   * Triggers the relay ON for pulseMs and then turns it OFF.
   * Synchronized to the 60-step Kick beat in App.tsx!
   */
  async triggerRelay(pulseMs = 50): Promise<void> {
    await this.sendRelayOverride(1);
    setTimeout(async () => {
      await this.sendRelayOverride(0);
    }, Math.max(25, pulseMs));
  }

  destroy() {
    this.stopRssiPolling();
    this.statusSub?.remove();
    this.manager?.destroy();
  }

  // Singleton instance & static helper API
  private static _instance: GodzillaBLEManager | null = null;
  static get instance(): GodzillaBLEManager {
    if (!this._instance) {
      this._instance = new GodzillaBLEManager();
    }
    return this._instance;
  }

  static initialize(
    onStatus: (status: BleConnectionStatus, device?: BleDeviceLite) => void,
    onDevices: (devices: BLEDeviceItem[]) => void,
    onMock: (isMock: boolean) => void,
    onBtPower?: (state: BluetoothPowerState) => void
  ) {
    const inst = this.instance;
    inst.onConnectionChange((status, device) => onStatus(status, device));
    inst.onDevicesDiscovered((devices) => onDevices(devices));
    onMock(inst.isSimulator || !inst.manager);
    if (onBtPower) {
      inst.onBtPowerChange(onBtPower);
    }
  }

  static async requestEnableBluetooth(): Promise<boolean> {
    return this.instance.requestEnableBluetooth();
  }

  static getBtPowerState(): BluetoothPowerState {
    return this.instance.getBtPowerState();
  }

  static async startScan(): Promise<void> {
    await this.instance.startScan();
  }

  static stopScan(): void {
    this.instance.stopScan();
  }

  static getConnectedDevice(): BleDeviceLite | null {
    return this.instance.getConnectedDevice();
  }

  static async connect(deviceId: string): Promise<void> {
    await this.instance.connect(deviceId);
  }

  static async disconnect(): Promise<void> {
    await this.instance.disconnect();
  }

  static async triggerManualPulse(pulseMs = 50): Promise<void> {
    await this.instance.triggerRelay(pulseMs);
  }
}

// ---------- Helpers ----------

function chunkString(str: string, size: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks;
}

function decodeStatusFrame(base64Value: string): DeviceStatusFrame | null {
  try {
    const json = Buffer.from(base64Value, 'base64').toString('utf-8');
    const parsed = JSON.parse(json);
    return {
      relay: parsed.relay === 1 ? 1 : 0,
      playing: !!parsed.playing,
      nextIndex: typeof parsed.nextIndex === 'number' ? parsed.nextIndex : -1,
      deviceMillis: typeof parsed.deviceMillis === 'number' ? parsed.deviceMillis : 0,
    };
  } catch {
    return null;
  }
}

export function btStateIsPoweredOn(state: BtState): boolean {
  return state === BtState.PoweredOn;
}
