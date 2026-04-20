import type { LifeStage } from "./types";

export const STAT_MIN = 0;
export const STAT_MAX = 100;

// Decay per second (awake, no modifiers). Tuned so stats drop visibly within minutes
// but a well-cared-for pet can live for hours.
export const DECAY_PER_SECOND = {
  hunger: 0.05,
  happiness: 0.04,
  energy: 0.03,
  hygiene: 0.035,
} as const;

// Energy regen per second while sleeping.
export const SLEEP_ENERGY_GAIN = 0.2;

// Hygiene decay multiplier per poop pile present.
export const POOP_HYGIENE_MULTIPLIER = 0.04;

// Health decay per second when pet is sick.
export const SICK_HEALTH_DECAY = 0.08;

// Health decay per second when any stat (other than health) is at 0.
export const CRITICAL_STAT_HEALTH_DECAY = 0.05;

// Passive health regen per second when all other stats > 50.
export const HEALTHY_REGEN = 0.015;

// Life-cycle thresholds in seconds of age.
export const STAGE_THRESHOLDS_SECONDS: Record<LifeStage, number> = {
  egg: 0,
  baby: 45,
  child: 5 * 60,
  teen: 15 * 60,
  adult: 40 * 60,
  elder: 120 * 60,
};

// Old-age death: pet can die naturally after this age in seconds, even healthy.
export const MAX_NATURAL_AGE_SECONDS = 180 * 60;

// How often a poop can appear (seconds).
export const POOP_INTERVAL_SECONDS = 90;
export const POOP_VARIANCE_SECONDS = 30;

// Probability a sweet causes sickness.
export const SWEET_SICKNESS_CHANCE = 0.35;

// Probability per second a sleeping pet auto-wakes if energy is full.
export const AUTO_WAKE_ENERGY_THRESHOLD = 98;

// Tick interval for the in-memory game loop (ms).
export const TICK_INTERVAL_MS = 3000;
