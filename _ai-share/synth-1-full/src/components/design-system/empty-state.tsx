import * as React from 'react';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

export type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export function EmptyState({ title, description, icon, className, children }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-border-default bg-bg-surface2/40 flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center',
        className
      )}
    >
      <div className="text-text-muted mb-3">
        {icon ?? <Inbox className="h-10 w-10 stroke-[1.25]" />}
      </div>
      <p className="text-text-primary text-sm font-semibold">{title}</p>
      {description ? (
        <p className="text-text-secondary mt-1 max-w-sm text-xs">{description}</p>
      ) : null}
      {children ? <div className="mt-4 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </div>
  );
}
