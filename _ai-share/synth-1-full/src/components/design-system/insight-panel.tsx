import * as React from 'react';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

export type InsightPanelProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

/** Короткий insight под графиком или KPI (enterprise, без декора). */
export function InsightPanel({ title = 'Insight', children, className }: InsightPanelProps) {
  return (
    <div
      className={cn(
        'flex gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs text-slate-700',
        className
      )}
    >
      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600/90" aria-hidden />
      <div className="min-w-0 space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{title}</p>
        <div className="leading-snug">{children}</div>
      </div>
    </div>
  );
}
