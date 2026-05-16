'use client';

import { useMemo } from 'react';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import { workshop2PolicySuppressesAttribute } from '@/lib/production/workshop2-attribute-policy';
import { getWorkshopTzSectionForAttribute as getSectionForAttr } from '@/lib/production/workshop2-tz-section-readiness';
import type { Workshop2DossierSectionRowsExtra } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-rows';

export type UseWorkshop2SampleIntakeCatalogRowsInput = {
  isPhase1: boolean;
  isPhase2: boolean;
  isPhase3: boolean;
  rowsToShow: ResolvedPhase1AttributeRow[];
  rowsToShowPhase2: ResolvedPhase1AttributeRow[];
  rowsToShowPhase3: ResolvedPhase1AttributeRow[];
  baseRows: ResolvedPhase1AttributeRow[];
  baseRowsPhase2: ResolvedPhase1AttributeRow[];
  baseRowsPhase3: ResolvedPhase1AttributeRow[];
  currentLeaf: HandbookCategoryLeaf;
  selectedAudienceId: string;
};

/** Каталог атрибутов секции sample_intake для вкладки «Задание». */
export function useWorkshop2SampleIntakeCatalogRows(
  input: UseWorkshop2SampleIntakeCatalogRowsInput
): ResolvedPhase1AttributeRow[] {
  const {
    isPhase1,
    isPhase2,
    isPhase3,
    rowsToShow,
    rowsToShowPhase2,
    rowsToShowPhase3,
    baseRows,
    baseRowsPhase2,
    baseRowsPhase3,
    currentLeaf,
    selectedAudienceId,
  } = input;

  return useMemo(() => {
    const catalogPhase = isPhase1 ? 1 : isPhase2 ? 2 : 3;
    const candidates: ResolvedPhase1AttributeRow[] = isPhase1
      ? [...rowsToShow, ...baseRows]
      : isPhase2
        ? [...rowsToShowPhase2, ...baseRows, ...baseRowsPhase2]
        : [...rowsToShowPhase3, ...baseRows, ...baseRowsPhase3];
    const seen = new Set<string>();
    const out: ResolvedPhase1AttributeRow[] = [];
    for (const row of candidates) {
      const id = row.attribute.attributeId;
      if (seen.has(id)) continue;
      if (getSectionForAttr(id, row.group?.groupId) !== 'sample_intake') continue;
      if (
        workshop2PolicySuppressesAttribute(id, {
          audienceId: selectedAudienceId,
          leafId: currentLeaf.leafId,
          l1Name: currentLeaf.l1Name,
          l2Name: currentLeaf.l2Name,
          l3Name: currentLeaf.l3Name,
          phase: catalogPhase,
          source: 'ui',
        })
      ) {
        continue;
      }
      seen.add(id);
      out.push(row);
    }
    return out;
  }, [
    baseRows,
    baseRowsPhase2,
    baseRowsPhase3,
    currentLeaf.leafId,
    currentLeaf.l1Name,
    currentLeaf.l2Name,
    currentLeaf.l3Name,
    isPhase1,
    isPhase2,
    isPhase3,
    rowsToShow,
    rowsToShowPhase2,
    rowsToShowPhase3,
    selectedAudienceId,
  ]);
}

export function useWorkshop2SampleIntakeCatalogExtras(
  extraRows: Workshop2DossierSectionRowsExtra[],
  isPhase1: boolean
): Workshop2DossierSectionRowsExtra[] {
  return useMemo(
    () =>
      isPhase1
        ? extraRows.filter(
            ({ attribute }) =>
              getSectionForAttr(attribute.attributeId, attribute.groupId) === 'sample_intake'
          )
        : [],
    [extraRows, isPhase1]
  );
}
