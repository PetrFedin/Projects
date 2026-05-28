'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ProductionPageContentTabLossesBodyRegistryHeader } from '@/app/brand/production/production-page-content-tab-losses-body-registry-header';
import { ProductionPageContentTabLossesBodyRegistryTable } from '@/app/brand/production/production-page-content-tab-losses-body-registry-table';

export function ProductionPageContentTabLossesBodyRegistry({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const {
    lossTypeFilter,
    lossCategoryFilter,
    handleAddLoss,
    filteredLosses,
    toggleCollectionSelection,
    setActiveTab,
  } = px;

  const rows = (filteredLosses || []).filter(
    (l: { type?: string; category?: string }) =>
      (!lossTypeFilter || lossTypeFilter === 'all' || l.type === lossTypeFilter) &&
      (!lossCategoryFilter || lossCategoryFilter === 'all' || l.category === lossCategoryFilter)
  );

  return (
    <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
      <div className="h-1 w-full bg-gradient-to-r from-rose-500 to-amber-500" />
      <ProductionPageContentTabLossesBodyRegistryHeader onAddLoss={handleAddLoss} />
      <CardContent className="pt-0">
        <ProductionPageContentTabLossesBodyRegistryTable
          rows={rows}
          toggleCollectionSelection={toggleCollectionSelection}
          setActiveTab={setActiveTab}
        />
      </CardContent>
    </Card>
  );
}
