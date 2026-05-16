'use client';

import { ProductionPageContentTabBudget } from '@/app/brand/production/production-page-content-tab-budget';
import { ProductionPageContentTabCompliance } from '@/app/brand/production/production-page-content-tab-compliance';
import { ProductionPageContentTabCosting } from '@/app/brand/production/production-page-content-tab-costing';
import { ProductionPageContentTabExecution } from '@/app/brand/production/production-page-content-tab-execution';
import { ProductionPageContentTabFinance } from '@/app/brand/production/production-page-content-tab-finance';
import { ProductionPageContentTabLabeling } from '@/app/brand/production/production-page-content-tab-labeling';
import { ProductionPageContentTabLogistics } from '@/app/brand/production/production-page-content-tab-logistics';
import { ProductionPageContentTabMaterials } from '@/app/brand/production/production-page-content-tab-materials';
import { ProductionPageContentTabWarehouse } from '@/app/brand/production/production-page-content-tab-warehouse';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

/** Материалы, калькуляция, исполнение, комплаенс, логистика, склад, маркировка, бюджет, финансы. */
export function ProductionPageContentTabPanelsBlockB({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  return (
    <>
      <ProductionPageContentTabMaterials p={p} cn={cn} />
      <ProductionPageContentTabCosting p={p} />
      <ProductionPageContentTabExecution p={p} cn={cn} />
      <ProductionPageContentTabCompliance p={p} cn={cn} />
      <ProductionPageContentTabLogistics p={p} cn={cn} />
      <ProductionPageContentTabWarehouse p={p} />
      <ProductionPageContentTabLabeling p={p} />
      <ProductionPageContentTabBudget p={p} cn={cn} />
      <ProductionPageContentTabFinance p={p} cn={cn} />
    </>
  );
}
