"use client";

import { useEffect, useRef, useState } from "react";
import { beepAction, beepError, beepSuccess } from "@/lib/audio";
import { tpl, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface ReflexGameProps {
  muted: boolean;
  onFinish: (result: { happiness: number; coins: number; won: boolean }) => void;
}

type Phase = "idle" | "wait" | "now" | "result" | "finished";

const TOTAL_ROUNDS = 5;
const NOW_WINDOW_MS = 900;
const RESULT_DISPLAY_MS = 900;

export function ReflexGame({ muted, onFinish }: ReflexGameProps) {
  const dict = useT();
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState(0);
  const [feedback, setFeedback] = useState<"hit" | "miss" | "early" | null>(
    null
  );

  const timersRef = useRef<number[]>([]);
  const phaseRef = useRef<Phase>("idle");
  const playRoundRef = useRef<(r: number) => void>(() => {});

  useEffect(() => {
    phaseRef.current = phase;
  });

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const scheduleNext = (nextR: number) => {
    const t = window.setTimeout(() => {
      if (nextR > TOTAL_ROUNDS) {
        setPhase("finished");
      } else {
        playRoundRef.current(nextR);
      }
    }, RESULT_DISPLAY_MS);
    timersRef.current.push(t);
  };

  const playRound = (r: number) => {
    clearTimers();
    setRound(r);
    setFeedback(null);
    setPhase("wait");
    const waitMs = 900 + Math.random() * 1600;
    const t1 = window.setTimeout(() => {
      setPhase("now");
      const t2 = window.setTimeout(() => {
        // Only fires if the user never pressed within the window.
        if (phaseRef.current !== "now") return;
        beepError({ muted });
        setFeedback("miss");
        setPhase("result");
        scheduleNext(r + 1);
      }, NOW_WINDOW_MS);
      timersRef.current.push(t2);
    }, waitMs);
    timersRef.current.push(t1);
  };

  useEffect(() => {
    playRoundRef.current = playRound;
  });

  const startGame = () => {
    setHits(0);
    playRound(1);
  };

  const handlePress = () => {
    if (phase === "wait") {
      clearTimers();
      beepError({ muted });
      setFeedback("early");
      setPhase("result");
      scheduleNext(round + 1);
      return;
    }
    if (phase === "now") {
      clearTimers();
      beepSuccess({ muted });
      setHits((h) => h + 1);
      setFeedback("hit");
      setPhase("result");
      scheduleNext(round + 1);
    }
  };

  const finalHits = hits;
  const coins = finalHits;
  const happiness = Math.min(30, finalHits * 5);
  const won = finalHits >= 3;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-[8px] uppercase tracking-widest text-lcd-light/70">
        {phase === "finished"
          ? tpl(dict.reflex.finished, { hits: finalHits })
          : tpl(dict.reflex.round, { n: Math.max(1, round) })}
      </p>

      <button
        type="button"
        onClick={() => {
          if (phase === "idle") {
            beepAction({ muted });
            startGame();
            return;
          }
          if (phase === "wait" || phase === "now") handlePress();
        }}
        disabled={phase === "result" || phase === "finished"}
        className={cn(
          "flex h-36 w-full max-w-[260px] items-center justify-center border-4 text-[11px] uppercase tracking-widest transition-colors",
          phase === "idle" &&
            "border-lcd-light bg-lcd-dim text-lcd-light hover:bg-lcd-dim/80",
          phase === "wait" &&
            "border-accent-pink bg-accent-pink/20 text-accent-pink animate-[pixelshake_0.8s_steps(2)_infinite]",
          phase === "now" &&
            "border-lcd-light bg-lcd-light text-lcd-dark",
          phase === "result" &&
            feedback === "hit" &&
            "border-accent-cyan bg-accent-cyan/30 text-accent-cyan",
          phase === "result" &&
            feedback !== "hit" &&
            "border-accent-pink bg-accent-pink/20 text-accent-pink",
          phase === "finished" &&
            "border-lcd-light bg-lcd-dim text-lcd-light"
        )}
      >
        {phase === "idle" && dict.reflex.start}
        {phase === "wait" && dict.reflex.wait}
        {phase === "now" && dict.reflex.now}
        {phase === "result" &&
          (feedback === "hit"
            ? dict.reflex.hit
            : feedback === "early"
            ? dict.reflex.tooEarly
            : dict.reflex.miss)}
        {phase === "finished" && tpl(dict.reflex.earned, { coins })}
      </button>

      {phase === "finished" && (
        <button
          type="button"
          onClick={() => onFinish({ happiness, coins, won })}
          className="border-2 border-lcd-light bg-lcd-light px-4 py-2 text-[9px] uppercase tracking-widest text-lcd-dark"
        >
          {dict.common.continue}
        </button>
      )}
    </div>
  );
}
