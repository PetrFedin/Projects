import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type MetricCardProps = {
  label: string;
  value: React.ReactNode;
  delta?: { value: string; positive?: boolean };
  icon?: React.ReactNode;
  className?: string;
};

export function MetricCard({ label, value, delta, icon, className }: MetricCardProps) {
  return (
    <Card className={cn('border-border-default shadow-sm', className)}>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
            {label}
          </span>
          {icon ? <span className="text-text-muted [&_svg]:h-4 [&_svg]:w-4">{icon}</span> : null}
        </div>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <span className="text-text-primary text-2xl font-bold tabular-nums tracking-tight">
            {value}
          </span>
          {delta ? (
            <span
              className={cn(
                'text-xs font-medium tabular-nums',
                delta.positive === false ? 'text-rose-600' : 'text-emerald-600'
              )}
            >
              {delta.value}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
