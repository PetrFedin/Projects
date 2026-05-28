'use client';

import { useMemo } from 'react';
import type { Workshop2DossierAttributeCardContextProps } from '@/components/brand/production/workshop2-phase1-dossier-panel-attribute-card';

/** Стабильный объект контекста для `Workshop2DossierAttributeCard` (как прежний `useMemo` в панели). */
export function useWorkshop2Phase1DossierAttrCardContext(
  p: Workshop2DossierAttributeCardContextProps
): Workshop2DossierAttributeCardContextProps {
  return useMemo(
    () => ({
      activeSection: p.activeSection,
      currentLeaf: p.currentLeaf,
      dossier: p.dossier,
      setDossier: p.setDossier,
      setDossierInternal: p.setDossierInternal,
      collectionId: p.collectionId,
      articleId: p.articleId,
      techPackSessionBlobById: p.techPackSessionBlobById,
      setTechPackSessionBlobById: p.setTechPackSessionBlobById,
      skuDraft: p.skuDraft,
      allowMultiHandbook: p.allowMultiHandbook,
      onSetHandbookParameters: p.onSetHandbookParameters,
      onFreeTextSide: p.onFreeTextSide,
      patchColor: p.patchColor,
      isPhase1: p.isPhase1,
      tzMinimalHideDeferCommentUi: p.tzMinimalHideDeferCommentUi,
      tzWriteDisabled: p.tzWriteDisabled,
      deferredAttrIds: p.deferredAttrIds,
      toggleDeferAttribute: p.toggleDeferAttribute,
      attrCommentsById: p.attrCommentsById,
      openAttrComments: p.openAttrComments,
      sketchVisualCatalogHighlightSet: p.sketchVisualCatalogHighlightSet,
      attributeIdsLinkedOnSketch: p.attributeIdsLinkedOnSketch,
      logTechPackZipLine: p.logTechPackZipLine,
      appendTzPulse: p.appendTzPulse,
      updatedByLabel: p.updatedByLabel,
    }),
    [
      p.activeSection,
      p.currentLeaf,
      p.dossier,
      p.setDossier,
      p.setDossierInternal,
      p.collectionId,
      p.articleId,
      p.techPackSessionBlobById,
      p.setTechPackSessionBlobById,
      p.skuDraft,
      p.allowMultiHandbook,
      p.onSetHandbookParameters,
      p.onFreeTextSide,
      p.patchColor,
      p.isPhase1,
      p.tzMinimalHideDeferCommentUi,
      p.tzWriteDisabled,
      p.deferredAttrIds,
      p.toggleDeferAttribute,
      p.attrCommentsById,
      p.openAttrComments,
      p.sketchVisualCatalogHighlightSet,
      p.attributeIdsLinkedOnSketch,
      p.logTechPackZipLine,
      p.appendTzPulse,
      p.updatedByLabel,
    ]
  );
}
