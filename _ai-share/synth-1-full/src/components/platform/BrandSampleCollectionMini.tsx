'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import type { PlatformCoreDemoContext } from '@/lib/platform-core-hub-matrix';
import { getPlatformCoreCollectionLabel } from '@/lib/platform-core-hub-matrix';
import { usePillarSnapshot } from '@/hooks/use-pillar-snapshot';
import { pickSampleCollectionStatus } from '@/lib/platform-core-pillar-snapshot.types';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { BrandCentricStyleImportPanel } from '@/components/integrations/BrandCentricStyleImportPanel';
import { BrandCentricMediaImportPanel } from '@/components/integrations/BrandCentricMediaImportPanel';
import { BrandLinesheetGenPanel } from '@/components/integrations/BrandLinesheetGenPanel';
import { useWorkshop2PublishedArticleCount } from '@/hooks/use-workshop2-published-article-count';
import { PlatformCorePublishedCountSyncBadge } from '@/components/platform/PlatformCorePublishedCountSyncBadge';
import { FileText } from 'lucide-react';
import { BrandScCabinetGoldenPathStrip } from '@/components/brand/sample/BrandScCabinetGoldenPathStrip';
import { BrandScCabinetRetailPeerStrip } from '@/components/platform/BrandScCabinetRetailPeerStrip';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';
import { PillarInsightHeader } from '@/components/platform/PillarInsightPrimitives';
import { PlatformCorePillarInsightSkeleton } from '@/components/platform/PlatformCorePillarInsightSkeleton';

/** Бренд · sample_collection — hub-гаджет. */
export function BrandSampleCollectionMini({
  demo,
  compact = false,
}: {
  demo: PlatformCoreDemoContext;
  compact?: boolean;
}) {
  const { collectionId, demoArticleId } = demo;
  const [linesheetReloadNonce, setLinesheetReloadNonce] = useState(0);
  const coreMode = isPlatformCoreMode();

  const { snapshot, loading, error } = usePillarSnapshot({
    collectionId,
    pillarId: 'sample_collection',
    roleId: 'brand',
  });

  const status = pickSampleCollectionStatus(snapshot);
  const loadState = loading ? 'loading' : error || !status ? 'error' : 'ready';
  const { count: livePublishedCount, loading: liveCountLoading } =
    useWorkshop2PublishedArticleCount(collectionId);

  return (
    <div
      className={hubGadget.root}
      data-testid="brand-sc-cabinet-panel"
      data-audit-legacy="brand-sample-collection-mini"
    >
      {!compact || coreMode ? (
        <>
          <BrandScCabinetGoldenPathStrip collectionId={collectionId} />
          {coreMode ? <BrandScCabinetRetailPeerStrip collectionId={collectionId} /> : null}
        </>
      ) : null}
      <div className={hubGadget.card}>
        <div className={hubGadget.cardBody}>
          {compact && loadState === 'loading' ? (
            <PlatformCorePillarInsightSkeleton testId="brand-sc-cabinet-loading" />
          ) : (
            <>
              {compact ? (
                <PillarInsightHeader
                  icon={FileText}
                  title="Образец → коллекция"
                  subtitle="Публикация артикулов и лайншит для магазинов."
                />
              ) : null}
              {!compact && loadState === 'loading' ? (
                <p
                  className={hubGadget.muted}
                  data-testid="brand-sc-cabinet-loading"
                  data-audit-legacy="brand-sample-collection-mini-loading"
                >
                  Загрузка…
                </p>
              ) : loadState === 'error' ? (
                <p
                  className={hubGadget.muted}
                  data-testid="brand-sc-cabinet-error"
                  data-audit-legacy="brand-sample-collection-mini-error"
                >
                  Статус недоступен.
                </p>
              ) : (
                <div
                  className={hubGadget.statRow}
                  data-testid="brand-sc-cabinet-published-badge"
                  data-audit-legacy="brand-sample-collection-published-badge"
                >
                  <span className={hubGadget.stat}>
                    <strong>{status?.publishedCount ?? 0}</strong> арт. ·{' '}
                    {getPlatformCoreCollectionLabel(collectionId)}
                  </span>
                  <PlatformCorePublishedCountSyncBadge
                    liveCount={livePublishedCount}
                    referenceCount={status?.publishedCount ?? null}
                    loading={liveCountLoading}
                    testId="brand-sc-cabinet-published-sync"
                    compact
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {!coreMode ? (
        <div
          className="border-border-subtle flex flex-col gap-1.5 border-t pt-2"
          data-testid="brand-sc-upstream-strip"
        >
          <BrandCentricStyleImportPanel
            collectionId={collectionId}
            articleId={demoArticleId}
            compact
          />
          <BrandCentricMediaImportPanel
            collectionId={collectionId}
            articleId={demoArticleId}
            compact
            onImportSuccess={() => setLinesheetReloadNonce((n) => n + 1)}
          />
          <BrandLinesheetGenPanel
            collectionId={collectionId}
            compact
            reloadNonce={linesheetReloadNonce}
          />
        </div>
      ) : null}
    </div>
  );
}
