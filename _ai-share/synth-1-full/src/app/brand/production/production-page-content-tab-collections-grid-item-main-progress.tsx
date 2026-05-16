'use client';

import { Factory } from 'lucide-react';
import {
  CollectionCardStats,
  CollectionProgressMiniChart,
} from '@/components/brand/production/ProductionSectionEnhancements';
import type { CollectionGridItemMetrics } from '@/app/brand/production/production-page-content-tab-collections-grid-item-metrics';

export function ProductionPageContentTabCollectionsGridItemMainProgress({
  c,
  p,
  metrics,
}: {
  c: Record<string, unknown>;
  p: Record<string, unknown>;
  metrics: CollectionGridItemMetrics;
}) {
  const px = p as Record<string, any>;
  const { setActiveTab, toggleCollectionSelection } = px;
  const { collSkuCount, collPoCount, collSamplePending, collFactories, stageStatus } = metrics;

  return (
    <>
      <CollectionCardStats
        skuCount={collSkuCount}
        poCount={collPoCount}
        samplePending={collSamplePending}
        onNavigate={(tab) => {
          setActiveTab?.(tab);
          toggleCollectionSelection?.(c.id as string);
        }}
      />
      <div className="mt-3">
        <CollectionProgressMiniChart
          stageStatus={stageStatus}
          onStageClick={(stage) => {
            toggleCollectionSelection?.(c.id as string);
            setActiveTab?.(
              stage === 'sample' || stage === 'approval'
                ? 'samples'
                : stage === 'po' || stage === 'production'
                  ? 'orders'
                  : 'plm'
            );
          }}
        />
      </div>
      {collFactories.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab?.('factories');
            }}
            className="text-text-secondary hover:text-accent-primary flex items-center gap-0.5 text-[9px]"
          >
            <Factory className="h-3 w-3" /> {collFactories.slice(0, 2).join(', ')}
            {collFactories.length > 2 ? ` +${collFactories.length - 2}` : ''}
          </button>
        </div>
      )}
      {c.responsible && (
        <p className="text-text-muted mt-2 text-[10px] font-medium">{String(c.responsible)}</p>
      )}
    </>
  );
}
