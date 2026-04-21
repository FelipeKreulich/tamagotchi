export type BuffKind = "shield" | "growth" | "luck";

export type PotionEffect =
  | { kind: "restore_all" }
  | { kind: "shield"; durationMs: number }
  | { kind: "growth"; durationMs: number; multiplier: number }
  | { kind: "luck"; uses: number; multiplier: number };

export interface Potion {
  id: string;
  nameKey: "potionElixir" | "potionShield" | "potionGrowth" | "potionLuck";
  emoji: string;
  price: number;
  effect: PotionEffect;
}

export const POTIONS: Potion[] = [
  {
    id: "potion_elixir",
    nameKey: "potionElixir",
    emoji: "🧪",
    price: 50,
    effect: { kind: "restore_all" },
  },
  {
    id: "potion_shield",
    nameKey: "potionShield",
    emoji: "🛡",
    price: 200,
    effect: { kind: "shield", durationMs: 2 * 60 * 60 * 1000 },
  },
  {
    id: "potion_growth",
    nameKey: "potionGrowth",
    emoji: "⚡",
    price: 150,
    effect: { kind: "growth", durationMs: 30 * 60 * 1000, multiplier: 3 },
  },
  {
    id: "potion_luck",
    nameKey: "potionLuck",
    emoji: "🍀",
    price: 80,
    effect: { kind: "luck", uses: 3, multiplier: 2 },
  },
];

export const POTIONS_BY_ID = new Map(POTIONS.map((p) => [p.id, p]));

export interface ActiveBuff {
  kind: BuffKind;
  startedAt: number;
  expiresAt?: number;
  usesLeft?: number;
  multiplier?: number;
}

export function activeShield(buffs: ActiveBuff[], now = Date.now()): boolean {
  return buffs.some(
    (b) => b.kind === "shield" && (b.expiresAt ?? 0) > now
  );
}

export function activeGrowth(
  buffs: ActiveBuff[],
  now = Date.now()
): { multiplier: number; expiresAt: number } | null {
  const b = buffs.find(
    (b) => b.kind === "growth" && (b.expiresAt ?? 0) > now
  );
  if (!b) return null;
  return {
    multiplier: b.multiplier ?? 3,
    expiresAt: b.expiresAt ?? now,
  };
}

export function activeLuck(
  buffs: ActiveBuff[]
): { multiplier: number; usesLeft: number } | null {
  const b = buffs.find((b) => b.kind === "luck" && (b.usesLeft ?? 0) > 0);
  if (!b) return null;
  return { multiplier: b.multiplier ?? 2, usesLeft: b.usesLeft ?? 0 };
}

export function pruneExpired(
  buffs: ActiveBuff[],
  now = Date.now()
): ActiveBuff[] {
  return buffs.filter((b) => {
    if (b.kind === "luck") return (b.usesLeft ?? 0) > 0;
    return (b.expiresAt ?? 0) > now;
  });
}

export function consumeLuckUse(buffs: ActiveBuff[]): ActiveBuff[] {
  return buffs
    .map((b) =>
      b.kind === "luck" && (b.usesLeft ?? 0) > 0
        ? { ...b, usesLeft: (b.usesLeft ?? 0) - 1 }
        : b
    )
    .filter((b) => {
      if (b.kind === "luck") return (b.usesLeft ?? 0) > 0;
      return true;
    });
}
