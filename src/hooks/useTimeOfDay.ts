"use client";

import { useEffect, useState } from "react";

export type DayPart = "day" | "night";

function computePart(date = new Date()): DayPart {
  const h = date.getHours();
  // Night: 19h–6h (inclusive 19, exclusive 7)
  return h >= 19 || h < 7 ? "night" : "day";
}

export function useTimeOfDay(): DayPart {
  const [part, setPart] = useState<DayPart>("day");

  useEffect(() => {
    const update = () => setPart(computePart());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.dataset.timeOfDay = part;
    return () => {
      delete root.dataset.timeOfDay;
    };
  }, [part]);

  return part;
}
