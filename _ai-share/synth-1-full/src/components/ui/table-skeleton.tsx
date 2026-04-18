'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * TableSkeleton — JOOR-style loading: строки таблицы.
 */
export function TableSkeleton({
  rows = 5,
  cols = 4,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div className={cn('border-border-default overflow-hidden rounded-xl border', className)}>
      <div className="divide-border-subtle divide-y">
        {/* Header */}
        <div
          className="bg-bg-surface2 grid gap-4 px-4 py-3"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((_, i) => (
            <div key={`h-${i}`} className="bg-border-subtle h-3 w-16 animate-pulse rounded" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="grid gap-4 px-4 py-3"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className={cn(
                  'bg-bg-surface2 h-4 animate-pulse rounded',
                  c === 0 ? 'w-24' : 'max-w-32'
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
