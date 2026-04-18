'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

/**
 * Breadcrumb — навигационная цепочка для Brand/Shop.
 */
export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm', className)}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
<<<<<<< HEAD
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />}
          {item.href ? (
            <Link
              href={item.href}
              className="text-slate-500 transition-colors hover:text-slate-900"
=======
          {i > 0 && <ChevronRight className="text-text-muted h-3.5 w-3.5 shrink-0" />}
          {item.href ? (
            <Link
              href={item.href}
              className="text-text-secondary hover:text-text-primary transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-text-primary font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
