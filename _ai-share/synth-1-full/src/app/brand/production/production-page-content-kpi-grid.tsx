'use client';

import { ProductionPageContentKpiGridCards } from '@/app/brand/production/production-page-content-kpi-grid-cards';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentKpiGrid({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  return <ProductionPageContentKpiGridCards p={p} cn={cn} />;
}
