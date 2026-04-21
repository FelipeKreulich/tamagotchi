"use client";

import { useEffect } from "react";
import {
  paletteSkinById,
  type PaletteVars,
} from "@/components/tamagotchi/accessories/catalog";

const VAR_KEYS: Array<[keyof PaletteVars, string]> = [
  ["lcdBg", "--lcd-bg"],
  ["lcdDark", "--lcd-dark"],
  ["lcdDim", "--lcd-dim"],
  ["lcdLight", "--lcd-light"],
  ["accentPink", "--accent-pink"],
  ["accentCyan", "--accent-cyan"],
];

/**
 * Applies the equipped palette skin's CSS variables on <html>. When nothing
 * is equipped, we remove the overrides so the default palette (and the
 * day/night automatic theming) takes back over.
 */
export function usePaletteOverride(paletteId: string | null | undefined) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const palette = paletteSkinById(paletteId);

    if (palette) {
      for (const [key, cssVar] of VAR_KEYS) {
        root.style.setProperty(cssVar, palette.vars[key]);
      }
      // Disable the night auto-override while a custom palette is active.
      root.dataset.paletteLocked = "1";
    } else {
      for (const [, cssVar] of VAR_KEYS) {
        root.style.removeProperty(cssVar);
      }
      delete root.dataset.paletteLocked;
    }

    return () => {
      for (const [, cssVar] of VAR_KEYS) {
        root.style.removeProperty(cssVar);
      }
      delete root.dataset.paletteLocked;
    };
  }, [paletteId]);
}
