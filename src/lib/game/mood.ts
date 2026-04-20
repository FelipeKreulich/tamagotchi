import type { Mood, Pet } from "./types";

export function computeMood(pet: Pet): Mood {
  if (!pet.isAlive) return "dead";
  if (pet.isSleeping) return "sleeping";
  if (pet.isSick) return "sick";
  if (pet.stats.hygiene <= 20 || pet.poopCount >= 2) return "dirty";
  if (pet.stats.hunger <= 25) return "hungry";
  if (pet.stats.happiness <= 25 || pet.stats.energy <= 20) return "sad";
  return "happy";
}
