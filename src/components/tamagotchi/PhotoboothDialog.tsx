"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Download, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useT } from "@/lib/i18n";
import type { Pet } from "@/lib/game/types";
import type { Cosmetics } from "@/lib/storage/schema";
import {
  PHOTOBOOTH_HEIGHT,
  PHOTOBOOTH_WIDTH,
  renderPhotobooth,
  type PhotoboothLabels,
} from "@/lib/photobooth/render";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PhotoboothDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pet: Pet | null;
  cosmetics: Cosmetics;
}

function buildLabels(
  dict: ReturnType<typeof useT>,
  date: Date
): PhotoboothLabels {
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
  return {
    brand: "TAMA-GOTCHI",
    tagline: dict.photobooth.tagline,
    ageLabel: dict.photobooth.ageLabel,
    stageLabel: dict.photobooth.stageLabel,
    moodLabel: dict.photobooth.moodLabel,
    statsTitle: dict.photobooth.statsTitle,
    stats: dict.photobooth.stats,
    stages: dict.stages,
    moods: {
      happy: dict.moodStatus.happy,
      sad: dict.moodStatus.sad,
      sick: dict.moodStatus.sick,
      sleeping: dict.moodStatus.sleeping,
      hungry: dict.moodStatus.hungry,
      dirty: dict.moodStatus.dirty,
      dead: "R.I.P.",
    },
    species: {
      blob: "BLOB",
      dino: "DINO",
      cat: "CAT",
    },
    variants: dict.variants,
    minuteShort: dict.photobooth.minuteShort,
    hourShort: dict.photobooth.hourShort,
    date: dateStr,
    footer: dict.photobooth.footer,
  };
}

export function PhotoboothDialog({
  open,
  onOpenChange,
  pet,
  cosmetics,
}: PhotoboothDialogProps) {
  const dict = useT();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rendering, setRendering] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (!open || !pet) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setRendering(true);
    const raf = requestAnimationFrame(() => {
      try {
        renderPhotobooth(canvas, {
          pet,
          cosmetics,
          labels: buildLabels(dict, new Date()),
        });
      } finally {
        setRendering(false);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [open, pet, cosmetics, dict]);

  const filename = pet
    ? `tamagotchi-${pet.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${pet.ageMinutes}m.png`
    : "tamagotchi.png";

  const toBlob = () =>
    new Promise<Blob | null>((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return resolve(null);
      canvas.toBlob((b) => resolve(b), "image/png");
    });

  const handleDownload = async () => {
    const blob = await toBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast(dict.photobooth.downloaded);
  };

  const canShareFiles = () => {
    if (typeof navigator === "undefined" || !navigator.share) return false;
    const probe = new File([new Blob(["."], { type: "image/png" })], "p.png", {
      type: "image/png",
    });
    return (
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [probe] })
    );
  };

  const handleShare = async () => {
    const blob = await toBlob();
    if (!blob) return;
    const file = new File([blob], filename, { type: "image/png" });
    if (canShareFiles()) {
      try {
        setSharing(true);
        await navigator.share({
          files: [file],
          title: dict.photobooth.shareTitle,
          text: pet ? `${pet.name} · TAMA-GOTCHI` : undefined,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error(dict.photobooth.shareFailed);
        }
      } finally {
        setSharing(false);
      }
    } else {
      await handleDownload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border-4 border-lcd-light bg-lcd-dark font-pixel text-lcd-light sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[11px] uppercase tracking-widest text-accent-pink">
            {dict.photobooth.title}
          </DialogTitle>
          <DialogDescription className="text-[9px] uppercase tracking-widest text-lcd-light/80">
            {dict.photobooth.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          <div
            className="relative w-full max-w-[280px] border-2 border-lcd-light/40 bg-lcd-dark"
            style={{ aspectRatio: `${PHOTOBOOTH_WIDTH} / ${PHOTOBOOTH_HEIGHT}` }}
          >
            <canvas
              ref={canvasRef}
              width={PHOTOBOOTH_WIDTH}
              height={PHOTOBOOTH_HEIGHT}
              className="block h-full w-full"
              style={{ imageRendering: "pixelated" }}
            />
            {rendering && (
              <div className="absolute inset-0 flex items-center justify-center bg-lcd-dark/60">
                <Camera className="h-8 w-8 animate-[lcdflicker_0.6s_steps(2)_infinite] text-accent-pink" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleShare}
            disabled={!pet || sharing}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 border-2 border-accent-pink bg-accent-pink/10 py-2 text-[9px] uppercase tracking-widest text-accent-pink transition-colors hover:bg-accent-pink/20 disabled:opacity-60"
            )}
          >
            <Share2 className="h-4 w-4" />
            {dict.photobooth.share}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!pet}
            className="flex flex-1 items-center justify-center gap-2 border-2 border-accent-cyan bg-accent-cyan/10 py-2 text-[9px] uppercase tracking-widest text-accent-cyan transition-colors hover:bg-accent-cyan/20 disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {dict.photobooth.download}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
