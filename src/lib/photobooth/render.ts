import type { Pet, Species, Variant } from "@/lib/game/types";
import type { Cosmetics } from "@/lib/storage/schema";
import {
  accessoryById,
  DEFAULT_CASE_STYLE,
  caseSkinById,
  isPetAccessory,
  wallpaperSkinById,
  type CaseStyle,
  type PetAccessory,
  type WallpaperStyle,
} from "@/components/tamagotchi/accessories/catalog";
import { getSpriteFor } from "@/components/tamagotchi/sprites";
import type { PixelGrid, SpritePalette } from "@/components/tamagotchi/Sprite";

export const PHOTOBOOTH_WIDTH = 1080;
export const PHOTOBOOTH_HEIGHT = 1920;

export interface PhotoboothLabels {
  brand: string;
  tagline: string;
  ageLabel: string;
  stageLabel: string;
  moodLabel: string;
  statsTitle: string;
  stats: {
    hunger: string;
    happiness: string;
    energy: string;
    hygiene: string;
    health: string;
  };
  stages: Record<Pet["stage"], string>;
  moods: Record<Pet["mood"], string>;
  species: Record<Species, string>;
  variants: Record<Variant, string>;
  minuteShort: string;
  hourShort: string;
  date: string;
  footer: string;
}

export interface PhotoboothOptions {
  pet: Pet;
  cosmetics: Cosmetics;
  labels: PhotoboothLabels;
}

const FONT = '"Press Start 2P", "Courier New", monospace';

function resolveVar(value: string, root: HTMLElement): string {
  const trimmed = value.trim();
  const m = trimmed.match(/^var\((--[^)]+)\)$/);
  if (!m) return trimmed;
  return (
    getComputedStyle(root).getPropertyValue(m[1]).trim() || trimmed
  );
}

function resolvePalette(
  palette: SpritePalette,
  root: HTMLElement
): Record<number, string> {
  const out: Record<number, string> = {};
  for (const key of Object.keys(palette)) {
    const i = Number(key);
    out[i] = resolveVar(palette[i] ?? "transparent", root);
  }
  return out;
}

function paintPixelGrid(
  ctx: CanvasRenderingContext2D,
  grid: PixelGrid,
  palette: Record<number, string>,
  x: number,
  y: number,
  pixelSize: number
) {
  for (let row = 0; row < grid.length; row++) {
    const cols = grid[row];
    for (let col = 0; col < cols.length; col++) {
      const idx = cols[col];
      const color = palette[idx];
      if (!color || color === "transparent") continue;
      ctx.fillStyle = color;
      ctx.fillRect(
        Math.round(x + col * pixelSize),
        Math.round(y + row * pixelSize),
        pixelSize,
        pixelSize
      );
    }
  }
}

function parsePercent(v: string): number {
  return parseFloat(v);
}

function drawAccessory(
  ctx: CanvasRenderingContext2D,
  accessory: PetAccessory,
  species: Species,
  petX: number,
  petY: number,
  petW: number,
  petH: number,
  basePixelSize: number,
  root: HTMLElement
) {
  const offset = accessory.offsets[species];
  const scale = accessory.scale ?? 1;
  const pixelSize = Math.max(2, Math.round(basePixelSize * scale));
  const frameW = accessory.frame[0].length * pixelSize;
  const frameH = accessory.frame.length * pixelSize;
  const leftPct = parsePercent(offset.left);
  const topPct = parsePercent(offset.top);
  const cx = petX + (petW * leftPct) / 100;
  const yTop = petY + (petH * topPct) / 100;
  const x = cx - frameW / 2;
  const resolved = resolvePalette(accessory.palette, root);
  paintPixelGrid(ctx, accessory.frame, resolved, x, yTop, pixelSize);
  void frameH;
}

function paintCaseFrame(
  ctx: CanvasRenderingContext2D,
  caseStyle: CaseStyle,
  x: number,
  y: number,
  w: number,
  h: number,
  root: HTMLElement
) {
  const bezelWidth = 24;

  // Outer bezel background: solid color from case style (gradients are
  // parsed only if `background` is a pure color; otherwise we sample the
  // border color as a fallback so the case stays readable).
  const bezelFill = extractSolidFill(caseStyle.background, caseStyle.border);
  ctx.fillStyle = resolveVar(bezelFill, root);
  ctx.fillRect(x, y, w, h);

  // Outer border line
  ctx.strokeStyle = resolveVar(caseStyle.border, root);
  ctx.lineWidth = 6;
  ctx.strokeRect(x + 3, y + 3, w - 6, h - 6);

  // Inner border around the LCD well
  ctx.strokeStyle = resolveVar(caseStyle.innerBorder, root);
  ctx.lineWidth = 4;
  ctx.strokeRect(
    x + bezelWidth,
    y + bezelWidth,
    w - bezelWidth * 2,
    h - bezelWidth * 2
  );
}

