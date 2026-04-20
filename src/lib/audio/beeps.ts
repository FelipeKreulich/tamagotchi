import { getAudioContext } from "./context";

type Wave = OscillatorType;

function note(
  ctx: AudioContext,
  startAt: number,
  freq: number,
  duration: number,
  volume = 0.12,
  wave: Wave = "square"
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, startAt);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + duration);
}

export interface PlayOptions {
  muted?: boolean;
}

export function beepAction(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 880, 0.08);
}

export function beepAlert(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 220, 0.15, 0.16, "sawtooth");
  note(ctx, t + 0.18, 220, 0.15, 0.16, "sawtooth");
}

export function beepSuccess(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 659, 0.08);
  note(ctx, t + 0.1, 988, 0.1);
}

export function beepError(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 330, 0.12, 0.14, "triangle");
  note(ctx, t + 0.14, 220, 0.16, 0.14, "triangle");
}

export function melodyEvolution(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  notes.forEach((f, i) => note(ctx, t + i * 0.12, f, 0.11));
}

export function melodyDeath(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 523, 0.2, 0.14, "triangle");
  note(ctx, t + 0.22, 440, 0.22, 0.14, "triangle");
  note(ctx, t + 0.46, 349, 0.3, 0.14, "triangle");
  note(ctx, t + 0.8, 262, 0.55, 0.12, "triangle");
}

export function melodyAchievement(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  const notes = [659, 784, 988, 1319];
  notes.forEach((f, i) => note(ctx, t + i * 0.09, f, 0.09));
}

// ---------- Action-specific jingles ----------

export function sfxFeed(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 660, 0.06);
  note(ctx, t + 0.07, 880, 0.06);
  note(ctx, t + 0.14, 990, 0.1);
}

export function sfxCandy(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 1047, 0.05);
  note(ctx, t + 0.05, 1319, 0.05);
  note(ctx, t + 0.12, 1568, 0.08);
}

export function sfxBath(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 440, 0.1, 0.09, "sine");
  note(ctx, t + 0.08, 587, 0.1, 0.09, "sine");
  note(ctx, t + 0.16, 784, 0.14, 0.09, "sine");
}

export function sfxSleep(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 523, 0.2, 0.1, "triangle");
  note(ctx, t + 0.22, 392, 0.25, 0.1, "triangle");
  note(ctx, t + 0.5, 262, 0.35, 0.09, "triangle");
}

export function sfxWake(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 523, 0.08);
  note(ctx, t + 0.1, 784, 0.08);
  note(ctx, t + 0.2, 1047, 0.1);
}

export function sfxMedicine(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 988, 0.06);
  note(ctx, t + 0.08, 880, 0.06);
  note(ctx, t + 0.16, 1047, 0.12);
}

export function sfxClean(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 1200, 0.05, 0.08, "square");
  note(ctx, t + 0.05, 900, 0.05, 0.08, "square");
  note(ctx, t + 0.1, 1200, 0.05, 0.08, "square");
  note(ctx, t + 0.15, 700, 0.08, 0.09, "square");
}

export function sfxMinigameStart(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 440, 0.06);
  note(ctx, t + 0.08, 660, 0.06);
}

export function sfxPurchase(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  // Bright ka-ching arpeggio (C5 E5 G5) + bell-like top note.
  note(ctx, t, 523, 0.06, 0.12, "square");
  note(ctx, t + 0.07, 659, 0.06, 0.12, "square");
  note(ctx, t + 0.14, 784, 0.08, 0.13, "square");
  note(ctx, t + 0.22, 1319, 0.18, 0.1, "triangle");
}

export function sfxEquip(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 660, 0.05, 0.1, "square");
  note(ctx, t + 0.06, 990, 0.07, 0.1, "square");
}

export function sfxUnequip(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 880, 0.05, 0.09, "square");
  note(ctx, t + 0.06, 523, 0.07, 0.09, "square");
}

export function sfxDenied(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 196, 0.12, 0.12, "square");
  note(ctx, t + 0.14, 165, 0.2, 0.12, "square");
}

// ---------- Ambient pet chirps ----------

export function chirpHappy(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 1200, 0.05, 0.08);
  note(ctx, t + 0.06, 1500, 0.05, 0.08);
}

export function chirpSad(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 520, 0.12, 0.08, "triangle");
  note(ctx, t + 0.14, 392, 0.16, 0.08, "triangle");
}

export function chirpHungry(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 660, 0.08, 0.09);
  note(ctx, t + 0.1, 523, 0.08, 0.09);
  note(ctx, t + 0.2, 660, 0.1, 0.09);
}

export function chirpSick(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 330, 0.14, 0.09, "sawtooth");
  note(ctx, t + 0.16, 294, 0.2, 0.09, "sawtooth");
}

export function chirpSleep(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 294, 0.18, 0.05, "sine");
  note(ctx, t + 0.22, 220, 0.22, 0.05, "sine");
}

export function chirpDirty(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 220, 0.08, 0.07, "sawtooth");
  note(ctx, t + 0.09, 180, 0.12, 0.07, "sawtooth");
}

/**
 * Subtle "crying" whimper — short sine sweep, lower volume than chirps so it
 * can loop without becoming annoying.
 */
export function chirpCry(opts: PlayOptions = {}): void {
  if (opts.muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, t, 440, 0.14, 0.045, "sine");
  note(ctx, t + 0.12, 360, 0.18, 0.045, "sine");
  note(ctx, t + 0.32, 300, 0.2, 0.04, "sine");
}
