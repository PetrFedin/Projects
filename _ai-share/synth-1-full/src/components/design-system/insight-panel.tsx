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
        'border-border-default bg-bg-surface2/80 text-text-primary flex gap-2 rounded-lg border px-3 py-2 text-xs',
        className
      )}
    >
      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600/90" aria-hidden />
      <div className="min-w-0 space-y-0.5">
        <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wider">
          {title}
        </p>
        <div className="leading-snug">{children}</div>
      </div>
    </div>
  );
}
