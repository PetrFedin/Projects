/**
 * Wave 25: PUT досье + localStorage + cross-tab audit.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { saveWorkshop2DossierToApi } from '@/lib/production/workshop2-api-client';
import { evaluateWorkshop2DossierSaveHonesty } from '@/lib/production/workshop2-dossier-store-mode';
import { setWorkshop2Phase1Dossier } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  auditWorkshop2Wave25Persist,
  type Workshop2Wave25PersistField,
} from '@/lib/production/workshop2-wave25-cross-tab-audit';

export type Workshop2Wave25PersistResult = {
  ok: boolean;
  dossier: Workshop2DossierPhase1;
  reason?: string;
  storeMode?: string;
  pgPrimary?: boolean;
  filePersistOnly?: boolean;
  messageRu?: string;
};

export async function putWorkshop2Wave25DossierPatch(input: {
  collectionId: string;
  articleId: string;
  base: Workshop2DossierPhase1;
  apply: (dossier: Workshop2DossierPhase1) => Workshop2DossierPhase1;
  field: Workshop2Wave25PersistField;
  updatedByLabel: string;
  meta?: Record<string, unknown>;
}): Promise<Workshop2Wave25PersistResult> {
  const stamped: Workshop2DossierPhase1 = {
    ...input.apply(input.base),
    updatedAt: new Date().toISOString(),
    updatedBy: input.updatedByLabel.slice(0, 120),
  };
  const api = await saveWorkshop2DossierToApi({
    collectionId: input.collectionId,
    articleId: input.articleId,
    dossier: stamped,
  });
  const honesty = evaluateWorkshop2DossierSaveHonesty({
    apiOk: api.ok,
    storeMode: api.ok ? api.data.storeMode : undefined,
    reason: api.ok ? undefined : api.reason,
  });
  setWorkshop2Phase1Dossier(input.collectionId, input.articleId, stamped);
  const persistedAt = stamped.updatedAt ?? new Date().toISOString();
  auditWorkshop2Wave25Persist({
    collectionId: input.collectionId,
    articleId: input.articleId,
    field: input.field,
    persistedAt,
    by: input.updatedByLabel,
    meta: input.meta,
  });
  if (!api.ok) {
    return {
      ok: false,
      dossier: stamped,
      reason: api.reason,
      pgPrimary: false,
      filePersistOnly: false,
      messageRu: honesty.messageRu,
    };
  }
  return {
    ok: true,
    dossier: stamped,
    storeMode: api.data.storeMode,
    pgPrimary: honesty.pgPrimary,
    filePersistOnly: honesty.filePersistOnly,
    messageRu: api.data.messageRu ?? honesty.messageRu,
  };
}
