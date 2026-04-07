"use client";

import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import type { GlobalCategory } from "@/lib/types";

type GlobalCategoryItem = {
  id: GlobalCategory;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

type GlobalCategorySelectorProps = {
  categories: GlobalCategoryItem[];
  activeCategory: GlobalCategory;
  onChange: (category: GlobalCategory) => void;
};

export function GlobalCategorySelector({
  categories,
  activeCategory,
  onChange,
}: GlobalCategorySelectorProps) {
  return (
    <section className="sticky top-[var(--header-height,48px)] z-30 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm py-3">
      <div className="container mx-auto px-14">
        <div className="flex items-center justify-start md:justify-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={cn(
                "flex-1 px-1.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap border flex items-center justify-center gap-1.5 group",
                activeCategory === cat.id ? "btn-tab-active" : "btn-tab-inactive-light"
              )}
            >
              <cat.icon
                className={cn(
                  "h-3 w-3 transition-transform shrink-0",
                  activeCategory === cat.id ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              <span className="truncate">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