function extractSolidFill(bg: string, fallback: string): string {
  // If it looks like a pure hex/rgb color, use it; else fall back. Canvas
  // can't paint CSS gradients directly, so we pick the fallback (usually
  // the outer border color) which still reads as "that case vibe".
  const stripped = bg.trim();
  if (
    stripped.startsWith("#") ||
    stripped.startsWith("rgb") ||
    stripped.startsWith("var(")
  ) {
    return stripped;
  }
  // gradient or unknown — pick the second color stop as a best-effort
  const match = stripped.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/g);
  if (match && match.length >= 2) return match[1];
  if (match && match.length === 1) return match[0];
  return fallback;
}

function paintLcdBackground(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  root: HTMLElement
) {
  ctx.fillStyle = resolveVar("var(--lcd-bg)", root);
  ctx.fillRect(x, y, w, h);
}

function paintWallpaper(
  ctx: CanvasRenderingContext2D,
  style: WallpaperStyle,
  x: number,
  y: number,
  w: number,
  h: number,
  root: HTMLElement
) {
  const color = resolveVar(style.color, root);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.globalAlpha = style.opacity;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  if (style.pattern === "dots") {
    const step = 24;
    for (let gy = y; gy < y + h; gy += step) {
      for (let gx = x; gx < x + w; gx += step) {
        ctx.beginPath();
        ctx.arc(gx + step / 2, gy + step / 2, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (style.pattern === "waves") {
    ctx.lineWidth = 3;
    const step = 32;
    for (let gy = y + 16; gy < y + h; gy += step) {
      ctx.beginPath();
      ctx.moveTo(x, gy);
      for (let gx = 0; gx < w; gx += 8) {
        const phase = ((gx / 60) * Math.PI * 2) % (Math.PI * 2);
        ctx.lineTo(x + gx, gy + Math.sin(phase) * 6);
      }
      ctx.stroke();
    }
  } else if (style.pattern === "rain") {
    ctx.font = `28px ${FONT}`;
    ctx.textBaseline = "top";
    const cols = 10;
    const rows = 8;
    const stepX = w / cols;
    const stepY = h / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // deterministic scatter
        const jitterX = ((r * 17 + c * 31) % 19) - 9;
        const jitterY = ((r * 23 + c * 13) % 29) - 14;
        ctx.fillText(
          "*",
          x + c * stepX + stepX / 2 + jitterX,
          y + r * stepY + stepY / 2 + jitterY
        );
      }
    }
  } else {
    // scanlines
    ctx.lineWidth = 2;
    for (let gy = y; gy < y + h; gy += 6) {
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.lineTo(x + w, gy);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function paintLcdScanlines(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  for (let gy = y; gy < y + h; gy += 4) {
    ctx.fillRect(x, gy, w, 1);
  }
  ctx.restore();
}

function formatAge(
  minutes: number,
  minuteShort: string,
  hourShort: string
): string {
  if (minutes < 60) return `${Math.max(0, Math.round(minutes))} ${minuteShort}`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m === 0
    ? `${h} ${hourShort}`
    : `${h} ${hourShort} ${m} ${minuteShort}`;
}

function paintStatBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  label: string,
  value: number,
  color: string,
  trackColor: string,
  labelColor: string
) {
  ctx.fillStyle = labelColor;
  ctx.font = `24px ${FONT}`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText(label, x, y);
  ctx.textAlign = "right";
  ctx.fillText(`${Math.round(value)}%`, x + w, y);

  const barY = y + 18;
  const barH = 22;
  ctx.fillStyle = trackColor;
  ctx.fillRect(x, barY, w, barH);
  const segments = 16;
  const segW = w / segments;
  const filled = Math.round((value / 100) * segments);
  ctx.fillStyle = color;
  for (let i = 0; i < filled; i++) {
    ctx.fillRect(x + i * segW + 2, barY + 2, segW - 4, barH - 4);
  }
}

export function renderPhotobooth(
  canvas: HTMLCanvasElement,
  opts: PhotoboothOptions
) {
  const { pet, cosmetics, labels } = opts;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = PHOTOBOOTH_WIDTH;
  canvas.height = PHOTOBOOTH_HEIGHT;

  const root = document.documentElement;
  const lcdDark = resolveVar("var(--lcd-dark)", root);
  const lcdDim = resolveVar("var(--lcd-dim)", root);
  const lcdLight = resolveVar("var(--lcd-light)", root);
  const accentPink = resolveVar("var(--accent-pink)", root);
  const accentCyan = resolveVar("var(--accent-cyan)", root);

  // ---------- Background: vertical gradient from lcd-dim → lcd-dark ----------
  const bg = ctx.createLinearGradient(0, 0, 0, PHOTOBOOTH_HEIGHT);
  bg.addColorStop(0, lcdDim);
  bg.addColorStop(0.5, lcdDark);
  bg.addColorStop(1, "#000000");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, PHOTOBOOTH_WIDTH, PHOTOBOOTH_HEIGHT);

  // Grain/vignette dots in the margins
  ctx.fillStyle = lcdLight;
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 400; i++) {
    const gx = (i * 97) % PHOTOBOOTH_WIDTH;
    const gy = (i * 131) % PHOTOBOOTH_HEIGHT;
    ctx.fillRect(gx, gy, 3, 3);
  }
  ctx.globalAlpha = 1;

  // ---------- Header ----------
  const pad = 72;
  const headerY = 110;
  ctx.fillStyle = accentPink;
  ctx.fillRect(pad, headerY - 24, 20, 20);
  ctx.fillStyle = lcdLight;
  ctx.font = `28px ${FONT}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(labels.brand, pad + 36, headerY - 6);

  ctx.fillStyle = lcdLight;
  ctx.globalAlpha = 0.6;
  ctx.font = `20px ${FONT}`;
  ctx.textAlign = "right";
  ctx.fillText(labels.date, PHOTOBOOTH_WIDTH - pad, headerY - 6);
  ctx.globalAlpha = 1;

  // thin divider
  ctx.fillStyle = lcdLight;
  ctx.globalAlpha = 0.35;
  ctx.fillRect(pad, headerY + 12, PHOTOBOOTH_WIDTH - pad * 2, 2);
  ctx.globalAlpha = 1;

  // ---------- LCD hero ----------
  const caseStyle =
    caseSkinById(cosmetics.equipped.case)?.style ?? DEFAULT_CASE_STYLE;
  const caseX = pad;
  const caseY = 200;
  const caseW = PHOTOBOOTH_WIDTH - pad * 2;
  const caseH = 860;
  paintCaseFrame(ctx, caseStyle, caseX, caseY, caseW, caseH, root);

  const bezel = 48;
  const lcdX = caseX + bezel;
  const lcdY = caseY + bezel;
  const lcdW = caseW - bezel * 2;
  const lcdH = caseH - bezel * 2;
  paintLcdBackground(ctx, lcdX, lcdY, lcdW, lcdH, root);

  // Wallpaper
  const wallpaper = wallpaperSkinById(cosmetics.equipped.wallpaper)?.style;
  if (wallpaper) {
    paintWallpaper(ctx, wallpaper, lcdX, lcdY, lcdW, lcdH, root);
  }

  // Mood badge at top of LCD
  ctx.fillStyle = lcdLight;
  ctx.globalAlpha = 0.6;
  ctx.font = `22px ${FONT}`;
  ctx.textAlign = "center";
  const moodLabel = labels.moods[pet.mood] ?? "";
  ctx.fillText(moodLabel, lcdX + lcdW / 2, lcdY + 60);
  ctx.globalAlpha = 1;

  // Pet sprite, centered. Render the first frame of the current mood.
  const stage = pet.stage === "egg" ? "egg" : "post-egg";
  const { frames, palette } = getSpriteFor(
    pet.species,
    pet.mood,
    stage,
    pet.variant
  );
  const frame = frames[0];
  const gridH = frame.length;
  const gridW = frame[0].length;
  const maxPetW = lcdW * 0.6;
  const maxPetH = lcdH * 0.6;
  const pixelSize = Math.max(
    4,
    Math.floor(Math.min(maxPetW / gridW, maxPetH / gridH))
  );
  const petW = gridW * pixelSize;
  const petH = gridH * pixelSize;
  const petX = lcdX + (lcdW - petW) / 2;
  const petY = lcdY + (lcdH - petH) / 2 + 20;
  const resolvedPalette = resolvePalette(palette, root);
  paintPixelGrid(ctx, frame, resolvedPalette, petX, petY, pixelSize);

  // Accessories on top of the pet (hats/glasses/ribbons)
  if (pet.stage !== "egg") {
    for (const slot of ["hat", "glasses", "ribbon"] as const) {
      const acc = accessoryById(cosmetics.equipped[slot]);
      if (acc && isPetAccessory(acc)) {
        drawAccessory(
          ctx,
          acc,
          pet.species,
          petX,
          petY,
          petW,
          petH,
          pixelSize,
          root
        );
      }
    }
  }

  paintLcdScanlines(ctx, lcdX, lcdY, lcdW, lcdH);

  // ---------- Name ----------
  const afterCaseY = caseY + caseH + 80;
  ctx.fillStyle = lcdLight;
  ctx.font = `72px ${FONT}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const nameText = pet.name.toUpperCase();
  // shadow/offset for emphasis
  ctx.fillStyle = accentPink;
  ctx.fillText(nameText, pad + 4, afterCaseY + 4);
  ctx.fillStyle = lcdLight;
  ctx.fillText(nameText, pad, afterCaseY);

  // Subtitle: STAGE · SPECIES · VARIANT (if not normal)
  ctx.fillStyle = accentCyan;
  ctx.font = `26px ${FONT}`;
  const stageLabel = labels.stages[pet.stage] ?? pet.stage;
  const speciesLabel = labels.species[pet.species] ?? pet.species;
  const variantLabel =
    pet.variant !== "normal" ? ` · ${labels.variants[pet.variant] ?? ""}` : "";
  ctx.fillText(
    `${stageLabel} · ${speciesLabel}${variantLabel}`,
    pad,
    afterCaseY + 52
  );

  // ---------- Stats block ----------
  const statsTop = afterCaseY + 110;
  ctx.fillStyle = lcdLight;
  ctx.globalAlpha = 0.55;
  ctx.font = `22px ${FONT}`;
  ctx.textAlign = "left";
  ctx.fillText(labels.statsTitle, pad, statsTop);
  ctx.globalAlpha = 1;

  const bars: Array<[string, number, string]> = [
    [labels.stats.happiness, pet.stats.happiness, accentPink],
    [labels.stats.hunger, pet.stats.hunger, lcdLight],
    [labels.stats.energy, pet.stats.energy, accentCyan],
    [labels.stats.hygiene, pet.stats.hygiene, lcdLight],
    [labels.stats.health, pet.stats.health, accentPink],
  ];
  const barsW = PHOTOBOOTH_WIDTH - pad * 2;
  const rowH = 64;
  const firstBarY = statsTop + 42;
  bars.forEach(([label, value, color], i) => {
    paintStatBar(
      ctx,
      pad,
      firstBarY + i * rowH,
      barsW,
      label,
      value,
      color,
      lcdDim,
      lcdLight
    );
  });
  const statsEndY = firstBarY + (bars.length - 1) * rowH + 40;

  // ---------- Age + Footer (centered block) ----------
  const ageY = statsEndY + 82;
  // small divider above the age block
  ctx.fillStyle = lcdLight;
  ctx.globalAlpha = 0.25;
  ctx.fillRect(
    PHOTOBOOTH_WIDTH / 2 - 120,
    ageY - 54,
    240,
    2
  );
  ctx.globalAlpha = 1;

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = lcdLight;
  ctx.globalAlpha = 0.6;
  ctx.font = `20px ${FONT}`;
  ctx.fillText(labels.ageLabel, PHOTOBOOTH_WIDTH / 2, ageY - 16);
  ctx.globalAlpha = 1;

  ctx.fillStyle = accentCyan;
  ctx.font = `42px ${FONT}`;
  ctx.fillText(
    formatAge(pet.ageMinutes, labels.minuteShort, labels.hourShort),
    PHOTOBOOTH_WIDTH / 2,
    ageY + 32
  );

  // ---------- Footer (centered, two lines) ----------
  const footerY = PHOTOBOOTH_HEIGHT - 90;
  ctx.fillStyle = lcdLight;
  ctx.globalAlpha = 0.35;
  ctx.fillRect(pad, footerY - 40, PHOTOBOOTH_WIDTH - pad * 2, 2);
  ctx.globalAlpha = 1;

  ctx.textAlign = "center";
  ctx.fillStyle = lcdLight;
  ctx.font = `24px ${FONT}`;
  ctx.fillText(labels.tagline, PHOTOBOOTH_WIDTH / 2, footerY - 8);

  ctx.fillStyle = lcdLight;
  ctx.globalAlpha = 0.55;
  ctx.font = `18px ${FONT}`;
  ctx.fillText(labels.footer, PHOTOBOOTH_WIDTH / 2, footerY + 28);
  ctx.globalAlpha = 1;
}
