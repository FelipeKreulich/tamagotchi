"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type PixelGrid = readonly (readonly number[])[];

export interface SpritePalette {
  [index: number]: string;
}

export interface SpriteProps {
  frames: readonly PixelGrid[];
  palette: SpritePalette;
  frameDurationMs?: number;
  pixelSize?: number;
  className?: string;
  flicker?: boolean;
}

export function Sprite({
  frames,
  palette,
  frameDurationMs = 420,
  pixelSize = 8,
  className,
  flicker = true,
}: SpriteProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (frames.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % frames.length);
    }, frameDurationMs);
    return () => window.clearInterval(id);
  }, [frames.length, frameDurationMs]);

  const grid = frames[index] ?? frames[0];
  if (!grid) return null;
  const cols = grid[0]?.length ?? 0;
  const rows = grid.length;

  return (
    <div
      className={cn(
        "grid select-none",
        flicker && "animate-[lcdflicker_2.5s_steps(2)_infinite]",
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${pixelSize}px)`,
        imageRendering: "pixelated",
      }}
      aria-hidden
    >
      {grid.map((row, y) =>
        row.map((val, x) => {
          const color = palette[val];
          return (
            <div
              key={`${y}-${x}`}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: color ?? "transparent",
              }}
            />
          );
        })
      )}
    </div>
  );
}
