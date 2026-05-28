'use client';

import { TabsList } from '@/components/ui/tabs';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { ProductionPageContentTabsListSegmentGovernance } from '@/app/brand/production/production-page-content-tabs-list-segment-governance';
import { ProductionPageContentTabsListSegmentOperations } from '@/app/brand/production/production-page-content-tabs-list-segment-operations';
import { ProductionPageContentTabsListSegmentPlanning } from '@/app/brand/production/production-page-content-tabs-list-segment-planning';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabsList({ cn }: { cn: CnFn }) {
  return (
    <TabsList
      className={cn(
        cabinetSurface.tabsList,
        'no-scrollbar min-h-12 flex-wrap justify-start gap-0 overflow-x-auto'
      )}
    >
      <ProductionPageContentTabsListSegmentPlanning cn={cn} />
      <ProductionPageContentTabsListSegmentOperations cn={cn} />
      <ProductionPageContentTabsListSegmentGovernance cn={cn} />
    </TabsList>
  );
}
