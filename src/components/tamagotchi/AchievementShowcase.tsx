"use client";

import {
  ACHIEVEMENTS,
  ACHIEVEMENT_EMOJI,
  MAX_FAVORITES,
} from "@/lib/game/achievements";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface AchievementShowcaseProps {
  favorites: string[];
  onOpenPicker: () => void;
}

export function AchievementShowcase({
  favorites,
  onOpenPicker,
}: AchievementShowcaseProps) {
  const dict = useT();
  const slots = Array.from({ length: MAX_FAVORITES }, (_, i) => favorites[i] ?? null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[7px] uppercase tracking-[0.3em] text-lcd-light/60">
          {dict.status.showcase}
        </p>
        <span className="text-[7px] uppercase tracking-widest text-lcd-light/50">
          {favorites.length}/{MAX_FAVORITES}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((id, i) => {
          const def = id ? ACHIEVEMENTS.find((d) => d.id === id) : null;
          const text = def ? dict.achievements[def.key] : null;
          const emoji = def ? ACHIEVEMENT_EMOJI[def.key] ?? "★" : null;
          return (
            <button
              key={i}
              type="button"
              onClick={onOpenPicker}
              title={text?.title ?? dict.status.showcaseEmpty}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-1 border-2 p-1 text-center transition-colors",
                def
                  ? "border-accent-cyan bg-accent-cyan/10 hover:border-accent-pink"
                  : "border-dashed border-lcd-light/30 bg-lcd-dim/30 hover:border-lcd-light/60"
              )}
            >
              <span className="text-base leading-none" aria-hidden>
                {emoji ?? "+"}
              </span>
              <span className="max-w-full truncate text-[7px] uppercase tracking-widest text-lcd-light">
                {text?.title ?? dict.status.showcaseEmpty}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
