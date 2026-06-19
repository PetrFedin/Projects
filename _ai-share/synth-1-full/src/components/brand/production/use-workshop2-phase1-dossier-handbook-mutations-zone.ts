'use client';

import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import { applyMatComposition } from '@/components/brand/production/workshop2-phase1-dossier-panel-color-mat-helpers';
import {
  applyHandbookParametersWithColorBundleSync,
  applyPassportColorPatchWithPrimarySync,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-passport-color-handbook-sync';
import { pushTzActionLog } from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-action-log';
import {
  removeAssignmentById,
  upsertCanonicalHandbookValues,
  upsertCanonicalMultiHandbookPreservingFreeSide,
  upsertCanonicalMultiHandbookPreservingHandbookSide,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-mutations';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import {
  findHandbookLeafById,
  handbookL1OptionsForAudience,
  handbookL2OptionsForAudience,
  handbookL3OptionsForAudience,
  handbookLeafIdFromL123,
  resolveWorkshop2EffectiveAudienceId,
} from '@/lib/production/category-catalog';
import type { Workshop2ArticleLinePatch } from '@/lib/production/local-collection-inventory';
import type { MatPctRow } from '@/lib/production/workshop2-material-mat-rows';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type UseWorkshop2Phase1DossierHandbookMutationsZoneInput = {
  leaves: HandbookCategoryLeaf[];
  currentLeaf: HandbookCategoryLeaf;
  effectiveAudienceId: string;
  selectedAudienceId: string;
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  onPatchArticleLine: (patch: Workshop2ArticleLinePatch) => boolean;
  updatedByLabel: string;
  articleSku: string;
  skuDraft: string;
  setSkuDraft: Dispatch<SetStateAction<string>>;
  articleName: string;
  nameDraft: string;
  setNameDraft: Dispatch<SetStateAction<string>>;
  linkedMatComposition: boolean;
};

/** Handbook assignments, catalog path selectors, SKU/name commit, mat/color patches. */
export function useWorkshop2Phase1DossierHandbookMutationsZone({
  leaves,
  currentLeaf,
  effectiveAudienceId,
  selectedAudienceId,
  dossier,
  setDossier,
  onPatchArticleLine,
  updatedByLabel,
  articleSku,
  skuDraft,
  setSkuDraft,
  articleName,
  nameDraft,
  setNameDraft,
  linkedMatComposition,
}: UseWorkshop2Phase1DossierHandbookMutationsZoneInput) {
  const onSetHandbookParameters = useCallback(
    (attributeId: string, parts: { parameterId: string; displayLabel: string }[]) => {
      setDossier((prev: Workshop2DossierPhase1) =>
        upsertCanonicalMultiHandbookPreservingFreeSide(prev, attributeId, parts)
      );
    },
    [setDossier]
  );

  const onSetHandbookParametersWithColorBundleSync = useCallback(
    (attributeId: string, parts: { parameterId: string; displayLabel: string }[]) => {
      setDossier((prev: Workshop2DossierPhase1) =>
        applyHandbookParametersWithColorBundleSync(prev, attributeId, parts, currentLeaf)
      );
    },
    [currentLeaf, setDossier]
  );

  const onFreeTextSide = useCallback(
    (attributeId: string, text: string) => {
      setDossier((prev: Workshop2DossierPhase1) =>
        upsertCanonicalMultiHandbookPreservingHandbookSide(prev, attributeId, text)
      );
    },
    [setDossier]
  );

  const removeCustom = useCallback(
    (assignmentId: string) => {
      setDossier((prev: Workshop2DossierPhase1) => removeAssignmentById(prev, assignmentId));
    },
    [setDossier]
  );

  const l1Opts = useMemo(
    () => handbookL1OptionsForAudience(leaves, effectiveAudienceId),
    [effectiveAudienceId, leaves]
  );

  const l2Opts = useMemo(
    () => handbookL2OptionsForAudience(leaves, effectiveAudienceId, currentLeaf.l1Name),
    [currentLeaf.l1Name, effectiveAudienceId, leaves]
  );

  const l3Opts = useMemo(
    () =>
      handbookL3OptionsForAudience(
        leaves,
        effectiveAudienceId,
        currentLeaf.l1Name,
        currentLeaf.l2Name
      ),
    [currentLeaf.l1Name, currentLeaf.l2Name, effectiveAudienceId, leaves]
  );

  const applyLeaf = useCallback(
    (leafId: string) => {
      const ok = onPatchArticleLine({ categoryLeafId: leafId });
      if (!ok) return;
      const path = findHandbookLeafById(leafId)?.pathLabel ?? leafId;
      setDossier((prev: Workshop2DossierPhase1) =>
        pushTzActionLog(prev, updatedByLabel, {
          type: 'dossier_edit',
          summaries: [`Путь в каталоге: ${path}`],
        })
      );
    },
    [onPatchArticleLine, setDossier, updatedByLabel]
  );

  const onAudienceSelect = useCallback(
    (audienceId: string) => {
      setDossier((prev: Workshop2DossierPhase1) => ({ ...prev, selectedAudienceId: audienceId }));
      const effective = resolveWorkshop2EffectiveAudienceId(leaves, audienceId);
      const keepCurrentPath =
        leaves.find(
          (l) =>
            l.audienceId === effective &&
            l.l1Name === currentLeaf.l1Name &&
            l.l2Name === currentLeaf.l2Name &&
            l.l3Name === currentLeaf.l3Name
        ) ?? leaves.find((l) => l.audienceId === effective);
      if (keepCurrentPath && keepCurrentPath.leafId !== currentLeaf.leafId) {
        applyLeaf(keepCurrentPath.leafId);
      }
    },
    [
      applyLeaf,
      currentLeaf.leafId,
      currentLeaf.l1Name,
      currentLeaf.l2Name,
      currentLeaf.l3Name,
      leaves,
      setDossier,
    ]
  );

  const onL1Select = useCallback(
    (l1: string) => {
      const matchAudience = resolveWorkshop2EffectiveAudienceId(leaves, selectedAudienceId);
      const first = leaves.find((l) => l.audienceId === matchAudience && l.l1Name === l1);
      if (first) applyLeaf(first.leafId);
    },
    [applyLeaf, leaves, selectedAudienceId]
  );

  const onL2Select = useCallback(
    (l2: string) => {
      const matchAudience = resolveWorkshop2EffectiveAudienceId(leaves, selectedAudienceId);
      const first = leaves.find(
        (l) => l.audienceId === matchAudience && l.l1Name === currentLeaf.l1Name && l.l2Name === l2
      );
      if (first) applyLeaf(first.leafId);
    },
    [applyLeaf, currentLeaf.l1Name, leaves, selectedAudienceId]
  );

  const onL3Select = useCallback(
    (l3: string) => {
      const id = handbookLeafIdFromL123(
        leaves,
        resolveWorkshop2EffectiveAudienceId(leaves, selectedAudienceId),
        currentLeaf.l1Name,
        currentLeaf.l2Name,
        l3
      );
      if (id) applyLeaf(id);
    },
    [applyLeaf, currentLeaf.l1Name, currentLeaf.l2Name, leaves, selectedAudienceId]
  );

  const commitSku = useCallback(() => {
    const next = skuDraft.trim();
    if (!next || next === articleSku) return;
    const ok = onPatchArticleLine({ sku: next });
    if (!ok) {
      setSkuDraft(articleSku);
      return;
    }
    setDossier((prev: Workshop2DossierPhase1) =>
      pushTzActionLog(prev, updatedByLabel, {
        type: 'dossier_edit',
        summaries: [`SKU артикула: ${next}`],
      })
    );
  }, [articleSku, onPatchArticleLine, setDossier, setSkuDraft, skuDraft, updatedByLabel]);

  const commitName = useCallback(() => {
    const next = nameDraft.trim();
    if (next === articleName.trim()) return;
    const ok = onPatchArticleLine({ name: next });
    if (!ok) {
      setNameDraft(articleName);
      return;
    }
    setDossier((prev: Workshop2DossierPhase1) =>
      pushTzActionLog(prev, updatedByLabel, {
        type: 'dossier_edit',
        summaries: [`Название артикула: ${next.slice(0, 120)}${next.length > 120 ? '…' : ''}`],
      })
    );
  }, [articleName, nameDraft, onPatchArticleLine, setDossier, setNameDraft, updatedByLabel]);

  const applyMatRows = useCallback(
    (rows: MatPctRow[]) => {
      setDossier((prev: Workshop2DossierPhase1) =>
        applyMatComposition(prev, rows, linkedMatComposition)
      );
    },
    [linkedMatComposition, setDossier]
  );

  const applyMatSoloParts = useCallback(
    (parts: { parameterId: string; displayLabel: string }[]) => {
      setDossier((prev: Workshop2DossierPhase1) =>
        upsertCanonicalHandbookValues(prev, 'mat', parts)
      );
    },
    [setDossier]
  );

  const patchColor = useCallback(
    (u: { handbook?: { parameterId: string; displayLabel: string } | null; freeText?: string }) => {
      setDossier((prev: Workshop2DossierPhase1) =>
        applyPassportColorPatchWithPrimarySync(prev, u, currentLeaf)
      );
    },
    [currentLeaf, setDossier]
  );

  return {
    onSetHandbookParameters,
    onSetHandbookParametersWithColorBundleSync,
    onFreeTextSide,
    removeCustom,
    l1Opts,
    l2Opts,
    l3Opts,
    onAudienceSelect,
    onL1Select,
    onL2Select,
    onL3Select,
    commitSku,
    commitName,
    applyMatRows,
    applyMatSoloParts,
    patchColor,
  };
}
