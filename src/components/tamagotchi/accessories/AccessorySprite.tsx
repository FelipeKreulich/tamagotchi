"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { PixelGrid, SpritePalette } from "../Sprite";

interface AccessorySpriteProps {
  frame: PixelGrid;
  palette: SpritePalette;
  pixelSize: number;
  className?: string;
  style?: CSSProperties;
}

export function AccessorySprite({
  frame,
  palette,
  pixelSize,
  className,
  style,
}: AccessorySpriteProps) {
  const cols = frame[0]?.length ?? 0;
  const rows = frame.length;
  return (
    <div
      aria-hidden
      className={cn("grid select-none", className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${pixelSize}px)`,
        imageRendering: "pixelated",
        ...style,
      }}
    >
      {frame.map((row, y) =>
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
