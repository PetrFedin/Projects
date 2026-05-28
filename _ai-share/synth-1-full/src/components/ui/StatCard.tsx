import React from 'react';
import { Card } from './card';
import { cn } from '../../lib/cn';

export function StatCard({
  label,
  value,
  hint,
  trend,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: { value: string; tone: 'up' | 'down' | 'neutral' };
}) {
  const trendClass =
    trend?.tone === 'up'
      ? 'text-state-success bg-[rgba(22,163,74,0.10)]'
      : trend?.tone === 'down'
        ? 'text-state-error bg-[rgba(220,38,38,0.10)]'
        : 'text-text-secondary bg-bg-surface2';

  return (
    <Card className="p-3">
      <div className="text-text-muted text-xs">{label}</div>
      <div className="text-text-primary mt-2 text-sm font-semibold tabular-nums">{value}</div>
      <div className="mt-3 flex items-center gap-2">
        {trend && (
          <span className={cn('rounded-full px-2 py-1 text-xs', trendClass)}>{trend.value}</span>
        )}
        {hint && <span className="text-text-secondary text-xs">{hint}</span>}
      </div>
    </Card>
  );
}
