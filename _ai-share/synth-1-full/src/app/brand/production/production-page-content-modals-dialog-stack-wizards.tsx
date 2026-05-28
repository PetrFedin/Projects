'use client';

import { CollectionCreateWizard } from '@/components/brand/production/CollectionCreateWizard';
import { SkuCreateWizard } from '@/components/brand/production/SkuCreateWizard';

export function ProductionPageContentModalsDialogStackWizards({
  p,
}: {
  p: Record<string, unknown>;
}) {
  const px = p as Record<string, any>;
  const {
    isSkuWizardOpen,
    setIsSkuWizardOpen,
    isCreatingCollection,
    setIsCreatingCollection,
    selectedId,
    collections,
    handleSkuCreated,
    handleCollectionCreated,
  } = px;

  return (
    <>
      <SkuCreateWizard
        open={!!isSkuWizardOpen}
        onOpenChange={(open) => setIsSkuWizardOpen?.(open)}
        collectionId={selectedId || 'General'}
        collectionName={collections?.find((c: { id?: string }) => c.id === selectedId)?.name}
        onCreated={handleSkuCreated}
      />
      <CollectionCreateWizard
        open={!!isCreatingCollection}
        onOpenChange={(open) => setIsCreatingCollection?.(!open)}
        onCreated={handleCollectionCreated}
        existingCollections={
          collections?.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })) || []
        }
        duplicateFrom={px.duplicateFromCollection}
      />
    </>
  );
}
