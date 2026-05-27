/**
 * Vault: S3/local split, storage_path для handoff, prod S3 banner.
 */
import { getWorkshop2VaultS3ProdBanner } from '@/lib/production/workshop2-vault-prod-banner';
import { evaluateWorkshop2VaultPresignProdGuard } from '@/lib/production/workshop2-vault-presign-prod-guard';
import { summarizeWorkshop2VaultVirusScanCounts } from '@/lib/production/workshop2-vault-virus-scan';
import { WORKSHOP2_HANDOFF_DEFAULT_MIN_VAULT_FILES } from '@/lib/production/workshop2-handoff-readiness';

export type Workshop2VaultPanelStatus = {
  backendMode: 'server' | 'local';
  totalDocs: number;
  withStoragePath: number;
  localOnlyDocs: number;
  s3UploadBlocked: boolean;
  s3PresignGuard: 'allowed' | 'prod_blocked';
  virusScanPendingCount: number;
  virusScanFailedCount: number;
  orphanPresignCount: number;
  pgIndexedOk: boolean;
  handoffVaultOk: boolean;
  state: 'empty' | 'partial' | 'ready' | 'blocked';
  hintRu?: string;
};

export function summarizeWorkshop2VaultPanelStatus(input: {
  backendMode: 'server' | 'local';
  vaultDocuments: { storagePath?: string | null; metadata?: Record<string, unknown> | null }[];
  nodeEnv?: string;
  s3Configured?: boolean;
  minVaultFiles?: number;
  pgIndexedOk?: boolean;
}): Workshop2VaultPanelStatus {
  const minVault = input.minVaultFiles ?? WORKSHOP2_HANDOFF_DEFAULT_MIN_VAULT_FILES;
  const totalDocs = input.vaultDocuments.length;
  const withStoragePath = input.vaultDocuments.filter((d) => Boolean(d.storagePath?.trim())).length;
  const localOnlyDocs =
    input.backendMode === 'server' ? Math.max(0, totalDocs - withStoragePath) : totalDocs;

  const s3Banner = getWorkshop2VaultS3ProdBanner({
    nodeEnv: input.nodeEnv,
    s3Configured: input.s3Configured ?? true,
  });
  const s3UploadBlocked = s3Banner.show;
  const presignGuard = evaluateWorkshop2VaultPresignProdGuard({
    NODE_ENV: input.nodeEnv ?? process.env.NODE_ENV,
    ...(input.s3Configured
      ? {
          WORKSHOP2_S3_BUCKET: 'x',
          WORKSHOP2_S3_REGION: 'x',
          WORKSHOP2_S3_ACCESS_KEY_ID: 'x',
          WORKSHOP2_S3_SECRET_ACCESS_KEY: 'x',
        }
      : {}),
  });
  const virus = summarizeWorkshop2VaultVirusScanCounts(input.vaultDocuments);
  const pgIndexedOk = input.pgIndexedOk ?? input.backendMode === 'server';

  const handoffVaultOk =
    withStoragePath >= minVault &&
    virus.pending === 0 &&
    virus.failed === 0 &&
    virus.awaitingUpload === 0;

  let state: Workshop2VaultPanelStatus['state'] = 'empty';
  if (totalDocs === 0) {
    state = 'empty';
  } else if (s3UploadBlocked || presignGuard.s3PresignGuard === 'prod_blocked') {
    state = 'blocked';
  } else if (virus.pending > 0 || virus.failed > 0) {
    state = 'partial';
  } else if (input.backendMode === 'local') {
    state = 'partial';
  } else if (!handoffVaultOk || localOnlyDocs > 0) {
    state = 'partial';
  } else {
    state = 'ready';
  }

  let hintRu: string | undefined;
  if (presignGuard.s3PresignGuard === 'prod_blocked') {
    hintRu = presignGuard.messageRu;
  } else if (virus.awaitingUpload > 0) {
    hintRu = `${virus.awaitingUpload} presign без upload — завершите PUT в PG после S3.`;
  } else if (virus.pending > 0) {
    hintRu = `${virus.pending} файл(ов) ожидают virus scan (fail-closed handoff).`;
  } else if (virus.failed > 0) {
    hintRu = `${virus.failed} файл(ов) failed virus scan.`;
  } else if (s3UploadBlocked) {
    hintRu = s3Banner.messageRu;
  } else if (totalDocs === 0) {
    hintRu = `Vault пуст — для handoff нужен минимум ${minVault} файл с storage_path (S3).`;
  } else if (input.backendMode === 'local') {
    hintRu = 'Документы только в браузере — после подключения PG загрузите в S3 для handoff и ZIP.';
  } else if (localOnlyDocs > 0) {
    hintRu = `${localOnlyDocs} из ${totalDocs} без storage_path — не попадут в ZIP/handoff до повторной загрузки.`;
  } else if (!handoffVaultOk) {
    hintRu = `Для handoff: ${withStoragePath}/${minVault} файлов с storage_path в PG/S3.`;
  }

  return {
    backendMode: input.backendMode,
    totalDocs,
    withStoragePath,
    localOnlyDocs,
    s3UploadBlocked,
    s3PresignGuard: presignGuard.s3PresignGuard,
    virusScanPendingCount: virus.pending,
    virusScanFailedCount: virus.failed,
    orphanPresignCount: virus.awaitingUpload,
    pgIndexedOk,
    handoffVaultOk,
    state,
    hintRu,
  };
}
