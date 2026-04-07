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
        <div className="h-10 w-10 rounded-xl bg-slate-200 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-7 w-48 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-64 rounded bg-slate-100 animate-pulse" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
            <div className="h-8 w-16 rounded bg-slate-100 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
