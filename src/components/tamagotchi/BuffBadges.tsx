"use client";

import { useEffect, useState } from "react";
import {
  activeGrowth,
  activeLuck,
  activeShield,
  type ActiveBuff,
} from "@/lib/game/potions";

interface BuffBadgesProps {
  buffs: ActiveBuff[];
}

function formatRemaining(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h${m.toString().padStart(2, "0")}`;
  if (m > 0) return `${m}:${s.toString().padStart(2, "0")}`;
  return `${s}s`;
}

export function BuffBadges({ buffs }: BuffBadgesProps) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const shielded = buffs.find(
    (b) => b.kind === "shield" && (b.expiresAt ?? 0) > now
  );
  const growth = activeGrowth(buffs, now);
  const luck = activeLuck(buffs);
  const shieldExp = shielded?.expiresAt ?? 0;
  // Force reads so buffs list is accepted by lint
  void activeShield;

  if (!shielded && !growth && !luck) return null;

  return (
    <div className="pointer-events-none absolute left-2 top-2 z-[3] flex flex-wrap gap-1">
      {shielded && (
        <span className="flex items-center gap-1 border border-[#ffe14d] bg-lcd-dark/80 px-1.5 py-0.5 text-[8px] uppercase tracking-widest text-[#ffe14d]">
          🛡 {formatRemaining(shieldExp - now)}
        </span>
      )}
      {growth && (
        <span className="flex items-center gap-1 border border-accent-cyan bg-lcd-dark/80 px-1.5 py-0.5 text-[8px] uppercase tracking-widest text-accent-cyan">
          ⚡ {formatRemaining(growth.expiresAt - now)}
        </span>
      )}
      {luck && (
        <span className="flex items-center gap-1 border border-accent-pink bg-lcd-dark/80 px-1.5 py-0.5 text-[8px] uppercase tracking-widest text-accent-pink">
          🍀 x{luck.usesLeft}
        </span>
      )}
    </div>
  );
}
