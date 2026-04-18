'use client';

import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

export type BreadcrumbsNavProps = {
  items: BreadcrumbItem[];
  className?: string;
};

/**
 * Хлебные крошки для экранов Brand OS (registry shell): компактный ряд над заголовком.
 */
export function BreadcrumbsNav({ items, className }: BreadcrumbsNavProps) {
  return (
    <Breadcrumb
      items={items}
      className={cn('text-text-secondary text-[11px] leading-tight', className)}
    />
  );
}
