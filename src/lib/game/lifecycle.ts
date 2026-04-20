import {
  MAX_NATURAL_AGE_SECONDS,
  STAGE_THRESHOLDS_SECONDS,
} from "./constants";
import type { LifeStage, Pet } from "./types";
import { criticalCount } from "./stats";

const STAGE_ORDER: LifeStage[] = [
  "egg",
  "baby",
  "child",
  "teen",
  "adult",
  "elder",
];

export function ageSeconds(pet: Pet, now = Date.now()): number {
  return Math.max(0, Math.floor((now - pet.bornAt) / 1000));
}

export function stageFromAge(seconds: number): LifeStage {
  let current: LifeStage = "egg";
  for (const stage of STAGE_ORDER) {
    if (seconds >= STAGE_THRESHOLDS_SECONDS[stage]) current = stage;
  }
  return current;
}

export function shouldDie(pet: Pet, now = Date.now()): {
  die: boolean;
  cause: string | null;
} {
  if (!pet.isAlive) return { die: false, cause: null };

  if (pet.stats.health <= 0) {
    return { die: true, cause: "Saúde chegou a zero" };
  }

  if (criticalCount(pet.stats) >= 3) {
    return { die: true, cause: "Abandono (múltiplos stats críticos)" };
  }

  const age = ageSeconds(pet, now);
  if (age >= MAX_NATURAL_AGE_SECONDS) {
    return { die: true, cause: "Velhice" };
  }

  return { die: false, cause: null };
}

export function hasEvolved(
  previous: LifeStage,
  current: LifeStage
): boolean {
  return (
    STAGE_ORDER.indexOf(current) > STAGE_ORDER.indexOf(previous)
  );
}
