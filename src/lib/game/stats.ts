import { STAT_MAX, STAT_MIN } from "./constants";
import type { Stats } from "./types";

export function clamp(value: number, min = STAT_MIN, max = STAT_MAX): number {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

export function clampStats(stats: Stats): Stats {
  return {
    hunger: clamp(stats.hunger),
    happiness: clamp(stats.happiness),
    energy: clamp(stats.energy),
    hygiene: clamp(stats.hygiene),
    health: clamp(stats.health),
  };
}

export function addStats(stats: Stats, delta: Partial<Stats>): Stats {
  return clampStats({
    hunger: stats.hunger + (delta.hunger ?? 0),
    happiness: stats.happiness + (delta.happiness ?? 0),
    energy: stats.energy + (delta.energy ?? 0),
    hygiene: stats.hygiene + (delta.hygiene ?? 0),
    health: stats.health + (delta.health ?? 0),
  });
}

export function criticalCount(stats: Stats, threshold = 15): number {
  let n = 0;
  if (stats.hunger <= threshold) n++;
  if (stats.happiness <= threshold) n++;
  if (stats.energy <= threshold) n++;
  if (stats.hygiene <= threshold) n++;
  return n;
}

export function averageStat(stats: Stats): number {
  return (
    (stats.hunger + stats.happiness + stats.energy + stats.hygiene + stats.health) /
    5
  );
}

export function isCritical(stats: Stats): boolean {
  return (
    stats.hunger <= 15 ||
    stats.happiness <= 10 ||
    stats.energy <= 10 ||
    stats.hygiene <= 10 ||
    stats.health <= 20
  );
}
