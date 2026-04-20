import type { SaveState } from "@/lib/storage";
import type { Achievement } from "./types";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  check: (state: SaveState) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first-hatch",
    title: "PRIMEIRO CHOCAR",
    description: "Seu primeiro bichinho nasceu!",
    check: (s) => !!s.pet && s.pet.stage !== "egg",
  },
  {
    id: "teen-reached",
    title: "ADOLESCÊNCIA",
    description: "Seu bichinho virou adolescente.",
    check: (s) =>
      !!s.pet &&
      ["teen", "adult", "elder"].includes(s.pet.stage),
  },
  {
    id: "adult-reached",
    title: "VIDA ADULTA",
    description: "Seu bichinho chegou à fase adulta.",
    check: (s) =>
      !!s.pet && ["adult", "elder"].includes(s.pet.stage),
  },
  {
    id: "elder-reached",
    title: "ANCIÃO SÁBIO",
    description: "Seu bichinho atingiu a anciania.",
    check: (s) => !!s.pet && s.pet.stage === "elder",
  },
  {
    id: "first-week",
    title: "PRIMEIRA SEMANA",
    description: "Um bichinho viveu por uma sessão longa.",
    check: (s) => !!s.pet && s.pet.ageMinutes >= 60,
  },
  {
    id: "never-sick",
    title: "SAÚDE DE FERRO",
    description: "Bichinho nunca adoeceu até a fase adulta.",
    check: (s) =>
      !!s.pet &&
      !s.pet.isSick &&
      ["adult", "elder"].includes(s.pet.stage),
  },
  {
    id: "full-life",
    title: "VIDA PLENA",
    description: "Seu bichinho morreu de velhice.",
    check: (s) =>
      s.graveyard.some((g) => g.causeOfDeath === "Velhice"),
  },
  {
    id: "pet-collector",
    title: "COLECIONADOR",
    description: "Tenha 3 bichinhos no cemitério.",
    check: (s) => s.graveyard.length >= 3,
  },
];

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
        title: def.title,
        description: def.description,
        unlockedAt: Date.now(),
      });
    }
  }
  return unlocked;
}
