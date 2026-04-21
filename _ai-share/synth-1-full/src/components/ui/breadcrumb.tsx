'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

function crumbClass(withTitle?: string): string {
  return cn(
    withTitle ? 'min-w-0 max-w-[min(100%,20rem)] truncate' : undefined
  );
}

export type BreadcrumbItem = {
  label: string;
  href?: string;
  /** Подсказка при наведении (например полное название при усечённом label). */
  title?: string;
};

/**
 * Breadcrumb — навигационная цепочка для Brand/Shop.
 */
export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm', className)}>
      {items.map((item, i) => (
        <span key={i} className="flex min-w-0 max-w-full items-center gap-1">
          {i > 0 && <ChevronRight className="text-text-muted h-3.5 w-3.5 shrink-0" />}
          {item.href ? (
            <Link
              href={item.href}
              title={item.title}
              className={cn(
                'text-text-secondary hover:text-text-primary transition-colors',
                crumbClass(item.title)
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span
              title={item.title}
              className={cn(
                'text-text-primary font-medium',
                crumbClass(item.title)
              )}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
