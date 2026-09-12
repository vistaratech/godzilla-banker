/**
 * Web Audio API synthesizer for acoustic beat feedback and relay click sound
 */
class AudioSynthService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays a punchy acoustic kick / sub-bass pulse when beat triggers
   */
  playBeatTrigger(durationMs: number = 80) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + Math.min(0.2, durationMs / 1000));

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + Math.min(0.25, durationMs / 1000));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // AudioContext policy catch
    }
  }

  /**
   * Plays a physical mechanical relay contact "click" sound
   */
  playRelayClick(turnOn: boolean) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = turnOn ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(turnOn ? 2400 : 1800, now);
      osc.frequency.exponentialRampToValueAtTime(turnOn ? 400 : 300, now + 0.02);

      gain.gain.setValueAtTime(turnOn ? 0.25 : 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // AudioContext policy catch
    }
  }
}

export const audioSynth = new AudioSynthService();
