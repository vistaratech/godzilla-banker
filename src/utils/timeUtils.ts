import { QuantizeOption, BeatPin } from '../types';

/**
 * Calculates the duration of one beat in milliseconds given BPM
 */
export function getBeatDurationMs(bpm: number): number {
  if (bpm <= 0) return 500;
  return (60 / bpm) * 1000;
}

/**
 * Calculates the duration of 1 bar (4/4 time signature) in milliseconds
 */
export function getBarDurationMs(bpm: number): number {
  return getBeatDurationMs(bpm) * 4;
}

/**
 * Snaps a raw millisecond timestamp to the nearest grid quantization step based on BPM
 */
export function quantizeTime(timeMs: number, bpm: number, quantize: QuantizeOption): number {
  if (quantize === 'OFF') return Math.max(0, Math.round(timeMs));

  const beatMs = getBeatDurationMs(bpm);
  let stepMs = beatMs;

  switch (quantize) {
    case '1/4':
      stepMs = beatMs; // 1 beat
      break;
    case '1/8':
      stepMs = beatMs / 2; // half beat
      break;
    case '1/16':
      stepMs = beatMs / 4; // sixteenth note
      break;
    case '1/32':
      stepMs = beatMs / 8; // thirty-second note
      break;
  }

  const snapped = Math.round(timeMs / stepMs) * stepMs;
  return Math.max(0, Math.round(snapped));
}

/**
 * Formats milliseconds into human-readable seconds:ms (e.g., "02.450s")
 */
export function formatTimeMs(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const remainingMs = Math.floor(ms % 1000);
  return `${seconds.toString().padStart(2, '0')}.${remainingMs.toString().padStart(3, '0')}s`;
}

/**
 * Sorts beat pins in chronological order
 */
export function sortPins(pins: BeatPin[]): BeatPin[] {
  return [...pins].sort((a, b) => a.timeMs - b.timeMs);
}
