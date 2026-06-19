'use client';

import { useMemo } from 'react';
import {
  defaultSizeScaleIdForLeaf,
  getAttributeById,
  resolveEffectiveParametersForLeaf,
} from '@/lib/production/attribute-catalog';
import { getWorkshopDimensionLabels } from '@/lib/production/workshop-size-handbook';
import { buildBomLinePickOptions } from '@/lib/production/workshop2-collection-dossier-analytics';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import { buildWorkshop2VisualGateItems } from '@/lib/production/workshop2-visual-section-warnings';
import { workshop2SketchTechnologistGaps } from '@/lib/production/workshop2-sketch-technologist-gaps';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

type AttributeRow = {
  attribute: { attributeId: string; name: string };
};

export type UseWorkshop2Phase1DossierMatCatalogDerivedZoneInput = {
  currentLeaf: HandbookCategoryLeaf;
  dossier: Workshop2DossierPhase1;
  isPhase1: boolean;
  leafPhase1Ids: readonly string[];
  baseRows: AttributeRow[];
};

/** Mat/BOM/sketch derived maps, gates, scale labels (sectionBodies). */
export function useWorkshop2Phase1DossierMatCatalogDerivedZone({
  currentLeaf,
  dossier,
  isPhase1,
  leafPhase1Ids,
  baseRows,
}: UseWorkshop2Phase1DossierMatCatalogDerivedZoneInput) {
  const matAttrDef = getAttributeById('mat');

  const matAttrForLeaf = useMemo(() => {
    if (!matAttrDef) return undefined;
    return {
      ...matAttrDef,
      parameters: resolveEffectiveParametersForLeaf(matAttrDef, currentLeaf),
    };
  }, [matAttrDef, currentLeaf]);

  const matLabelById = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of matAttrDef?.parameters ?? []) m.set(p.parameterId, p.label);
    return m;
  }, [matAttrDef]);

  const bomLinePickOptions = useMemo(() => buildBomLinePickOptions(dossier), [dossier]);

  const matRequiredUnset = useMemo(() => {
    if (!isPhase1) return false;
    if (!leafPhase1Ids.includes('mat') || !matAttrDef?.requiredForPhase1) return false;
    const matAssign = dossier.assignments.find(
      (x) => x.kind === 'canonical' && x.attributeId === 'mat'
    );
    const hbCount =
      matAssign?.values.filter((v) => v.valueSource === 'handbook_parameter').length ?? 0;
    return hbCount === 0;
  }, [dossier.assignments, isPhase1, leafPhase1Ids, matAttrDef?.requiredForPhase1]);

  const sketchAttributeOptions = useMemo(
    () =>
      baseRows
        .map((row) => ({ id: row.attribute.attributeId, label: row.attribute.name }))
        .sort((a, b) => a.label.localeCompare(b.label, 'ru')),
    [baseRows]
  );

  const sketchTechGaps = useMemo(
    () => workshop2SketchTechnologistGaps(dossier, currentLeaf.leafId),
    [dossier, currentLeaf.leafId]
  );

  const visualGateOpenCountGlobal = useMemo(
    () => buildWorkshop2VisualGateItems(dossier, currentLeaf).length,
    [dossier, currentLeaf]
  );

  const expectedScaleId = defaultSizeScaleIdForLeaf(currentLeaf);
  const dimensionLabels = getWorkshopDimensionLabels(currentLeaf, dossier.isUnisex);

  return {
    matAttrDef,
    matAttrForLeaf,
    matLabelById,
    bomLinePickOptions,
    matRequiredUnset,
    sketchAttributeOptions,
    sketchTechGaps,
    visualGateOpenCountGlobal,
    expectedScaleId,
    dimensionLabels,
  };
}
