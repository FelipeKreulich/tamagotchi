"use client";

import { useRef } from "react";
import { Download, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useT } from "@/lib/i18n";
import { toast } from "sonner";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: () => string;
  onImport: (raw: string) => { success: boolean; error?: string };
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="mr-1 inline-block border-2 border-lcd-light bg-lcd-dim/60 px-1.5 py-0.5 text-[9px] text-lcd-light">
      {children}
    </span>
  );
}

export function HelpDialog({
  open,
  onOpenChange,
  onExport,
  onImport,
}: HelpDialogProps) {
  const dict = useT();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    const json = onExport();
    try {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      a.download = `tamagotchi-save-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast(dict.toasts.exported);
    } catch {
      toast.error(dict.toasts.importInvalid);
    }
  };

  const handleImportClick = () => fileInputRef.current?.click();
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const result = onImport(text);
      if (result.success) {
        toast(dict.toasts.imported);
        onOpenChange(false);
      } else {
        toast.error(dict.toasts.importInvalid);
      }
    } catch {
      toast.error(dict.toasts.importInvalid);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border-4 border-lcd-light bg-lcd-dark font-pixel text-lcd-light sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-[11px] uppercase tracking-widest text-accent-pink">
            {dict.help.title}
          </DialogTitle>
          <DialogDescription className="text-[9px] uppercase tracking-widest text-lcd-light/80">
            {dict.help.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[65vh] space-y-6 overflow-y-auto pr-2">
          <section className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-widest text-accent-cyan">
              {dict.help.aboutTitle}
            </h3>
            <p className="text-[9px] leading-relaxed text-lcd-light/90">
              {dict.help.aboutIntro}
            </p>
            <p className="text-[9px] leading-relaxed text-lcd-light/90">
              {dict.help.aboutHistory}
            </p>
            <p className="text-[9px] leading-relaxed text-lcd-light/90">
              {dict.help.aboutWhy}
            </p>
          </section>

          <section className="space-y-2 border-t-2 border-dashed border-lcd-light/30 pt-4">
            <h3 className="text-[10px] uppercase tracking-widest text-accent-cyan">
              {dict.help.shortcutsTitle}
            </h3>
            <ul className="space-y-1 text-[9px] leading-relaxed text-lcd-light/90">
              <li>
                <Kbd>◀</Kbd>
                <Kbd>A</Kbd>
                {dict.help.shortcuts.prev}
              </li>
              <li>
                <Kbd>▶</Kbd>
                <Kbd>D</Kbd>
                {dict.help.shortcuts.next}
              </li>
              <li>
                <Kbd>Enter</Kbd>
                <Kbd>Space</Kbd>
                {dict.help.shortcuts.select}
              </li>
              <li>
                <Kbd>1</Kbd>–<Kbd>8</Kbd>
                {dict.help.shortcuts.direct}
              </li>
              <li>
                <Kbd>M</Kbd>
                {dict.help.shortcuts.mute}
              </li>
              <li>
                <Kbd>N</Kbd>
                {dict.help.shortcuts.notif}
              </li>
              <li>
                <Kbd>L</Kbd>
                {dict.help.shortcuts.language}
              </li>
              <li>
                <Kbd>?</Kbd>
                <Kbd>H</Kbd>
                {dict.help.shortcuts.help}
              </li>
            </ul>
          </section>

          <section className="space-y-2 border-t-2 border-dashed border-lcd-light/30 pt-4">
            <h3 className="text-[10px] uppercase tracking-widest text-accent-cyan">
              {dict.help.statsTitle}
            </h3>
            <ul className="space-y-1 text-[9px] leading-relaxed text-lcd-light/90">
              <li>{dict.help.statsInfo.hunger}</li>
              <li>{dict.help.statsInfo.happiness}</li>
              <li>{dict.help.statsInfo.energy}</li>
              <li>{dict.help.statsInfo.hygiene}</li>
              <li>{dict.help.statsInfo.health}</li>
            </ul>
          </section>

          <section className="space-y-3 border-t-2 border-dashed border-lcd-light/30 pt-4">
            <h3 className="text-[10px] uppercase tracking-widest text-accent-cyan">
              {dict.help.dataTitle}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleExport}
                className="group flex flex-col gap-2 border-2 border-lcd-light bg-lcd-dark p-3 text-left transition-colors hover:border-accent-cyan"
              >
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-lcd-light group-hover:text-accent-cyan">
                  <Download className="h-3 w-3" />
                  {dict.help.export}
                </div>
                <p className="text-[8px] leading-relaxed text-lcd-light/70">
                  {dict.help.exportDesc}
                </p>
              </button>
              <button
                type="button"
                onClick={handleImportClick}
                className="group flex flex-col gap-2 border-2 border-lcd-light bg-lcd-dark p-3 text-left transition-colors hover:border-accent-pink"
              >
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-lcd-light group-hover:text-accent-pink">
                  <Upload className="h-3 w-3" />
                  {dict.help.import}
                </div>
                <p className="text-[8px] leading-relaxed text-lcd-light/70">
                  {dict.help.importDesc}
                </p>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImportFile}
            />
          </section>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="border-2 border-lcd-light bg-lcd-light px-4 py-2 text-[9px] uppercase tracking-widest text-lcd-dark"
          >
            {dict.help.close}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
