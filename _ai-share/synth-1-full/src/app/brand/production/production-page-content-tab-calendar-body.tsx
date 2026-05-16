'use client';

import { ProductionPageContentTabCalendarBodyEvents } from '@/app/brand/production/production-page-content-tab-calendar-body-events';
import { ProductionPageContentTabCalendarBodyStages } from '@/app/brand/production/production-page-content-tab-calendar-body-stages';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabCalendarBody({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  return (
    <div className="space-y-4">
      <ProductionPageContentTabCalendarBodyStages p={p} cn={cn} />
      <ProductionPageContentTabCalendarBodyEvents p={p} />
    </div>
  );
}
