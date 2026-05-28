'use client';

import { AssortmentPlm } from '@/components/brand/assortment-plm';
import { PatternVersionControl } from '@/components/brand/PatternVersionControl';
import { TechPackBuilder } from '@/components/brand/tech-pack-builder';
import { VariantMatrixEditor } from '@/components/brand/VariantMatrixEditor';

export function ProductionPageContentTabPlmBody({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const {
    plmView,
    setPlmView,
    selectedId,
    displaySkus,
    filteredSkus,
    setIsSkuWizardOpen,
    selectedSkuId,
    setSelectedSkuId,
  } = px;

  if (plmView === 'techpack') {
    return <TechPackBuilder collectionId={selectedId} />;
  }
  if (plmView === 'variants') {
    return <VariantMatrixEditor collectionId={selectedId} />;
  }
  if (plmView === 'pim') {
    return <PatternVersionControl collectionId={selectedId} />;
  }
  return (
    <AssortmentPlm
      collectionId={selectedId}
      skus={displaySkus || filteredSkus || []}
      onAddSku={() => setIsSkuWizardOpen?.(true)}
      onSkuClick={(skuId) => setSelectedSkuId?.(selectedSkuId === skuId ? null : skuId)}
      onPlmViewSwitch={(v) => setPlmView?.(v)}
      onBomHistory={(skuId) => {
        setPlmView?.('techpack');
        setSelectedSkuId?.(skuId);
      }}
    />
  );
}
