'use client';

import { useEffect, type Dispatch, type MutableRefObject, type SetStateAction } from 'react';
import type { HandbookCheckSnapshot } from '@/components/brand/production/workshop2-phase1-dossier-panel-handbook-check-snapshot';
import {
  emptyWorkshop2DossierPhase1,
  getWorkshop2Phase1Dossier,
  setWorkshop2Phase1Dossier,
  withWorkshop2PassportMoqDefaultApplied,
} from '@/lib/production/workshop2-phase1-dossier-storage';
import { isSs27MenCoatFullTzDemoArticle } from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/** Загрузка фазы 1 из localStorage, нормализация MOQ/демо, сброс снимка справочника. */
export function useWorkshop2Phase1DossierHydrateFromStorage(p: {
  collectionId: string;
  articleId: string;
  articleSku: string;
  dossierHydrateKey: number;
  tzWriteDisabled: boolean;
  setDossierInternal: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  lastPersistedDossierRef: MutableRefObject<Workshop2DossierPhase1 | null>;
  setHandbookCheckSnapshot: Dispatch<SetStateAction<HandbookCheckSnapshot | null>>;
}) {
  const {
    collectionId,
    articleId,
    articleSku,
    dossierHydrateKey,
    tzWriteDisabled,
    setDossierInternal,
    lastPersistedDossierRef,
    setHandbookCheckSnapshot,
  } = p;

  useEffect(() => {
    const raw = getWorkshop2Phase1Dossier(collectionId, articleId) ?? emptyWorkshop2DossierPhase1();
    let normalized = withWorkshop2PassportMoqDefaultApplied(raw);
    if (
      isSs27MenCoatFullTzDemoArticle(collectionId, { id: articleId, sku: articleSku }) &&
      normalized.passportProductionBrief?.moqTargetMaxPieces === 120
    ) {
      normalized = {
        ...normalized,
        passportProductionBrief: {
          ...(normalized.passportProductionBrief ?? {}),
          moqTargetMaxPieces: 1,
        },
      };
    }
    const moqPatched =
      normalized.passportProductionBrief?.moqTargetMaxPieces !==
      raw.passportProductionBrief?.moqTargetMaxPieces;
    if (moqPatched && !tzWriteDisabled) {
      setWorkshop2Phase1Dossier(collectionId, articleId, normalized);
    }
    setDossierInternal(normalized);
    lastPersistedDossierRef.current = normalized;
    setHandbookCheckSnapshot(null);
  }, [articleSku, collectionId, articleId, dossierHydrateKey, tzWriteDisabled]);
}
