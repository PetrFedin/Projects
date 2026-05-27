'use client';

import { Card } from '@/components/ui/card';
import { computeCollectionGridItemMetrics } from '@/app/brand/production/production-page-content-tab-collections-grid-item-metrics';
import { ProductionPageContentTabCollectionsGridItemActions } from '@/app/brand/production/production-page-content-tab-collections-grid-item-actions';
import { ProductionPageContentTabCollectionsGridItemMain } from '@/app/brand/production/production-page-content-tab-collections-grid-item-main';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabCollectionsGridItem({
  c,
  p,
  cn,
}: {
  c: any;
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { toggleCollectionSelection } = px;
  const metrics = computeCollectionGridItemMetrics(px, c);

  return (
    <Card
      className={cn(
        'group cursor-pointer overflow-hidden rounded-2xl border shadow-sm transition-all duration-300',
        metrics.isSelected
          ? 'ring-accent-primary border-accent-primary/30 from-accent-primary/10 bg-gradient-to-br to-white shadow-md ring-2'
          : 'border-border-subtle hover:border-accent-primary/20 bg-white hover:shadow-lg'
      )}
      onClick={() => toggleCollectionSelection?.(c.id)}
    >
      <div className={cn('h-1.5 w-full bg-gradient-to-r', metrics.statusColor)} />
      <div className="flex flex-col gap-5 p-6">
        <ProductionPageContentTabCollectionsGridItemMain c={c} p={p} cn={cn} metrics={metrics} />
        <ProductionPageContentTabCollectionsGridItemActions c={c} p={p} />
      </div>
    </Card>
  );
}
