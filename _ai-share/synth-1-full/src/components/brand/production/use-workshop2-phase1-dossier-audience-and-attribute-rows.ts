'use client';

import { useMemo } from 'react';
import {
  buildWorkshop2Phase1ExtraAttributeRows,
  filterWorkshop2CatalogRowsForPhaseUi,
  inferWorkshop2Phase1ExtraCanonicalAttributeIds,
  WORKSHOP2_ATTRIBUTE_GROUP_LABEL_BY_ID,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-attribute-rows-build';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import {
  resolveWorkshop2AudienceDisplayLabel,
  resolveWorkshop2EffectiveAudienceId,
} from '@/lib/production/category-catalog';
import {
  resolveAttributeIdsForLeaf,
  resolvePhase1AttributeRows,
  resolvePhase2OnlyAttributeRows,
  resolvePhase3OnlyAttributeRows,
} from '@/lib/production/attribute-catalog';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

type AudienceOption = { id: string; name: string };

/** Аудитория справочника, строки каталога по фазам и extra/custom rows для панели ТЗ. */
export function useWorkshop2Phase1DossierAudienceAndAttributeRows(input: {
  dossierSelectedAudienceId: Workshop2DossierPhase1['selectedAudienceId'];
  dossierAssignments: Workshop2DossierPhase1['assignments'];
  audiences: AudienceOption[];
  leaves: HandbookCategoryLeaf[];
  currentLeaf: HandbookCategoryLeaf;
}) {
  const { dossierSelectedAudienceId, dossierAssignments, audiences, leaves, currentLeaf } = input;

  const selectedAudienceId =
    dossierSelectedAudienceId ??
    (audiences.some((a) => a.id === currentLeaf.audienceId)
      ? currentLeaf.audienceId
      : (audiences[0]?.id ?? currentLeaf.audienceId));

  const selectedAudienceLabel = useMemo(
    () =>
      resolveWorkshop2AudienceDisplayLabel(dossierSelectedAudienceId, currentLeaf, audiences) ||
      audiences.find((a) => a.id === selectedAudienceId)?.name?.trim() ||
      selectedAudienceId ||
      '',
    [audiences, currentLeaf, dossierSelectedAudienceId, selectedAudienceId]
  );

  const passportCategoryCaption = useMemo(() => {
    const aud = selectedAudienceLabel.trim() || '—';
    const path = currentLeaf.pathLabel.trim() || '—';
    return `${aud} · ${path}`;
  }, [currentLeaf.pathLabel, selectedAudienceLabel]);

  const effectiveAudienceId = useMemo(
    () => resolveWorkshop2EffectiveAudienceId(leaves, selectedAudienceId),
    [leaves, selectedAudienceId]
  );

  const baseRows = useMemo(
    () => resolvePhase1AttributeRows(currentLeaf.leafId),
    [currentLeaf.leafId]
  );

  const leafPhase1Ids = useMemo(
    () => resolveAttributeIdsForLeaf(currentLeaf.leafId, 1),
    [currentLeaf.leafId]
  );
  const leafPhase2Ids = useMemo(
    () => resolveAttributeIdsForLeaf(currentLeaf.leafId, 2),
    [currentLeaf.leafId]
  );
  const leafPhase3Ids = useMemo(
    () => resolveAttributeIdsForLeaf(currentLeaf.leafId, 3),
    [currentLeaf.leafId]
  );
  const baseRowsPhase2 = useMemo(
    () => resolvePhase2OnlyAttributeRows(currentLeaf.leafId),
    [currentLeaf.leafId]
  );
  const baseRowsPhase3 = useMemo(
    () => resolvePhase3OnlyAttributeRows(currentLeaf.leafId),
    [currentLeaf.leafId]
  );

  const linkedMatComposition =
    leafPhase1Ids.includes('mat') && leafPhase1Ids.includes('composition');
  const linkedMatCompositionPhase2 =
    leafPhase2Ids.includes('mat') && leafPhase2Ids.includes('composition');
  const linkedMatCompositionPhase3 =
    leafPhase3Ids.includes('mat') && leafPhase3Ids.includes('composition');

  const leafRowPolicy = useMemo(
    () => ({
      audienceId: selectedAudienceId,
      leafId: currentLeaf.leafId,
      l1Name: currentLeaf.l1Name,
      l2Name: currentLeaf.l2Name,
      l3Name: currentLeaf.l3Name,
    }),
    [
      selectedAudienceId,
      currentLeaf.leafId,
      currentLeaf.l1Name,
      currentLeaf.l2Name,
      currentLeaf.l3Name,
    ]
  );

  const rowsToShow = useMemo(
    () =>
      filterWorkshop2CatalogRowsForPhaseUi(baseRows, 1, leafRowPolicy, linkedMatComposition),
    [baseRows, leafRowPolicy, linkedMatComposition]
  );

  const rowsToShowPhase2 = useMemo(
    () =>
      filterWorkshop2CatalogRowsForPhaseUi(
        baseRowsPhase2,
        2,
        leafRowPolicy,
        linkedMatCompositionPhase2
      ),
    [baseRowsPhase2, leafRowPolicy, linkedMatCompositionPhase2]
  );

  const rowsToShowPhase3 = useMemo(
    () =>
      filterWorkshop2CatalogRowsForPhaseUi(
        baseRowsPhase3,
        3,
        leafRowPolicy,
        linkedMatCompositionPhase3
      ),
    [baseRowsPhase3, leafRowPolicy, linkedMatCompositionPhase3]
  );

  const baseAttributeIdSet = useMemo(
    () => new Set(baseRows.map((r) => r.attribute.attributeId)),
    [baseRows]
  );

  const extraIds = useMemo(
    () => inferWorkshop2Phase1ExtraCanonicalAttributeIds(dossierAssignments, baseAttributeIdSet),
    [dossierAssignments, baseAttributeIdSet]
  );

  const extraRows = useMemo(
    () =>
      buildWorkshop2Phase1ExtraAttributeRows({
        extraIds,
        baseAttributeIdSet,
        groupById: WORKSHOP2_ATTRIBUTE_GROUP_LABEL_BY_ID,
        leaf: leafRowPolicy,
        linkedMatComposition,
      }),
    [baseAttributeIdSet, extraIds, leafRowPolicy, linkedMatComposition]
  );

  const customAssignments = useMemo(
    () => dossierAssignments.filter((a) => a.kind === 'custom_proposed'),
    [dossierAssignments]
  );

  return {
    selectedAudienceId,
    selectedAudienceLabel,
    passportCategoryCaption,
    effectiveAudienceId,
    baseRows,
    leafPhase1Ids,
    leafPhase2Ids,
    leafPhase3Ids,
    baseRowsPhase2,
    baseRowsPhase3,
    linkedMatComposition,
    linkedMatCompositionPhase2,
    linkedMatCompositionPhase3,
    leafRowPolicy,
    rowsToShow,
    rowsToShowPhase2,
    rowsToShowPhase3,
    baseAttributeIdSet,
    extraIds,
    extraRows,
    customAssignments,
  };
}
