"use client";

import { useCallback, useEffect, useState } from "react";

function getFullscreenElement(): Element | null {
  if (typeof document === "undefined") return null;
  const d = document as Document & {
    webkitFullscreenElement?: Element | null;
    msFullscreenElement?: Element | null;
  };
  return (
    document.fullscreenElement ??
    d.webkitFullscreenElement ??
    d.msFullscreenElement ??
    null
  );
}

async function enterFullscreen(): Promise<void> {
  if (typeof document === "undefined") return;
  const el = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  };
  if (el.requestFullscreen) return el.requestFullscreen();
  if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
  if (el.msRequestFullscreen) return el.msRequestFullscreen();
}

async function exitFullscreen(): Promise<void> {
  if (typeof document === "undefined") return;
  const d = document as Document & {
    webkitExitFullscreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
  };
  if (document.exitFullscreen) return document.exitFullscreen();
  if (d.webkitExitFullscreen) return d.webkitExitFullscreen();
  if (d.msExitFullscreen) return d.msExitFullscreen();
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const supportsApi =
      !!document.documentElement.requestFullscreen ||
      !!(document.documentElement as unknown as { webkitRequestFullscreen?: unknown })
        .webkitRequestFullscreen;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(supportsApi);

    const onChange = () => setIsFullscreen(!!getFullscreenElement());
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    // Sync initial state (matters if the page reloads while already fullscreen).
    setIsFullscreen(!!getFullscreenElement());
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const toggle = useCallback(async () => {
    try {
      if (getFullscreenElement()) {
        await exitFullscreen();
      } else {
        await enterFullscreen();
      }
    } catch {
      /* browser denied; ignore */
    }
  }, []);

  return { isFullscreen, supported, toggle };
}
