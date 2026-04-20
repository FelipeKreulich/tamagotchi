"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface ActionItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionItem[];
  selectedIndex: number;
  columns?: number;
}

export function ActionMenu({
  items,
  selectedIndex,
  columns = 4,
}: ActionMenuProps) {
  return (
    <div
      className={cn("grid gap-2 sm:gap-3")}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        const selected = i === selectedIndex;
        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onSelect}
            disabled={item.disabled}
            aria-pressed={selected}
            className={cn(
              "group relative flex flex-col items-center gap-1 border-2 border-lcd-light/60 bg-lcd-dark px-2 py-3 text-[8px] uppercase tracking-widest text-lcd-light shadow-[3px_3px_0_0] shadow-lcd-dim transition-[transform,box-shadow,background-color] disabled:opacity-30 sm:text-[9px]",
              selected &&
                "border-accent-pink bg-accent-pink/15 text-accent-pink shadow-accent-pink/40",
              !item.disabled &&
                "hover:border-accent-pink hover:text-accent-pink active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0]"
            )}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            <span>{item.label}</span>
            {selected && (
              <span
                aria-hidden
                className="absolute -top-1 -left-1 h-2 w-2 animate-[ledpulse_1.4s_steps(2)_infinite] bg-accent-pink"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
