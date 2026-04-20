"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  applyMinigameResult,
  bath as bathAction,
  cleanPoop as cleanPoopAction,
  feedCandy,
  feedFood,
  medicine as medicineAction,
  sleep as sleepAction,
  wake as wakeAction,
} from "@/lib/game/actions";
import { TICK_INTERVAL_MS } from "@/lib/game/constants";
import { createPet } from "@/lib/game/create";
import { hasEvolved } from "@/lib/game/lifecycle";
import { tickPet } from "@/lib/game/tick";
import type {
  Achievement,
  GraveyardEntry,
  Pet,
  Species,
} from "@/lib/game/types";
import {
  beepAlert,
  beepError,
  beepSuccess,
  melodyAchievement,
  melodyDeath,
  melodyEvolution,
  sfxBath,
  sfxCandy,
  sfxClean,
  sfxFeed,
  sfxMedicine,
  sfxSleep,
  sfxWake,
} from "@/lib/audio";
import {
  INITIAL_SAVE_STATE,
  loadSave,
  migrate,
  saveSave,
  type SaveState,
} from "@/lib/storage";
import { ACHIEVEMENTS, checkAchievements } from "@/lib/game/achievements";

export interface TamagotchiApi {
  hydrated: boolean;
  pet: Pet | null;
  graveyard: GraveyardEntry[];
  achievements: Achievement[];
  settings: SaveState["settings"];
  isAlive: boolean;
  actions: {
    start: (name: string, species: Species) => void;
    feedFood: () => void;
    feedCandy: () => void;
    bath: () => void;
    medicine: () => void;
    cleanPoop: () => void;
    sleep: () => void;
    wake: () => void;
    playMinigame: (won: boolean) => void;
    reset: () => void;
    setMuted: (muted: boolean) => void;
    setNotificationsEnabled: (enabled: boolean) => void;
    exportSave: () => string;
    importSave: (raw: string) => { success: boolean; error?: string };
  };
}

function persist(state: SaveState) {
  saveSave(state);
}

