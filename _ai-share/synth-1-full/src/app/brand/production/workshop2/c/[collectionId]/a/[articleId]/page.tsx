'use client';

import { useParams } from 'next/navigation';
import { Workshop2ArticleWorkspace } from '@/components/brand/production/Workshop2ArticleWorkspace';
import { Button } from '@/components/ui/button';
import { useWorkshop2LocalState } from '@/app/brand/production/workshop2/workshop2-local-state-provider';

export default function Workshop2ArticlePage() {
  const params = useParams();
  const collectionId = decodeURIComponent(String(params.collectionId ?? ''));
  const articleId = decodeURIComponent(String(params.articleId ?? ''));
  const ctx = useWorkshop2LocalState();

  return (
    <div className="space-y-4 pb-20">
      {ctx.storageStaleBanner ? (
        <div
          className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2.5 text-[12px] text-amber-950"
          role="status"
        >
          <span>Данные обновлены в другой вкладке.</span>
          <Button
            type="button"
            size="sm"
            className="h-8 text-[11px]"
            onClick={ctx.reloadInventoryAfterExternalChange}
          >
            Обновить
          </Button>
        </div>
      ) : null}
      <Workshop2ArticleWorkspace
        collectionId={collectionId}
        articleId={articleId}
        createdByLabel={ctx.createdByLabel}
        activeCollections={ctx.activeCollections}
        archivedCollections={ctx.archivedCollections}
        getArticlePipelineProgress={ctx.getArticlePipelineProgress}
        onPatchWorkshop2ArticleLine={ctx.onPatchWorkshop2ArticleLine}
      />
    </div>
  );
}
