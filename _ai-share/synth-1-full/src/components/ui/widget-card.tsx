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
        'overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm',
        'transition-all duration-200 hover:border-slate-300 hover:shadow-md',
        className
      )}
    >
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
