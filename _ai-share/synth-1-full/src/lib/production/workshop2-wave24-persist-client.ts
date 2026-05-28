/**
 * Wave 24: единый PUT досье + localStorage + cross-tab audit.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { saveWorkshop2DossierToApi } from '@/lib/production/workshop2-api-client';
import { workshop2DossierHonestyFieldsFromApi } from '@/lib/production/workshop2-dossier-store-mode';
import { setWorkshop2Phase1Dossier } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  auditWorkshop2Wave24Persist,
  type Workshop2Wave24PersistField,
} from '@/lib/production/workshop2-wave24-cross-tab-audit';

export type Workshop2Wave24PersistResult = {
  ok: boolean;
  dossier: Workshop2DossierPhase1;
  reason?: string;
  storeMode?: string;
  pgPrimary?: boolean;
  filePersistOnly?: boolean;
  messageRu?: string;
};

export async function putWorkshop2Wave24DossierPatch(input: {
  collectionId: string;
  articleId: string;
  base: Workshop2DossierPhase1;
  apply: (dossier: Workshop2DossierPhase1) => Workshop2DossierPhase1;
  field: Workshop2Wave24PersistField;
  updatedByLabel: string;
  meta?: Record<string, unknown>;
}): Promise<Workshop2Wave24PersistResult> {
  const stamped: Workshop2DossierPhase1 = {
    ...input.apply(input.base),
    updatedAt: new Date().toISOString(),
    updatedBy: input.updatedByLabel.slice(0, 120),
  };
  setWorkshop2Phase1Dossier(input.collectionId, input.articleId, stamped);
  const api = await saveWorkshop2DossierToApi({
    collectionId: input.collectionId,
    articleId: input.articleId,
    dossier: stamped,
  });
  const persistedAt = stamped.updatedAt;
  auditWorkshop2Wave24Persist({
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
      ...workshop2DossierHonestyFieldsFromApi({ ok: false, reason: api.reason }),
    };
  }
  return {
    ok: true,
    dossier: stamped,
    ...workshop2DossierHonestyFieldsFromApi({
      ok: true,
      storeMode: api.data.storeMode,
      messageRu: api.data.messageRu,
    }),
  };
}
