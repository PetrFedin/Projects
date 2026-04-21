import * as React from 'react';
import { cn } from '@/lib/utils';

export function PageContainer({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1680px] px-3 py-6 sm:px-5 lg:px-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  /** Элементы в одной строке с заголовком (бейджи, подсказки). */
  titleAddon?: React.ReactNode;
};

export function PageHeader({
  title,
  description,
  actions,
  className,
  titleAddon,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-start sm:justify-between',
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          {titleAddon ? <div className="flex flex-wrap items-center gap-1.5">{titleAddon}</div> : null}
        </div>
        {description ? <p className="max-w-2xl text-sm text-slate-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
