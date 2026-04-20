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
