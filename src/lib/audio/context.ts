type WindowWithWebkit = Window & {
  webkitAudioContext?: typeof AudioContext;
};

let ctx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const w = window as WindowWithWebkit;
  const Ctor = window.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
  } catch {
    return null;
  }
  return ctx;
}

export function resumeAudio(): void {
  const c = getAudioContext();
  if (c && c.state === "suspended") {
    void c.resume();
  }
}
