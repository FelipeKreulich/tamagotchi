"use client";

import type { Pet } from "@/lib/game/types";
import { Sprite } from "./Sprite";
import { getSpriteFor, poopFrames, poopPalette } from "./sprites";

interface PetSpriteProps {
  pet: Pet;
  pixelSize?: number;
}

export function PetSprite({ pet, pixelSize = 8 }: PetSpriteProps) {
  const stage = pet.stage === "egg" ? "egg" : "post-egg";
  const { frames, palette } = getSpriteFor(pet.species, pet.mood, stage);

  return (
    <div className="flex items-center justify-center gap-3">
      <Sprite
        frames={frames}
        palette={palette}
        pixelSize={pixelSize}
        frameDurationMs={pet.mood === "sleeping" ? 1200 : 420}
      />
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
