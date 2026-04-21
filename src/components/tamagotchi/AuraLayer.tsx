"use client";

import {
  activeGrowth,
  activeLuck,
  activeShield,
  type ActiveBuff,
} from "@/lib/game/potions";

interface AuraLayerProps {
  buffs: ActiveBuff[];
}

const SHIELD_SPARKLES = [
  { top: "6%", left: "50%", size: 14, dur: 0.9, delay: 0 },
  { top: "18%", left: "18%", size: 12, dur: 1.1, delay: 0.2 },
  { top: "28%", left: "82%", size: 12, dur: 1.2, delay: 0.5 },
  { top: "54%", left: "10%", size: 14, dur: 1, delay: 0.3 },
  { top: "60%", left: "88%", size: 12, dur: 0.8, delay: 0.1 },
  { top: "82%", left: "30%", size: 12, dur: 1.3, delay: 0.6 },
  { top: "82%", left: "68%", size: 14, dur: 1, delay: 0.4 },
];

const GROWTH_BOLTS = [0, 90, 180, 270];

const LUCK_STARS = [0, 72, 144, 216, 288];
const LUCK_SPARKLES = [
  { top: "10%", left: "20%", size: 12, dur: 1.1, delay: 0 },
  { top: "85%", left: "80%", size: 12, dur: 1, delay: 0.3 },
  { top: "45%", left: "5%", size: 10, dur: 0.9, delay: 0.2 },
  { top: "50%", left: "92%", size: 10, dur: 1.1, delay: 0.5 },
];

export function AuraLayer({ buffs }: AuraLayerProps) {
  const shielded = activeShield(buffs);
  const growth = activeGrowth(buffs);
  const luck = activeLuck(buffs);

  if (!shielded && !growth && !luck) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-visible"
    >
      {/* ---------- SHIELD: divine golden bubble ---------- */}
      {shielded && (
        <>
          {/* Outer glow halo */}
          <div
            className="absolute h-[260px] w-[260px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,225,77,0.22) 0%, rgba(255,225,77,0.08) 40%, transparent 70%)",
              filter: "blur(6px)",
              animationName: "auraPulse",
              animationDuration: "2.2s",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
            }}
          />
          {/* Bubble fill */}
          <div
            className="absolute h-[200px] w-[200px] rounded-full border-[4px] border-[#ffe14d]/80"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,246,199,0.55) 0%, rgba(255,225,77,0.28) 35%, rgba(255,170,0,0.15) 70%, transparent 85%)",
              boxShadow:
                "0 0 40px 14px rgba(255,225,77,0.45), inset 0 0 30px 8px rgba(255,225,77,0.35)",
              animationName: "auraPulse",
              animationDuration: "1.8s",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
            }}
          />
          {/* Bubble highlight arc */}
          <div
            className="absolute h-[200px] w-[200px] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45) 0%, transparent 25%)",
              mixBlendMode: "screen",
            }}
          />
          {/* Sparkles floating inside the bubble */}
          {SHIELD_SPARKLES.map((s, i) => (
            <span
              key={i}
              className="absolute text-[#ffe14d]"
              style={{
                top: s.top,
                left: s.left,
                fontSize: `${s.size}px`,
                transform: "translate(-50%, -50%)",
                filter: "drop-shadow(0 0 4px rgba(255,225,77,0.8))",
                animationName: "lcdflicker",
                animationDuration: `${s.dur}s`,
                animationTimingFunction: "steps(2)",
                animationIterationCount: "infinite",
                animationDelay: `${s.delay}s`,
              }}
            >
              ✦
            </span>
          ))}
        </>
      )}

      {/* ---------- GROWTH: electric cyan storm ---------- */}
      {growth && (
        <>
          {/* Outer electric glow */}
          <div
            className="absolute h-[240px] w-[240px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(77,225,255,0.22) 0%, transparent 65%)",
              filter: "blur(4px)",
              animationName: "auraElectric",
              animationDuration: "0.4s",
              animationTimingFunction: "steps(2)",
              animationIterationCount: "infinite",
            }}
          />
          {/* Double ring pulsing */}
          <div
            className="absolute h-[200px] w-[200px] rounded-full border-[4px] border-accent-cyan"
            style={{
              boxShadow:
                "0 0 40px 12px rgba(77,225,255,0.55), inset 0 0 20px 4px rgba(77,225,255,0.35)",
              animationName: "auraPulse",
              animationDuration: "0.9s",
              animationTimingFunction: "steps(4)",
              animationIterationCount: "infinite",
            }}
          />
          <div
            className="absolute h-[220px] w-[220px] rounded-full border-2 border-accent-cyan/60"
            style={{
              animationName: "auraPulse",
              animationDuration: "1.2s",
              animationTimingFunction: "steps(4)",
              animationIterationCount: "infinite",
              animationDelay: "0.2s",
            }}
          />
          {/* 4 bolts rotating */}
          <div
            className="absolute h-[220px] w-[220px]"
            style={{
              animationName: "auraSpin",
              animationDuration: "1.8s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          >
            {GROWTH_BOLTS.map((angle, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 text-[20px] text-accent-cyan"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-110px) rotate(${-angle}deg)`,
                  filter: "drop-shadow(0 0 6px rgba(77,225,255,1))",
                  animationName: "auraElectric",
                  animationDuration: "0.35s",
                  animationTimingFunction: "steps(3)",
                  animationIterationCount: "infinite",
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                ⚡
              </span>
            ))}
          </div>
        </>
      )}

      {/* ---------- LUCK: pink stardust orbit ---------- */}
      {luck && (
        <>
          <div
            className="absolute h-[230px] w-[230px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,79,163,0.22) 0%, transparent 65%)",
              filter: "blur(4px)",
              animationName: "auraPulse",
              animationDuration: "1.6s",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
            }}
          />
          <div
            className="absolute h-[200px] w-[200px] rounded-full border-[3px] border-accent-pink/70"
            style={{
              boxShadow:
                "0 0 32px 10px rgba(255,79,163,0.5), inset 0 0 20px 4px rgba(255,79,163,0.3)",
              animationName: "auraPulse",
              animationDuration: "1.8s",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
            }}
          />
          {/* Rotating star ring */}
          <div
            className="absolute h-[220px] w-[220px]"
            style={{
              animationName: "auraSpinReverse",
              animationDuration: "3.2s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          >
            {LUCK_STARS.map((angle, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 text-[16px] text-accent-pink"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-105px) rotate(${-angle}deg)`,
                  filter: "drop-shadow(0 0 4px rgba(255,79,163,0.8))",
                  animationName: "lcdflicker",
                  animationDuration: "0.9s",
                  animationTimingFunction: "steps(2)",
                  animationIterationCount: "infinite",
                  animationDelay: `${i * 0.12}s`,
                }}
              >
                ★
              </span>
            ))}
          </div>
          {/* Extra floating sparkles */}
          {LUCK_SPARKLES.map((s, i) => (
            <span
              key={i}
              className="absolute text-accent-pink"
              style={{
                top: s.top,
                left: s.left,
                fontSize: `${s.size}px`,
                transform: "translate(-50%, -50%)",
                filter: "drop-shadow(0 0 4px rgba(255,79,163,0.8))",
                animationName: "lcdflicker",
                animationDuration: `${s.dur}s`,
                animationTimingFunction: "steps(2)",
                animationIterationCount: "infinite",
                animationDelay: `${s.delay}s`,
              }}
            >
              ✧
            </span>
          ))}
        </>
      )}
    </div>
  );
}
