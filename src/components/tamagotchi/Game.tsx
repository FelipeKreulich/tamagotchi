"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { usePetAmbience } from "@/hooks/usePetAmbience";
import { sfxMinigameStart } from "@/lib/audio";
import type { Species } from "@/lib/game/types";
import { StartScreen } from "./StartScreen";
import { PetSprite } from "./PetSprite";
import { HUD } from "./HUD";
import { ActionMenu, type ActionItem } from "./ActionMenu";
import { DeathScreen } from "./DeathScreen";
import { MuteToggle } from "./MuteToggle";
import { MinigameHub } from "./MinigameHub";
import { Sprite } from "./Sprite";
import { eggFrames } from "./sprites/egg";
import { SPECIES_META } from "./sprites";
import { NotificationToggle } from "./NotificationToggle";
import { LocaleToggle } from "./LocaleToggle";
import { FullscreenToggle } from "./FullscreenToggle";
import { LcdScreen } from "./LcdScreen";
import { DpadButtons } from "./DpadButtons";
import { AchievementsDialog } from "./AchievementsDialog";
import { ParticleBurst, type ParticleKind } from "./Particles";
import { HelpButton } from "./HelpButton";
import { HelpDialog } from "./HelpDialog";
import { HistoryDialog } from "./HistoryDialog";
import { EvolutionFlash } from "./EvolutionFlash";
import { DaycareDialog } from "./DaycareDialog";
import { ShopDialog } from "./ShopDialog";
import { LineChart, Coins, HeartPulse } from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/game/achievements";
import { hasEvolved } from "@/lib/game/lifecycle";
import { cn } from "@/lib/utils";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import {
  LOCALES,
  tpl,
  useLocale,
  useT,
  type Dictionary,
} from "@/lib/i18n";
import type { LifeStage } from "@/lib/game/types";
import { toast } from "sonner";

function StatusPanel({
  achievementCount,
  totalAchievements,
  graveyardCount,
  coins,
  daycareEnabled,
  onOpenGraveyard,
  onOpenAchievements,
  onOpenHistory,
  onOpenDaycare,
  onOpenShop,
  dict,
}: {
  achievementCount: number;
  totalAchievements: number;
  graveyardCount: number;
  coins: number;
  daycareEnabled: boolean;
  onOpenGraveyard: () => void;
  onOpenAchievements: () => void;
  onOpenHistory: () => void;
  onOpenDaycare: () => void;
  onOpenShop: () => void;
  dict: Dictionary;
}) {
  return (
    <div className="flex h-full flex-col gap-3 border-4 border-lcd-light bg-lcd-dark p-4 shadow-[6px_6px_0_0] shadow-lcd-dim">
      <p className="text-[8px] uppercase tracking-[0.3em] text-lcd-light/60">
        {dict.status.title}
      </p>
      <div className="space-y-3">
        <button
          type="button"
          onClick={onOpenShop}
          className="flex w-full items-center justify-between border-2 border-accent-pink/50 bg-accent-pink/10 p-3 transition-colors hover:border-accent-pink"
        >
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-accent-pink" />
            <span className="text-[9px] uppercase tracking-widest text-lcd-light">
              {dict.status.shop}
            </span>
          </div>
          <span className="text-sm uppercase tracking-widest text-accent-pink">
            {coins}
          </span>
        </button>
        <button
          type="button"
          onClick={onOpenAchievements}
          className="flex w-full items-center justify-between border-2 border-lcd-light/40 bg-lcd-dim/40 p-3 transition-colors hover:border-accent-cyan"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-cyan" />
            <span className="text-[9px] uppercase tracking-widest text-lcd-light">
              {dict.status.achievements}
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
              {dict.status.graveyard}
            </span>
          </div>
          <span className="text-sm text-accent-pink">{graveyardCount}</span>
        </button>
        <button
          type="button"
          onClick={onOpenHistory}
          className="flex w-full items-center justify-between border-2 border-lcd-light/40 bg-lcd-dim/40 p-3 transition-colors hover:border-accent-cyan"
        >
          <div className="flex items-center gap-2">
            <LineChart className="h-4 w-4 text-accent-cyan" />
            <span className="text-[9px] uppercase tracking-widest text-lcd-light">
              {dict.status.history}
            </span>
          </div>
        </button>
        <button
          type="button"
          onClick={onOpenDaycare}
          className={cn(
            "flex w-full items-center justify-between border-2 p-3 transition-colors",
            daycareEnabled
              ? "border-accent-cyan bg-accent-cyan/15 hover:border-accent-pink"
              : "border-lcd-light/40 bg-lcd-dim/40 hover:border-accent-cyan"
          )}
        >
          <div className="flex items-center gap-2">
            <HeartPulse
              className={cn(
                "h-4 w-4",
                daycareEnabled ? "text-accent-cyan" : "text-lcd-light"
              )}
            />
            <span className="text-[9px] uppercase tracking-widest text-lcd-light">
              {dict.status.daycare}
            </span>
          </div>
          <span
            className={cn(
              "text-[9px] uppercase tracking-widest",
              daycareEnabled ? "text-accent-cyan" : "text-lcd-light/60"
            )}
          >
            {daycareEnabled ? dict.status.daycareOn : dict.status.daycareOff}
          </span>
        </button>
      </div>
    </div>
  );
}

