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
    <div className={cn('rounded-xl border border-slate-200 overflow-hidden', className)}>
      <div className="divide-y divide-slate-100">
        {/* Header */}
        <div
          className="grid gap-4 px-4 py-3 bg-slate-50"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((_, i) => (
            <div key={`h-${i}`} className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
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
                className={cn('h-4 rounded bg-slate-100 animate-pulse', c === 0 ? 'w-24' : 'max-w-32')}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
