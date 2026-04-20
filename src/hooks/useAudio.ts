"use client";

import { useCallback, useEffect, useState } from "react";
import { loadSave, saveSave } from "@/lib/storage";
import { resumeAudio } from "@/lib/audio";

const SETTING_KEY_MUTED = "muted";

export function useAudio() {
  const [muted, setMutedState] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const save = loadSave();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMutedState(save.settings.muted);
     
    setHydrated(true);
  }, []);

  const setMuted = useCallback((value: boolean) => {
    setMutedState(value);
    const save = loadSave();
    saveSave({
      ...save,
      settings: { ...save.settings, [SETTING_KEY_MUTED]: value },
    });
  }, []);

  const toggleMuted = useCallback(() => {
    setMuted(!muted);
  }, [muted, setMuted]);

  useEffect(() => {
    if (!hydrated) return;
    if (!muted) resumeAudio();
  }, [muted, hydrated]);

  return { muted, setMuted, toggleMuted, hydrated };
}
