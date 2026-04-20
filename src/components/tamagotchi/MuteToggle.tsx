"use client";

import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface MuteToggleProps {
  muted: boolean;
  onToggle: () => void;
  className?: string;
  label?: string;
}

export function MuteToggle({ muted, onToggle, className, label }: MuteToggleProps) {
  const Icon = muted ? VolumeX : Volume2;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={!muted}
      aria-label={muted ? "Ativar som" : "Desativar som"}
      className={cn(
        "group inline-flex items-center gap-2 border-2 border-lcd-light bg-lcd-dark px-3 py-2 text-[10px] uppercase tracking-wider text-lcd-light shadow-[4px_4px_0_0] shadow-lcd-light/30 transition-[transform,box-shadow] duration-75 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0]",
        muted && "border-accent-pink text-accent-pink shadow-accent-pink/30",
        className
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span>{label ?? (muted ? "MUTE" : "SOM")}</span>
    </button>
  );
}
