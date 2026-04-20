"use client";

import { useEffect, useState } from "react";

export type ParticleKind =
  | "hearts"
  | "stars"
  | "bubbles"
  | "sparkles"
  | "plus"
  | "notes";

interface Spec {
  count: number;
  chars: string[];
  color: string;
  duration: number; // ms
  animation: "up" | "burst" | "wobble";
}

const SPECS: Record<ParticleKind, Spec> = {
  hearts: {
    count: 6,
    chars: ["♥", "♥"],
    color: "var(--accent-pink)",
    duration: 1200,
    animation: "up",
  },
  stars: {
    count: 8,
    chars: ["★", "✦", "✧"],
    color: "#ffe14d",
    duration: 1100,
    animation: "burst",
  },
  bubbles: {
    count: 7,
    chars: ["◯", "○", "o"],
    color: "var(--accent-cyan)",
    duration: 1500,
    animation: "wobble",
  },
  sparkles: {
    count: 5,
    chars: ["✧", "*"],
    color: "var(--lcd-light)",
    duration: 900,
    animation: "up",
  },
  plus: {
    count: 5,
    chars: ["+"],
    color: "var(--lcd-light)",
    duration: 1000,
    animation: "up",
  },
  notes: {
    count: 5,
    chars: ["♪", "♫"],
    color: "var(--accent-cyan)",
    duration: 1200,
    animation: "up",
  },
};

interface Particle {
  id: number;
  char: string;
  left: number;
  bottom: number;
  delay: number;
  dx: number;
  dy: number;
}

interface ParticleBurstProps {
  /** A changing key: each new value triggers a fresh burst. 0 = idle. */
  trigger: number;
  kind: ParticleKind;
  className?: string;
}

export function ParticleBurst({ trigger, kind, className }: ParticleBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const spec = SPECS[kind];
    const list: Particle[] = Array.from({ length: spec.count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / spec.count + Math.random() * 0.4;
      const radius = 30 + Math.random() * 35;
      return {
        id: Date.now() + i,
        char: spec.chars[Math.floor(Math.random() * spec.chars.length)],
        left: 50 + (Math.random() - 0.5) * 20,
        bottom: 40 + Math.random() * 20,
        delay: Math.random() * 160,
        dx: Math.cos(angle) * radius,
        dy: -Math.abs(Math.sin(angle) * radius),
      };
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(list);
    const t = window.setTimeout(() => {
      setParticles([]);
    }, spec.duration + 400);
    return () => window.clearTimeout(t);
  }, [trigger, kind]);

  if (particles.length === 0) return null;

  const spec = SPECS[kind];
  const animName =
    spec.animation === "burst"
      ? "particleBurst"
      : spec.animation === "wobble"
      ? "particleWobble"
      : "particleUp";

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute text-[12px] select-none"
          style={{
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            color: spec.color,
            transform: "translate(-50%, 0)",
            animation: `${animName} ${spec.duration}ms steps(12) ${p.delay}ms forwards`,
            ["--dx" as string]: `${p.dx}px`,
            ["--dy" as string]: `${p.dy}px`,
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}
