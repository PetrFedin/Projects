'use client';

import { useMemo } from 'react';
import {
  buildMaterialBomHubModel,
  buildMaterialCategoryNotes,
} from '@/lib/production/workshop2-material-bom-check';
import { buildMaterialSketchBomStrip } from '@/lib/production/workshop2-material-bom-sketch-strip';
import type { MaterialBomExportInput } from '@/lib/production/workshop2-material-bom-export';
import { parseMatRowsFromDossier } from '@/lib/production/workshop2-material-mat-rows';
import { bomRefsUnionFromSketchSurfaces } from '@/lib/production/sketch-bom-integrity';
import { resolveMatSketchBomGapRefs } from '@/lib/production/workshop2-mat-sketch-bom-crosscheck';
import { normalizeSketchSheets } from '@/lib/production/workshop2-sketch-sheets';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type UseWorkshop2Phase1DossierMaterialBomZoneInput = {
  currentPhase: '1' | '2' | '3';
  leafPhase1Ids: readonly string[];
  leafPhase2Ids: readonly string[];
  leafPhase3Ids: readonly string[];
  matRequiredForPhase1: boolean;
  matRequiredForPhase2: boolean;
  dossier: Workshop2DossierPhase1;
  linkedMatComposition: boolean;
  linkedMatCompositionPhase2: boolean;
  linkedMatCompositionPhase3: boolean;
  matLabelById: Map<string, string>;
  sectionReadinessMaterialPct: number;
  currentLeaf: HandbookCategoryLeaf;
  skuDraft: string;
  nameDraft: string;
  articleId: string;
};

/** Material BOM hub, sketch strip, export input, sketch cross-check (sectionBodies). */
export function useWorkshop2Phase1DossierMaterialBomZone({
  currentPhase,
  leafPhase1Ids,
  leafPhase2Ids,
  leafPhase3Ids,
  matRequiredForPhase1,
  matRequiredForPhase2,
  dossier,
  linkedMatComposition,
  linkedMatCompositionPhase2,
  linkedMatCompositionPhase3,
  matLabelById,
  sectionReadinessMaterialPct,
  currentLeaf,
  skuDraft,
  nameDraft,
  articleId,
}: UseWorkshop2Phase1DossierMaterialBomZoneInput) {
  const materialBomHubModel = useMemo(() => {
    const matOnLeaf =
      currentPhase === '1'
        ? leafPhase1Ids.includes('mat')
        : currentPhase === '2'
          ? leafPhase2Ids.includes('mat')
          : leafPhase3Ids.includes('mat');
    const matRequired =
      currentPhase === '1'
        ? Boolean(matOnLeaf && matRequiredForPhase1)
        : currentPhase === '2'
          ? Boolean(matOnLeaf && matRequiredForPhase2)
          : false;
    const linkedMatForPhase =
      currentPhase === '1'
        ? linkedMatComposition
        : currentPhase === '2'
          ? linkedMatCompositionPhase2
          : linkedMatCompositionPhase3;
    const matAssign = dossier.assignments.find(
      (x) => x.kind === 'canonical' && x.attributeId === 'mat'
    );
    const hbCount =
      matAssign?.values.filter((v) => v.valueSource === 'handbook_parameter').length ?? 0;
    let compSum: number | null = null;
    if (linkedMatForPhase) {
      const rows = parseMatRowsFromDossier(dossier, matLabelById);
      compSum = rows.reduce((s, r) => s + r.pct, 0);
    }
    return buildMaterialBomHubModel({
      matRequired,
      matHandbookLineCount: hbCount,
      linkedMatComposition: linkedMatForPhase,
      compositionPctSum: compSum,
      materialSectionPct: sectionReadinessMaterialPct,
    });
  }, [
    currentPhase,
    leafPhase1Ids,
    leafPhase2Ids,
    leafPhase3Ids,
    matRequiredForPhase1,
    matRequiredForPhase2,
    dossier,
    linkedMatComposition,
    linkedMatCompositionPhase2,
    linkedMatCompositionPhase3,
    matLabelById,
    sectionReadinessMaterialPct,
  ]);

  const materialSketchBomStripModel = useMemo(
    () =>
      buildMaterialSketchBomStrip(
        currentLeaf.leafId,
        dossier.categorySketchAnnotations,
        dossier.categorySketchRevisionSnapshots
      ),
    [currentLeaf.leafId, dossier.categorySketchAnnotations, dossier.categorySketchRevisionSnapshots]
  );

  const materialBomExportInput = useMemo((): MaterialBomExportInput => {
    const matAssign = dossier.assignments.find(
      (x) => x.kind === 'canonical' && x.attributeId === 'mat'
    );
    const matLines = (matAssign?.values ?? [])
      .filter((v) => v.valueSource === 'handbook_parameter')
      .map((v) => v.displayLabel.trim())
      .filter(Boolean);
    const rows = parseMatRowsFromDossier(dossier, matLabelById);
    const linked =
      currentPhase === '1'
        ? linkedMatComposition
        : currentPhase === '2'
          ? linkedMatCompositionPhase2
          : linkedMatCompositionPhase3;
    return {
      sku: skuDraft.trim() || articleId,
      productName: nameDraft.trim() || currentLeaf.pathLabel,
      l2Name: currentLeaf.l2Name,
      tzPhase: currentPhase,
      matLines,
      composition: rows.map((r) => ({ label: r.label, pct: r.pct })),
      linkedComposition: linked,
    };
  }, [
    currentPhase,
    dossier,
    matLabelById,
    linkedMatComposition,
    linkedMatCompositionPhase2,
    linkedMatCompositionPhase3,
    skuDraft,
    articleId,
    nameDraft,
    currentLeaf.pathLabel,
    currentLeaf.l2Name,
  ]);

  const sketchBomRefsUnion = useMemo(
    () =>
      bomRefsUnionFromSketchSurfaces(
        dossier.categorySketchAnnotations,
        normalizeSketchSheets(dossier.sketchSheets),
        currentLeaf.leafId
      ),
    [currentLeaf.leafId, dossier.categorySketchAnnotations, dossier.sketchSheets]
  );

  const matSketchBomGapRefs = useMemo(
    () => resolveMatSketchBomGapRefs(dossier, sketchBomRefsUnion, materialBomExportInput.matLines),
    [dossier, sketchBomRefsUnion, materialBomExportInput.matLines]
  );

  const materialCategoryNotes = useMemo(
    () => buildMaterialCategoryNotes(currentLeaf.l2Name),
    [currentLeaf.l2Name]
  );

  return {
    materialBomHubModel,
    materialSketchBomStripModel,
    materialBomExportInput,
    sketchBomRefsUnion,
    matSketchBomGapRefs,
    materialCategoryNotes,
  };
}
