"use client";

import { useMemo, useState } from "react";
import {
  Apple,
  Bath,
  Candy,
  Gamepad2,
  Moon,
  Pill,
  RotateCcw,
  Sparkles,
  Trash2,
  Skull,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTamagotchi } from "@/hooks/useTamagotchi";
import { useIntroMusic } from "@/hooks/useIntroMusic";
import { useCriticalNotifications } from "@/hooks/useCriticalNotifications";
import type { Species } from "@/lib/game/types";
import { StartScreen } from "./StartScreen";
import { PetSprite } from "./PetSprite";
import { HUD } from "./HUD";
import { ActionMenu, type ActionItem } from "./ActionMenu";
import { DeathScreen } from "./DeathScreen";
import { MuteToggle } from "./MuteToggle";
import { MiniGame } from "./MiniGame";
import { Sprite } from "./Sprite";
import { eggFrames } from "./sprites/egg";
import { SPECIES_META } from "./sprites";
import { NotificationToggle } from "./NotificationToggle";
import { LcdScreen } from "./LcdScreen";
import { DpadButtons } from "./DpadButtons";
import { AchievementsDialog } from "./AchievementsDialog";
import { ACHIEVEMENTS } from "@/lib/game/achievements";
import { toast } from "sonner";

function StatusPanel({
  achievementCount,
  totalAchievements,
  graveyardCount,
  onOpenGraveyard,
  onOpenAchievements,
}: {
  achievementCount: number;
  totalAchievements: number;
  graveyardCount: number;
  onOpenGraveyard: () => void;
  onOpenAchievements: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-3 border-4 border-lcd-light bg-lcd-dark p-4 shadow-[6px_6px_0_0] shadow-lcd-dim">
      <p className="text-[8px] uppercase tracking-[0.3em] text-lcd-light/60">
        STATUS
      </p>
      <div className="space-y-3">
        <button
          type="button"
          onClick={onOpenAchievements}
          className="flex w-full items-center justify-between border-2 border-lcd-light/40 bg-lcd-dim/40 p-3 transition-colors hover:border-accent-cyan"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-cyan" />
            <span className="text-[9px] uppercase tracking-widest text-lcd-light">
              CONQUISTAS
            </span>
          </div>
          <span className="text-sm text-accent-cyan">
            {achievementCount}/{totalAchievements}
          </span>
        </button>
        <button
          type="button"
          onClick={onOpenGraveyard}
          className="flex w-full items-center justify-between border-2 border-lcd-light/40 bg-lcd-dim/40 p-3 transition-colors hover:border-accent-pink"
        >
          <div className="flex items-center gap-2">
            <Skull className="h-4 w-4 text-accent-pink" />
            <span className="text-[9px] uppercase tracking-widest text-lcd-light">
              CEMITERIO
            </span>
          </div>
          <span className="text-sm text-accent-pink">{graveyardCount}</span>
        </button>
      </div>
      <div className="mt-auto border-t-2 border-dashed border-lcd-light/30 pt-3">
        <p className="text-[7px] uppercase tracking-[0.25em] text-lcd-light/60">
          DICA
        </p>
        <p className="mt-1 text-[9px] leading-relaxed text-lcd-light/90">
          Use A/◀ e C/▶ para navegar, B/OK para executar.
        </p>
      </div>
    </div>
  );
}

const TOTAL_ACHIEVEMENTS = ACHIEVEMENTS.length;

