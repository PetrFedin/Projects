import * as React from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export type SectionContainerProps = {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  divider?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function SectionContainer({
  title,
  description,
  actions,
  divider = false,
  className,
  children,
}: SectionContainerProps) {
  return (
    <section className={cn('space-y-4', className)}>
      {(title || description || actions) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            {title ? <h2 className="text-text-primary text-base font-semibold">{title}</h2> : null}
            {description ? <p className="text-text-secondary text-sm">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
        </div>
      )}
      {divider ? <Separator className="bg-border-subtle" /> : null}
      {children}
    </section>
  );
}
