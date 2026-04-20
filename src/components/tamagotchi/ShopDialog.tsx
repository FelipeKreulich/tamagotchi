"use client";

import { Coins } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useT } from "@/lib/i18n";
import type { Cosmetics } from "@/lib/storage/schema";
import { cn } from "@/lib/utils";
import {
  ACCESSORIES,
  SLOT_ORDER,
  type Accessory,
  type AccessorySlot,
} from "./accessories/catalog";
import { AccessorySprite } from "./accessories/AccessorySprite";

interface ShopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coins: number;
  cosmetics: Cosmetics;
  onBuy: (id: string) => { success: boolean; error?: string };
  onEquip: (id: string) => void;
  onUnequip: (slot: AccessorySlot) => void;
}

export function ShopDialog({
  open,
  onOpenChange,
  coins,
  cosmetics,
  onBuy,
  onEquip,
  onUnequip,
}: ShopDialogProps) {
  const dict = useT();

  const slotLabel: Record<AccessorySlot, string> = {
    hat: dict.shop.slotHat,
    glasses: dict.shop.slotGlasses,
    ribbon: dict.shop.slotRibbon,
  };

  const grouped = SLOT_ORDER.map((slot) => ({
    slot,
    items: ACCESSORIES.filter((a) => a.slot === slot),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border-4 border-lcd-light bg-lcd-dark font-pixel text-lcd-light sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[11px] uppercase tracking-widest text-accent-pink">
            {dict.shop.title}
          </DialogTitle>
          <DialogDescription className="text-[9px] uppercase tracking-widest text-lcd-light/80">
            {dict.shop.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between border-2 border-accent-pink/50 bg-accent-pink/10 p-2">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-accent-pink" />
            <span className="text-[9px] uppercase tracking-widest text-lcd-light/80">
              {dict.shop.balance}
            </span>
          </div>
          <span className="text-sm uppercase tracking-widest text-accent-pink">
            {coins}
          </span>
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
          {grouped.map(({ slot, items }) => (
            <section key={slot} className="space-y-2">
              <h3 className="text-[10px] uppercase tracking-widest text-accent-cyan">
                {slotLabel[slot]}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {items.map((item) => (
                  <ShopCard
                    key={item.id}
                    item={item}
                    coins={coins}
                    owned={cosmetics.owned.includes(item.id)}
                    equipped={cosmetics.equipped[item.slot] === item.id}
                    onBuy={() => onBuy(item.id)}
                    onEquip={() => onEquip(item.id)}
                    onUnequip={() => onUnequip(item.slot)}
                    labels={{
                      buy: dict.shop.buy,
                      equip: dict.shop.equip,
                      unequip: dict.shop.unequip,
                      insufficient: dict.shop.insufficient,
                      itemName:
                        dict.shop.items[item.nameKey as keyof typeof dict.shop.items],
                    }}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ShopCardProps {
  item: Accessory;
  coins: number;
  owned: boolean;
  equipped: boolean;
  onBuy: () => void;
  onEquip: () => void;
  onUnequip: () => void;
  labels: {
    buy: string;
    equip: string;
    unequip: string;
    insufficient: string;
    itemName: string;
  };
}

function ShopCard({
  item,
  coins,
  owned,
  equipped,
  onBuy,
  onEquip,
  onUnequip,
  labels,
}: ShopCardProps) {
  const canAfford = coins >= item.price;
  const action = owned
    ? equipped
      ? { label: labels.unequip, onClick: onUnequip, accent: "pink" as const }
      : { label: labels.equip, onClick: onEquip, accent: "cyan" as const }
    : canAfford
    ? { label: labels.buy, onClick: onBuy, accent: "pink" as const }
    : { label: labels.insufficient, onClick: undefined, accent: "gray" as const };

  const accentClass =
    action.accent === "pink"
      ? "border-accent-pink text-accent-pink hover:bg-accent-pink/10"
      : action.accent === "cyan"
      ? "border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10"
      : "border-lcd-light/30 text-lcd-light/40 cursor-not-allowed";

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 border-2 p-2",
        equipped
          ? "border-accent-cyan bg-accent-cyan/10"
          : owned
          ? "border-lcd-light bg-lcd-dim/40"
          : "border-lcd-light/40 bg-lcd-dark"
      )}
    >
      <div className="flex h-12 w-full items-center justify-center">
        <AccessorySprite
          frame={item.frame}
          palette={item.palette}
          pixelSize={3}
        />
      </div>
      <p className="text-center text-[8px] uppercase tracking-widest text-lcd-light">
        {labels.itemName}
      </p>
      <div className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-accent-pink">
        <Coins className="h-3 w-3" />
        {item.price}
      </div>
      <button
        type="button"
        onClick={action.onClick}
        disabled={!action.onClick}
        className={cn(
          "w-full border-2 py-1 text-[8px] uppercase tracking-widest transition-colors disabled:opacity-60",
          accentClass
        )}
      >
        {action.label}
      </button>
    </div>
  );
}
