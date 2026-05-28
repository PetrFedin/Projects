'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { getAttributeById } from '@/lib/production/attribute-catalog';
import {
  pruneSampleSizeScaleForLeaf,
  syncBagTypeAssignmentForBagsLeaf,
  syncSampleBaseSizePartsForLeaf,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-leaf-catalog-sync-reducers';

/**
 * Синхронизация полей досье с выбранным листом справочника (размеры, сумки/bag-type).
 * Три эффекта — прежний порядок и семантика зависимостей.
 */
export function useWorkshop2Phase1DossierLeafCatalogSyncEffects(p: {
  tzWriteDisabled: boolean;
  currentLeaf: HandbookCategoryLeaf;
  setDossierInternal: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
}) {
  const { tzWriteDisabled, currentLeaf, setDossierInternal } = p;

  useEffect(() => {
    if (tzWriteDisabled) return;
    setDossierInternal((prev) => pruneSampleSizeScaleForLeaf(prev, currentLeaf));
  }, [currentLeaf.leafId, tzWriteDisabled]);

  useEffect(() => {
    if (tzWriteDisabled) return;
    setDossierInternal((prev) => syncSampleBaseSizePartsForLeaf(prev, currentLeaf));
  }, [currentLeaf.leafId, tzWriteDisabled]);

  useEffect(() => {
    if (tzWriteDisabled) return;
    if (currentLeaf.l1Name !== 'Сумки') return;
    if (!getAttributeById('bag-type')) return;
    setDossierInternal((prev) => syncBagTypeAssignmentForBagsLeaf(prev, currentLeaf));
  }, [
    currentLeaf.leafId,
    currentLeaf.l1Name,
    currentLeaf.l2Name,
    currentLeaf.l3Name,
    tzWriteDisabled,
  ]);
}
