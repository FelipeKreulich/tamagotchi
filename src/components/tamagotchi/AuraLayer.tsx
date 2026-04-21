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

export function AuraLayer({ buffs }: AuraLayerProps) {
  const shielded = activeShield(buffs);
  const growth = activeGrowth(buffs);
  const luck = activeLuck(buffs);

  if (!shielded && !growth && !luck) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
    >
      {/* Shield: pulsing golden ring + bubble */}
      {shielded && (
        <>
          <div
            className="absolute h-[180px] w-[180px] rounded-full border-[3px] border-[#ffe14d]/70 bg-[radial-gradient(circle,rgba(255,225,77,0.18)_30%,transparent_70%)]"
            style={{
              animation: "auraPulse 1.8s ease-in-out infinite",
              boxShadow: "0 0 40px 10px rgba(255,225,77,0.35)",
            }}
          />
          <div
            className="absolute h-[200px] w-[200px] rounded-full border border-[#fff6c7]/50"
            style={{
              animation: "auraPulse 2.4s ease-in-out infinite",
              animationDelay: "0.4s",
            }}
          />
          {/* Sparkles */}
          <span className="absolute top-[14%] left-[20%] text-[14px] text-[#ffe14d] animate-[lcdflicker_0.8s_steps(2)_infinite]">
            ✦
          </span>
          <span className="absolute bottom-[22%] right-[18%] text-[14px] text-[#ffe14d] animate-[lcdflicker_1s_steps(2)_infinite]">
            ✦
          </span>
        </>
      )}

      {/* Growth: electric cyan aura with rotating bolts */}
      {growth && (
        <>
          <div
            className="absolute h-[170px] w-[170px] rounded-full border-[3px] border-accent-cyan/80 bg-[radial-gradient(circle,rgba(77,225,255,0.12)_40%,transparent_75%)]"
            style={{
              animation: "auraPulse 1.2s steps(4) infinite",
              boxShadow: "0 0 32px 8px rgba(77,225,255,0.4)",
            }}
          />
          <div
            className="absolute h-[180px] w-[180px]"
            style={{ animation: "auraSpin 2.4s linear infinite" }}
          >
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2 text-[16px] text-accent-cyan"
              style={{ animation: "auraElectric 0.5s steps(4) infinite" }}
            >
              ⚡
            </span>
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[16px] text-accent-cyan"
              style={{
                animation: "auraElectric 0.5s steps(4) infinite",
                animationDelay: "0.25s",
              }}
            >
              ⚡
            </span>
          </div>
        </>
      )}

      {/* Luck: rotating pink stars + sparkle */}
      {luck && (
        <>
          <div
            className="absolute h-[160px] w-[160px] rounded-full bg-[radial-gradient(circle,rgba(255,79,163,0.15)_40%,transparent_75%)]"
            style={{
              animation: "auraPulse 1.6s ease-in-out infinite",
              boxShadow: "0 0 28px 6px rgba(255,79,163,0.4)",
            }}
          />
          <div
            className="absolute h-[170px] w-[170px]"
            style={{ animation: "auraSpinReverse 3s linear infinite" }}
          >
            <span className="absolute top-[10%] left-1/2 -translate-x-1/2 text-[14px] text-accent-pink animate-[lcdflicker_0.9s_steps(2)_infinite]">
              ★
            </span>
            <span className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-[14px] text-accent-pink animate-[lcdflicker_0.9s_steps(2)_infinite]">
              ★
            </span>
            <span className="absolute top-1/2 left-[10%] -translate-y-1/2 text-[12px] text-accent-pink animate-[lcdflicker_1.1s_steps(2)_infinite]">
              ✧
            </span>
            <span className="absolute top-1/2 right-[10%] -translate-y-1/2 text-[12px] text-accent-pink animate-[lcdflicker_1.1s_steps(2)_infinite]">
              ✧
            </span>
          </div>
        </>
      )}
    </div>
  );
}
