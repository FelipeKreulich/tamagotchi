import type { SaveState } from "@/lib/storage";
import type { Achievement } from "./types";
import type { Dictionary } from "@/lib/i18n";

export const ACHIEVEMENT_EMOJI: Record<string, string> = {
  firstHatch: "🥚",
  teenReached: "🧒",
  adultReached: "👤",
  elderReached: "👴",
  firstWeek: "🗓",
  neverSick: "💪",
  fullLife: "🌅",
  petCollector: "💀",
  chef: "🍳",
  sweetTooth: "🍬",
  bathMaster: "🛁",
  gamer: "🎮",
  champion: "🏆",
  sleepyHead: "😴",
  nurse: "💊",
  cleanFreak: "🧹",
  marathon: "⏱",
  legend: "👑",
  megaEvolution: "★",
  darkEvolution: "☠",
};

export const MAX_FAVORITES = 3;

export type AchievementKey =
  | "firstHatch"
  | "teenReached"
  | "adultReached"
  | "elderReached"
  | "firstWeek"
  | "neverSick"
  | "fullLife"
  | "petCollector"
  | "chef"
  | "sweetTooth"
  | "bathMaster"
  | "gamer"
  | "champion"
  | "sleepyHead"
  | "nurse"
  | "cleanFreak"
  | "marathon"
  | "legend"
  | "megaEvolution"
  | "darkEvolution";

export interface AchievementDef {
  key: AchievementKey;
  id: string;
  check: (state: SaveState) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    key: "firstHatch",
    id: "first-hatch",
    check: (s) => !!s.pet && s.pet.stage !== "egg",
  },
  {
    key: "teenReached",
    id: "teen-reached",
    check: (s) =>
      !!s.pet && ["teen", "adult", "elder"].includes(s.pet.stage),
  },
  {
    key: "adultReached",
    id: "adult-reached",
    check: (s) => !!s.pet && ["adult", "elder"].includes(s.pet.stage),
  },
  {
    key: "elderReached",
    id: "elder-reached",
    check: (s) => !!s.pet && s.pet.stage === "elder",
  },
  {
    key: "firstWeek",
    id: "first-week",
    check: (s) => !!s.pet && s.pet.ageMinutes >= 60,
  },
  {
    key: "neverSick",
    id: "never-sick",
    check: (s) =>
      !!s.pet &&
      !s.pet.everSick &&
      ["adult", "elder"].includes(s.pet.stage),
  },
  {
    key: "fullLife",
    id: "full-life",
    check: (s) => s.graveyard.some((g) => g.causeOfDeath === "oldAge"),
  },
  {
    key: "petCollector",
    id: "pet-collector",
    check: (s) => s.graveyard.length >= 3,
  },
  {
    key: "chef",
    id: "chef",
    check: (s) => !!s.pet && s.pet.counters.feed >= 10,
  },
  {
    key: "sweetTooth",
    id: "sweet-tooth",
    check: (s) => !!s.pet && s.pet.counters.candy >= 5,
  },
  {
    key: "bathMaster",
    id: "bath-master",
    check: (s) => !!s.pet && s.pet.counters.bath >= 5,
  },
  {
    key: "gamer",
    id: "gamer",
    check: (s) => !!s.pet && s.pet.counters.play >= 5,
  },
  {
    key: "champion",
    id: "champion",
    check: (s) => !!s.pet && s.pet.counters.playWins >= 5,
  },
  {
    key: "sleepyHead",
    id: "sleepy-head",
    check: (s) => !!s.pet && s.pet.counters.sleep >= 3,
  },
  {
    key: "nurse",
    id: "nurse",
    check: (s) => !!s.pet && s.pet.counters.medicine >= 3,
  },
  {
    key: "cleanFreak",
    id: "clean-freak",
    check: (s) => !!s.pet && s.pet.counters.clean >= 5,
  },
  {
    key: "marathon",
    id: "marathon",
    check: (s) => !!s.pet && s.pet.ageMinutes >= 120,
  },
  {
    key: "legend",
    id: "legend",
    check: (s) => !!s.pet && s.pet.ageMinutes >= 180,
  },
  {
    key: "megaEvolution",
    id: "mega-evolution",
    check: (s) =>
      (!!s.pet && s.pet.variant === "mega") ||
      s.graveyard.some((g) => g.variant === "mega"),
  },
  {
    key: "darkEvolution",
    id: "dark-evolution",
    check: (s) =>
      (!!s.pet && s.pet.variant === "dark") ||
      s.graveyard.some((g) => g.variant === "dark"),
  },
];

export function getAchievementText(
  def: AchievementDef,
  dict: Dictionary
): { title: string; description: string } {
  return dict.achievements[def.key];
}

export function checkAchievements(
  state: SaveState,
  defs: AchievementDef[] = ACHIEVEMENTS
): Achievement[] {
  const unlocked: Achievement[] = [];
  for (const def of defs) {
    const already = state.achievements.find((a) => a.id === def.id);
    if (already?.unlockedAt) continue;
    if (def.check(state)) {
      unlocked.push({
        id: def.id,
        title: def.key,
        description: def.key,
        unlockedAt: Date.now(),
      });
    }
  }
  return unlocked;
}
