'use client';

import { Tabs } from '@/components/ui/tabs';
import { cn as mergeCn } from '@/lib/utils';
import { ProductionPageSvgGrid } from '@/app/brand/production/production-page-content-chrome';
import { ProductionContextBar } from '@/components/brand/production/ProductionContextBar';
import { ProductionPageContentShellTop } from '@/app/brand/production/production-page-content-shell-top';
import { ProductionPageContentShellHeader } from '@/app/brand/production/production-page-content-shell-header';
import { ProductionPageContentPipelineStrip } from '@/app/brand/production/production-page-content-pipeline-strip';
import { ProductionPageContentKpiGrid } from '@/app/brand/production/production-page-content-kpi-grid';
import { ProductionPageContentTabsList } from '@/app/brand/production/production-page-content-tabs-list';
import { ProductionPageContentTabPanels } from '@/app/brand/production/production-page-content-tab-panels';
import { ProductionPageContentModals } from '@/app/brand/production/production-page-content-modals';
import type { ProductionPageContentProps } from '@/app/brand/production/production-page-content-props';

export type { ProductionPageContentProps } from '@/app/brand/production/production-page-content-props';

export function ProductionPageContent(props: ProductionPageContentProps) {
  const {
    cn: cnUtil,
    activeTab,
    setActiveTab,
    selectedCollectionIds,
    collections,
    filteredSkus,
    filteredProductionOrders,
    samplePendingCount,
    slaOverdueCount,
    contextBarBudgetRemainder,
    filteredLosses,
    productionDocuments,
    apiDrops,
  } = props;

  const cn = cnUtil ?? mergeCn;

  return (
    <div className="contents">
      <ProductionPageSvgGrid />
      <ProductionPageContentShellTop p={props} />

      <ProductionPageContentShellHeader p={props} cn={cn} />

      {(selectedCollectionIds?.length ?? 0) > 0 && selectedCollectionIds && (
        <ProductionContextBar
          selectedCollectionIds={selectedCollectionIds}
          collections={collections ?? []}
          skuCount={(filteredSkus ?? []).length}
          poCount={(filteredProductionOrders ?? []).length}
          samplePendingCount={samplePendingCount ?? 0}
          sampleOverdueCount={slaOverdueCount ?? 0}
          budgetRemainder={contextBarBudgetRemainder ?? 0}
          lossCount={(filteredLosses ?? []).length}
          docCount={(productionDocuments ?? []).length}
          apiDrops={apiDrops ?? []}
          onNavigate={(tab) => setActiveTab?.(tab)}
          activeTab={activeTab}
        />
      )}

      <ProductionPageContentPipelineStrip p={props} cn={cn} />

      <ProductionPageContentKpiGrid p={props} cn={cn} />

      <Tabs
        value={activeTab || 'collections'}
        onValueChange={(v) => setActiveTab?.(v)}
        className="w-full"
      >
        <ProductionPageContentTabsList cn={cn} />
        <ProductionPageContentTabPanels p={props} cn={cn} />
      </Tabs>

      <ProductionPageContentModals p={props} />
    </div>
  );
}
