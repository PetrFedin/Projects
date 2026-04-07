"use client";

import * as React from "react";
import { Check, Plus, Shirt } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Product } from "@/lib/types";

export const CATEGORY_RU: Record<string, string> = {
  Outerwear: "Верхняя одежда",
  Tops: "Топы",
  Bottoms: "Брюки / Низ",
  Shoes: "Обувь",
  Accessories: "Аксессуары",
};

export type WardrobePickerItem = {
  id: string;
  title: string;
  brand: string;
  category: string;
  image: string;
  tags?: string[];
  color?: string;
};

type Props = {
  items: WardrobePickerItem[];
  selectedIds: string[];
  onToggle: (item: WardrobePickerItem) => void;
};

function productToPickerItem(p: Product): WardrobePickerItem {
  return {
    id: p.id,
    title: p.name,
    brand: p.brand,
    category: p.category,
    image: p.images?.[0]?.url ?? "",
    tags: p.tags ?? [],
    color: (p as { color?: string }).color,
  };
}

export { productToPickerItem };

export function WardrobePicker({ items, selectedIds, onToggle }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
        <Shirt className="mx-auto h-10 w-10 text-slate-300 mb-3" />
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
          Ваш гардероб пуст
        </p>
        <p className="text-[10px] text-slate-500 mb-4 max-w-xs mx-auto">
          Добавьте вещи в гардероб — они появятся здесь и вы сможете дополнить их подбором из каталога.
        </p>
        <Link
          href="/u/wardrobe"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:underline"
        >
          Перейти в гардероб <Plus className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar px-1">
        {items.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div 
              key={item.id}
              onClick={() => onToggle(item)}
              className={cn(
                "min-w-[130px] w-[130px] cursor-pointer transition-all rounded-2xl overflow-hidden border-2 relative group/card",
                isSelected 
                  ? "border-slate-950 shadow-2xl scale-[1.02] z-10 bg-white" 
                  : "border-slate-100 bg-white hover:border-slate-300"
              )}
            >
              <div className="aspect-square relative overflow-hidden bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
                
                {/* OS Overlay Elements */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {isSelected && (
                    <div className="bg-slate-950 text-white rounded-lg p-1.5 shadow-xl animate-in zoom-in-50">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <div className="text-[6px] font-mono text-white tracking-widest">UID_{item.id.slice(0,4).toUpperCase()}</div>
                </div>
              </div>

              <div className="p-3 space-y-1 bg-white border-t border-slate-50">
                <div className="text-[8px] font-black uppercase text-slate-400 truncate tracking-widest">{item.brand}</div>
                <div className="text-[11px] font-black text-slate-950 truncate leading-tight uppercase tracking-tight">{item.title}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[7px] font-bold text-accent uppercase tracking-[0.2em]">{CATEGORY_RU[item.category] ?? item.category}</span>
                  <div className="h-1 w-1 rounded-full bg-slate-200" />
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Добавить в гардероб */}
        <Link
          href="/u/wardrobe"
          className="min-w-[130px] w-[130px] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-slate-950 hover:border-slate-950 transition-all cursor-pointer group bg-slate-50/30 hover:bg-white relative overflow-hidden"
        >
          <div className="os-grid-bg opacity-10 absolute inset-0" />
          <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:shadow-lg transition-all relative z-10">
            <Plus className="h-5 w-5" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] relative z-10">Добавить вещи</span>
        </Link>
      </div>
    </div>
  );
}
