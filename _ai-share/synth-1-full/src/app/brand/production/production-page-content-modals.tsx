'use client';

import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getProductionLinks } from '@/lib/data/entity-links';
import { ProductionPageContentModalsRejectSample } from '@/app/brand/production/production-page-content-modals-reject-sample';
import { ProductionPageContentModalsDialogStack } from '@/app/brand/production/production-page-content-modals-dialog-stack';

export function ProductionPageContentModals({ p }: { p: Record<string, unknown> }) {
  return (
    <>
      <ProductionPageContentModalsRejectSample p={p} />
      <ProductionPageContentModalsDialogStack p={p} />
      <RelatedModulesBlock links={getProductionLinks()} className="mt-6" />
    </>
  );
}
