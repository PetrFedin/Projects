'use client';

import * as React from 'react';
import { Check, Plus, Shirt } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
<<<<<<< HEAD
=======
import { ROUTES } from '@/lib/routes';
>>>>>>> recover/cabinet-wip-from-stash
import type { Product } from '@/lib/types';

export const CATEGORY_RU: Record<string, string> = {
  Outerwear: 'Верхняя одежда',
  Tops: 'Топы',
  Bottoms: 'Брюки / Низ',
  Shoes: 'Обувь',
  Accessories: 'Аксессуары',
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
    image: p.images?.[0]?.url ?? '',
    tags: p.tags ?? [],
    color: (p as { color?: string }).color,
  };
}

export { productToPickerItem };

export function WardrobePicker({ items, selectedIds, onToggle }: Props) {
  if (items.length === 0) {
    return (
<<<<<<< HEAD
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
        <Shirt className="mx-auto mb-3 h-10 w-10 text-slate-300" />
        <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
          Ваш гардероб пуст
        </p>
        <p className="mx-auto mb-4 max-w-xs text-[10px] text-slate-500">
=======
      <div className="border-border-default bg-bg-surface2/80 rounded-2xl border-2 border-dashed p-4 text-center">
        <Shirt className="text-text-muted mx-auto mb-3 h-10 w-10" />
        <p className="text-text-muted mb-2 text-[11px] font-black uppercase tracking-widest">
          Ваш гардероб пуст
        </p>
        <p className="text-text-secondary mx-auto mb-4 max-w-xs text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
          Добавьте вещи в гардероб — они появятся здесь и вы сможете дополнить их подбором из
          каталога.
        </p>
        <Link
          href={ROUTES.client.profileWardrobe}
          className="text-text-primary inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:underline"
        >
          Перейти в гардероб <Plus className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="custom-scrollbar flex gap-3 overflow-x-auto px-1 pb-4">
        {items.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => onToggle(item)}
              className={cn(
                'group/card relative w-[130px] min-w-[130px] cursor-pointer overflow-hidden rounded-2xl border-2 transition-all',
                isSelected
<<<<<<< HEAD
                  ? 'z-10 scale-[1.02] border-slate-950 bg-white shadow-2xl'
                  : 'border-slate-100 bg-white hover:border-slate-300'
              )}
            >
              <div className="relative aspect-square overflow-hidden bg-slate-50">
=======
                  ? 'border-text-primary z-10 scale-[1.02] bg-white shadow-2xl'
                  : 'border-border-subtle hover:border-border-default bg-white'
              )}
            >
              <div className="bg-bg-surface2 relative aspect-square overflow-hidden">
>>>>>>> recover/cabinet-wip-from-stash
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                />

                {/* OS Overlay Elements */}
                <div className="absolute right-2 top-2 flex flex-col gap-1">
                  {isSelected && (
<<<<<<< HEAD
                    <div className="rounded-lg bg-slate-950 p-1.5 text-white shadow-xl animate-in zoom-in-50">
=======
                    <div className="bg-text-primary rounded-lg p-1.5 text-white shadow-xl animate-in zoom-in-50">
>>>>>>> recover/cabinet-wip-from-stash
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/20 to-transparent p-2 opacity-0 transition-opacity group-hover/card:opacity-100">
                  <div className="font-mono text-[6px] tracking-widest text-white">
                    UID_{item.id.slice(0, 4).toUpperCase()}
                  </div>
                </div>
              </div>

<<<<<<< HEAD
              <div className="space-y-1 border-t border-slate-50 bg-white p-3">
                <div className="truncate text-[8px] font-black uppercase tracking-widest text-slate-400">
                  {item.brand}
                </div>
                <div className="truncate text-[11px] font-black uppercase leading-tight tracking-tight text-slate-950">
=======
              <div className="border-border-subtle space-y-1 border-t bg-white p-3">
                <div className="text-text-muted truncate text-[8px] font-black uppercase tracking-widest">
                  {item.brand}
                </div>
                <div className="text-text-primary truncate text-[11px] font-black uppercase leading-tight tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                  {item.title}
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-accent">
                    {CATEGORY_RU[item.category] ?? item.category}
                  </span>
<<<<<<< HEAD
                  <div className="h-1 w-1 rounded-full bg-slate-200" />
=======
                  <div className="bg-border-subtle h-1 w-1 rounded-full" />
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              </div>
            </div>
          );
        })}

        {/* Добавить в гардероб */}
        <Link
<<<<<<< HEAD
          href="/u/wardrobe"
          className="group relative flex w-[130px] min-w-[130px] cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/30 text-slate-400 transition-all hover:border-slate-950 hover:bg-white hover:text-slate-950"
        >
          <div className="os-grid-bg absolute inset-0 opacity-10" />
          <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition-all group-hover:shadow-lg">
=======
          href={ROUTES.client.profileWardrobe}
          className="border-border-default text-text-muted hover:text-text-primary hover:border-text-primary bg-bg-surface2/30 group relative flex w-[130px] min-w-[130px] cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed transition-all hover:bg-white"
        >
          <div className="os-grid-bg absolute inset-0 opacity-10" />
          <div className="border-border-default relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border bg-white transition-all group-hover:shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
            <Plus className="h-5 w-5" />
          </div>
          <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.2em]">
            Добавить вещи
          </span>
        </Link>
      </div>
    </div>
  );
}
