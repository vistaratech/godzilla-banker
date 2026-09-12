import { BeatPin, TelemetryData } from '../types';

export class GodzillaProtocol {
  /**
   * Encodes a direct relay state command
   */
  static encodeRelayState(active: boolean): string {
    return `RELAY:${active ? '1' : '0'}\n`;
  }

  /**
   * Encodes a temporary pulse command in milliseconds
   */
  static encodePulse(durationMs: number): string {
    const safeDuration = Math.max(10, Math.min(10000, Math.round(durationMs)));
    return `PULSE:${safeDuration}\n`;
  }

  /**
   * Encodes a manual override toggle command
   */
  static encodeOverride(override: boolean): string {
    return `OVERRIDE:${override ? '1' : '0'}\n`;
  }

  /**
   * Encodes an emergency kill command (instant relay open)
   */
  static encodeKill(): string {
    return `KILL\n`;
  }

  /**
   * Encodes a keepalive heartbeat ping
   */
  static encodePing(): string {
    return `PING\n`;
  }

  /**
   * Encodes a schedule of timestamped beat pins for autonomous hardware execution on ESP32
   * Format: SCHED:<count>:<t0,d0>;<t1,d1>;...\n where t is offset in ms, d is duration in ms
   */
  static encodeSchedule(pins: BeatPin[], totalDurationMs: number): string {
    const activePins = pins.filter(p => p.state === 'ON');
    const count = activePins.length;
    
    if (count === 0) {
      return `SCHED:0\n`;
    }

    const segments = activePins.map(p => `${Math.round(p.timeMs)},${Math.round(p.durationMs)}`);
    return `SCHED:${count}:${totalDurationMs}:${segments.join(';')}\n`;
  }

  /**
   * Parses inbound status notify messages from the ESP32
   * Expected format: STATUS:RELAY=<0|1>,OVERRIDE=<0|1>,UPTIME=<ms>
   */
  static parseTelemetry(payload: string): Partial<TelemetryData> | null {
    try {
      const clean = payload.trim();
      if (!clean.startsWith('STATUS:')) return null;

      const dataStr = clean.replace('STATUS:', '');
      const pairs = dataStr.split(',');
      const result: Partial<TelemetryData> = {
        timestamp: Date.now(),
      };

      for (const pair of pairs) {
        const [key, val] = pair.split('=');
        if (!key || val === undefined) continue;

        if (key === 'RELAY') {
          result.relayState = val === '1';
        } else if (key === 'OVERRIDE') {
          result.overrideActive = val === '1';
        }
      }

      return result;
    } catch {
      return null;
    }
  }
}
