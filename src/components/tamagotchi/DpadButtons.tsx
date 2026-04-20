"use client";

import { cn } from "@/lib/utils";

interface DpadButtonsProps {
  onA: () => void;
  onB: () => void;
  onC: () => void;
  labelA?: string;
  labelB?: string;
  labelC?: string;
  className?: string;
}

export function DpadButtons({
  onA,
  onB,
  onC,
  labelA = "◀",
  labelB = "OK",
  labelC = "▶",
  className,
}: DpadButtonsProps) {
  const defs = [
    { onClick: onA, label: labelA, letter: "A" },
    { onClick: onB, label: labelB, letter: "B" },
    { onClick: onC, label: labelC, letter: "C" },
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-center gap-6 sm:gap-10",
        className
      )}
    >
      {defs.map((btn, i) => (
        <button
          key={i}
          type="button"
          onClick={btn.onClick}
          className="group flex flex-col items-center gap-2 text-[10px] uppercase tracking-widest text-lcd-light"
        >
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-lcd-light bg-[radial-gradient(circle_at_30%_25%,#ffc1dc,#ff4fa3_55%,#a62368)] text-base font-bold text-lcd-dark shadow-[6px_6px_0_0] shadow-lcd-dim transition-[transform,box-shadow] duration-75 group-hover:shadow-[4px_4px_0_0] group-active:translate-x-[4px] group-active:translate-y-[4px] group-active:shadow-[0_0_0_0] sm:h-20 sm:w-20">
            <span className="absolute inset-1 rounded-full border border-accent-pink/50" />
            {btn.letter}
          </span>
          <span>{btn.label}</span>
        </button>
      ))}
    </div>
  );
}
