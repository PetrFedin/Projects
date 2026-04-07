"use client";

import React from "react";
import { cn } from "@/lib/utils";

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
  const categoryOrder = ["Outerwear", "Tops", "Bottoms", "Shoes", "Accessories"];
  const sortedItems = [...items].sort((a, b) => 
    categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
  );

  // Позиции для предметов
  const getPosition = (category: string) => {
    switch (category) {
      case "Outerwear": return "z-30 scale-110 top-0 left-0 w-full h-full object-contain opacity-90";
      case "Tops": return "z-20 scale-90 top-[5%] left-[5%] w-[90%] h-[70%] object-contain";
      case "Bottoms": return "z-10 scale-95 bottom-0 left-[10%] w-[80%] h-[60%] object-contain";
      case "Shoes": return "z-40 scale-50 bottom-[-15%] right-[-5%] w-[60%] h-[40%] object-contain drop-shadow-xl";
      case "Accessories": return "z-50 scale-40 top-[-5%] right-[-5%] w-[50%] h-[30%] object-contain rotate-12";
      default: return "z-0 w-full h-full object-cover";
    }
  };

  return (
    <div className={cn("relative aspect-[3/4] bg-slate-50 rounded-3xl overflow-hidden border border-slate-100/50 shadow-inner group/collage", className)}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-slate-100 opacity-50" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', size: '20px 20px' }} />

      <div className="relative w-full h-full p-4 flex items-center justify-center">
        {sortedItems.length === 0 ? (
          <div className="text-slate-300 font-black uppercase text-[8px] tracking-widest">Outfit_Not_Compiled</div>
        ) : (
          <div className="relative w-full h-full">
            {sortedItems.map((item, idx) => (
              <img
                key={item.id}
                src={item.image}
                alt={item.title}
                className={cn(
                  "absolute transition-all duration-700 ease-out group-hover/collage:scale-[1.05]",
                  getPosition(item.category)
                )}
                style={{ 
                  filter: idx === 0 ? 'none' : 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                  transitionDelay: `${idx * 100}ms`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Decorative tech label */}
      <div className="absolute bottom-3 left-4 flex flex-col gap-0.5">
        <div className="text-[6px] font-mono text-slate-400 uppercase tracking-widest">Visual_Synthesis_v4.2</div>
        <div className="h-[1px] w-8 bg-slate-200" />
      </div>
    </div>
  );
}
