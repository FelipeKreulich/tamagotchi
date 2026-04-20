"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  applyMinigameResult,
  bath as bathAction,
  cleanPoop as cleanPoopAction,
  feedCandy,
  feedFood,
  medicine as medicineAction,
  pat as patAction,
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
  chirpHappy,
  melodyAchievement,
  melodyDeath,
  melodyEvolution,
  sfxBath,
  sfxCandy,
  sfxClean,
  sfxDenied,
  sfxEquip,
  sfxFeed,
  sfxMedicine,
  sfxPurchase,
  sfxSleep,
  sfxUnequip,
  sfxWake,
} from "@/lib/audio";
import {
  INITIAL_SAVE_STATE,
  loadSave,
  migrate,
  saveSave,
  type SaveState,
} from "@/lib/storage";
import {
  ACHIEVEMENTS,
  MAX_FAVORITES,
  checkAchievements,
} from "@/lib/game/achievements";
import { runDaycare } from "@/lib/game/daycare";
import type { Cosmetics, DaycareRules } from "@/lib/storage/schema";
import {
  ACCESSORIES_BY_ID,
  type AccessorySlot,
} from "@/components/tamagotchi/accessories/catalog";

export interface TamagotchiApi {
  hydrated: boolean;
  pet: Pet | null;
  graveyard: GraveyardEntry[];
  achievements: Achievement[];
  favorites: string[];
  settings: SaveState["settings"];
  cosmetics: Cosmetics;
  coins: number;
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
    awardHappiness: (delta: number) => void;
    addCoins: (n: number) => void;
    pat: () => void;
    rename: (name: string) => void;
    reset: () => void;
    setMuted: (muted: boolean) => void;
    setNotificationsEnabled: (enabled: boolean) => void;
    setDaycareEnabled: (enabled: boolean) => void;
    setDaycareRules: (rules: DaycareRules) => void;
    buyAccessory: (id: string) => { success: boolean; error?: string };
    equipAccessory: (id: string) => void;
    unequipSlot: (slot: AccessorySlot) => void;
    toggleFavorite: (id: string) => { success: boolean; error?: string };
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
            variant: pet.variant,
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

        let runnablePet = pet;
        if (
          prev.settings.daycareEnabled &&
          runnablePet.isAlive &&
          !events.died
        ) {
          const result = runDaycare(runnablePet, prev.settings.daycareRules);
          runnablePet = result.pet;
        }

        let next: SaveState = { ...prev, pet: runnablePet };

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
                variant: pet.variant,
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
      pat: () =>
        applyToPet(patAction, (muted) => chirpHappy({ muted })),
      rename: (name) => {
        const trimmed = name.trim().slice(0, 12);
        if (trimmed.length < 2) return;
        applyToPet(
          (p) => ({ ...p, name: trimmed }),
          (muted) => beepSuccess({ muted })
        );
      },
      awardHappiness: (delta) =>
        applyToPet((p) =>
          p.isAlive && !p.isSleeping
            ? {
                ...p,
                stats: { ...p.stats, happiness: Math.max(0, Math.min(100, p.stats.happiness + delta)) },
              }
            : p
        ),
      addCoins: (n) => {
        if (n === 0) return;
        setState((prev) => {
          const next: SaveState = {
            ...prev,
            coins: Math.max(0, prev.coins + n),
          };
          persist(next);
          return next;
        });
      },
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
      setDaycareEnabled: (enabled) => {
        setState((prev) => {
          const next: SaveState = {
            ...prev,
            settings: { ...prev.settings, daycareEnabled: enabled },
          };
          persist(next);
          return next;
        });
      },
      setDaycareRules: (rules) => {
        setState((prev) => {
          const next: SaveState = {
            ...prev,
            settings: { ...prev.settings, daycareRules: rules },
          };
          persist(next);
          return next;
        });
      },
      buyAccessory: (id) => {
        const accessory = ACCESSORIES_BY_ID.get(id);
        if (!accessory) return { success: false, error: "unknown item" };
        let result: { success: boolean; error?: string } = { success: false };
        setState((prev) => {
          if (prev.cosmetics.owned.includes(id)) {
            result = { success: false, error: "already owned" };
            return prev;
          }
          if (prev.coins < accessory.price) {
            sfxDenied({ muted: prev.settings.muted });
            result = { success: false, error: "not enough coins" };
            return prev;
          }
          const next: SaveState = {
            ...prev,
            coins: prev.coins - accessory.price,
            cosmetics: {
              ...prev.cosmetics,
              owned: [...prev.cosmetics.owned, id],
              equipped: {
                ...prev.cosmetics.equipped,
                [accessory.slot]: id,
              },
            },
          };
          sfxPurchase({ muted: prev.settings.muted });
          persist(next);
          result = { success: true };
          return next;
        });
        return result;
      },
      equipAccessory: (id) => {
        const accessory = ACCESSORIES_BY_ID.get(id);
        if (!accessory) return;
        setState((prev) => {
          if (!prev.cosmetics.owned.includes(id)) return prev;
          const next: SaveState = {
            ...prev,
            cosmetics: {
              ...prev.cosmetics,
              equipped: {
                ...prev.cosmetics.equipped,
                [accessory.slot]: id,
              },
            },
          };
          sfxEquip({ muted: prev.settings.muted });
          persist(next);
          return next;
        });
      },
      unequipSlot: (slot) => {
        setState((prev) => {
          const next: SaveState = {
            ...prev,
            cosmetics: {
              ...prev.cosmetics,
              equipped: { ...prev.cosmetics.equipped, [slot]: null },
            },
          };
          sfxUnequip({ muted: prev.settings.muted });
          persist(next);
          return next;
        });
      },
      toggleFavorite: (id) => {
        let result: { success: boolean; error?: string } = { success: false };
        setState((prev) => {
          const alreadyPinned = prev.favorites.includes(id);
          if (alreadyPinned) {
            const next: SaveState = {
              ...prev,
              favorites: prev.favorites.filter((x) => x !== id),
            };
            sfxUnequip({ muted: prev.settings.muted });
            persist(next);
            result = { success: true };
            return next;
          }
          const unlocked = prev.achievements.some(
            (a) => a.id === id && a.unlockedAt
          );
          if (!unlocked) {
            result = { success: false, error: "not unlocked" };
            return prev;
          }
          if (prev.favorites.length >= MAX_FAVORITES) {
            sfxDenied({ muted: prev.settings.muted });
            result = { success: false, error: "max favorites reached" };
            return prev;
          }
          const next: SaveState = {
            ...prev,
            favorites: [...prev.favorites, id],
          };
          sfxEquip({ muted: prev.settings.muted });
          persist(next);
          result = { success: true };
          return next;
        });
        return result;
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
    favorites: state.favorites,
    settings: state.settings,
    cosmetics: state.cosmetics,
    coins: state.coins,
    isAlive: !!state.pet?.isAlive,
    actions,
  };
}
