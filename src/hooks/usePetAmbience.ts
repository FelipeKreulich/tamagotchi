"use client";

import { useEffect } from "react";
import type { Pet } from "@/lib/game/types";
import {
  chirpDirty,
  chirpHappy,
  chirpHungry,
  chirpSad,
  chirpSick,
  chirpSleep,
} from "@/lib/audio";

const BASE_INTERVAL_MS = 9000;
const JITTER_MS = 6000;

function pickChirp(pet: Pet): ((opts: { muted: boolean }) => void) | null {
  if (!pet.isAlive) return null;
  switch (pet.mood) {
    case "sleeping":
      return chirpSleep;
    case "sick":
      return chirpSick;
    case "dirty":
      return chirpDirty;
    case "hungry":
      return chirpHungry;
    case "sad":
      return chirpSad;
    case "happy":
      return chirpHappy;
    default:
      return null;
  }
}

export function usePetAmbience(options: {
  pet: Pet | null;
  muted: boolean;
  enabled: boolean;
}) {
  const { pet, muted, enabled } = options;

  useEffect(() => {
    if (!enabled || muted) return;
    if (!pet || !pet.isAlive) return;

    let timeoutId: number | undefined;
    let cancelled = false;

    const schedule = () => {
      const delay = BASE_INTERVAL_MS + Math.random() * JITTER_MS;
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        const chirp = pickChirp(pet);
        chirp?.({ muted });
        schedule();
      }, delay);
    };
    schedule();

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [pet, muted, enabled]);
}
