'use client';

import { useMemo } from 'react';
import type { Workshop2DossierSectionRowsSharedBundle } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-rows';

/** Общий bundle для `Workshop2DossierSectionRows` — логика и зависимости как в прежнем `useMemo` панели. */
export function useWorkshop2Phase1DossierSectionRowsSharedBundle(
  o: Workshop2DossierSectionRowsSharedBundle
): Workshop2DossierSectionRowsSharedBundle {
  return useMemo(
    () => ({
      activeSection: o.activeSection,
      currentLeaf: o.currentLeaf,
      tzMinimalModeBySection: o.tzMinimalModeBySection,
      collapsedAttrGroups: o.collapsedAttrGroups,
      pinnedAttrGroups: o.pinnedAttrGroups,
      toggleAttrGroupPinned: o.toggleAttrGroupPinned,
      toggleAttrGroupCollapsed: o.toggleAttrGroupCollapsed,
      deferGroupSetAll: o.deferGroupSetAll,
      isPhase1: o.isPhase1,
      dossier: o.dossier,
      dossierAttrCardCtx: o.dossierAttrCardCtx,
      allowMultiHandbook: o.allowMultiHandbook,
      patchColor: o.patchColor,
      deferredAttrIds: o.deferredAttrIds,
      toggleDeferAttribute: o.toggleDeferAttribute,
      attrCommentsById: o.attrCommentsById,
      openAttrComments: o.openAttrComments,
      onSetHandbookParametersWithColorBundleSync: o.onSetHandbookParametersWithColorBundleSync,
      onSetHandbookParameters: o.onSetHandbookParameters,
      onFreeTextSide: o.onFreeTextSide,
      renderPhaseRow: o.renderPhaseRow,
    }),
    [
      o.activeSection,
      o.currentLeaf,
      o.tzMinimalModeBySection,
      o.collapsedAttrGroups,
      o.pinnedAttrGroups,
      o.toggleAttrGroupPinned,
      o.toggleAttrGroupCollapsed,
      o.deferGroupSetAll,
      o.isPhase1,
      o.dossier,
      o.dossierAttrCardCtx,
      o.allowMultiHandbook,
      o.patchColor,
      o.deferredAttrIds,
      o.toggleDeferAttribute,
      o.attrCommentsById,
      o.openAttrComments,
      o.onSetHandbookParametersWithColorBundleSync,
      o.onSetHandbookParameters,
      o.onFreeTextSide,
      o.renderPhaseRow,
    ]
  );
}
