import { normalizePet } from "@/lib/game/create";
import {
  INITIAL_SAVE_STATE,
  STORAGE_KEY,
  STORAGE_VERSION,
  isSaveStateV1,
  type SaveState,
} from "./schema";

export { INITIAL_SAVE_STATE, STORAGE_KEY, STORAGE_VERSION };
export type { SaveState };

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadSave(): SaveState {
  if (!isBrowser()) return INITIAL_SAVE_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SAVE_STATE;
    const parsed: unknown = JSON.parse(raw);
    return migrate(parsed);
  } catch {
    return INITIAL_SAVE_STATE;
  }
}

export function saveSave(state: SaveState): void {
  if (!isBrowser()) return;
  try {
    const next: SaveState = { ...state, updatedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / JSON errors */
  }
}

export function clearSave(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function migrate(raw: unknown): SaveState {
  if (isSaveStateV1(raw)) {
    const rawCosmetics = (raw as { cosmetics?: Partial<SaveState["cosmetics"]> })
      .cosmetics;
    return {
      ...INITIAL_SAVE_STATE,
      ...raw,
      coins: typeof raw.coins === "number" ? raw.coins : 0,
      favorites: Array.isArray((raw as { favorites?: unknown }).favorites)
        ? ((raw as { favorites: unknown }).favorites as string[]).filter(
            (v) => typeof v === "string"
          )
        : [],
      pet: normalizePet(raw.pet),
      cosmetics: {
        owned: Array.isArray(rawCosmetics?.owned) ? rawCosmetics.owned : [],
        equipped: {
          ...INITIAL_SAVE_STATE.cosmetics.equipped,
          ...(rawCosmetics?.equipped ?? {}),
        },
      },
      settings: {
        ...INITIAL_SAVE_STATE.settings,
        ...raw.settings,
        daycareRules: {
          ...INITIAL_SAVE_STATE.settings.daycareRules,
          ...(raw.settings?.daycareRules ?? {}),
        },
      },
    };
  }
  return INITIAL_SAVE_STATE;
}
