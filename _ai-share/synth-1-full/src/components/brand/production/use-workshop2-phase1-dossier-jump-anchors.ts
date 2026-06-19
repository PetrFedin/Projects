'use client';

import { useCallback } from 'react';
import { W2_ARTICLE_SECTION_DOM } from '@/lib/production/workshop2-url';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import { W2_CONSTRUCTION_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-construction-dossier-anchors';
import { W2_MATERIAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-material-bom-check';
import { W2_VISUALS_SKETCH_ANCHOR_ID } from '@/lib/production/workshop2-material-bom-sketch-strip';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

type Options = {
  jumpToTzSectionAnchor: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
  onNavigateToTab?: (
    tab: 'overview' | 'tz' | 'supply' | 'fit' | 'plan' | 'release' | 'qc' | 'stock',
    opts?: { dossierSection?: DossierSection; scrollDomId?: string }
  ) => void;
  onRequestClosePulse?: () => void;
};

/** Навигация по якорям TZ / QC / материалы — вынесено из Workshop2Phase1DossierPanel. */
export function useWorkshop2Phase1DossierJumpAnchors({
  jumpToTzSectionAnchor,
  onNavigateToTab,
  onRequestClosePulse,
}: Options) {
  const jumpToMaterialMatTable = useCallback(
    () => jumpToTzSectionAnchor('material', W2_MATERIAL_SUBPAGE_ANCHORS.mat),
    [jumpToTzSectionAnchor]
  );

  const jumpToConstructionContour = useCallback(
    () => jumpToTzSectionAnchor('construction', W2_CONSTRUCTION_SUBPAGE_ANCHORS.contour),
    [jumpToTzSectionAnchor]
  );

  const jumpToSketchLineRefs = useCallback(
    () => jumpToTzSectionAnchor('construction', W2_VISUALS_SKETCH_ANCHOR_ID),
    [jumpToTzSectionAnchor]
  );

  const jumpToQcArticleSection = useCallback(() => {
    onNavigateToTab?.('qc', { scrollDomId: W2_ARTICLE_SECTION_DOM.qc });
  }, [onNavigateToTab]);

  const jumpToTzSectionAnchorFromPulse = useCallback(
    (section: Workshop2TzSignoffSectionKey, anchorId: string) => {
      onRequestClosePulse?.();
      jumpToTzSectionAnchor(section, anchorId);
    },
    [jumpToTzSectionAnchor, onRequestClosePulse]
  );

  return {
    jumpToMaterialMatTable,
    jumpToConstructionContour,
    jumpToSketchLineRefs,
    jumpToQcArticleSection,
    jumpToTzSectionAnchorFromPulse,
  };
}
