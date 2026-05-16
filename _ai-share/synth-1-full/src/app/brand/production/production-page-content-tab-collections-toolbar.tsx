'use client';

import { ProductionPageContentTabCollectionsToolbarCreate } from '@/app/brand/production/production-page-content-tab-collections-toolbar-create';
import { ProductionPageContentTabCollectionsToolbarControls } from '@/app/brand/production/production-page-content-tab-collections-toolbar-controls';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabCollectionsToolbar({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { setIsCreatingCollection } = px;

  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <ProductionPageContentTabCollectionsToolbarCreate
        onCreateClick={() => setIsCreatingCollection?.(true)}
      />
      <ProductionPageContentTabCollectionsToolbarControls p={p} cn={cn} />
    </div>
  );
}
