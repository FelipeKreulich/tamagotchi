"use client";

import type { DayPart } from "@/hooks/useTimeOfDay";

interface SceneryLayerProps {
  timeOfDay: DayPart;
}

const STARS = [
  { top: 10, left: 12, size: 10, duration: 2.6, delay: 0, char: "*" },
  { top: 18, left: 28, size: 8, duration: 3.2, delay: 0.4, char: "·" },
  { top: 6, left: 44, size: 10, duration: 2.2, delay: 0.9, char: "*" },
  { top: 22, left: 58, size: 7, duration: 3.4, delay: 0.2, char: "·" },
  { top: 12, left: 72, size: 9, duration: 2.8, delay: 0.7, char: "*" },
  { top: 28, left: 18, size: 7, duration: 3.6, delay: 1.1, char: "·" },
  { top: 32, left: 48, size: 8, duration: 3, delay: 0.5, char: "*" },
];

const SUN_FLARES = [
  { top: 4, right: 18, delay: 0 },
  { top: 10, right: 4, delay: 0.3 },
  { top: 22, right: 10, delay: 0.6 },
];

export function SceneryLayer({ timeOfDay }: SceneryLayerProps) {
  if (timeOfDay === "night") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Moon */}
        <div
          className="absolute h-8 w-8 rounded-full bg-[#f5efd0]"
          style={{
            top: "8%",
            right: "8%",
            boxShadow:
              "0 0 22px 8px rgba(245,239,208,0.35), inset -5px -4px 0 rgba(0,0,0,0.25)",
            imageRendering: "pixelated",
          }}
        />
        {/* Stars */}
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute select-none text-white"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              fontSize: `${s.size}px`,
              opacity: 0.85,
              animationName: "lcdflicker",
              animationDuration: `${s.duration}s`,
              animationTimingFunction: "steps(2)",
              animationIterationCount: "infinite",
              animationDelay: `${s.delay}s`,
            }}
          >
            {s.char}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Sun */}
      <div
        className="absolute h-9 w-9 rounded-full bg-[#ffe14d]"
        style={{
          top: "8%",
          right: "8%",
          boxShadow:
            "0 0 26px 10px rgba(255,225,77,0.4), inset -4px -4px 0 rgba(0,0,0,0.15)",
          imageRendering: "pixelated",
        }}
      />
      {/* Sun flares around the disk */}
      {SUN_FLARES.map((f, i) => (
        <span
          key={i}
          className="absolute select-none text-[10px] text-[#ffe14d]"
          style={{
            top: `${f.top}%`,
            right: `${f.right}%`,
            opacity: 0.75,
            animationName: "lcdflicker",
            animationDuration: "1.6s",
            animationTimingFunction: "steps(2)",
            animationIterationCount: "infinite",
            animationDelay: `${f.delay}s`,
          }}
        >
          +
        </span>
      ))}
    </div>
  );
}
