import * as React from 'react';
import { cn } from '@/lib/utils';

export function PageContainer({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8', className)}
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
};

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'border-border-default/80 mb-6 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-start sm:justify-between',
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        <h1 className="text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description ? (
          <p className="text-text-secondary max-w-2xl text-sm">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
