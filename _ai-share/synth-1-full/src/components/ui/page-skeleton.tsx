'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * PageSkeleton — JOOR-style loading: header + grid карточек.
 */
export function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-start gap-4">
<<<<<<< HEAD
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
=======
        <div className="bg-border-subtle h-10 w-10 shrink-0 animate-pulse rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="bg-border-subtle h-7 w-48 animate-pulse rounded" />
          <div className="bg-bg-surface2 h-4 w-64 animate-pulse rounded" />
>>>>>>> recover/cabinet-wip-from-stash
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
<<<<<<< HEAD
          <div key={i} className="space-y-3 rounded-xl border border-slate-200 p-5">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-8 w-16 animate-pulse rounded bg-slate-100" />
=======
          <div key={i} className="border-border-default space-y-3 rounded-xl border p-5">
            <div className="bg-border-subtle h-4 w-24 animate-pulse rounded" />
            <div className="bg-bg-surface2 h-8 w-16 animate-pulse rounded" />
>>>>>>> recover/cabinet-wip-from-stash
          </div>
        ))}
      </div>
    </div>
  );
}
