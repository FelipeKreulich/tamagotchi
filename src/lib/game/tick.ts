import {
  CRITICAL_STAT_HEALTH_DECAY,
  DECAY_PER_SECOND,
  HEALTHY_REGEN,
  POOP_HYGIENE_MULTIPLIER,
  POOP_INTERVAL_SECONDS,
  POOP_VARIANCE_SECONDS,
  SICK_HEALTH_DECAY,
  SLEEP_ENERGY_GAIN,
} from "./constants";
import { addStats, criticalCount } from "./stats";
import { ageSeconds, shouldDie, stageFromAge } from "./lifecycle";
import { computeMood } from "./mood";
import type { Pet } from "./types";

export interface TickEvents {
  evolved: boolean;
  died: boolean;
  deathCause: string | null;
  poopSpawned: boolean;
  woke: boolean;
}

const emptyEvents = (): TickEvents => ({
  evolved: false,
  died: false,
  deathCause: null,
  poopSpawned: false,
  woke: false,
});

export function tickPet(pet: Pet, now = Date.now()): {
  pet: Pet;
  events: TickEvents;
} {
  if (!pet.isAlive) return { pet, events: emptyEvents() };

  const deltaSec = Math.max(0, (now - pet.lastTickAt) / 1000);
  if (deltaSec === 0)
    return {
      pet: { ...pet, lastTickAt: now, mood: computeMood(pet) },
      events: emptyEvents(),
    };

  const events = emptyEvents();

  // Base decay
  let hungerDelta = -DECAY_PER_SECOND.hunger * deltaSec;
  let happinessDelta = -DECAY_PER_SECOND.happiness * deltaSec;
  let energyDelta = -DECAY_PER_SECOND.energy * deltaSec;
  let hygieneDelta =
    -(DECAY_PER_SECOND.hygiene +
      pet.poopCount * POOP_HYGIENE_MULTIPLIER) *
    deltaSec;

  // Sleeping modifier: regen energy, halt hunger/happiness/hygiene decay
  let isSleeping = pet.isSleeping;
  if (isSleeping) {
    energyDelta = SLEEP_ENERGY_GAIN * deltaSec;
    hungerDelta *= 0.3;
    happinessDelta *= 0.3;
    hygieneDelta *= 0.3;
  }

  // Health dynamics
  let healthDelta = 0;
  if (pet.isSick) {
    healthDelta -= SICK_HEALTH_DECAY * deltaSec;
  }
  const nextStats = addStats(pet.stats, {
    hunger: hungerDelta,
    happiness: happinessDelta,
    energy: energyDelta,
    hygiene: hygieneDelta,
  });
  const crit = criticalCount(nextStats);
  if (crit > 0) {
    healthDelta -= CRITICAL_STAT_HEALTH_DECAY * deltaSec * crit;
  } else if (
    pet.stats.health > 0 &&
    !pet.isSick &&
    nextStats.hunger > 60 &&
    nextStats.happiness > 60 &&
    nextStats.energy > 60 &&
    nextStats.hygiene > 60
  ) {
    healthDelta += HEALTHY_REGEN * deltaSec;
  }

  const withHealth = addStats(nextStats, { health: healthDelta });

  // Auto-wake if energy reached full
  if (isSleeping && withHealth.energy >= 100) {
    isSleeping = false;
    events.woke = true;
  }

  // Poop spawning (deterministic-ish based on ticks)
  let poopCount = pet.poopCount;
  const age = ageSeconds({ ...pet, lastTickAt: now }, now);
  const poopWindow = POOP_INTERVAL_SECONDS + Math.random() * POOP_VARIANCE_SECONDS;
  if (
    !pet.isSleeping &&
    age > 30 &&
    Math.random() < deltaSec / poopWindow &&
    poopCount < 5
  ) {
    poopCount += 1;
    events.poopSpawned = true;
  }

  // Life-cycle evolution
  const newAge = ageSeconds({ ...pet, bornAt: pet.bornAt }, now);
  const nextStage = stageFromAge(newAge);
  if (nextStage !== pet.stage) {
    events.evolved = true;
  }

  let nextPet: Pet = {
    ...pet,
    stats: withHealth,
    isSleeping,
    poopCount,
    stage: nextStage,
    ageMinutes: Math.floor(newAge / 60),
    lastTickAt: now,
    mood: "happy",
  };

  // Check death last so it uses final stats
  const death = shouldDie(nextPet, now);
  if (death.die) {
    nextPet = {
      ...nextPet,
      isAlive: false,
      diedAt: now,
      causeOfDeath: death.cause,
      mood: "dead",
      isSleeping: false,
    };
    events.died = true;
    events.deathCause = death.cause;
  } else {
    nextPet = { ...nextPet, mood: computeMood(nextPet) };
  }

  return { pet: nextPet, events };
}
