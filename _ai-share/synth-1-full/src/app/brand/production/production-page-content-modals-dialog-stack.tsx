'use client';

import { ProductionPageContentModalsDialogStackArchive } from '@/app/brand/production/production-page-content-modals-dialog-stack-archive';
import { ProductionPageContentModalsDialogStackTools } from '@/app/brand/production/production-page-content-modals-dialog-stack-tools';
import { ProductionPageContentModalsDialogStackWizards } from '@/app/brand/production/production-page-content-modals-dialog-stack-wizards';

export function ProductionPageContentModalsDialogStack({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { isArchiveOpen, setIsArchiveOpen, prodRole } = px;

  return (
    <>
      <ProductionPageContentModalsDialogStackWizards p={p} />
      <ProductionPageContentModalsDialogStackTools p={p} />
      <ProductionPageContentModalsDialogStackArchive
        isArchiveOpen={!!isArchiveOpen}
        setIsArchiveOpen={setIsArchiveOpen}
        prodRole={prodRole}
      />
    </>
  );
}
