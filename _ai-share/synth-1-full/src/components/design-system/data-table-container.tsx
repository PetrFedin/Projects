import * as React from 'react';
import { cn } from '@/lib/utils';

export type DataTableContainerProps = {
  toolbar?: React.ReactNode;
  filters?: React.ReactNode;
  footer?: React.ReactNode;
  /** Показать рамку вокруг таблицы */
  bordered?: boolean;
  className?: string;
  children?: React.ReactNode;
};

/** Каркас enterprise-таблицы: слоты под toolbar, фильтры, таблицу, подвал. */
export function DataTableContainer({
  toolbar,
  filters,
  footer,
  bordered = true,
  className,
  children,
}: DataTableContainerProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {toolbar ? <div className="flex flex-wrap items-center gap-2">{toolbar}</div> : null}
      {filters ? <div>{filters}</div> : null}
      <div
        className={cn(
          'overflow-x-auto rounded-xl bg-white',
          bordered && 'border-border-default border shadow-sm'
        )}
      >
        {children}
      </div>
      {footer ? <div className="text-text-secondary text-xs">{footer}</div> : null}
    </div>
  );
}
