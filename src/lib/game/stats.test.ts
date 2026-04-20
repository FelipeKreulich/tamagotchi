import { describe, expect, it } from "vitest";
import {
  addStats,
  averageStat,
  clamp,
  clampStats,
  criticalCount,
  isCritical,
} from "./stats";

const full = {
  hunger: 100,
  happiness: 100,
  energy: 100,
  hygiene: 100,
  health: 100,
};

describe("stats utils", () => {
  it("clamps values to 0..100", () => {
    expect(clamp(-5)).toBe(0);
    expect(clamp(150)).toBe(100);
    expect(clamp(42)).toBe(42);
  });

  it("clampStats applies to every field", () => {
    expect(
      clampStats({
        hunger: -10,
        happiness: 250,
        energy: 50,
        hygiene: 0,
        health: 99,
      })
    ).toEqual({
      hunger: 0,
      happiness: 100,
      energy: 50,
      hygiene: 0,
      health: 99,
    });
  });

  it("addStats adds and clamps", () => {
    expect(addStats(full, { hunger: -120 }).hunger).toBe(0);
    expect(addStats(full, { happiness: 50 }).happiness).toBe(100);
  });

  it("criticalCount counts stats at/under threshold", () => {
    expect(
      criticalCount({
        hunger: 5,
        happiness: 5,
        energy: 50,
        hygiene: 50,
        health: 50,
      })
    ).toBe(2);
  });

  it("isCritical returns true when any stat is dangerous", () => {
    expect(isCritical({ ...full, hunger: 10 })).toBe(true);
    expect(isCritical(full)).toBe(false);
  });

  it("averageStat averages the 5 stats", () => {
    expect(averageStat(full)).toBe(100);
  });
});
