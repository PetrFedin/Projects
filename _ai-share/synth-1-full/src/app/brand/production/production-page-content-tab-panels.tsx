'use client';

import { ProductionPageContentTabPanelsBlockA } from '@/app/brand/production/production-page-content-tab-panels-block-a';
import { ProductionPageContentTabPanelsBlockB } from '@/app/brand/production/production-page-content-tab-panels-block-b';
import { ProductionPageContentTabPanelsBlockC } from '@/app/brand/production/production-page-content-tab-panels-block-c';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabPanels({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  return (
    <>
      <ProductionPageContentTabPanelsBlockA p={p} cn={cn} />
      <ProductionPageContentTabPanelsBlockB p={p} cn={cn} />
      <ProductionPageContentTabPanelsBlockC p={p} cn={cn} />
    </>
  );
}
