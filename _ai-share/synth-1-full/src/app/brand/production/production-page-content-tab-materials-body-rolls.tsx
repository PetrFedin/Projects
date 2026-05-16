'use client';

import { FabricLabTests } from '@/components/brand/FabricLabTests';
import { SupplierCollabHub } from '@/components/brand/supplier-collab-hub';
import { ProductionPageContentTabMaterialsBodyRollsFabricCard } from '@/app/brand/production/production-page-content-tab-materials-body-rolls-fabric-card';
import {
  ProductionPageContentTabMaterialsBodyRollsSfcOps,
  type MaterialsBodyRollsSfcOperation,
} from '@/app/brand/production/production-page-content-tab-materials-body-rolls-sfc-ops';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabMaterialsBodyRolls({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const {
    selectedId,
    handleAddMaterial,
    filteredMaterials,
    sfcOperations,
    handleToggleSfcConfirmation,
  } = px;

  const fullOps = (sfcOperations || []) as MaterialsBodyRollsSfcOperation[];
  const filteredOps = fullOps.filter((op) => !selectedId || op.collection === selectedId);

  return (
    <>
      <ProductionPageContentTabMaterialsBodyRollsFabricCard
        filteredMaterials={filteredMaterials || []}
        onAddMaterial={handleAddMaterial}
      />
      <FabricLabTests />
      <SupplierCollabHub />
      <ProductionPageContentTabMaterialsBodyRollsSfcOps
        filteredOps={filteredOps}
        fullOps={fullOps}
        cn={cn}
        onToggleConfirmation={handleToggleSfcConfirmation}
      />
    </>
  );
}
