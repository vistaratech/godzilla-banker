import { Platform } from 'react-native';
import { Buffer } from 'buffer';

export type SoundType = 'KICK' | 'SNARE' | 'HIHAT' | 'SYNTH';

// Generate 16-bit Mono PCM WAV base64 string safely using Buffer
function generateWavBase64(sampleRate: number, durationSec: number, generateSamples: (numSamples: number) => Float32Array): string {
  const numSamples = Math.floor(sampleRate * durationSec);
  const rawSamples = generateSamples(numSamples);

  const byteLength = numSamples * 2;
  const buffer = new ArrayBuffer(44 + byteLength);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + byteLength, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, byteLength, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, rawSamples[i]));
    const int16 = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(offset, int16, true);
    offset += 2;
  }

  const base64 = Buffer.from(buffer).toString('base64');
  return 'data:audio/wav;base64,' + base64;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

const SAMPLE_RATE = 22050;

function createKickSamples(numSamples: number): Float32Array {
  const out = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    // Punchy 808 bass kick: pitch drop from 180Hz down to deep 40Hz sub
    const freq = 170 * Math.exp(-t * 26) + 40;
    const env = Math.exp(-t * 7.5);
    const click = Math.exp(-t * 90) * 0.3 * Math.sin(2 * Math.PI * 400 * t);
    out[i] = Math.sin(2 * Math.PI * freq * t) * env + click;
  }
  return out;
}

class SoundEngine {
  private webAudioCtx: any = null;
  private nativePlayers: Map<SoundType, any[]> = new Map();
  private currentIndex: Map<SoundType, number> = new Map();
  private isInitialized = false;

  async init() {
    if (this.isInitialized) return;

    // 1. Web Audio Context for Web / Browser environments
    if (Platform.OS === 'web' || (typeof window !== 'undefined' && ((window as any).AudioContext || (window as any).webkitAudioContext))) {
      try {
        const AudioCtxClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          this.webAudioCtx = new AudioCtxClass();
          this.isInitialized = true;
          return;
        }
      } catch {
        // Fallback to Expo audio
      }
    }

    // 2. Native Expo Audio - KICK 808 ONLY
    try {
      const expoAudio = await import('expo-audio');
      if (expoAudio && expoAudio.setAudioModeAsync) {
        await expoAudio.setAudioModeAsync({
          playsInSilentMode: true,
        });

        const kickUri = generateWavBase64(SAMPLE_RATE, 0.45, createKickSamples);
        const pool: any[] = [];
        for (let i = 0; i < 4; i++) {
          if (expoAudio.createAudioPlayer) {
            const player = expoAudio.createAudioPlayer({ uri: kickUri });
            pool.push(player);
          }
        }
        this.nativePlayers.set('KICK', pool);
        this.currentIndex.set('KICK', 0);
      }
      this.isInitialized = true;
    } catch {
      this.isInitialized = true;
    }
  }

  private playWebSound(type: SoundType, volume: number) {
    if (!this.webAudioCtx) return;
    try {
      if (this.webAudioCtx.state === 'suspended') {
        this.webAudioCtx.resume();
      }
      const ctx = this.webAudioCtx;
      const now = ctx.currentTime;

      // Only generate Kick 808
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(170, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.10);

      gain.gain.setValueAtTime(volume * 1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
      return;
    } catch {
      // Ignored
    }
  }

  play(type: SoundType, volume = 1.0) {
    if (!this.isInitialized) {
      this.init();
    }

    // Strictly enforce Kick 808 only — no music/synth or noisy instruments
    type = 'KICK';

    if (this.webAudioCtx) {
      this.playWebSound('KICK', volume);
      return;
    }

    const pool = this.nativePlayers.get('KICK');
    if (!pool || pool.length === 0) return;

    const idx = this.currentIndex.get('KICK') || 0;
    const player = pool[idx];
    this.currentIndex.set('KICK', (idx + 1) % pool.length);

    try {
      if (player) {
        player.volume = volume;
        player.seekTo(0);
        player.play();
      }
    } catch {
      // Graceful catch
    }
  }

  playSound(type: SoundType, volume = 1.0) {
    this.play(type, volume);
  }
}

export const soundEngine = new SoundEngine();

