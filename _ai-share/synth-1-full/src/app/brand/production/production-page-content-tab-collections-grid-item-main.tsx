'use client';

import { ChevronRight } from 'lucide-react';
import { ProductionPageContentTabCollectionsGridItemMainHeading } from '@/app/brand/production/production-page-content-tab-collections-grid-item-main-heading';
import { ProductionPageContentTabCollectionsGridItemMainMetaBadges } from '@/app/brand/production/production-page-content-tab-collections-grid-item-main-meta-badges';
import { ProductionPageContentTabCollectionsGridItemMainProgress } from '@/app/brand/production/production-page-content-tab-collections-grid-item-main-progress';
import type { CollectionGridItemMetrics } from '@/app/brand/production/production-page-content-tab-collections-grid-item-metrics';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabCollectionsGridItemMain({
  c,
  p,
  cn,
  metrics,
}: {
  c: Record<string, unknown>;
  p: Record<string, unknown>;
  cn: CnFn;
  metrics: CollectionGridItemMetrics;
}) {
  const { isSelected } = metrics;

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <ProductionPageContentTabCollectionsGridItemMainHeading c={c} />
        <ProductionPageContentTabCollectionsGridItemMainMetaBadges c={c} cn={cn} />
        <ProductionPageContentTabCollectionsGridItemMainProgress c={c} p={p} metrics={metrics} />
      </div>
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
          isSelected
            ? 'bg-accent-primary/15 text-accent-primary'
            : 'bg-bg-surface2 text-text-secondary'
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </div>
    </div>
  );
}
