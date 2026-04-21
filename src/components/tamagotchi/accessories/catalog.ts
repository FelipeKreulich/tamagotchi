import type { Species } from "@/lib/game/types";
import type { PixelGrid, SpritePalette } from "../Sprite";

export type AccessorySlot =
  | "hat"
  | "glasses"
  | "ribbon"
  | "buttons"
  | "palette"
  | "case";

export interface AccessoryOffset {
  top: string;
  left: string;
}

export interface ButtonSkinStyle {
  /** CSS background for the dome (gradient recommended). */
  background: string;
  /** Border color of the button. */
  border: string;
  /** Text color for the A/B/C letter. */
  letterColor: string;
  /** Color used for the drop shadow block. */
  shadowColor: string;
  /** Color of the inner ring outline. */
  innerRing: string;
  /** Hover border override (optional). */
  hoverBorder?: string;
}

interface AccessoryBase {
  id: string;
  nameKey: string;
  price: number;
}

export interface PetAccessory extends AccessoryBase {
  slot: "hat" | "glasses" | "ribbon";
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

export interface ButtonSkin extends AccessoryBase {
  slot: "buttons";
  style: ButtonSkinStyle;
}

export interface PaletteVars {
  lcdBg: string;
  lcdDark: string;
  lcdDim: string;
  lcdLight: string;
  accentPink: string;
  accentCyan: string;
}

export interface PaletteSkin extends AccessoryBase {
  slot: "palette";
  vars: PaletteVars;
}

export interface CaseStyle {
  /** Background of the outer frame (usually a gradient). */
  background: string;
  /** Color of the 6px bezel border around the LCD. */
  border: string;
  /** Drop-shadow color for the 3D raised look. */
  shadow: string;
  /** Color of the inner bezel line that frames the LCD. */
  innerBorder: string;
  /** Color of the LED "ON" dot and LCD label text. */
  ledText: string;
}

export interface CaseSkin extends AccessoryBase {
  slot: "case";
  style: CaseStyle;
}

export type Accessory =
  | PetAccessory
  | ButtonSkin
  | PaletteSkin
  | CaseSkin;

export function isPetAccessory(a: Accessory): a is PetAccessory {
  return a.slot === "hat" || a.slot === "glasses" || a.slot === "ribbon";
}

export function isButtonSkin(a: Accessory): a is ButtonSkin {
  return a.slot === "buttons";
}

export function isPaletteSkin(a: Accessory): a is PaletteSkin {
  return a.slot === "palette";
}

export function isCaseSkin(a: Accessory): a is CaseSkin {
  return a.slot === "case";
}

export const DEFAULT_BUTTON_STYLE: ButtonSkinStyle = {
  background:
    "radial-gradient(circle at 30% 25%,#ffc1dc,#ff4fa3 55%,#a62368)",
  border: "var(--lcd-light)",
  letterColor: "var(--lcd-dark)",
  shadowColor: "var(--lcd-dim)",
  innerRing: "rgba(255,79,163,0.5)",
  hoverBorder: "var(--accent-cyan)",
};

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

// ---------- BUTTON SKINS ----------

const BUTTON_SKINS: ButtonSkin[] = [
  {
    id: "btn_cyan",
    slot: "buttons",
    nameKey: "btnCyan",
    price: 50,
    style: {
      background:
        "radial-gradient(circle at 30% 25%,#c7f7ff,#4de1ff 55%,#1a6f87)",
      border: "var(--lcd-light)",
      letterColor: "#0a0f0a",
      shadowColor: "var(--lcd-dim)",
      innerRing: "rgba(77,225,255,0.55)",
      hoverBorder: "var(--accent-pink)",
    },
  },
  {
    id: "btn_gold",
    slot: "buttons",
    nameKey: "btnGold",
    price: 120,
    style: {
      background:
        "radial-gradient(circle at 30% 25%,#fff2b8,#ffd24d 55%,#8a5a00)",
      border: "#fff6c7",
      letterColor: "#3a2a00",
      shadowColor: "#6a4a00",
      innerRing: "rgba(255,210,77,0.65)",
      hoverBorder: "#ffffff",
    },
  },
  {
    id: "btn_retro",
    slot: "buttons",
    nameKey: "btnRetro",
    price: 80,
    style: {
      background:
        "radial-gradient(circle at 30% 25%,#d4f8c4,#7cf074 55%,#3a8a34)",
      border: "var(--lcd-dark)",
      letterColor: "#0a0f0a",
      shadowColor: "var(--lcd-bg)",
      innerRing: "rgba(124,240,116,0.6)",
      hoverBorder: "var(--accent-pink)",
    },
  },
  {
    id: "btn_dark",
    slot: "buttons",
    nameKey: "btnDark",
    price: 70,
    style: {
      background:
        "radial-gradient(circle at 30% 25%,#3a1320,#14050a 55%,#000000)",
      border: "#ff2a4d",
      letterColor: "#ff4d6d",
      shadowColor: "#300014",
      innerRing: "rgba(255,42,77,0.55)",
      hoverBorder: "#ffffff",
    },
  },
];

ACCESSORIES.push(...BUTTON_SKINS);

// ---------- LCD PALETTES ----------

const PALETTE_SKINS: PaletteSkin[] = [
  {
    id: "pal_virtual_boy",
    slot: "palette",
    nameKey: "palVirtualBoy",
    price: 120,
    vars: {
      lcdBg: "#1a0000",
      lcdDark: "#070000",
      lcdDim: "#2a0a0a",
      lcdLight: "#ff2a2a",
      accentPink: "#ff5577",
      accentCyan: "#ff8888",
    },
  },
  {
    id: "pal_amber",
    slot: "palette",
    nameKey: "palAmber",
    price: 100,
    vars: {
      lcdBg: "#1a0f00",
      lcdDark: "#080400",
      lcdDim: "#3a2400",
      lcdLight: "#ffb040",
      accentPink: "#ff7020",
      accentCyan: "#ffd080",
    },
  },
  {
    id: "pal_blueberry",
    slot: "palette",
    nameKey: "palBlueberry",
    price: 110,
    vars: {
      lcdBg: "#0a1a2e",
      lcdDark: "#040a14",
      lcdDim: "#162844",
      lcdLight: "#a0d8ff",
      accentPink: "#ff80c0",
      accentCyan: "#80e0ff",
    },
  },
  {
    id: "pal_midnight",
    slot: "palette",
    nameKey: "palMidnight",
    price: 130,
    vars: {
      lcdBg: "#1a0636",
      lcdDark: "#0a0018",
      lcdDim: "#2a0e50",
      lcdLight: "#c080ff",
      accentPink: "#ff66dd",
      accentCyan: "#9a9aff",
    },
  },
];

ACCESSORIES.push(...PALETTE_SKINS);

export const DEFAULT_PALETTE_VARS: PaletteVars = {
  lcdBg: "#0b1b10",
  lcdDark: "#0a0f0a",
  lcdDim: "#1f3a24",
  lcdLight: "#7cf074",
  accentPink: "#ff4fa3",
  accentCyan: "#4de1ff",
};

// ---------- CASE COLORS ----------

const CASE_SKINS: CaseSkin[] = [
  {
    id: "case_flamingo",
    slot: "case",
    nameKey: "caseFlamingo",
    price: 80,
    style: {
      background:
        "linear-gradient(180deg,#ff8fbf 0%,#f25490 40%,#f25490 60%,#ff8fbf 100%)",
      border: "#ffd5e5",
      shadow: "#7a1445",
      innerBorder: "#9a2a5a",
      ledText: "#ffffff",
    },
  },
  {
    id: "case_chrome",
    slot: "case",
    nameKey: "caseChrome",
    price: 100,
    style: {
      background:
        "linear-gradient(180deg,#e4e8ee 0%,#7a8290 40%,#7a8290 60%,#e4e8ee 100%)",
      border: "#cfd4dc",
      shadow: "#2a3240",
      innerBorder: "#434a58",
      ledText: "#1a1f28",
    },
  },
  {
    id: "case_wood",
    slot: "case",
    nameKey: "caseWood",
    price: 90,
    style: {
      background:
        "linear-gradient(180deg,#b78b5c 0%,#6e461f 40%,#6e461f 60%,#b78b5c 100%)",
      border: "#d9b38a",
      shadow: "#2a180a",
      innerBorder: "#3a240f",
      ledText: "#ffe0b5",
    },
  },
  {
    id: "case_clear",
    slot: "case",
    nameKey: "caseClear",
    price: 110,
    style: {
      background:
        "linear-gradient(180deg,rgba(255,255,255,0.25) 0%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.25) 100%)",
      border: "rgba(255,255,255,0.7)",
      shadow: "rgba(120,120,150,0.4)",
      innerBorder: "rgba(255,255,255,0.3)",
      ledText: "#ffffff",
    },
  },
];

ACCESSORIES.push(...CASE_SKINS);

export const DEFAULT_CASE_STYLE: CaseStyle = {
  background:
    "linear-gradient(180deg,#1b3424 0%,#0a120d 40%,#0a120d 60%,#1b3424 100%)",
  border: "var(--lcd-light)",
  shadow: "var(--lcd-dim)",
  innerBorder: "var(--lcd-dim)",
  ledText: "var(--lcd-light)",
};

export const ACCESSORIES_BY_ID = new Map(
  ACCESSORIES.map((a) => [a.id, a])
);

export function accessoryById(id: string | null | undefined): Accessory | null {
  if (!id) return null;
  return ACCESSORIES_BY_ID.get(id) ?? null;
}

export function buttonSkinById(id: string | null | undefined): ButtonSkin | null {
  const a = accessoryById(id);
  return a && isButtonSkin(a) ? a : null;
}

export function paletteSkinById(
  id: string | null | undefined
): PaletteSkin | null {
  const a = accessoryById(id);
  return a && isPaletteSkin(a) ? a : null;
}

export function caseSkinById(id: string | null | undefined): CaseSkin | null {
  const a = accessoryById(id);
  return a && isCaseSkin(a) ? a : null;
}

export const SLOT_ORDER: AccessorySlot[] = [
  "hat",
  "glasses",
  "ribbon",
  "buttons",
  "palette",
  "case",
];
