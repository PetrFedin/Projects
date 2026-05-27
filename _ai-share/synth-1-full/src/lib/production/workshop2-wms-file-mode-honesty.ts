/**
 * Wave Q — честные сообщения internal WMS reserve в file-store / memory режиме.
 */
import type { Workshop2InternalWmsMirror } from '@/lib/production/workshop2-internal-wms';
import {
  isWorkshop2FilePersistStoreMode,
  isWorkshop2PgPrimaryStoreMode,
  type Workshop2DossierStoreMode,
} from '@/lib/production/workshop2-dossier-store-mode';

export type Workshop2WmsFileModeHonesty = {
  pgPrimary: boolean;
  filePersistOnly: boolean;
  storeMode: Workshop2DossierStoreMode | 'unknown';
  wmsSyncStatus: Workshop2InternalWmsMirror['wmsSyncStatus'] | 'disabled';
  messageRu: string;
};

export function buildWorkshop2WmsFileModeHonesty(input: {
  storeMode: Workshop2DossierStoreMode | string;
  mirror?: Workshop2InternalWmsMirror | null;
  internalWmsEnabled: boolean;
  reserveOk: boolean;
}): Workshop2WmsFileModeHonesty {
  const pgPrimary = isWorkshop2PgPrimaryStoreMode(input.storeMode);
  const filePersistOnly = isWorkshop2FilePersistStoreMode(input.storeMode);

  if (!input.internalWmsEnabled) {
    return {
      pgPrimary,
      filePersistOnly,
      storeMode:
        pgPrimary || filePersistOnly ? (input.storeMode as Workshop2DossierStoreMode) : 'unknown',
      wmsSyncStatus: 'disabled',
      messageRu:
        'Internal WMS недоступен — задайте WORKSHOP2_INTERNAL_WMS=true (503 fail-closed без PG).',
    };
  }

  const wmsSyncStatus = input.mirror?.wmsSyncStatus ?? 'memory_fallback';
  let messageRu: string;
  if (wmsSyncStatus === 'internal_pg') {
    messageRu = input.reserveOk
      ? 'WMS резерв под образец — PG primary.'
      : 'WMS резерв не выполнен — проверьте остатки.';
  } else if (filePersistOnly) {
    messageRu = input.reserveOk
      ? 'WMS резерв (memory simulation, file-store dossier mirror) — PG bootstrap для live ledger.'
      : 'WMS резерв не выполнен (file-store) — синхронизируйте BOM → WMS.';
  } else {
    messageRu = input.reserveOk
      ? 'WMS резерв выполнен (memory simulation).'
      : 'WMS резерв не выполнен.';
  }

  return {
    pgPrimary,
    filePersistOnly,
    storeMode:
      pgPrimary || filePersistOnly ? (input.storeMode as Workshop2DossierStoreMode) : 'unknown',
    wmsSyncStatus,
    messageRu,
  };
}

export type Workshop2WmsReleaseFileModeHonesty = Workshop2WmsFileModeHonesty & {
  released: boolean;
};

/** Wave R — честные сообщения WMS release при movement received (intake). */
export function buildWorkshop2WmsReleaseFileModeHonesty(input: {
  storeMode: Workshop2DossierStoreMode | string;
  mirror?: Workshop2InternalWmsMirror | null;
  internalWmsEnabled: boolean;
  releaseOk: boolean;
}): Workshop2WmsReleaseFileModeHonesty {
  const base = buildWorkshop2WmsFileModeHonesty({
    storeMode: input.storeMode,
    mirror: input.mirror,
    internalWmsEnabled: input.internalWmsEnabled,
    reserveOk: input.releaseOk,
  });

  if (!input.internalWmsEnabled) {
    return {
      ...base,
      released: false,
      messageRu:
        'WMS release при received недоступен — задайте WORKSHOP2_INTERNAL_WMS=true (503 fail-closed без PG).',
    };
  }

  const wmsSyncStatus = input.mirror?.wmsSyncStatus ?? base.wmsSyncStatus;
  let messageRu: string;
  if (wmsSyncStatus === 'internal_pg') {
    messageRu = input.releaseOk
      ? 'WMS резерв снят при intake (PG primary, idempotent release).'
      : 'WMS release не выполнен — проверьте резерв под образец.';
  } else if (base.filePersistOnly) {
    messageRu = input.releaseOk
      ? 'WMS release (memory simulation, file-store) — PG bootstrap для live ledger.'
      : 'WMS release не выполнен (file-store) — сначала reserve-sample.';
  } else {
    messageRu = input.releaseOk
      ? 'WMS release выполнен (memory simulation).'
      : 'WMS release не выполнен.';
  }

  return {
    ...base,
    wmsSyncStatus,
    messageRu,
    released: input.releaseOk,
  };
}
