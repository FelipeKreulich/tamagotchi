"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface FullscreenToggleProps {
  className?: string;
}

export function FullscreenToggle({ className }: FullscreenToggleProps) {
  const { isFullscreen, supported, toggle } = useFullscreen();
  const dict = useT();

  if (!supported) return null;

  const Icon = isFullscreen ? Minimize2 : Maximize2;

  return (
    <button
      type="button"
      onClick={() => {
        void toggle();
      }}
      aria-pressed={isFullscreen}
      aria-label={
        isFullscreen ? dict.header.fullscreenExitAria : dict.header.fullscreenAria
      }
      title={
        isFullscreen ? dict.header.fullscreenExitAria : dict.header.fullscreenAria
      }
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center border-2 border-lcd-light bg-lcd-dark text-lcd-light shadow-[4px_4px_0_0] shadow-lcd-light/30 transition-[transform,box-shadow] duration-75 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0]",
        isFullscreen && "border-accent-cyan text-accent-cyan shadow-accent-cyan/30",
        className
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