const TOTAL_ACHIEVEMENTS = ACHIEVEMENTS.length;

export function Game() {
  const tama = useTamagotchi();
  const {
    pet,
    hydrated,
    settings,
    actions,
    achievements,
    graveyard,
    coins,
    cosmetics,
  } = tama;
  const dict = useT();
  const { locale, setLocale } = useLocale();
  const timeOfDay = useTimeOfDay();

  const onStartScreen = !pet;
  const showIntroMusic = !hydrated || onStartScreen || (pet && !pet.isAlive);

  useIntroMusic({ muted: settings.muted, enabled: !!showIntroMusic });
  useCriticalNotifications({
    pet,
    enabled: settings.notificationsEnabled,
    dict,
  });
  usePetAmbience({
    pet,
    muted: settings.muted,
    enabled: !showIntroMusic,
  });

  const [menuIndex, setMenuIndex] = useState(0);
  const [miniOpen, setMiniOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [graveyardOpen, setGraveyardOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [daycareOpen, setDaycareOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [patBouncing, setPatBouncing] = useState(false);
  const lastPatAtRef = useRef(0);
  const [particle, setParticle] = useState<{
    kind: ParticleKind;
    key: number;
  }>({ kind: "hearts", key: 0 });

  const triggerParticle = (kind: ParticleKind) => {
    setParticle({ kind, key: Date.now() });
  };

  const handlePat = () => {
    if (!pet || !pet.isAlive || pet.isSleeping) return;
    const now = Date.now();
    if (now - lastPatAtRef.current < 5000) return;
    lastPatAtRef.current = now;
    actions.pat();
    toast(dict.toasts.patted);
    triggerParticle("hearts");
    setPatBouncing(true);
    const t = window.setTimeout(() => setPatBouncing(false), 700);
    return () => window.clearTimeout(t);
  };
  const [evolvedStage, setEvolvedStage] = useState<LifeStage | null>(null);
  const lastStageRef = useRef<LifeStage | null>(null);

  // Detect stage changes to trigger the evolution flash.
  useEffect(() => {
    if (!pet) {
      lastStageRef.current = null;
      return;
    }
    const previous = lastStageRef.current;
    lastStageRef.current = pet.stage;
    if (
      previous &&
      previous !== pet.stage &&
      hasEvolved(previous, pet.stage)
    ) {
      setEvolvedStage(pet.stage);
      const t = window.setTimeout(() => setEvolvedStage(null), 2200);
      return () => window.clearTimeout(t);
    }
  }, [pet]);

  const actionItems = useMemo<ActionItem[]>(() => {
    if (!pet) return [];
    return [
      {
        id: "food",
        label: dict.actions.feed,
        icon: Apple,
        onSelect: () => {
          actions.feedFood();
          toast(dict.toasts.fed);
          triggerParticle("plus");
        },
        disabled: !pet.isAlive || pet.isSleeping,
      },
      {
        id: "candy",
        label: dict.actions.candy,
        icon: Candy,
        onSelect: () => {
          actions.feedCandy();
          toast(dict.toasts.candy);
          triggerParticle("hearts");
        },
        disabled: !pet.isAlive || pet.isSleeping,
      },
      {
        id: "play",
        label: dict.actions.play,
        icon: Gamepad2,
        onSelect: () => {
          sfxMinigameStart({ muted: settings.muted });
          setMiniOpen(true);
        },
        disabled: !pet.isAlive || pet.isSleeping,
      },
      {
        id: "sleep",
        label: pet.isSleeping ? dict.actions.wake : dict.actions.sleep,
        icon: Moon,
        onSelect: () => {
          if (pet.isSleeping) {
            actions.wake();
            toast(dict.toasts.goodMorning);
            triggerParticle("stars");
          } else {
            actions.sleep();
            toast(dict.toasts.goodNight);
            triggerParticle("notes");
          }
        },
        disabled: !pet.isAlive,
      },
      {
        id: "bath",
        label: dict.actions.bath,
        icon: Bath,
        onSelect: () => {
          actions.bath();
          toast(dict.toasts.clean);
          triggerParticle("bubbles");
        },
        disabled: !pet.isAlive || pet.isSleeping,
      },
      {
        id: "medicine",
        label: dict.actions.medicine,
        icon: Pill,
        onSelect: () => {
          if (!pet.isSick) {
            toast.error(dict.toasts.notSick);
          } else {
            actions.medicine();
            toast(dict.toasts.cured);
            triggerParticle("plus");
          }
        },
        disabled: !pet.isAlive,
      },
      {
        id: "clean",
        label: dict.actions.clean,
        icon: Trash2,
        onSelect: () => {
          if (pet.poopCount <= 0) {
            toast.error(dict.toasts.nothingToClean);
          } else {
            actions.cleanPoop();
            toast(dict.toasts.poopCleaned);
            triggerParticle("sparkles");
          }
        },
        disabled: !pet.isAlive,
      },
      {
        id: "reset",
        label: dict.actions.reset,
        icon: RotateCcw,
        onSelect: () => setResetOpen(true),
      },
    ];
  }, [pet, actions, settings.muted, dict]);

  const handleA = () => {
    if (!pet || !pet.isAlive) return;
    setMenuIndex((i) => (i - 1 + actionItems.length) % actionItems.length);
  };
  const handleB = () => {
    if (!pet || !pet.isAlive) return;
    const item = actionItems[menuIndex];
    if (item && !item.disabled) item.onSelect();
  };
  const handleC = () => {
    if (!pet || !pet.isAlive) return;
    setMenuIndex((i) => (i + 1) % actionItems.length);
  };

  const cycleLocale = () => {
    const i = LOCALES.indexOf(locale);
    setLocale(LOCALES[(i + 1) % LOCALES.length]);
  };

  useKeyboardControls({
    onPrev: handleA,
    onNext: handleC,
    onSelect: handleB,
    onToggleMute: () => actions.setMuted(!settings.muted),
    onToggleNotif: () => {
      if (settings.notificationsEnabled) {
        actions.setNotificationsEnabled(false);
      }
    },
    onCycleLocale: cycleLocale,
    onToggleHelp: () => setHelpOpen((o) => !o),
    onDirectAction: (i) => {
      if (!pet || !pet.isAlive) return;
      const item = actionItems[i];
      if (item && !item.disabled) {
        setMenuIndex(i);
        item.onSelect();
      }
    },
  });

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[10px] uppercase tracking-widest text-lcd-light">
        <span className="animate-[lcdflicker_1s_steps(2)_infinite]">
          {dict.common.loading}
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top,#112317_0%,#050905_70%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-6 bg-[repeating-linear-gradient(0deg,var(--lcd-light)_0,var(--lcd-light)_4px,transparent_4px,transparent_12px)] opacity-20 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-6 bg-[repeating-linear-gradient(0deg,var(--lcd-light)_0,var(--lcd-light)_4px,transparent_4px,transparent_12px)] opacity-20 md:block"
      />

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b-4 border-lcd-light bg-lcd-dark/80 px-4 py-3 backdrop-blur sm:px-8">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-3 w-3 animate-[ledpulse_1.6s_steps(2)_infinite] bg-accent-pink"
          />
          <h1 className="text-[12px] tracking-[0.4em] text-lcd-light sm:text-sm">
            TAMA<span className="text-accent-pink">—</span>GOTCHI
          </h1>
          <span
            aria-hidden
            className="hidden border-2 border-lcd-light/50 px-2 py-0.5 text-[8px] uppercase tracking-widest text-lcd-light/70 sm:inline"
            title={timeOfDay}
          >
            {timeOfDay === "night" ? "☾" : "☀"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MuteToggle
            muted={settings.muted}
            onToggle={() => actions.setMuted(!settings.muted)}
          />
          <LocaleToggle />
          <NotificationToggle
            enabled={settings.notificationsEnabled}
            onChange={actions.setNotificationsEnabled}
          />
          <FullscreenToggle />
          <HelpButton onClick={() => setHelpOpen(true)} />
        </div>
      </header>

      <div
        className={`relative z-10 flex flex-1 flex-col gap-6 p-4 sm:p-8 md:gap-8 lg:items-stretch ${
          pet
            ? "lg:grid lg:grid-cols-[300px_1fr_300px]"
            : "lg:flex lg:items-center lg:justify-center"
        }`}
      >
        {pet && (
          <aside className="order-2 lg:order-1 lg:col-start-1">
            <HUD pet={pet} />
          </aside>
        )}

        <section className="order-1 flex flex-col items-center justify-center gap-6 lg:order-2 lg:col-start-2">
          <LcdScreen className="max-w-2xl">
            <div className="relative flex min-h-[260px] flex-col items-center justify-center gap-5 sm:min-h-[320px]">
              <ParticleBurst trigger={particle.key} kind={particle.kind} />
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
                        <PetSprite
                          pet={pet}
                          pixelSize={16}
                          onClick={handlePat}
                          bouncing={patBouncing}
                          clickable
                          disabled={pet.isSleeping}
                          equipped={cosmetics.equipped}
                        />
                      )}
                    </div>
                    <p className="text-center text-[9px] uppercase tracking-[0.3em] text-lcd-light/70">
                      {pet.mood !== "dead" &&
                        dict.moodStatus[
                          pet.mood as keyof typeof dict.moodStatus
                        ]}
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

        {pet && (
          <aside className="order-3 lg:col-start-3">
            <StatusPanel
              achievementCount={achievements.length}
              totalAchievements={TOTAL_ACHIEVEMENTS}
              graveyardCount={graveyard.length}
              coins={coins}
              daycareEnabled={settings.daycareEnabled}
              onOpenGraveyard={() => setGraveyardOpen(true)}
              onOpenAchievements={() => setAchievementsOpen(true)}
              onOpenHistory={() => setHistoryOpen(true)}
              onOpenDaycare={() => setDaycareOpen(true)}
              onOpenShop={() => setShopOpen(true)}
              dict={dict}
            />
          </aside>
        )}
      </div>

      {pet && pet.isAlive && (
        <footer className="relative z-10 border-t-4 border-lcd-light bg-lcd-dark/80 p-4 sm:p-6">
          <div className="mx-auto max-w-5xl space-y-3">
            <p className="text-center text-[8px] uppercase tracking-[0.4em] text-lcd-light/60">
              {dict.actions.title}
            </p>
            <ActionMenu
              items={actionItems}
              selectedIndex={menuIndex}
              columns={4}
            />
          </div>
        </footer>
      )}

      {pet && (
        <MinigameHub
          open={miniOpen}
          onOpenChange={setMiniOpen}
          pet={pet}
          muted={settings.muted}
          coins={coins}
          onFinishGuess={(won) => {
            actions.playMinigame(won);
            if (won) {
              actions.addCoins(5);
              triggerParticle("stars");
            }
            toast(won ? dict.toasts.minigameWon : dict.toasts.minigameLost);
          }}
          onFinishGeneric={(result) => {
            if (result.happiness > 0) actions.awardHappiness(result.happiness);
            if (result.coins > 0) actions.addCoins(result.coins);
            const earned = result.won || result.coins > 0;
            if (earned) triggerParticle("stars");
            toast(
              earned ? dict.toasts.minigameWon : dict.toasts.minigameLost
            );
          }}
        />
      )}

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="rounded-none border-4 border-lcd-light bg-lcd-dark font-pixel text-lcd-light sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[11px] uppercase tracking-widest text-accent-pink">
              {dict.reset.title}
            </DialogTitle>
            <DialogDescription className="text-[9px] uppercase tracking-widest text-lcd-light/80">
              {tpl(dict.reset.subtitle, { name: pet?.name ?? "" })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2">
            <button
              type="button"
              onClick={() => setResetOpen(false)}
              className="flex-1 border-2 border-lcd-light bg-lcd-dark px-3 py-2 text-[9px] uppercase tracking-widest text-lcd-light"
            >
              {dict.reset.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                actions.reset();
                setResetOpen(false);
              }}
              className="flex-1 border-2 border-accent-pink bg-accent-pink/20 px-3 py-2 text-[9px] uppercase tracking-widest text-accent-pink"
            >
              {dict.reset.confirm}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AchievementsDialog
        open={achievementsOpen}
        onOpenChange={setAchievementsOpen}
        unlocked={achievements}
      />

      <HelpDialog
        open={helpOpen}
        onOpenChange={setHelpOpen}
        onExport={actions.exportSave}
        onImport={actions.importSave}
      />

      <HistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        pet={pet}
      />

      <DaycareDialog
        open={daycareOpen}
        onOpenChange={setDaycareOpen}
        enabled={settings.daycareEnabled}
        rules={settings.daycareRules}
        onToggle={actions.setDaycareEnabled}
        onChangeRules={actions.setDaycareRules}
      />

      <ShopDialog
        open={shopOpen}
        onOpenChange={setShopOpen}
        coins={coins}
        cosmetics={cosmetics}
        onBuy={(id) => {
          const result = actions.buyAccessory(id);
          if (result.success) toast(dict.shop.bought);
          return result;
        }}
        onEquip={actions.equipAccessory}
        onUnequip={actions.unequipSlot}
      />

      {evolvedStage && <EvolutionFlash stage={evolvedStage} />}

      <Dialog open={graveyardOpen} onOpenChange={setGraveyardOpen}>
        <DialogContent className="rounded-none border-4 border-lcd-light bg-lcd-dark font-pixel text-lcd-light sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[11px] uppercase tracking-widest text-accent-pink">
              {dict.graveyard.title}
            </DialogTitle>
            <DialogDescription className="text-[9px] uppercase tracking-widest text-lcd-light/80">
              {dict.graveyard.subtitle}
            </DialogDescription>
          </DialogHeader>
          {graveyard.length === 0 ? (
            <p className="text-center text-[9px] uppercase tracking-widest text-lcd-light/60">
              {dict.graveyard.empty}
            </p>
          ) : (
            <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {graveyard.map((g) => {
                const cause =
                  g.causeOfDeath in dict.causes
                    ? dict.causes[g.causeOfDeath as keyof typeof dict.causes]
                    : g.causeOfDeath;
                return (
                  <li
                    key={g.id}
                    className="border-2 border-lcd-light/40 bg-lcd-dim/60 p-3 text-[9px] uppercase tracking-widest"
                  >
                    <div className="flex justify-between text-lcd-light">
                      <span>{g.name}</span>
                      <span className="text-accent-cyan">{g.species}</span>
                    </div>
                    <div className="mt-1 text-[8px] text-lcd-light/70">
                      {g.ageMinutes}min · {cause}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
