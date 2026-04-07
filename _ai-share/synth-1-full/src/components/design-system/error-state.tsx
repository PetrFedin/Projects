import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export type ErrorStateProps = {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
};

export function ErrorState({ title, description, className, children }: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50/50 px-6 py-10 text-center',
        className
      )}
      role="alert"
    >
      <AlertCircle className="mb-3 h-10 w-10 text-rose-600" aria-hidden />
      <p className="text-sm font-semibold text-rose-900">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-xs text-rose-800/90">{description}</p> : null}
      {children ? <div className="mt-4 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </div>
  );
}
