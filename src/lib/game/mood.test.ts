import { describe, expect, it } from "vitest";
import { createPet } from "./create";
import { computeMood } from "./mood";

describe("computeMood", () => {
  it("dead overrides everything", () => {
    const pet = createPet({ name: "X", species: "blob" });
    pet.isAlive = false;
    expect(computeMood(pet)).toBe("dead");
  });

  it("sleeping when flag set", () => {
    const pet = createPet({ name: "X", species: "blob" });
    pet.isSleeping = true;
    expect(computeMood(pet)).toBe("sleeping");
  });

  it("sick when flag set", () => {
    const pet = createPet({ name: "X", species: "blob" });
    pet.isSick = true;
    expect(computeMood(pet)).toBe("sick");
  });

  it("hungry when hunger low", () => {
    const pet = createPet({ name: "X", species: "blob" });
    pet.stats.hunger = 10;
    expect(computeMood(pet)).toBe("hungry");
  });

  it("happy by default", () => {
    const pet = createPet({ name: "X", species: "blob" });
    expect(computeMood(pet)).toBe("happy");
  });
});
