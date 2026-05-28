'use client';

import { ProductionPageContentTabLossesBodyFilters } from '@/app/brand/production/production-page-content-tab-losses-body-filters';
import { ProductionPageContentTabLossesBodyRegistry } from '@/app/brand/production/production-page-content-tab-losses-body-registry';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabLossesBody({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  return (
    <>
      <ProductionPageContentTabLossesBodyFilters p={p} cn={cn} />
      <ProductionPageContentTabLossesBodyRegistry p={p} />
    </>
  );
}
