'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

/** Сегмент крошек: строка или `{ label, href }` для кликабельного пункта (кроме последнего). */
export type BreadcrumbItem = string | { label: string; href?: string };

type CabinetBreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

function normalizeItems(items: BreadcrumbItem[]): { label: string; href?: string }[] {
  return items
    .map((item) => (typeof item === 'string' ? { label: item } : item))
    .filter((item) => item.label?.trim());
}

export function CabinetBreadcrumbs({ items, className }: CabinetBreadcrumbsProps) {
  const segments = normalizeItems(items);
  if (segments.length === 0) return null;

  return (
    <nav
      aria-label="Путь раздела"
      className={
        className ??
        'text-text-muted flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest'
      }
    >
      {segments.map((item, index) => {
        const isLast = index === segments.length - 1;
        const showLink = Boolean(item.href) && !isLast;
        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
            {index > 0 ? <ChevronRight className="h-2.5 w-2.5 opacity-50" aria-hidden /> : null}
            {showLink ? (
              <Link
                href={item.href!}
                className="text-text-muted hover:text-accent-primary transition-colors duration-150"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? 'text-accent-primary max-w-[min(100%,240px)] truncate'
                    : 'text-text-muted'
                }
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
