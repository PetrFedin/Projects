import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const toneClass: Record<StatusTone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  info: 'border-sky-200 bg-sky-50 text-sky-900',
  neutral: 'border-slate-200 bg-white text-slate-700',
};

export type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: StatusTone;
  className?: string;
};

export function StatusBadge({ children, tone = 'neutral', className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('h-5 px-2 text-[10px] font-semibold', toneClass[tone], className)}
    >
      {children}
    </Badge>
  );
}
