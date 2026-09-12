import { BeatPin } from '../types';
import { sortPins } from '../utils/timeUtils';

type OnTickCallback = (currentTimeMs: number) => void;
type OnTriggerCallback = (pin: BeatPin, active: boolean) => void;

/**
 * PlaybackEngine - Millisecond-accurate beat pattern sequencer
 *
 * Uses requestAnimationFrame for smooth visual scrubber sync and
 * dispatches relay trigger callbacks when the playhead crosses pin boundaries.
 */
export class PlaybackEngine {
  private playing: boolean = false;
  private looping: boolean = false;
  private startTimestamp: number = 0;
  private pausedAtMs: number = 0;
  private totalDurationMs: number = 4000; // Default 4 seconds
  private pins: BeatPin[] = [];
  private sortedPins: BeatPin[] = [];
  private activePin: BeatPin | null = null;
  private animFrameId: number | null = null;

  private onTick: OnTickCallback | null = null;
  private onTrigger: OnTriggerCallback | null = null;

  setOnTick(cb: OnTickCallback) {
    this.onTick = cb;
  }

  setOnTrigger(cb: OnTriggerCallback) {
    this.onTrigger = cb;
  }

  setPins(pins: BeatPin[]) {
    this.pins = pins;
    this.sortedPins = sortPins(pins.filter(p => p.state === 'ON'));
  }

  setDuration(ms: number) {
    this.totalDurationMs = Math.max(500, ms);
  }

  getDuration(): number {
    return this.totalDurationMs;
  }

  setLooping(loop: boolean) {
    this.looping = loop;
  }

  isPlaying(): boolean {
    return this.playing;
  }

  play() {
    if (this.playing) return;
    this.playing = true;
    this.startTimestamp = Date.now() - this.pausedAtMs;
    this.activePin = null;
    this._tick();
  }

  pause() {
    this.playing = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.pausedAtMs = Date.now() - this.startTimestamp;
  }

  stop() {
    this.playing = false;
    this.pausedAtMs = 0;
    this.activePin = null;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.onTick?.(0);
    // Ensure relay is off when stopping
    if (this.activePin) {
      this.onTrigger?.(this.activePin, false);
      this.activePin = null;
    }
  }

  seekTo(ms: number) {
    this.pausedAtMs = Math.max(0, Math.min(ms, this.totalDurationMs));
    if (this.playing) {
      this.startTimestamp = Date.now() - this.pausedAtMs;
    }
    this.onTick?.(this.pausedAtMs);
  }

  getCurrentTimeMs(): number {
    if (!this.playing) return this.pausedAtMs;
    return Date.now() - this.startTimestamp;
  }

  private _tick = () => {
    if (!this.playing) return;

    const elapsed = Date.now() - this.startTimestamp;

    if (elapsed >= this.totalDurationMs) {
      if (this.looping) {
        this.startTimestamp = Date.now();
        this.activePin = null;
        this.onTick?.(0);
      } else {
        this.stop();
        return;
      }
    } else {
      this.onTick?.(elapsed);
      this._checkTriggers(elapsed);
    }

    this.animFrameId = requestAnimationFrame(this._tick);
  };

  private _checkTriggers(currentMs: number) {
    // Find the pin whose time range contains currentMs
    let shouldBeActive: BeatPin | null = null;

    for (const pin of this.sortedPins) {
      const pinStart = pin.timeMs;
      const pinEnd = pin.timeMs + pin.durationMs;
      if (currentMs >= pinStart && currentMs < pinEnd) {
        shouldBeActive = pin;
        break;
      }
    }

    // Trigger state changes
    if (shouldBeActive && this.activePin?.id !== shouldBeActive.id) {
      // Deactivate previous if any
      if (this.activePin) {
        this.onTrigger?.(this.activePin, false);
      }
      this.activePin = shouldBeActive;
      this.onTrigger?.(shouldBeActive, true);
    } else if (!shouldBeActive && this.activePin) {
      this.onTrigger?.(this.activePin, false);
      this.activePin = null;
    }
  }

  destroy() {
    this.stop();
    this.onTick = null;
    this.onTrigger = null;
  }
}
