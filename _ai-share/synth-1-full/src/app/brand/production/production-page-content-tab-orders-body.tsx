'use client';

import { ProductionPageContentTabOrdersBodyFilters } from '@/app/brand/production/production-page-content-tab-orders-body-filters';
import { ProductionPageContentTabOrdersBodyTable } from '@/app/brand/production/production-page-content-tab-orders-body-table';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabOrdersBody({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  return (
    <>
      <ProductionPageContentTabOrdersBodyFilters p={p} cn={cn} />
      <ProductionPageContentTabOrdersBodyTable p={p} />
    </>
  );
}
