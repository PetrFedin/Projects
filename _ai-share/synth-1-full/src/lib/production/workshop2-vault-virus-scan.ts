/**
 * Wave 36 #75: virus scan hook (stub) — fail-closed handoff/export while pending.
 */
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2VaultVirusScanStatus =
  | 'not_required'
  | 'awaiting_upload'
  | 'pending'
  | 'clean'
  | 'failed';

export type Workshop2VaultDocScanInput = {
  storagePath?: string | null;
  metadata?: Record<string, unknown> | null;
};

export function readWorkshop2VaultVirusScanStatus(
  doc: Workshop2VaultDocScanInput
): Workshop2VaultVirusScanStatus {
  const meta = doc.metadata ?? {};
  const raw = String(meta.virusScanStatus ?? meta.virus_scan_status ?? '').trim();
  if (raw === 'clean' || raw === 'failed' || raw === 'pending' || raw === 'awaiting_upload') {
    return raw;
  }
  if (!doc.storagePath?.trim()) {
    return String(meta.presignIssuedAt ?? '').trim() ? 'awaiting_upload' : 'not_required';
  }
  return 'not_required';
}

export function summarizeWorkshop2VaultVirusScanCounts(docs: Workshop2VaultDocScanInput[]): {
  pending: number;
  failed: number;
  awaitingUpload: number;
  clean: number;
} {
  let pending = 0;
  let failed = 0;
  let awaitingUpload = 0;
  let clean = 0;
  for (const d of docs) {
    const s = readWorkshop2VaultVirusScanStatus(d);
    if (s === 'pending') pending += 1;
    else if (s === 'failed') failed += 1;
    else if (s === 'awaiting_upload') awaitingUpload += 1;
    else if (s === 'clean') clean += 1;
  }
  return { pending, failed, awaitingUpload, clean };
}

export type Workshop2ProcessEnvLike = Record<string, string | undefined>;

function envFlag(env: Workshop2ProcessEnvLike, key: string): boolean {
  return (
    String(env[key] ?? '')
      .trim()
      .toLowerCase() === 'true'
  );
}

/** Stub: queue scan; auto-clean in dev when WORKSHOP2_VIRUS_SCAN_STUB_AUTO_CLEAN=true. */
export async function runWorkshop2VaultVirusScanStub(input: {
  documentId: string;
  storagePath: string;
  env?: Workshop2ProcessEnvLike;
}): Promise<Workshop2VaultVirusScanStatus> {
  const env = input.env ?? process.env;
  if (envFlag(env, 'WORKSHOP2_VIRUS_SCAN_STUB_AUTO_CLEAN')) {
    return 'clean';
  }
  const scanUrl = String(env.WORKSHOP2_VIRUS_SCAN_URL ?? '').trim();
  if (scanUrl) {
    return 'pending';
  }
  if ((env.NODE_ENV ?? process.env.NODE_ENV) === 'production') {
    return 'pending';
  }
  return 'clean';
}

export function buildWorkshop2VaultVirusScanMetadataPatch(
  status: Workshop2VaultVirusScanStatus,
  existing?: Record<string, unknown>
): Record<string, unknown> {
  return {
    ...(existing ?? {}),
    virusScanStatus: status,
    virusScanAt: new Date().toISOString(),
  };
}

export function evaluateWorkshop2VaultVirusScanHandoffGate(input: {
  dossier: Workshop2DossierPhase1;
  vaultDocuments?: Workshop2VaultDocScanInput[];
}): Workshop2HandoffReadinessCheck | null {
  const mirror = input.dossier.vaultPanelMirror;
  const pending =
    mirror?.virusScanPendingCount ??
    summarizeWorkshop2VaultVirusScanCounts(
      input.vaultDocuments ?? input.dossier.vaultDocuments ?? []
    ).pending;
  const failed =
    mirror?.virusScanFailedCount ??
    summarizeWorkshop2VaultVirusScanCounts(
      input.vaultDocuments ?? input.dossier.vaultDocuments ?? []
    ).failed;
  const orphan =
    mirror?.orphanPresignCount ??
    summarizeWorkshop2VaultVirusScanCounts(
      input.vaultDocuments ?? input.dossier.vaultDocuments ?? []
    ).awaitingUpload;

  if (orphan > 0) {
    return {
      id: 'vault.presign.orphan',
      severity: 'blocker',
      messageRu: `${orphan} presign без завершённой загрузки в PG/S3 — повторите upload или удалите черновик.`,
    };
  }
  if (failed > 0) {
    return {
      id: 'vault.virus.failed',
      severity: 'blocker',
      messageRu: `${failed} файл(ов) не прошли virus scan — handoff заблокирован.`,
    };
  }
  if (pending > 0) {
    return {
      id: 'vault.virus.pending',
      severity: 'blocker',
      messageRu:
        mirror?.hintRu ??
        `${pending} файл(ов) ожидают virus scan — handoff fail-closed до статуса clean.`,
    };
  }
  return null;
}

export function evaluateWorkshop2VaultVirusScanExportGate(input: {
  dossier: Workshop2DossierPhase1;
}): Workshop2HandoffReadinessCheck | null {
  const mirror = input.dossier.vaultPanelMirror;
  const pending = mirror?.virusScanPendingCount ?? 0;
  const failed = mirror?.virusScanFailedCount ?? 0;
  if (failed > 0) {
    return {
      id: 'export.vault.virus.failed',
      severity: 'blocker',
      messageRu: `ZIP ТЗ: ${failed} vault с failed virus scan.`,
    };
  }
  if (pending > 0) {
    return {
      id: 'export.vault.virus.pending',
      severity: 'warning',
      messageRu: `ZIP ТЗ: ${pending} vault ожидают virus scan — экспорт разрешён с предупреждением.`,
    };
  }
  return null;
}
