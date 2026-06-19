'use client';

import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

/** Skeleton матрицы оценки готовности пока chain-overview грузится. */
export function PlatformCoreReadinessMatrixSkeleton({ className }: Props) {
  return (
    <div
      data-testid="platform-core-readiness-matrix-skeleton"
      className={cn('border-border-subtle animate-pulse rounded-xl border bg-white p-4', className)}
      aria-hidden
    >
      <div className="bg-bg-surface2 mb-3 h-3 w-36 rounded" />
      <div className="bg-bg-surface2 mb-4 h-3 w-full max-w-md rounded" />
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="bg-bg-surface2 h-[2.5rem] rounded-lg" />
        ))}
      </div>
    </div>
  );
}
