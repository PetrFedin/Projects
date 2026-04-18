'use client';

import { ChevronRight } from 'lucide-react';

type CabinetBreadcrumbsProps = {
  items: string[];
  className?: string;
};

export function CabinetBreadcrumbs({ items, className }: CabinetBreadcrumbsProps) {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return null;

  return (
    <nav
      aria-label="Путь раздела"
      className={
        className ??
        'text-text-muted flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest'
      }
    >
      {filtered.map((item, index) => {
        const isLast = index === filtered.length - 1;
        return (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-1.5">
            {index > 0 ? <ChevronRight className="h-2.5 w-2.5 opacity-70" aria-hidden /> : null}
            <span className={isLast ? 'text-accent-primary' : undefined}>{item}</span>
          </span>
        );
      })}
    </nav>
  );
}
