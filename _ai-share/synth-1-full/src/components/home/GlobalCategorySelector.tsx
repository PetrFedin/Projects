'use client';

import type { ComponentType } from 'react';
import { cn } from '@/lib/utils';
import type { GlobalCategory } from '@/lib/types';

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
<<<<<<< HEAD
    <section className="sticky top-[var(--header-height,48px)] z-30 w-full border-b border-slate-200 bg-white/90 py-3 shadow-sm backdrop-blur-xl">
      <div className="container mx-auto px-14">
=======
    <section className="border-border-default sticky top-[var(--header-height,48px)] z-30 w-full border-b bg-white/90 py-3 shadow-sm backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-14">
>>>>>>> recover/cabinet-wip-from-stash
        <div className="no-scrollbar flex items-center justify-start gap-1.5 overflow-x-auto md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={cn(
                'group flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border px-1.5 py-2.5 text-xs font-bold uppercase tracking-wide transition-all',
                activeCategory === cat.id ? 'btn-tab-active' : 'btn-tab-inactive-light'
              )}
            >
              <cat.icon
                className={cn(
                  'h-3 w-3 shrink-0 transition-transform',
                  activeCategory === cat.id
                    ? 'text-white'
<<<<<<< HEAD
                    : 'text-slate-400 group-hover:text-slate-600'
=======
                    : 'text-text-muted group-hover:text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
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
