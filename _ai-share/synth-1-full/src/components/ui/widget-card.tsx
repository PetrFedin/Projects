'use client';

import React, { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * WidgetCard — JOOR-style блок с заголовком.
 * STYLE_GUIDE: Card с заголовком, описанием и контентом.
 */
export function WidgetCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'border-border-default/80 overflow-hidden rounded-xl border bg-white shadow-sm',
        'hover:border-border-default transition-all duration-200 hover:shadow-md',
        className
      )}
    >
      <div className="border-border-subtle flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-text-primary text-base font-semibold">{title}</h3>
          {description && <p className="text-text-secondary mt-0.5 text-sm">{description}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
