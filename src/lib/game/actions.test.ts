import { describe, expect, it } from "vitest";
import {
  applyMinigameResult,
  bath,
  cleanPoop,
  feedCandy,
  feedFood,
  medicine,
  sleep,
  wake,
} from "./actions";
import { createPet } from "./create";

function mk() {
  return createPet({ name: "X", species: "blob" });
}

describe("actions", () => {
  it("feedFood raises hunger", () => {
    const p = mk();
    p.stats.hunger = 40;
    expect(feedFood(p).stats.hunger).toBe(70);
  });

  it("feedCandy with lucky roll does not sicken", () => {
    const p = mk();
    p.stats.happiness = 50;
    const next = feedCandy(p, 0.99); // above SWEET_SICKNESS_CHANCE
    expect(next.isSick).toBe(false);
    expect(next.stats.happiness).toBeGreaterThan(50);
  });

  it("feedCandy with unlucky roll sickens", () => {
    const p = mk();
    const next = feedCandy(p, 0.01);
    expect(next.isSick).toBe(true);
  });

  it("bath restores hygiene and clears poop", () => {
    const p = mk();
    p.stats.hygiene = 10;
    p.poopCount = 3;
    const next = bath(p);
    expect(next.stats.hygiene).toBe(70);
    expect(next.poopCount).toBe(0);
  });

  it("medicine only works when sick", () => {
    const p = mk();
    expect(medicine(p).isSick).toBe(false);
    p.isSick = true;
    const healed = medicine(p);
    expect(healed.isSick).toBe(false);
    expect(healed.stats.health).toBeGreaterThan(100 - 1);
  });

  it("cleanPoop decrements count", () => {
    const p = mk();
    p.poopCount = 2;
    expect(cleanPoop(p).poopCount).toBe(1);
  });

  it("sleep/wake toggles flag", () => {
    const p = mk();
    expect(sleep(p).isSleeping).toBe(true);
    expect(wake(sleep(p)).isSleeping).toBe(false);
  });

  it("minigame win gives more happiness than loss", () => {
    const p = mk();
    p.stats.happiness = 40;
    expect(applyMinigameResult(p, true).stats.happiness).toBeGreaterThan(
      applyMinigameResult(p, false).stats.happiness
    );
  });
});
