import * as React from 'react';
import { cn } from '@/lib/utils';

export type FilterToolbarProps = React.HTMLAttributes<HTMLDivElement>;

/** Одна компактная строка фильтров / поиска / переключателей вида. */
export function FilterToolbar({ className, ...props }: FilterToolbarProps) {
  return (
    <div
      className={cn(
        'border-border-default bg-bg-surface2/80 flex flex-wrap items-end gap-2 rounded-xl border p-3',
        className
      )}
      {...props}
    />
  );
}
