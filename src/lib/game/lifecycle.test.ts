import { describe, expect, it } from "vitest";
import { createPet } from "./create";
import { ageSeconds, hasEvolved, shouldDie, stageFromAge } from "./lifecycle";

describe("lifecycle", () => {
  it("returns egg then baby then child based on age", () => {
    expect(stageFromAge(10)).toBe("egg");
    expect(stageFromAge(60)).toBe("baby");
    expect(stageFromAge(6 * 60)).toBe("child");
    expect(stageFromAge(20 * 60)).toBe("teen");
    expect(stageFromAge(45 * 60)).toBe("adult");
    expect(stageFromAge(200 * 60)).toBe("elder");
  });

  it("ageSeconds computes from bornAt", () => {
    const pet = createPet({ name: "X", species: "blob", now: 1000 });
    expect(ageSeconds(pet, 4000)).toBe(3);
  });

  it("detects death when health is 0", () => {
    const pet = createPet({ name: "X", species: "blob" });
    pet.stats.health = 0;
    expect(shouldDie(pet).die).toBe(true);
  });

  it("detects death when 3+ stats are critical", () => {
    const pet = createPet({ name: "X", species: "blob" });
    pet.stats.hunger = 0;
    pet.stats.happiness = 0;
    pet.stats.hygiene = 0;
    expect(shouldDie(pet).die).toBe(true);
  });

  it("hasEvolved detects forward progression only", () => {
    expect(hasEvolved("egg", "baby")).toBe(true);
    expect(hasEvolved("adult", "child")).toBe(false);
    expect(hasEvolved("baby", "baby")).toBe(false);
  });
});
