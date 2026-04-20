import type { Mood, Species } from "@/lib/game/types";
import type { SpritePalette } from "../Sprite";
import type { PixelGrid } from "../Sprite";
import { eggFrames } from "./egg";
import {
  blobDead,
  blobDirty,
  blobHappyA,
  blobHappyB,
  blobSad,
  blobSick,
  blobSleeping,
} from "./blob";
import {
  dinoDead,
  dinoDirty,
  dinoHappyA,
  dinoHappyB,
  dinoSad,
  dinoSick,
  dinoSleeping,
} from "./dino";
import {
  catDead,
  catDirty,
  catHappyA,
  catHappyB,
  catSad,
  catSick,
  catSleeping,
} from "./cat";
import { poopFrameA, poopFrameB } from "./poop";

export const blobPalette: SpritePalette = {
  0: "transparent",
  1: "var(--lcd-dark)",
  2: "var(--lcd-light)",
  3: "var(--lcd-dark)",
  4: "var(--accent-pink)",
};

export const dinoPalette: SpritePalette = {
  0: "transparent",
  1: "var(--lcd-dark)",
  2: "var(--accent-cyan)",
  3: "var(--lcd-dark)",
  4: "var(--accent-pink)",
};

export const catPalette: SpritePalette = {
  0: "transparent",
  1: "var(--lcd-dark)",
  2: "var(--accent-pink)",
  3: "var(--lcd-dark)",
  4: "var(--lcd-light)",
};

export const eggPalette: SpritePalette = {
  0: "transparent",
  1: "var(--lcd-dark)",
  2: "var(--lcd-light)",
  3: "var(--accent-cyan)",
};

export const poopPalette: SpritePalette = {
  0: "transparent",
  1: "var(--lcd-dark)",
  2: "var(--accent-pink)",
  4: "var(--lcd-dim)",
};

type FrameSet = readonly PixelGrid[];

const blobFrames: Record<Mood, FrameSet> = {
  happy: [blobHappyA, blobHappyB],
  sad: [blobSad],
  sick: [blobSick, blobSad],
  sleeping: [blobSleeping],
  hungry: [blobSad, blobHappyA],
  dirty: [blobDirty, blobSad],
  dead: [blobDead],
};

const dinoFrames: Record<Mood, FrameSet> = {
  happy: [dinoHappyA, dinoHappyB],
  sad: [dinoSad],
  sick: [dinoSick, dinoSad],
  sleeping: [dinoSleeping],
  hungry: [dinoSad, dinoHappyA],
  dirty: [dinoDirty, dinoSad],
  dead: [dinoDead],
};

const catFrames: Record<Mood, FrameSet> = {
  happy: [catHappyA, catHappyB],
  sad: [catSad],
  sick: [catSick, catSad],
  sleeping: [catSleeping],
  hungry: [catSad, catHappyA],
  dirty: [catDirty, catSad],
  dead: [catDead],
};

const allFrames: Record<Species, Record<Mood, FrameSet>> = {
  blob: blobFrames,
  dino: dinoFrames,
  cat: catFrames,
};

const palettes: Record<Species, SpritePalette> = {
  blob: blobPalette,
  dino: dinoPalette,
  cat: catPalette,
};

export function getSpriteFor(
  species: Species,
  mood: Mood,
  stage: "egg" | "post-egg"
): { frames: FrameSet; palette: SpritePalette } {
  if (stage === "egg") {
    return { frames: eggFrames, palette: eggPalette };
  }
  return { frames: allFrames[species][mood], palette: palettes[species] };
}

export const SPECIES_META: Record<
  Species,
  { label: string; previewFrames: FrameSet; palette: SpritePalette }
> = {
  blob: {
    label: "BLOB",
    previewFrames: blobFrames.happy,
    palette: blobPalette,
  },
  dino: {
    label: "DINO",
    previewFrames: dinoFrames.happy,
    palette: dinoPalette,
  },
  cat: {
    label: "CAT",
    previewFrames: catFrames.happy,
    palette: catPalette,
  },
};

export const poopFrames = [poopFrameA, poopFrameB] as const;
