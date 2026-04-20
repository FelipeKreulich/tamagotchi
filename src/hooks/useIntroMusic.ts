"use client";

import { useEffect, useRef } from "react";
import { MUSIC_TRACKS } from "@/lib/audio";

function shuffledPlaylist(): string[] {
  const items = [...MUSIC_TRACKS];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export function useIntroMusic(options: { muted: boolean; enabled: boolean }) {
  const { muted, enabled } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlistRef = useRef<string[]>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (playlistRef.current.length === 0) {
      playlistRef.current = shuffledPlaylist();
    }

    const el = new Audio(playlistRef.current[indexRef.current]);
    el.loop = false;
    el.volume = 0.45;
    el.preload = "auto";

    const onEnded = () => {
      indexRef.current = (indexRef.current + 1) % playlistRef.current.length;
      // When we loop back to the start, reshuffle so the order isn't rigid.
      if (indexRef.current === 0) {
        playlistRef.current = shuffledPlaylist();
      }
      el.src = playlistRef.current[indexRef.current];
      void el.play().catch(() => {
        /* ignore autoplay errors */
      });
    };
    el.addEventListener("ended", onEnded);
    audioRef.current = el;

    return () => {
      el.removeEventListener("ended", onEnded);
      el.pause();
      audioRef.current = null;
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
    void el.play().catch(() => {
      window.addEventListener("pointerdown", handler, { once: true });
      window.addEventListener("keydown", handler, { once: true });
    });
    return () => {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
    };
  }, [muted, enabled]);
}
