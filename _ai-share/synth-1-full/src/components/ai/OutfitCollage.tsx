'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type CollageItem = {
  id: string;
  image: string;
  category: string;
  title: string;
};

interface OutfitCollageProps {
  items: CollageItem[];
  className?: string;
}

/**
 * Визуализация образа в виде коллажа.
 * Располагает вещи по слоям: Верхняя одежда (Outerwear) -> Верх (Tops) -> Низ (Bottoms) -> Обувь (Shoes) -> Аксессуары
 */
export function OutfitCollage({ items, className }: OutfitCollageProps) {
  // Сортировка для наложения слоев
  const categoryOrder = ['Outerwear', 'Tops', 'Bottoms', 'Shoes', 'Accessories'];
  const sortedItems = [...items].sort(
    (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
  );

  // Позиции для предметов
  const getPosition = (category: string) => {
    switch (category) {
      case 'Outerwear':
        return 'z-30 scale-110 top-0 left-0 w-full h-full object-contain opacity-90';
      case 'Tops':
        return 'z-20 scale-90 top-[5%] left-[5%] w-[90%] h-[70%] object-contain';
      case 'Bottoms':
        return 'z-10 scale-95 bottom-0 left-[10%] w-[80%] h-[60%] object-contain';
      case 'Shoes':
        return 'z-40 scale-50 bottom-[-15%] right-[-5%] w-[60%] h-[40%] object-contain drop-shadow-xl';
      case 'Accessories':
        return 'z-50 scale-40 top-[-5%] right-[-5%] w-[50%] h-[30%] object-contain rotate-12';
      default:
        return 'z-0 w-full h-full object-cover';
    }
  };

  return (
    <div
      className={cn(
<<<<<<< HEAD
        'group/collage relative aspect-[3/4] overflow-hidden rounded-3xl border border-slate-100/50 bg-slate-50 shadow-inner',
=======
        'bg-bg-surface2 border-border-subtle/50 group/collage relative aspect-[3/4] overflow-hidden rounded-3xl border shadow-inner',
>>>>>>> recover/cabinet-wip-from-stash
        className
      )}
    >
      {/* Background decoration */}
<<<<<<< HEAD
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-slate-100 opacity-50" />
=======
      <div className="to-bg-surface2 absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white opacity-50" />
>>>>>>> recover/cabinet-wip-from-stash

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
<<<<<<< HEAD
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', size: '20px 20px' }}
=======
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
>>>>>>> recover/cabinet-wip-from-stash
      />

      <div className="relative flex h-full w-full items-center justify-center p-4">
        {sortedItems.length === 0 ? (
<<<<<<< HEAD
          <div className="text-[8px] font-black uppercase tracking-widest text-slate-300">
=======
          <div className="text-text-muted text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Outfit_Not_Compiled
          </div>
        ) : (
          <div className="relative h-full w-full">
            {sortedItems.map((item, idx) => (
              <img
                key={item.id}
                src={item.image}
                alt={item.title}
                className={cn(
                  'absolute transition-all duration-700 ease-out group-hover/collage:scale-[1.05]',
                  getPosition(item.category)
                )}
                style={{
                  filter: idx === 0 ? 'none' : 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                  transitionDelay: `${idx * 100}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Decorative tech label */}
      <div className="absolute bottom-3 left-4 flex flex-col gap-0.5">
<<<<<<< HEAD
        <div className="font-mono text-[6px] uppercase tracking-widest text-slate-400">
          Visual_Synthesis_v4.2
        </div>
        <div className="h-[1px] w-8 bg-slate-200" />
=======
        <div className="text-text-muted font-mono text-[6px] uppercase tracking-widest">
          Visual_Synthesis_v4.2
        </div>
        <div className="bg-border-subtle h-[1px] w-8" />
>>>>>>> recover/cabinet-wip-from-stash
      </div>
    </div>
  );
}
