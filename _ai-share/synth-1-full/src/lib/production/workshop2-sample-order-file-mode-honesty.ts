/**
 * Wave P — честные сообщения sample-order gate в file-store режиме (без fake PG ACK).
 */
import {
  isWorkshop2FilePersistStoreMode,
  isWorkshop2PgPrimaryStoreMode,
  type Workshop2DossierStoreMode,
} from '@/lib/production/workshop2-dossier-store-mode';

export type Workshop2SampleOrderFileModeHonesty = {
  pgPrimary: boolean;
  filePersistOnly: boolean;
  storeMode: Workshop2DossierStoreMode | 'unknown';
  gateMessageRu: string;
  successMessageRu?: string;
  /** M2: badge в dev когда данные из memory/demo, не PG. */
  demoBadgeRu?: string;
};

export function buildWorkshop2SampleOrderDemoBadgeRu(input: {
  storeMode: Workshop2DossierStoreMode | string;
  env?: NodeJS.ProcessEnv;
}): string | undefined {
  const env = input.env ?? process.env;
  if (env.NODE_ENV === 'production') return undefined;
  if (isWorkshop2PgPrimaryStoreMode(input.storeMode)) return undefined;
  if (isWorkshop2FilePersistStoreMode(input.storeMode)) {
    return 'Демо · file-store (PG off)';
  }
  return 'Демо · memory sample-order';
}

export function buildWorkshop2SampleOrderFileModeHonesty(input: {
  storeMode: Workshop2DossierStoreMode | string;
  allowed: boolean;
}): Workshop2SampleOrderFileModeHonesty {
  const pgPrimary = isWorkshop2PgPrimaryStoreMode(input.storeMode);
  const filePersistOnly = isWorkshop2FilePersistStoreMode(input.storeMode);

  const baseGate = input.allowed
    ? 'Handoff-readiness пройден — заказ образца разрешён.'
    : 'Заказ образца заблокирован до готовности передачи (handoff-readiness).';

  const fileSuffix = filePersistOnly
    ? ' Досье на файловом сервере (PG off) — WMS/inspector flush потребуют PG bootstrap.'
    : '';

  return {
    pgPrimary,
    filePersistOnly,
    storeMode:
      pgPrimary || filePersistOnly ? (input.storeMode as Workshop2DossierStoreMode) : 'unknown',
    gateMessageRu: `${baseGate}${fileSuffix}`,
    demoBadgeRu: buildWorkshop2SampleOrderDemoBadgeRu({ storeMode: input.storeMode }),
    successMessageRu: input.allowed
      ? pgPrimary
        ? 'Заказ образца создан — PG primary.'
        : filePersistOnly
          ? 'Заказ образца создан (file-store). PG bootstrap для live WMS/inspector.'
          : 'Заказ образца создан.'
      : undefined,
  };
}
