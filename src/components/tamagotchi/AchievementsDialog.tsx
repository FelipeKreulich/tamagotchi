"use client";

import { Check, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ACHIEVEMENTS } from "@/lib/game/achievements";
import type { Achievement } from "@/lib/game/types";
import { cn } from "@/lib/utils";

interface AchievementsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unlocked: Achievement[];
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const dd = d.getDate().toString().padStart(2, "0");
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${dd}/${mm}`;
}

export function AchievementsDialog({
  open,
  onOpenChange,
  unlocked,
}: AchievementsDialogProps) {
  const unlockedById = new Map(unlocked.map((a) => [a.id, a]));
  const unlockedCount = unlocked.length;
  const total = ACHIEVEMENTS.length;
  const pct = Math.round((unlockedCount / total) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border-4 border-lcd-light bg-lcd-dark font-pixel text-lcd-light sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[11px] uppercase tracking-widest text-accent-pink">
            CONQUISTAS
          </DialogTitle>
          <DialogDescription className="text-[9px] uppercase tracking-widest text-lcd-light/80">
            {unlockedCount} de {total} desbloqueadas ({pct}%)
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
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2",
                    isUnlocked
                      ? "border-accent-cyan bg-accent-cyan/30 text-accent-cyan"
                      : "border-lcd-light/40 bg-lcd-dark text-lcd-light/50"
                  )}
                >
                  {isUnlocked ? (
                    <Check className="h-3 w-3" />
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
                    {def.title}
                  </p>
                  <p className="text-[8px] leading-relaxed text-lcd-light/80">
                    {def.description}
                  </p>
                  {isUnlocked && got?.unlockedAt && (
                    <p className="text-[7px] uppercase tracking-widest text-lcd-light/50">
                      obtida em {formatDate(got.unlockedAt)}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