export function Game() {
  const tama = useTamagotchi();
  const { pet, hydrated, settings, actions, achievements, graveyard } = tama;

  const onStartScreen = !pet;
  const showIntroMusic = !hydrated || onStartScreen || (pet && !pet.isAlive);

  useIntroMusic({ muted: settings.muted, enabled: !!showIntroMusic });
  useCriticalNotifications({ pet, enabled: settings.notificationsEnabled });

  const [menuIndex, setMenuIndex] = useState(0);
  const [miniOpen, setMiniOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [graveyardOpen, setGraveyardOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);

  const actionItems = useMemo<ActionItem[]>(() => {
    if (!pet) return [];
    return [
      {
        id: "food",
        label: "COMER",
        icon: Apple,
        onSelect: () => {
          actions.feedFood();
          toast("🍎 Refeição servida!");
        },
        disabled: !pet.isAlive || pet.isSleeping,
      },
      {
        id: "candy",
        label: "DOCE",
        icon: Candy,
        onSelect: () => {
          actions.feedCandy();
          toast("🍬 Um docinho...");
        },
        disabled: !pet.isAlive || pet.isSleeping,
      },
      {
        id: "play",
        label: "BRINCAR",
        icon: Gamepad2,
        onSelect: () => setMiniOpen(true),
        disabled: !pet.isAlive || pet.isSleeping,
      },
      {
        id: "sleep",
        label: pet.isSleeping ? "ACORDAR" : "DORMIR",
        icon: Moon,
        onSelect: () => {
          if (pet.isSleeping) {
            actions.wake();
            toast("☀ Bom dia!");
          } else {
            actions.sleep();
            toast("💤 Boa noite...");
          }
        },
        disabled: !pet.isAlive,
      },
      {
        id: "bath",
        label: "BANHO",
        icon: Bath,
        onSelect: () => {
          actions.bath();
          toast("🛁 Limpinho!");
        },
        disabled: !pet.isAlive || pet.isSleeping,
      },
      {
        id: "medicine",
        label: "REMEDIO",
        icon: Pill,
        onSelect: () => {
          if (!pet.isSick) {
            toast.error("Bichinho não está doente.");
          } else {
            actions.medicine();
            toast("💊 Curado!");
          }
        },
        disabled: !pet.isAlive,
      },
      {
        id: "clean",
        label: "LIMPAR",
        icon: Trash2,
        onSelect: () => {
          if (pet.poopCount <= 0) {
            toast.error("Nada para limpar.");
          } else {
            actions.cleanPoop();
            toast("🧹 Sujeira removida");
          }
        },
        disabled: !pet.isAlive,
      },
      {
        id: "reset",
        label: "RESET",
        icon: RotateCcw,
        onSelect: () => setResetOpen(true),
      },
    ];
  }, [pet, actions]);

  const handleA = () => {
    if (!pet) return;
    setMenuIndex((i) => (i - 1 + actionItems.length) % actionItems.length);
  };
  const handleB = () => {
    if (!pet) return;
    const item = actionItems[menuIndex];
    if (item && !item.disabled) item.onSelect();
  };
  const handleC = () => {
    if (!pet) return;
    setMenuIndex((i) => (i + 1) % actionItems.length);
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[10px] uppercase tracking-widest text-lcd-light">
        <span className="animate-[lcdflicker_1s_steps(2)_infinite]">
          CARREGANDO...
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top,#112317_0%,#050905_70%)]">
      {/* Decorative side pixel columns */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-6 bg-[repeating-linear-gradient(0deg,var(--lcd-light)_0,var(--lcd-light)_4px,transparent_4px,transparent_12px)] opacity-20 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-6 bg-[repeating-linear-gradient(0deg,var(--lcd-light)_0,var(--lcd-light)_4px,transparent_4px,transparent_12px)] opacity-20 md:block"
      />

      {/* Top bar */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b-4 border-lcd-light bg-lcd-dark/80 px-4 py-3 backdrop-blur sm:px-8">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-3 w-3 animate-[ledpulse_1.6s_steps(2)_infinite] bg-accent-pink"
          />
          <h1 className="text-[12px] tracking-[0.4em] text-lcd-light sm:text-sm">
            TAMA<span className="text-accent-pink">—</span>GOCHI
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MuteToggle
            muted={settings.muted}
            onToggle={() => actions.setMuted(!settings.muted)}
            label={settings.muted ? "MUTE" : "SOM"}
          />
          <NotificationToggle
            enabled={settings.notificationsEnabled}
            onChange={actions.setNotificationsEnabled}
          />
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col gap-6 p-4 sm:p-8 md:gap-8 lg:grid lg:grid-cols-[300px_1fr_300px] lg:items-stretch">
        {/* Left panel (HUD) */}
        {pet && (
          <aside className="order-2 lg:order-1">
            <HUD pet={pet} />
          </aside>
        )}

        {/* Center: LCD Screen */}
        <section className="order-1 flex flex-col items-center justify-center gap-6 lg:order-2">
          <LcdScreen className="max-w-2xl">
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-5 sm:min-h-[320px]">
              {onStartScreen ? (
                <StartScreen
                  onStart={(name, species) =>
                    actions.start(name, species as Species)
                  }
                />
              ) : pet && !pet.isAlive ? (
                <DeathScreen pet={pet} onNew={actions.reset} />
              ) : (
                pet && (
                  <>
                    <div className="flex items-center justify-center">
                      {pet.stage === "egg" ? (
                        <Sprite
                          frames={eggFrames}
                          palette={SPECIES_META[pet.species].palette}
                          pixelSize={14}
                          frameDurationMs={500}
                        />
                      ) : (
                        <PetSprite pet={pet} pixelSize={16} />
                      )}
                    </div>
                    <p className="text-center text-[9px] uppercase tracking-[0.3em] text-lcd-light/70">
                      {pet.mood === "happy" && "SE SENTINDO OTIMO"}
                      {pet.mood === "sad" && "PARECE TRISTE..."}
                      {pet.mood === "sick" && "ESTA DOENTE!"}
                      {pet.mood === "sleeping" && "DORMINDO"}
                      {pet.mood === "hungry" && "COM FOME!"}
                      {pet.mood === "dirty" && "PRECISA DE BANHO"}
                    </p>
                  </>
                )
              )}
            </div>
          </LcdScreen>

          {pet && pet.isAlive && (
            <DpadButtons onA={handleA} onB={handleB} onC={handleC} />
          )}
        </section>

        {/* Right panel */}
        {pet && (
          <aside className="order-3">
            <StatusPanel
              achievementCount={achievements.length}
              totalAchievements={TOTAL_ACHIEVEMENTS}
              graveyardCount={graveyard.length}
              onOpenGraveyard={() => setGraveyardOpen(true)}
              onOpenAchievements={() => setAchievementsOpen(true)}
            />
          </aside>
        )}
      </div>

      {/* Bottom: action grid */}
      {pet && pet.isAlive && (
        <footer className="relative z-10 border-t-4 border-lcd-light bg-lcd-dark/80 p-4 sm:p-6">
          <div className="mx-auto max-w-5xl space-y-3">
            <p className="text-center text-[8px] uppercase tracking-[0.4em] text-lcd-light/60">
              ACOES
            </p>
            <ActionMenu
              items={actionItems}
              selectedIndex={menuIndex}
              columns={4}
            />
          </div>
        </footer>
      )}

      <Dialog open={miniOpen} onOpenChange={setMiniOpen}>
        <DialogContent className="rounded-none border-4 border-lcd-light bg-lcd-dark font-pixel text-lcd-light sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[11px] uppercase tracking-widest text-accent-pink">
              ADIVINHE 1-3
            </DialogTitle>
            <DialogDescription className="text-[9px] uppercase tracking-widest text-lcd-light/80">
              Acerte pra deixar {pet?.name} feliz.
            </DialogDescription>
          </DialogHeader>
          {pet && (
            <MiniGame
              pet={pet}
              onFinish={(won) => {
                actions.playMinigame(won);
                toast(won ? "🎉 Acertou!" : "😢 Errou...");
                setMiniOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="rounded-none border-4 border-lcd-light bg-lcd-dark font-pixel text-lcd-light sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[11px] uppercase tracking-widest text-accent-pink">
              APAGAR BICHINHO?
            </DialogTitle>
            <DialogDescription className="text-[9px] uppercase tracking-widest text-lcd-light/80">
              Isso vai remover {pet?.name} sem ir pro cemitério.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2">
            <button
              type="button"
              onClick={() => setResetOpen(false)}
              className="flex-1 border-2 border-lcd-light bg-lcd-dark px-3 py-2 text-[9px] uppercase tracking-widest text-lcd-light"
            >
              CANCELAR
            </button>
            <button
              type="button"
              onClick={() => {
                actions.reset();
                setResetOpen(false);
              }}
              className="flex-1 border-2 border-accent-pink bg-accent-pink/20 px-3 py-2 text-[9px] uppercase tracking-widest text-accent-pink"
            >
              APAGAR
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AchievementsDialog
        open={achievementsOpen}
        onOpenChange={setAchievementsOpen}
        unlocked={achievements}
      />

      <Dialog open={graveyardOpen} onOpenChange={setGraveyardOpen}>
        <DialogContent className="rounded-none border-4 border-lcd-light bg-lcd-dark font-pixel text-lcd-light sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[11px] uppercase tracking-widest text-accent-pink">
              CEMITERIO
            </DialogTitle>
            <DialogDescription className="text-[9px] uppercase tracking-widest text-lcd-light/80">
              Bichinhos que partiram...
            </DialogDescription>
          </DialogHeader>
          {graveyard.length === 0 ? (
            <p className="text-center text-[9px] uppercase tracking-widest text-lcd-light/60">
              Nenhum bichinho aqui ainda.
            </p>
          ) : (
            <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {graveyard.map((g) => (
                <li
                  key={g.id}
                  className="border-2 border-lcd-light/40 bg-lcd-dim/60 p-3 text-[9px] uppercase tracking-widest"
                >
                  <div className="flex justify-between text-lcd-light">
                    <span>{g.name}</span>
                    <span className="text-accent-cyan">{g.species}</span>
                  </div>
                  <div className="mt-1 text-[8px] text-lcd-light/70">
                    {g.ageMinutes}min · {g.causeOfDeath}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
