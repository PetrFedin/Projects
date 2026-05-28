/**
 * Wave Q — честный статус BOM↔supply sync при file-store persist (без fake PG ACK).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  isWorkshop2FilePersistStoreMode,
  isWorkshop2PgPrimaryStoreMode,
  type Workshop2DossierStoreMode,
} from '@/lib/production/workshop2-dossier-store-mode';

export type Workshop2SupplyBomSyncHonesty = {
  pgPrimary: boolean;
  filePersistOnly: boolean;
  storeMode: Workshop2DossierStoreMode | 'unknown';
  supplyBomSyncAt: string | null;
  bomResyncNeeded: boolean;
  messageRu: string;
};

export function buildWorkshop2SupplyBomSyncHonesty(input: {
  dossier: Workshop2DossierPhase1;
  storeMode: Workshop2DossierStoreMode | string;
  supplyBomSyncAt?: string | null;
}): Workshop2SupplyBomSyncHonesty {
  const pgPrimary = isWorkshop2PgPrimaryStoreMode(input.storeMode);
  const filePersistOnly = isWorkshop2FilePersistStoreMode(input.storeMode);
  const supplyBomSyncAt =
    input.supplyBomSyncAt?.trim() ||
    input.dossier.supplyBundleMirror?.supplyBomSyncAt?.trim() ||
    null;
  const bomTouchedAt =
    input.dossier.updatedAt?.trim() || input.dossier.bomNodesMirror?.mirroredAt?.trim() || null;
  const bomResyncNeeded = Boolean(
    supplyBomSyncAt &&
    bomTouchedAt &&
    new Date(bomTouchedAt).getTime() > new Date(supplyBomSyncAt).getTime()
  );

  let messageRu: string;
  if (!supplyBomSyncAt) {
    messageRu = filePersistOnly
      ? 'Снабжение не синхронизировано с BOM — выполните «Синхр. из BOM» (file-store persist).'
      : 'Снабжение не синхронизировано с BOM — выполните «Синхр. из BOM».';
  } else if (bomResyncNeeded) {
    messageRu = filePersistOnly
      ? `BOM изменён после ${supplyBomSyncAt} — повторите sync (file-store, PG off).`
      : `BOM изменён после ${supplyBomSyncAt} — повторите sync supply ← BOM.`;
  } else {
    messageRu = filePersistOnly
      ? `Supply ← BOM синхронизирован ${supplyBomSyncAt} (file-store mirror).`
      : `Supply ← BOM синхронизирован ${supplyBomSyncAt}.`;
  }

  return {
    pgPrimary,
    filePersistOnly,
    storeMode:
      pgPrimary || filePersistOnly ? (input.storeMode as Workshop2DossierStoreMode) : 'unknown',
    supplyBomSyncAt,
    bomResyncNeeded,
    messageRu,
  };
}
