import { BeatPattern, BeatTrigger } from '../types';

/** Triggers must always be sorted ascending by `t` — every mutation goes through here. */
export function sortTriggers(triggers: BeatTrigger[]): BeatTrigger[] {
  return [...triggers].sort((a, b) => a.t - b.t);
}

/** Snap a raw ms offset to the nearest grid line for a given BPM + subdivision. */
export function quantizeToGrid(
  rawMs: number,
  bpm: number,
  subdivision: 4 | 8 | 16 = 16
): number {
  const beatMs = 60000 / bpm;
  const stepMs = beatMs / (subdivision / 4);
  return Math.round(rawMs / stepMs) * stepMs;
}

/** Convert an x pixel position on the canvas to a ms offset, given canvas width and pattern duration. */
export function xToMs(x: number, canvasWidth: number, durationMs: number): number {
  const clampedX = Math.max(0, Math.min(x, canvasWidth));
  return (clampedX / canvasWidth) * durationMs;
}

export function msToX(ms: number, canvasWidth: number, durationMs: number): number {
  return (ms / durationMs) * canvasWidth;
}

/**
 * Given the current playback cursor and the last index already fired,
 * return every trigger that should fire now (handles frame drops where
 * more than one trigger falls inside a single tick).
 */
export function triggersDue(
  pattern: BeatPattern,
  cursorMs: number,
  lastFiredIndex: number
): { due: BeatTrigger[]; newLastFiredIndex: number } {
  const due: BeatTrigger[] = [];
  let idx = lastFiredIndex;

  while (idx + 1 < pattern.triggers.length && pattern.triggers[idx + 1].t <= cursorMs) {
    idx += 1;
    due.push(pattern.triggers[idx]);
  }

  return { due, newLastFiredIndex: idx };
}

export function makeTriggerId(): string {
  return `trg_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}