export function useTamagotchi(): TamagotchiApi {
  const [state, setState] = useState<SaveState>(INITIAL_SAVE_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const saved = loadSave();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(saved);
    // Apply offline decay
    if (saved.pet && saved.pet.isAlive) {
      const { pet, events } = tickPet(saved.pet, Date.now());
      const next: SaveState = { ...saved, pet };
      if (events.died && pet.diedAt) {
        next.graveyard = [
          ...saved.graveyard,
          {
            id: pet.id,
            name: pet.name,
            species: pet.species,
            bornAt: pet.bornAt,
            diedAt: pet.diedAt,
            ageMinutes: pet.ageMinutes,
            causeOfDeath: pet.causeOfDeath ?? "Causas desconhecidas",
          },
        ];
      }
      setState(next);
      persist(next);
    }
    setHydrated(true);
  }, []);

  // Game loop
  useEffect(() => {
    if (!hydrated) return;
    const id = window.setInterval(() => {
      setState((prev) => {
        if (!prev.pet || !prev.pet.isAlive) return prev;
        const prevStage = prev.pet.stage;
        const now = Date.now();
        const { pet, events } = tickPet(prev.pet, now);

        // Sound effects for events
        const muted = prev.settings.muted;
        if (events.evolved && hasEvolved(prevStage, pet.stage)) {
          melodyEvolution({ muted });
        }
        if (events.died) {
          melodyDeath({ muted });
        } else if (
          pet.stats.health <= 25 ||
          pet.stats.hunger <= 15 ||
          pet.stats.hygiene <= 15
        ) {
          // subtle alert when things are bad (rate limited by tick interval)
          if (Math.random() < 0.12) beepAlert({ muted });
        }

        let next: SaveState = { ...prev, pet };

        // Graveyard entry on death
        if (events.died && pet.diedAt) {
          next = {
            ...next,
            graveyard: [
              ...prev.graveyard,
              {
                id: pet.id,
                name: pet.name,
                species: pet.species,
                bornAt: pet.bornAt,
                diedAt: pet.diedAt,
                ageMinutes: pet.ageMinutes,
                causeOfDeath: pet.causeOfDeath ?? "Causas desconhecidas",
              },
            ],
          };
        }

        // Achievements
        const newAchievements = checkAchievements(next, ACHIEVEMENTS);
        if (newAchievements.length > 0) {
          melodyAchievement({ muted });
          next = {
            ...next,
            achievements: [
              ...next.achievements.filter(
                (a) => !newAchievements.some((n) => n.id === a.id)
              ),
              ...newAchievements,
            ],
          };
        }

        persist(next);
        return next;
      });
    }, TICK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [hydrated]);

  const applyToPet = useCallback(
    (
      updater: (pet: Pet) => Pet,
      sfx?: (muted: boolean, petBefore: Pet, petAfter: Pet) => void
    ) => {
      setState((prev) => {
        if (!prev.pet) return prev;
        const pet = updater(prev.pet);
        const next: SaveState = { ...prev, pet };
        persist(next);
        sfx?.(prev.settings.muted, prev.pet, pet);
        return next;
      });
    },
    []
  );

  const actions = useMemo<TamagotchiApi["actions"]>(() => {
    return {
      start: (name, species) => {
        setState((prev) => {
          beepSuccess({ muted: prev.settings.muted });
          const pet = createPet({ name, species });
          const next: SaveState = { ...prev, pet };
          persist(next);
          return next;
        });
      },
      feedFood: () => applyToPet(feedFood, (muted) => sfxFeed({ muted })),
      feedCandy: () => applyToPet(feedCandy, (muted) => sfxCandy({ muted })),
      bath: () => applyToPet(bathAction, (muted) => sfxBath({ muted })),
      medicine: () =>
        applyToPet(
          (p) => (p.isSick ? medicineAction(p) : p),
          (muted, before) => {
            if (!before.isSick) beepError({ muted });
            else sfxMedicine({ muted });
          }
        ),
      cleanPoop: () =>
        applyToPet(cleanPoopAction, (muted) => sfxClean({ muted })),
      sleep: () => applyToPet(sleepAction, (muted) => sfxSleep({ muted })),
      wake: () => applyToPet(wakeAction, (muted) => sfxWake({ muted })),
      playMinigame: (won) =>
        applyToPet(
          (p) => applyMinigameResult(p, won),
          (muted) =>
            won ? beepSuccess({ muted }) : beepError({ muted })
        ),
      reset: () => {
        setState((prev) => {
          const next: SaveState = { ...prev, pet: null };
          persist(next);
          return next;
        });
      },
      setMuted: (muted) => {
        setState((prev) => {
          const next: SaveState = {
            ...prev,
            settings: { ...prev.settings, muted },
          };
          persist(next);
          return next;
        });
      },
      setNotificationsEnabled: (enabled) => {
        setState((prev) => {
          const next: SaveState = {
            ...prev,
            settings: { ...prev.settings, notificationsEnabled: enabled },
          };
          persist(next);
          return next;
        });
      },
      exportSave: () => {
        let snapshot: SaveState = INITIAL_SAVE_STATE;
        setState((prev) => {
          snapshot = prev;
          return prev;
        });
        return JSON.stringify(snapshot, null, 2);
      },
      importSave: (raw) => {
        try {
          const parsed: unknown = JSON.parse(raw);
          const migrated = migrate(parsed);
          if (migrated === INITIAL_SAVE_STATE) {
            return { success: false, error: "unrecognized save format" };
          }
          setState(migrated);
          persist(migrated);
          return { success: true };
        } catch (err) {
          return {
            success: false,
            error: err instanceof Error ? err.message : "parse error",
          };
        }
      },
    };
  }, [applyToPet]);

  return {
    hydrated,
    pet: state.pet,
    graveyard: state.graveyard,
    achievements: state.achievements,
    settings: state.settings,
    isAlive: !!state.pet?.isAlive,
    actions,
  };
}
