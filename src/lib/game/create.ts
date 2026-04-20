import type { Pet, Species } from "./types";

function randomId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createPet(params: {
  name: string;
  species: Species;
  now?: number;
}): Pet {
  const now = params.now ?? Date.now();
  return {
    id: randomId(),
    name: params.name.trim().slice(0, 12) || "Bicho",
    species: params.species,
    stage: "egg",
    mood: "happy",
    stats: {
      hunger: 100,
      happiness: 100,
      energy: 100,
      hygiene: 100,
      health: 100,
    },
    bornAt: now,
    ageMinutes: 0,
    lastTickAt: now,
    isAlive: true,
    diedAt: null,
    causeOfDeath: null,
    poopCount: 0,
    isSleeping: false,
    isSick: false,
  };
}
