import type { Species } from "@/lib/game/types";
import type { PixelGrid, SpritePalette } from "../Sprite";

export type AccessorySlot = "hat" | "glasses" | "ribbon";

export interface AccessoryOffset {
  top: string;
  left: string;
}

export interface Accessory {
  id: string;
  slot: AccessorySlot;
  nameKey: string;
  price: number;
  palette: SpritePalette;
  frame: PixelGrid;
  /**
   * Per-species anchor. Each sprite has a different head / eye / neck shape,
   * so we tune positions individually. Values are percentages of the pet's
   * bounding box. `left` assumes the accessory is translated -50% on X.
   */
  offsets: Record<Species, AccessoryOffset>;
  /** Pixel size relative to the pet's pixelSize (multiplier). */
  scale?: number;
}

const _ = 0;
const A = 1; // primary accessory color
const B = 2; // secondary / highlight

// ---------- HATS ----------

const crownFrame: PixelGrid = [
  [_, _, A, _, _, _, _, A, _, _],
  [_, A, A, A, _, _, A, A, A, _],
  [A, A, A, A, A, A, A, A, A, A],
  [A, A, A, A, A, A, A, A, A, A],
];

const wizardFrame: PixelGrid = [
  [_, _, _, _, A, A, _, _, _, _],
  [_, _, _, A, A, A, A, _, _, _],
  [_, _, A, A, A, B, A, A, _, _],
  [_, A, A, A, A, A, A, A, A, _],
  [A, A, A, A, A, A, A, A, A, A],
];

const capFrame: PixelGrid = [
  [_, _, _, A, A, A, A, _, _, _],
  [_, _, A, A, A, A, A, A, _, _],
  [A, A, A, A, A, A, A, A, A, A],
];

// ---------- GLASSES ----------

const roundFrame: PixelGrid = [
  [_, A, A, _, _, _, A, A, _, _],
  [_, A, A, _, _, _, A, A, _, _],
];

const shadesFrame: PixelGrid = [
  [A, A, A, A, _, A, A, A, A, _],
  [A, A, A, A, _, A, A, A, A, _],
];

const starFrame: PixelGrid = [
  [_, _, A, _, _, _, A, _, _, _],
  [_, A, A, A, _, A, A, A, _, _],
  [_, _, A, _, _, _, A, _, _, _],
];

// ---------- RIBBONS ----------

const bowFrame: PixelGrid = [
  [_, A, _, _, _, _, A, _],
  [A, A, A, A, A, A, A, A],
  [_, A, _, _, _, _, A, _],
];

const collarFrame: PixelGrid = [
  [A, A, A, A, A, A, A, A, A, A],
  [_, _, _, A, A, A, A, _, _, _],
];

const tieFrame: PixelGrid = [
  [_, A, A, _],
  [_, A, _, _],
  [A, A, A, A],
  [_, A, A, _],
];

export const ACCESSORIES: Accessory[] = [
  {
    id: "hat_crown",
    slot: "hat",
    nameKey: "hatCrown",
    price: 60,
    frame: crownFrame,
    palette: { 0: "transparent", 1: "#ffe14d" },
    offsets: {
      blob: { top: "-15%", left: "50%" },
      dino: { top: "-15%", left: "55%" },
      cat: { top: "-6%", left: "50%" },
    },
    scale: 0.85,
  },
  {
    id: "hat_wizard",
    slot: "hat",
    nameKey: "hatWizard",
    price: 40,
    frame: wizardFrame,
    palette: { 0: "transparent", 1: "#6d3cff", 2: "#ffe14d" },
    offsets: {
      blob: { top: "-24%", left: "50%" },
      dino: { top: "-24%", left: "55%" },
      cat: { top: "-15%", left: "50%" },
    },
    scale: 0.85,
  },
  {
    id: "hat_cap",
    slot: "hat",
    nameKey: "hatCap",
    price: 20,
    frame: capFrame,
    palette: { 0: "transparent", 1: "#ff4d6d" },
    offsets: {
      blob: { top: "-10%", left: "50%" },
      dino: { top: "-10%", left: "55%" },
      cat: { top: "-2%", left: "50%" },
    },
    scale: 0.85,
  },
  {
    id: "glasses_round",
    slot: "glasses",
    nameKey: "glassesRound",
    price: 25,
    frame: roundFrame,
    palette: { 0: "transparent", 1: "#0a0f0a" },
    offsets: {
      blob: { top: "26%", left: "50%" },
      dino: { top: "22%", left: "55%" },
      cat: { top: "34%", left: "50%" },
    },
    scale: 0.85,
  },
  {
    id: "glasses_shades",
    slot: "glasses",
    nameKey: "glassesShades",
    price: 45,
    frame: shadesFrame,
    palette: { 0: "transparent", 1: "#000000" },
    offsets: {
      blob: { top: "26%", left: "50%" },
      dino: { top: "22%", left: "55%" },
      cat: { top: "34%", left: "50%" },
    },
    scale: 0.85,
  },
  {
    id: "glasses_star",
    slot: "glasses",
    nameKey: "glassesStar",
    price: 70,
    frame: starFrame,
    palette: { 0: "transparent", 1: "#ffe14d" },
    offsets: {
      blob: { top: "22%", left: "50%" },
      dino: { top: "18%", left: "55%" },
      cat: { top: "30%", left: "50%" },
    },
    scale: 0.85,
  },
  {
    id: "ribbon_bow",
    slot: "ribbon",
    nameKey: "ribbonBow",
    price: 20,
    frame: bowFrame,
    palette: { 0: "transparent", 1: "#ff4fa3" },
    offsets: {
      blob: { top: "62%", left: "50%" },
      dino: { top: "48%", left: "50%" },
      cat: { top: "60%", left: "50%" },
    },
    scale: 0.8,
  },
  {
    id: "ribbon_collar",
    slot: "ribbon",
    nameKey: "ribbonCollar",
    price: 35,
    frame: collarFrame,
    palette: { 0: "transparent", 1: "#4de1ff" },
    offsets: {
      blob: { top: "66%", left: "50%" },
      dino: { top: "52%", left: "50%" },
      cat: { top: "64%", left: "50%" },
    },
    scale: 0.85,
  },
  {
    id: "ribbon_tie",
    slot: "ribbon",
    nameKey: "ribbonTie",
    price: 50,
    frame: tieFrame,
    palette: { 0: "transparent", 1: "#ff4d4d" },
    offsets: {
      blob: { top: "58%", left: "50%" },
      dino: { top: "46%", left: "50%" },
      cat: { top: "58%", left: "50%" },
    },
    scale: 0.7,
  },
];

export const ACCESSORIES_BY_ID = new Map(
  ACCESSORIES.map((a) => [a.id, a])
);

export function accessoryById(id: string | null | undefined): Accessory | null {
  if (!id) return null;
  return ACCESSORIES_BY_ID.get(id) ?? null;
}

export const SLOT_ORDER: AccessorySlot[] = ["hat", "glasses", "ribbon"];
