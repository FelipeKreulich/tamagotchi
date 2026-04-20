"use client";

import { useEffect, useState } from "react";
import type { Weather } from "@/hooks/useWeather";

interface WeatherLayerProps {
  weather: Weather;
}

interface Drop {
  id: number;
  left: number;
  delay: number;
  duration: number;
  char?: string;
}

const RAIN_COUNT = 18;
const SNOW_COUNT = 14;

export function WeatherLayer({ weather }: WeatherLayerProps) {
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    if (weather === "clear") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDrops([]);
      return;
    }
    const count = weather === "rain" ? RAIN_COUNT : SNOW_COUNT;
    const list: Drop[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration:
        weather === "rain"
          ? 0.6 + Math.random() * 0.6
          : 3 + Math.random() * 3,
      char:
        weather === "snow"
          ? Math.random() > 0.5
            ? "*"
            : "·"
          : undefined,
    }));
    setDrops(list);
  }, [weather]);

  if (weather === "clear" || drops.length === 0) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {drops.map((d) =>
        weather === "rain" ? (
          <span
            key={d.id}
            className="absolute top-0 block w-[2px] bg-accent-cyan/60"
            style={{
              left: `${d.left}%`,
              height: "12px",
              animation: `fallRain ${d.duration}s linear ${d.delay}s infinite`,
            }}
          />
        ) : (
          <span
            key={d.id}
            className="absolute top-0 select-none text-[12px] text-white/80"
            style={{
              left: `${d.left}%`,
              animation: `fallSnow ${d.duration}s linear ${d.delay}s infinite`,
            }}
          >
            {d.char}
          </span>
        )
      )}
    </div>
  );
}
