"use client";

import { useEffect, useRef } from "react";
import { INTRO_MUSIC_SRC } from "@/lib/audio";

export function useIntroMusic(options: { muted: boolean; enabled: boolean }) {
  const { muted, enabled } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) {
      const el = new Audio(INTRO_MUSIC_SRC);
      el.loop = true;
      el.volume = 0.45;
      el.preload = "auto";
      audioRef.current = el;
    }
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (!enabled || muted) {
      el.pause();
      return;
    }
    const handler = () => {
      void el.play().catch(() => {
        /* autoplay blocked until user gesture */
      });
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
    };
    // Try immediately (works after first user gesture on page)
    void el.play().catch(() => {
      window.addEventListener("pointerdown", handler, { once: true });
      window.addEventListener("keydown", handler, { once: true });
    });
    return () => {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
    };
  }, [muted, enabled]);

  return { audio: audioRef };
}
