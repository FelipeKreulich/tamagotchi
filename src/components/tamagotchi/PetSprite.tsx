"use client";

import type { Pet } from "@/lib/game/types";
import { cn } from "@/lib/utils";
import { Sprite } from "./Sprite";
import { getSpriteFor, poopFrames, poopPalette } from "./sprites";

interface PetSpriteProps {
  pet: Pet;
  pixelSize?: number;
  onClick?: () => void;
  bouncing?: boolean;
  disabled?: boolean;
  clickable?: boolean;
}

export function PetSprite({
  pet,
  pixelSize = 8,
  onClick,
  bouncing,
  disabled,
  clickable,
}: PetSpriteProps) {
  const stage = pet.stage === "egg" ? "egg" : "post-egg";
  const { frames, palette } = getSpriteFor(pet.species, pet.mood, stage);

  const interactive = !!onClick && !disabled;

  const inner = (
    <Sprite
      frames={frames}
      palette={palette}
      pixelSize={pixelSize}
      frameDurationMs={pet.mood === "sleeping" ? 1200 : 420}
    />
  );

  return (
    <div className="flex items-center justify-center gap-3">
      {interactive ? (
        <button
          type="button"
          onClick={onClick}
          aria-label={`Pat ${pet.name}`}
          className={cn(
            "border-0 bg-transparent p-0",
            clickable && "cursor-pointer",
            bouncing && "animate-[pixelbounce_0.5s_steps(4)_2]",
            disabled && "opacity-60"
          )}
        >
          {inner}
        </button>
      ) : (
        <div className={cn(bouncing && "animate-[pixelbounce_0.5s_steps(4)_2]")}>
          {inner}
        </div>
      )}
      {pet.poopCount > 0 && (
        <div className="flex flex-col items-center gap-1">
          {Array.from({ length: Math.min(pet.poopCount, 3) }).map((_, i) => (
            <Sprite
              key={i}
              frames={poopFrames}
              palette={poopPalette}
              pixelSize={Math.max(3, Math.floor(pixelSize / 2))}
              frameDurationMs={600 + i * 100}
              flicker={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
