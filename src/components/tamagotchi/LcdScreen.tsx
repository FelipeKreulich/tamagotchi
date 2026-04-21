"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_CASE_STYLE,
  type CaseStyle,
} from "./accessories/catalog";

interface LcdScreenProps {
  children: ReactNode;
  className?: string;
  caseStyle?: CaseStyle;
}

export function LcdScreen({
  children,
  className,
  caseStyle = DEFAULT_CASE_STYLE,
}: LcdScreenProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div
        className="relative border-[6px] p-3"
        style={{
          background: caseStyle.background,
          borderColor: caseStyle.border,
          boxShadow: `10px 10px 0 0 ${caseStyle.shadow}, inset 0 0 0 2px ${caseStyle.innerBorder}`,
        }}
      >
        <div
          className="relative border-4 bg-lcd-bg"
          style={{ borderColor: caseStyle.innerBorder }}
        >
          <div className="lcd-glow relative overflow-hidden">
            <div className="lcd-scanlines absolute inset-0 z-10 opacity-60" />
            <div className="relative z-20 p-6 sm:p-8">{children}</div>
          </div>
        </div>
        <div
          className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 text-[8px] uppercase tracking-[0.3em]"
          style={{ color: caseStyle.ledText, opacity: 0.8 }}
        >
          <span
            aria-hidden
            className="h-2 w-2 animate-[ledpulse_1.8s_steps(2)_infinite] bg-accent-pink"
          />
          ON
        </div>
        <div
          className="pointer-events-none absolute right-4 top-4 text-[8px] uppercase tracking-[0.3em]"
          style={{ color: caseStyle.ledText, opacity: 0.6 }}
        >
          LCD
        </div>
      </div>
    </div>
  );
}
