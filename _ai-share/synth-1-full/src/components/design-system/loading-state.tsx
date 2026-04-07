import * as React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export type LoadingStateProps = {
  rows?: number;
  className?: string;
};

export function LoadingState({ rows = 4, className }: LoadingStateProps) {
  return (
    <div className={cn('space-y-3 p-4', className)} aria-busy aria-label="Загрузка">
      <Skeleton className="h-8 w-1/3 max-w-xs rounded-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-lg" />
      ))}
    </div>
  );
}
