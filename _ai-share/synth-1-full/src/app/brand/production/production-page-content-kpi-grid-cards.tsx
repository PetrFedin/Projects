'use client';

import { Card } from '@/components/ui/card';
import { KPI_STATS } from '@/app/brand/production/production-page-content-kpi-grid-cards-config';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentKpiGridCards({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { productionKpis, setActiveKpiDetail } = px;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {KPI_STATS.map((stat) => {
        const Icon = stat.icon;
        const value = productionKpis?.[stat.kpiKey];
        return (
          <Card
            key={stat.id}
            onClick={() => setActiveKpiDetail?.(stat.id)}
            className={cn(
              'hover:border-accent-primary/30 group flex cursor-pointer items-center gap-3.5 rounded-xl border bg-white p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.98]',
              stat.border
            )}
          >
            <div
              className={cn(
                'shrink-0 rounded-lg border p-2 shadow-inner transition-transform group-hover:scale-105',
                stat.bg,
                stat.color,
                stat.border
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-text-muted text-[10px] font-bold uppercase leading-none tracking-widest">
                {stat.label}
              </p>
              <p className="text-text-primary mt-1 text-lg font-black leading-none">
                {value ?? '—'}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
