import type { Achievement, GraveyardEntry, Pet } from "@/lib/game/types";

export const STORAGE_VERSION = 1 as const;

export const STORAGE_KEY = "tamagochi:save";

export interface DaycareRules {
  feedThreshold: number;
  bathThreshold: number;
  cleanPoopThreshold: number;
  autoMedicine: boolean;
  autoSleepThreshold: number;
  autoWakeThreshold: number;
}

export interface Cosmetics {
  owned: string[];
  equipped: {
    hat: string | null;
    glasses: string | null;
    ribbon: string | null;
  };
}

export interface SaveStateV1 {
  version: 1;
  pet: Pet | null;
  graveyard: GraveyardEntry[];
  achievements: Achievement[];
  favorites: string[];
  coins: number;
  cosmetics: Cosmetics;
  settings: {
    muted: boolean;
    notificationsEnabled: boolean;
    daycareEnabled: boolean;
    daycareRules: DaycareRules;
  };
  updatedAt: number;
}

export const INITIAL_COSMETICS: Cosmetics = {
  owned: [],
  equipped: { hat: null, glasses: null, ribbon: null },
};

export const DEFAULT_DAYCARE_RULES: DaycareRules = {
  feedThreshold: 30,
  bathThreshold: 25,
  cleanPoopThreshold: 1,
  autoMedicine: true,
  autoSleepThreshold: 25,
  autoWakeThreshold: 95,
};

export type SaveState = SaveStateV1;

export const INITIAL_SAVE_STATE: SaveState = {
  version: 1,
  pet: null,
  graveyard: [],
  achievements: [],
  favorites: [],
  coins: 0,
  cosmetics: {
    owned: [],
    equipped: { hat: null, glasses: null, ribbon: null },
  },
  settings: {
    muted: false,
    notificationsEnabled: false,
    daycareEnabled: false,
    daycareRules: { ...DEFAULT_DAYCARE_RULES },
  },
  updatedAt: 0,
};

export function isSaveStateV1(value: unknown): value is SaveStateV1 {
  if (!value || typeof value !== "object") return false;
  const v = value as { version?: unknown };
  return v.version === 1;
}
