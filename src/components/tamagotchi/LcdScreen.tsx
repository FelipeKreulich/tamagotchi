"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LcdScreenProps {
  children: ReactNode;
  className?: string;
}

export function LcdScreen({ children, className }: LcdScreenProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="retro-chrome relative border-[6px] border-lcd-light/80 p-3 shadow-[10px_10px_0_0,inset_0_0_0_2px] shadow-lcd-dim">
        <div className="relative border-4 border-lcd-dim bg-lcd-bg">
          <div className="lcd-glow relative overflow-hidden">
            <div className="lcd-scanlines absolute inset-0 z-10 opacity-60" />
            <div className="relative z-20 p-6 sm:p-8">{children}</div>
          </div>
        </div>
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 text-[8px] uppercase tracking-[0.3em] text-lcd-light/80">
          <span
            aria-hidden
            className="h-2 w-2 animate-[ledpulse_1.8s_steps(2)_infinite] bg-accent-pink"
          />
          ON
        </div>
        <div className="pointer-events-none absolute right-4 top-4 text-[8px] uppercase tracking-[0.3em] text-lcd-light/60">
          LCD
        </div>
      </div>
    </div>
  );
}
