"use client";

import { useEffect, useState } from "react";

export type Weather = "clear" | "rain" | "snow";

/**
 * Picks a weather flavor based on the real-world month.
 * - Dec/Jan: snow (holidays vibe regardless of hemisphere)
 * - Jun/Jul/Aug: rain (Brazilian winter / northern hemisphere summer storms)
 * - Everything else: clear
 */
function computeWeather(date = new Date()): Weather {
  const month = date.getMonth(); // 0-11
  if (month === 11 || month === 0) return "snow";
  if (month >= 5 && month <= 7) return "rain";
  return "clear";
}

export function useWeather(): Weather {
  const [weather, setWeather] = useState<Weather>("clear");

  useEffect(() => {
    const update = () => setWeather(computeWeather());
    update();
    // Update once an hour in case the day changes mid-session.
    const id = window.setInterval(update, 60 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  return weather;
}
