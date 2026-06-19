'use client';

import { use } from 'react';

import { Workshop2ArticleCoreWayfinding } from './workshop2-article-core-wayfinding';
import { Workshop2ArticleWorkspace } from '@/components/brand/production/Workshop2ArticleWorkspace';
import { Workshop2BackendStatusBanner } from '@/components/brand/production/Workshop2BackendStatusBanner';
import { Workshop2FloorToolkitBridge } from '@/components/brand/production/Workshop2FloorToolkitBridge';
import { Workshop2SeriesOrderHandoffCard } from '@/components/brand/production/Workshop2SeriesOrderHandoffCard';
import { Button } from '@/components/ui/button';
import { useWorkshop2LocalState } from '@/app/brand/production/workshop2/workshop2-local-state-provider';

/** Wave Y/Z + investor demo: PG article workspace + floor toolkit + handoff. */
export default function Workshop2ArticlePage({
  params,
}: {
  params: Promise<{ collectionId: string; articleId: string }>;
}) {
  const { collectionId, articleId } = use(params);
  const state = useWorkshop2LocalState();

  return (
    <div
      className="workshop2-article-workspace-page space-y-4 pb-20"
      data-testid="workshop2-workspace-backend-banner"
    >
      <Workshop2ArticleCoreWayfinding collectionId={collectionId} articleId={articleId} />
      {state.storageStaleBanner ? (
        <div
          className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2.5 text-[12px] text-amber-950"
          role="status"
        >
          <span>Данные обновлены в другой вкладке.</span>
          <Button
            type="button"
            size="sm"
            className="h-8 text-[11px]"
            onClick={state.reloadInventoryAfterExternalChange}
          >
            Обновить
          </Button>
        </div>
      ) : null}
      <Workshop2BackendStatusBanner />
      <Workshop2FloorToolkitBridge
        routeCollectionId={collectionId}
        routeArticleLineId={articleId}
        startCollapsed
      />
      <Workshop2ArticleWorkspace
        collectionId={collectionId}
        articleId={articleId}
        createdByLabel={state.createdByLabel}
        activeCollections={state.activeCollections}
        archivedCollections={state.archivedCollections}
        getArticlePipelineProgress={state.getArticlePipelineProgress}
        onPatchWorkshop2ArticleLine={state.onPatchWorkshop2ArticleLine}
        articlePickerLines={state.articlePickerLines}
        onCommitWorkshop2Article={state.onCommitWorkshop2Article}
      />
      <Workshop2SeriesOrderHandoffCard />
    </div>
  );
}
