"use client";

import { Check, Lock, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_EMOJI,
} from "@/lib/game/achievements";
import { tpl, useLocale, useT } from "@/lib/i18n";
import type { Achievement } from "@/lib/game/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AchievementsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unlocked: Achievement[];
  favorites: string[];
  onToggleFavorite: (id: string) => { success: boolean; error?: string };
}

function formatDate(ts: number, locale: string): string {
  try {
    const d = new Date(ts);
    return d.toLocaleDateString(locale, { day: "2-digit", month: "2-digit" });
  } catch {
    const d = new Date(ts);
    const dd = d.getDate().toString().padStart(2, "0");
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    return `${dd}/${mm}`;
  }
}

export function AchievementsDialog({
  open,
  onOpenChange,
  unlocked,
  favorites,
  onToggleFavorite,
}: AchievementsDialogProps) {
  const dict = useT();
  const { locale } = useLocale();

  const unlockedById = new Map(unlocked.map((a) => [a.id, a]));
  const unlockedCount = unlocked.length;
  const total = ACHIEVEMENTS.length;
  const pct = Math.round((unlockedCount / total) * 100);

  const handlePin = (id: string) => {
    const wasPinned = favorites.includes(id);
    const result = onToggleFavorite(id);
    if (result.success) {
      toast(
        wasPinned
          ? dict.achievementsDialog.showcaseUnpinned
          : dict.achievementsDialog.showcasePinned
      );
    } else if (result.error === "max favorites reached") {
      toast.error(dict.achievementsDialog.showcaseFull);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border-4 border-lcd-light bg-lcd-dark font-pixel text-lcd-light sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[11px] uppercase tracking-widest text-accent-pink">
            {dict.achievementsDialog.title}
          </DialogTitle>
          <DialogDescription className="text-[9px] uppercase tracking-widest text-lcd-light/80">
            {tpl(dict.achievementsDialog.progress, {
              current: unlockedCount,
              total,
              pct,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="border-2 border-lcd-light/40 bg-lcd-dim/40 p-[3px]">
          <div className="flex h-3 gap-[2px]">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1",
                  i < unlockedCount ? "bg-accent-cyan" : "bg-lcd-dark"
                )}
              />
            ))}
          </div>
        </div>

        <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {ACHIEVEMENTS.map((def) => {
            const got = unlockedById.get(def.id);
            const isUnlocked = !!got?.unlockedAt;
            const isFavorite = favorites.includes(def.id);
            const text = dict.achievements[def.key];
            const emoji = ACHIEVEMENT_EMOJI[def.key] ?? "★";
            return (
              <li
                key={def.id}
                className={cn(
                  "flex items-start gap-3 border-2 p-3",
                  isUnlocked
                    ? "border-accent-cyan bg-accent-cyan/10"
                    : "border-lcd-light/30 bg-lcd-dim/40 opacity-70"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 text-sm",
                    isUnlocked
                      ? "border-accent-cyan bg-accent-cyan/30 text-accent-cyan"
                      : "border-lcd-light/40 bg-lcd-dark text-lcd-light/50"
                  )}
                >
                  {isUnlocked ? (
                    <span aria-hidden>{emoji}</span>
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p
                    className={cn(
                      "text-[10px] uppercase tracking-widest",
                      isUnlocked ? "text-accent-cyan" : "text-lcd-light"
                    )}
                  >
                    {text.title}
                  </p>
                  <p className="text-[8px] leading-relaxed text-lcd-light/80">
                    {text.description}
                  </p>
                  {isUnlocked && got?.unlockedAt && (
                    <p className="text-[7px] uppercase tracking-widest text-lcd-light/50">
                      {tpl(dict.achievementsDialog.unlockedOn, {
                        date: formatDate(got.unlockedAt, locale),
                      })}
                    </p>
                  )}
                </div>
                {isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => handlePin(def.id)}
                    aria-pressed={isFavorite}
                    aria-label={
                      isFavorite
                        ? dict.achievementsDialog.unpin
                        : dict.achievementsDialog.pin
                    }
                    title={
                      isFavorite
                        ? dict.achievementsDialog.unpin
                        : dict.achievementsDialog.pin
                    }
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center border-2 transition-colors",
                      isFavorite
                        ? "border-accent-pink bg-accent-pink/20 text-accent-pink"
                        : "border-lcd-light/40 bg-lcd-dark text-lcd-light/60 hover:border-accent-pink hover:text-accent-pink"
                    )}
                  >
                    <Star
                      className="h-3 w-3"
                      fill={isFavorite ? "currentColor" : "none"}
                    />
                  </button>
                ) : (
                  <Check className="mt-1 h-3 w-3 shrink-0 opacity-0" />
                )}
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
