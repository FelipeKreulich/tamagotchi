import { SWEET_SICKNESS_CHANCE } from "./constants";
import { addStats } from "./stats";
import type { Pet } from "./types";

export function feedFood(pet: Pet): Pet {
  if (!pet.isAlive || pet.isSleeping) return pet;
  return {
    ...pet,
    stats: addStats(pet.stats, { hunger: 30, happiness: 5, hygiene: -3 }),
  };
}

export function feedCandy(pet: Pet, roll = Math.random()): Pet {
  if (!pet.isAlive || pet.isSleeping) return pet;
  const gotSick = roll < SWEET_SICKNESS_CHANCE;
  return {
    ...pet,
    stats: addStats(pet.stats, {
      hunger: 10,
      happiness: 22,
      hygiene: -5,
      health: gotSick ? -5 : 0,
    }),
    isSick: pet.isSick || gotSick,
  };
}

export function bath(pet: Pet): Pet {
  if (!pet.isAlive || pet.isSleeping) return pet;
  return {
    ...pet,
    stats: addStats(pet.stats, { hygiene: 60, happiness: -3 }),
    poopCount: 0,
  };
}

export function medicine(pet: Pet): Pet {
  if (!pet.isAlive) return pet;
  if (!pet.isSick) return pet;
  return {
    ...pet,
    isSick: false,
    stats: addStats(pet.stats, { health: 15, happiness: -4 }),
  };
}

export function cleanPoop(pet: Pet): Pet {
  if (!pet.isAlive) return pet;
  if (pet.poopCount <= 0) return pet;
  return {
    ...pet,
    poopCount: Math.max(0, pet.poopCount - 1),
    stats: addStats(pet.stats, { hygiene: 10 }),
  };
}

export function sleep(pet: Pet): Pet {
  if (!pet.isAlive) return pet;
  return { ...pet, isSleeping: true };
}

export function wake(pet: Pet): Pet {
  if (!pet.isAlive) return pet;
  return { ...pet, isSleeping: false };
}

export function applyMinigameResult(
  pet: Pet,
  won: boolean
): Pet {
  if (!pet.isAlive || pet.isSleeping) return pet;
  return {
    ...pet,
    stats: addStats(pet.stats, {
      happiness: won ? 25 : 8,
      energy: -4,
    }),
  };
}
