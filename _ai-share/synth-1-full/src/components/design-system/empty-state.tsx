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
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/40 px-6 py-12 text-center',
        className
      )}
    >
      <div className="mb-3 text-slate-400">
        {icon ?? <Inbox className="h-10 w-10 stroke-[1.25]" />}
      </div>
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-xs text-slate-500">{description}</p> : null}
      {children ? <div className="mt-4 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </div>
  );
}
