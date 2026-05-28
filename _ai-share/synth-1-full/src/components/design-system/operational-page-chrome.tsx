'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { operationalLayoutContract } from '@/lib/ui/operational-layout-contract';

export function OperationalPageChrome({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('min-h-0', className)}>{children}</div>;
}

export type OperationalPageHeaderProps = {
  title: string;
  /** Иконка или маркер слева от заголовка (операционный список). */
  leading?: ReactNode;
  /** Одна короткая строка под заголовком (без длинных пояснений). */
  meta?: ReactNode;
  /** Подпись справа: число строк / счётчик — в духе JOOR «total». */
  countLabel?: string;
  /** «Обновлено …» — мелким, `tabular-nums`. */
  asOf?: string;
  actions?: ReactNode;
  className?: string;
};

/**
 * Шапка operational-экрана: 56–64px по вертикали, заголовок ~22px / semibold, справа счётчик и действия.
 * См. `src/design/OPERATIONAL_SCREEN_SPEC.md`.
 */
export function OperationalPageHeader({
  title,
  leading,
  meta,
  countLabel,
  asOf,
  actions,
  className,
}: OperationalPageHeaderProps) {
  return (
    <header
      className={cn(
        'border-border-default/80 flex min-h-14 flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-2.5">
        {leading ? <div className="text-text-primary mt-0.5 shrink-0">{leading}</div> : null}
        <div className="min-w-0">
          <h1
            className={cn(
              operationalLayoutContract.pageTitle,
              'text-xl leading-tight sm:text-[22px]'
            )}
          >
            {title}
          </h1>
          {meta ? (
            <div className="text-text-secondary mt-1 text-xs leading-snug">{meta}</div>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end">
        {countLabel ? (
          <span className="text-text-secondary text-sm font-medium tabular-nums">{countLabel}</span>
        ) : null}
        {asOf ? (
          <span className="text-text-muted hidden text-xs tabular-nums sm:inline">{asOf}</span>
        ) : null}
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
