import { describe, expect, it } from "vitest";
import { createPet } from "./create";
import { tickPet } from "./tick";

describe("tickPet", () => {
  it("decays stats over time", () => {
    const pet = createPet({ name: "X", species: "blob", now: 0 });
    const { pet: next } = tickPet(pet, 60_000); // 60 seconds
    expect(next.stats.hunger).toBeLessThan(100);
    expect(next.stats.happiness).toBeLessThan(100);
    expect(next.stats.energy).toBeLessThan(100);
    expect(next.stats.hygiene).toBeLessThan(100);
  });

  it("regen energy while sleeping", () => {
    const pet = createPet({ name: "X", species: "blob", now: 0 });
    pet.stats.energy = 40;
    pet.isSleeping = true;
    const { pet: next } = tickPet(pet, 30_000);
    expect(next.stats.energy).toBeGreaterThan(40);
  });

  it("marks pet as dead when health hits 0", () => {
    const pet = createPet({ name: "X", species: "blob", now: 0 });
    pet.stats.health = 0;
    const { pet: next, events } = tickPet(pet, 1000);
    expect(next.isAlive).toBe(false);
    expect(events.died).toBe(true);
    expect(next.mood).toBe("dead");
  });

  it("does not tick a dead pet", () => {
    const pet = createPet({ name: "X", species: "blob", now: 0 });
    pet.isAlive = false;
    pet.diedAt = 500;
    const { pet: next } = tickPet(pet, 60_000);
    expect(next).toBe(pet);
  });
});
