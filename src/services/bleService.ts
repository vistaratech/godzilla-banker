import { BLEConnectionStatus, BLEDeviceItem, TelemetryData } from '../types';
import { BLE_CONFIG } from '../constants/bleConfig';
import { GodzillaProtocol } from './protocol';

type StatusCallback = (status: BLEConnectionStatus) => void;
type TelemetryCallback = (data: Partial<TelemetryData>) => void;
type LogCallback = (message: string) => void;

/**
 * BLE Service with Mock Simulator Fallback
 * 
 * When running on Expo Go / Web / Simulator where BLE hardware is unavailable,
 * this service automatically falls back to a mock mode that logs all outgoing
 * packets to the console and simulates ESP32 acknowledgments.
 */
export class BLEService {
  private statusCallback: StatusCallback | null = null;
  private telemetryCallback: TelemetryCallback | null = null;
  private logCallback: LogCallback | null = null;
  private connectionStatus: BLEConnectionStatus = 'disconnected';
  private keepaliveTimer: ReturnType<typeof setInterval> | null = null;
  private packetsSent: number = 0;
  private mockMode: boolean = true; // Default to mock; real BLE set on native builds
  private connectedDeviceId: string | null = null;

  constructor() {
    this.mockMode = true; // Safe default — toggle off when react-native-ble-plx is linked
  }

  onStatusChange(cb: StatusCallback) {
    this.statusCallback = cb;
  }

  onTelemetry(cb: TelemetryCallback) {
    this.telemetryCallback = cb;
  }

  onLog(cb: LogCallback) {
    this.logCallback = cb;
  }

  private log(msg: string) {
    const ts = new Date().toISOString().slice(11, 23);
    const formatted = `[BLE ${ts}] ${msg}`;
    console.log(formatted);
    this.logCallback?.(formatted);
  }

  private setStatus(status: BLEConnectionStatus) {
    this.connectionStatus = status;
    this.statusCallback?.(status);
  }

  getStatus(): BLEConnectionStatus {
    return this.connectionStatus;
  }

  isMock(): boolean {
    return this.mockMode;
  }

  /**
   * Scans for BLE peripherals advertising the Godzilla Banger service
   */
  async scan(): Promise<BLEDeviceItem[]> {
    this.setStatus('scanning');
    this.log('Scanning for Godzilla Banger devices...');

    if (this.mockMode) {
      await this._delay(800);
      this.log('Mock mode disabled: real hardware scanning required.');
      this.setStatus('disconnected');
      return [];
    }

    // Real BLE scan would go here with react-native-ble-plx
    this.setStatus('disconnected');
    return [];
  }

  /**
   * Connects to a specific BLE device
   */
  async connect(deviceId: string): Promise<boolean> {
    this.setStatus('connecting');
    this.log(`Connecting to device: ${deviceId}`);

    if (this.mockMode) {
      await this._delay(800);
      this.connectedDeviceId = deviceId;
      this.setStatus('connected');
      this.log(`Connected to ${deviceId} [MOCK MODE]`);
      this._startKeepalive();
      return true;
    }

    // Real BLE connection logic
    this.setStatus('error');
    return false;
  }

  /**
   * Disconnects from the current device
   */
  async disconnect(): Promise<void> {
    this._stopKeepalive();
    this.connectedDeviceId = null;
    this.setStatus('disconnected');
    this.log('Disconnected');
  }

  /**
   * Sends a raw string command to the ESP32 over BLE UART
   */
  async send(command: string): Promise<boolean> {
    if (this.connectionStatus !== 'connected') {
      this.log(`⚠ Cannot send — not connected (status: ${this.connectionStatus})`);
      return false;
    }

    this.packetsSent++;
    const clean = command.replace(/\n$/, '');
    this.log(`TX[${this.packetsSent}] → ${clean}`);

    if (this.mockMode) {
      // Simulate relay state echo back from ESP32
      if (command.startsWith('RELAY:')) {
        const state = command.includes('1');
        setTimeout(() => {
          this.telemetryCallback?.({
            relayState: state,
            packetsSent: this.packetsSent,
            lastLatencyMs: Math.floor(Math.random() * 8) + 2,
            lastCommand: clean,
            timestamp: Date.now(),
          });
        }, 5 + Math.random() * 12);
      } else if (command.startsWith('PULSE:')) {
        const durStr = command.replace('PULSE:', '').trim();
        const dur = parseInt(durStr, 10) || 100;
        setTimeout(() => {
          this.telemetryCallback?.({
            relayState: true,
            packetsSent: this.packetsSent,
            lastLatencyMs: Math.floor(Math.random() * 6) + 2,
            lastCommand: clean,
            timestamp: Date.now(),
          });
        }, 5);
        setTimeout(() => {
          this.telemetryCallback?.({
            relayState: false,
            packetsSent: this.packetsSent,
            lastLatencyMs: 0,
            lastCommand: `PULSE_END`,
            timestamp: Date.now(),
          });
        }, dur + 10);
      } else if (command.startsWith('KILL')) {
        setTimeout(() => {
          this.telemetryCallback?.({
            relayState: false,
            overrideActive: false,
            packetsSent: this.packetsSent,
            lastLatencyMs: 1,
            lastCommand: 'KILL',
            timestamp: Date.now(),
          });
        }, 3);
      }
      return true;
    }

    // Real BLE write
    return false;
  }

  /**
   * High-level: Send relay ON/OFF
   */
  async setRelay(active: boolean): Promise<boolean> {
    return this.send(GodzillaProtocol.encodeRelayState(active));
  }

  /**
   * High-level: Send timed pulse
   */
  async sendPulse(durationMs: number): Promise<boolean> {
    return this.send(GodzillaProtocol.encodePulse(durationMs));
  }

  /**
   * High-level: Emergency kill
   */
  async killRelay(): Promise<boolean> {
    return this.send(GodzillaProtocol.encodeKill());
  }

  getPacketCount(): number {
    return this.packetsSent;
  }

  private _startKeepalive() {
    this._stopKeepalive();
    this.keepaliveTimer = setInterval(() => {
      if (this.connectionStatus === 'connected') {
        this.send(GodzillaProtocol.encodePing());
      }
    }, BLE_CONFIG.KEEPALIVE_INTERVAL_MS);
  }

  private _stopKeepalive() {
    if (this.keepaliveTimer) {
      clearInterval(this.keepaliveTimer);
      this.keepaliveTimer = null;
    }
  }

  private _delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const bleService = new BLEService();
