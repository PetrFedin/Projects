'use client';

import { Workshop2TabContent } from '@/components/brand/production/Workshop2TabContent';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { useWorkshop2LocalState } from './workshop2-local-state-provider';

export default function ProductionWorkshop2Page() {
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
      <Workshop2TabContent
        basePath={ROUTES.brand.productionWorkshop2}
        activeCollections={ctx.activeCollections}
        archivedCollections={ctx.archivedCollections}
        metricsByCollectionId={ctx.metricsByCollectionId}
        getArticlePipelineProgress={ctx.getArticlePipelineProgress}
        getSkuFlowDoc={ctx.getSkuFlowDoc}
        onCreateCollection={ctx.onCreateCollection}
        onArchiveCollection={ctx.onArchiveCollection}
        onRestoreCollection={ctx.onRestoreCollection}
        onToggleCollectionPin={ctx.onToggleCollectionPin}
        getUserCollectionRow={ctx.getUserCollectionRow}
        getCollectionCoverDataUrl={ctx.getCollectionCoverDataUrl}
        onUpdateUserCollection={ctx.onUpdateUserCollection}
        onUpdateSs27Meta={ctx.onUpdateSs27Meta}
        articlePickerLines={ctx.articlePickerLines}
        onCommitWorkshop2Article={ctx.onCommitWorkshop2Article}
        onBulkAddWorkshop2Articles={ctx.onBulkAddWorkshop2Articles}
        onRemoveWorkshop2Article={ctx.onRemoveWorkshop2Article}
        onPatchWorkshop2ArticleLine={ctx.onPatchWorkshop2ArticleLine}
        createdByLabel={ctx.createdByLabel}
        highlightArticleId={ctx.highlightArticleId}
      />
    </div>
  );
}
