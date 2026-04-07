'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

/**
 * EmptyStateB2B — JOOR-style пустое состояние.
 * STYLE_GUIDE: иконка, заголовок, описание, кнопка.
 */
export function EmptyStateB2B({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/30',
        className
      )}
    >
      <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-slate-100 text-slate-400 mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {description && (
        <p className="text-xs text-slate-500 mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
