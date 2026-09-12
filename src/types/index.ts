/**
 * Godzilla Banger — Shared Types
 */

export type PinState = 'ON' | 'OFF';

export interface BeatPin {
  id: string;
  timeMs: number; // Offset from start in milliseconds
  durationMs: number; // Duration of ON pulse in milliseconds
  state: PinState;
  color?: string;
  intensity?: number; // 0 to 1 for visual UI intensity
}

export type QuantizeOption = 'OFF' | '1/4' | '1/8' | '1/16' | '1/32';

export interface PatternPreset {
  id: string;
  name: string;
  description: string;
  bpm: number;
  totalDurationMs: number;
  pins: BeatPin[];
}

export type BLEConnectionStatus = 'disconnected' | 'scanning' | 'connecting' | 'connected' | 'syncing' | 'error';
export type BleConnectionStatus = BLEConnectionStatus;
export type BluetoothPowerState = 'PoweredOn' | 'PoweredOff' | 'Unauthorized' | 'Unsupported' | 'Unknown';

export interface BLEDeviceItem {
  id: string;
  name: string;
  rssi: number;
  isConnectable?: boolean;
  isEsp32?: boolean;
  serviceUUIDs?: string[] | null;
}

export interface BleDeviceInfo {
  id: string;
  name: string | null;
  rssi: number | null;
}

export interface TelemetryData {
  relayState: boolean;
  overrideActive: boolean;
  packetsSent: number;
  lastLatencyMs: number;
  lastCommand: string;
  timestamp: number;
  batteryLevel?: number;
}

export type SyncMode = 'REALTIME_STREAM' | 'HARDWARE_BATCH';

export type BeatState = 0 | 1; // 0 = OFF (relay LOW), 1 = ON (relay HIGH)

export interface BeatTrigger {
  id: string;
  /** Offset in milliseconds from the start of the pattern */
  t: number;
  state: BeatState;
}

export interface BeatPattern {
  id: string;
  name: string;
  bpm: number;
  /** Total pattern length in milliseconds */
  durationMs: number;
  /** Triggers MUST be kept sorted ascending by `t` */
  triggers: BeatTrigger[];
}

export type PlaybackStatus = 'idle' | 'playing' | 'paused';

export interface DeviceStatusFrame {
  relay: BeatState;
  playing: boolean;
  /** Index of the next trigger the firmware expects to fire, or -1 if idle */
  nextIndex: number;
  /** Firmware's own millis() clock at the moment of the frame, for drift checks */
  deviceMillis: number;
}
