'use client';

import { ProductionPageContentTabMaterialsBodyExtra } from '@/app/brand/production/production-page-content-tab-materials-body-extra';
import { ProductionPageContentTabMaterialsBodyRequisition } from '@/app/brand/production/production-page-content-tab-materials-body-requisition';
import { ProductionPageContentTabMaterialsBodyRolls } from '@/app/brand/production/production-page-content-tab-materials-body-rolls';
import { ProductionPageContentTabMaterialsBodyViewSwitch } from '@/app/brand/production/production-page-content-tab-materials-body-view-switch';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabMaterialsBody({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { procurementView } = px;

  return (
    <>
      <ProductionPageContentTabMaterialsBodyViewSwitch p={p} cn={cn} />
      {procurementView === 'rolls' && <ProductionPageContentTabMaterialsBodyRolls p={p} cn={cn} />}
      {procurementView === 'requisition' && (
        <ProductionPageContentTabMaterialsBodyRequisition p={p} />
      )}
      <ProductionPageContentTabMaterialsBodyExtra p={p} />
    </>
  );
}
