'use client';

import { ProductionPageContentTabSamplesBodyFilters } from '@/app/brand/production/production-page-content-tab-samples-body-filters';
import { ProductionPageContentTabSamplesBodyTable } from '@/app/brand/production/production-page-content-tab-samples-body-table';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabSamplesBody({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  return (
    <>
      <ProductionPageContentTabSamplesBodyFilters p={p} cn={cn} />
      <ProductionPageContentTabSamplesBodyTable p={p} cn={cn} />
    </>
  );
}
