'use client';

import { useCallback, useMemo, type RefObject } from 'react';
import { buildWorkshop2SketchPinLinkAudit } from '@/components/brand/production/workshop2-phase1-dossier-panel-sketch-pin-link-audit';
import type { CategorySketchAnnotatorHandle } from '@/components/brand/production/CategorySketchAnnotator';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2DossierViewProfile } from '@/lib/production/workshop2-dossier-view-infrastructure';
import { normalizeSketchSheets } from '@/lib/production/workshop2-sketch-sheets';

/** Счётчики меток по листу, аудит связей пинов, чеклист для панели «Отправка», фокус пина на мастере. */
export function useWorkshop2Phase1DossierSketchPinReadiness(input: {
  leafId: string;
  categorySketchAnnotations: Workshop2DossierPhase1['categorySketchAnnotations'];
  sketchSheets: Workshop2DossierPhase1['sketchSheets'];
  subcategorySketchSlots: Workshop2DossierPhase1['subcategorySketchSlots'];
  dossierViewProfile: Workshop2DossierViewProfile;
  showVisualSketchLinkFieldsNav: boolean;
  jumpToSketchLineRefs: () => void;
  sketchMasterAnnotatorRef: RefObject<CategorySketchAnnotatorHandle | null>;
}) {
  const {
    leafId,
    categorySketchAnnotations,
    sketchSheets,
    subcategorySketchSlots,
    dossierViewProfile,
    showVisualSketchLinkFieldsNav,
    jumpToSketchLineRefs,
    sketchMasterAnnotatorRef,
  } = input;

  const sketchWorkspaceStats = useMemo(() => {
    const masterPins = (categorySketchAnnotations ?? []).filter((a) => a.categoryLeafId === leafId).length;
    const sh = normalizeSketchSheets(sketchSheets);
    const sheetCount = sh.length;
    const sheetPins = sh.reduce(
      (acc, s) => acc + s.annotations.filter((a) => a.categoryLeafId === leafId).length,
      0
    );
    const sheetsWithImage = sh.filter((s) => Boolean(s.imageDataUrl)).length;
    const slots = subcategorySketchSlots ?? [];
    const sublevelPins = slots.reduce(
      (acc, s) => acc + s.annotations.filter((a) => a.categoryLeafId === leafId).length,
      0
    );
    const sketchLeafPinTotal = masterPins + sheetPins + sublevelPins;
    return {
      masterPins,
      sheetCount,
      sheetPins,
      sketchLeafPinTotal,
      sheetsWithImage,
      sublevelPins,
    };
  }, [leafId, categorySketchAnnotations, sketchSheets, subcategorySketchSlots]);

  const sketchPinLinkAudit = useMemo(
    () =>
      buildWorkshop2SketchPinLinkAudit({
        leafId,
        dossier: {
          categorySketchAnnotations,
          sketchSheets,
          subcategorySketchSlots,
        },
        showVisualSketchLinkFieldsNav,
        dossierViewProfile,
      }),
    [
      leafId,
      categorySketchAnnotations,
      sketchSheets,
      subcategorySketchSlots,
      dossierViewProfile,
      showVisualSketchLinkFieldsNav,
    ]
  );

  const factorySendSketchPinReadiness = useMemo(() => {
    const total = sketchWorkspaceStats.sketchLeafPinTotal;
    const open = sketchPinLinkAudit.length;
    return {
      total,
      open,
      showChecklistRow: showVisualSketchLinkFieldsNav && total > 0,
    };
  }, [sketchPinLinkAudit, sketchWorkspaceStats.sketchLeafPinTotal, showVisualSketchLinkFieldsNav]);

  const jumpSketchFocusPin = useCallback(
    (annotationId: string) => {
      jumpToSketchLineRefs();
      window.setTimeout(() => {
        sketchMasterAnnotatorRef.current?.focusPin(annotationId);
      }, 420);
    },
    [jumpToSketchLineRefs]
  );

  return {
    sketchWorkspaceStats,
    sketchPinLinkAudit,
    factorySendSketchPinReadiness,
    jumpSketchFocusPin,
  };
}
