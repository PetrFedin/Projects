/**
 * Wave 40: documented staging contract path → strict 9.0 (localhost mock + PG partnerAck).
 * Prod без live env остаётся fail-closed; success только при HTTP 200 + ack id в journal.
 */
import type {
  Workshop2DossierPhase1,
  Workshop2DossierPgMirror,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2CeilingJournalEntry } from '@/lib/production/workshop2-ceiling-staging-core';
import type {
  Workshop2IntegrationCeilingCatalogId,
  Workshop2ProcessEnvLike,
} from '@/lib/production/workshop2-live-integration-probes-env';

export const WORKSHOP2_STAGING_MOCK_DEFAULT_PORT = 18_766;
export const WORKSHOP2_STAGING_MOCK_DEFAULT_BASE = `http://127.0.0.1:${WORKSHOP2_STAGING_MOCK_DEFAULT_PORT}`;

export type Workshop2StagingContractCeilingKind =
  | 'dpp'
  | 'sustainability'
  | 'fit3d'
  | 'nesting'
  | 'erp'
  | 'plmTransport';

const CATALOG_TO_KIND: Record<50 | 53 | 55 | 63 | 66 | 78, Workshop2StagingContractCeilingKind> = {
  50: 'dpp',
  53: 'sustainability',
  55: 'fit3d',
  63: 'nesting',
  66: 'erp',
  78: 'plmTransport',
};

export function isWorkshop2StagingContractModeEnabled(
  env: Workshop2ProcessEnvLike = process.env
): boolean {
  return (
    String(env.WORKSHOP2_STAGING_CONTRACT_MODE ?? '')
      .trim()
      .toLowerCase() === 'true'
  );
}

export function resolveWorkshop2StagingMockBaseUrl(
  env: Workshop2ProcessEnvLike = process.env
): string {
  const custom = String(env.WORKSHOP2_STAGING_MOCK_BASE_URL ?? '').trim();
  return custom || WORKSHOP2_STAGING_MOCK_DEFAULT_BASE;
}

export function isWorkshop2StagingContractLocalhostUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === '127.0.0.1' ||
      u.hostname === 'localhost' ||
      u.hostname === '[::1]' ||
      u.hostname === '0.0.0.0'
    );
  } catch {
    return false;
  }
}

/** ACK в PG только при contract mode + localhost (не маскируем prod URL). */
export function shouldRecordWorkshop2StagingContractPartnerAck(
  env: Workshop2ProcessEnvLike,
  stagingUrl: string
): boolean {
  return (
    isWorkshop2StagingContractModeEnabled(env) && isWorkshop2StagingContractLocalhostUrl(stagingUrl)
  );
}

export function extractWorkshop2StagingPartnerAckId(
  kind: Workshop2StagingContractCeilingKind,
  json: Record<string, unknown> | undefined
): string | null {
  if (!json) return null;
  const pick = (...keys: string[]) => {
    for (const k of keys) {
      const v = json[k];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
    return null;
  };
  switch (kind) {
    case 'dpp':
      return pick('registryAckId', 'partnerAckId', 'ackId');
    case 'sustainability':
      return pick('registryAckId', 'lcaAckId', 'partnerAckId', 'ackId');
    case 'fit3d':
      return pick('pipelineAckId', 'vaultAckId', 'partnerAckId', 'ackId');
    case 'nesting':
      return pick('nestingAckId', 'partnerAckId', 'ackId');
    case 'erp':
      return pick('erpOrderId', 'partnerAckId', 'ackId');
    case 'plmTransport':
      return pick('ackId', 'partnerAckId', 'id');
    default:
      return null;
  }
}

export function workshop2StagingContractMirrorAckFields(input: {
  journal: Workshop2CeilingJournalEntry[];
  env?: Workshop2ProcessEnvLike;
}): {
  partnerAckRecorded: boolean;
  partnerAckId: string | null;
  ackAt: string | null;
  stagingContractMode: boolean;
} {
  const stagingContractMode = isWorkshop2StagingContractModeEnabled(input.env);
  const ackEntry = [...input.journal]
    .reverse()
    .find((j) => j.partnerAckRecorded === true && j.ackId);
  return {
    partnerAckRecorded: Boolean(ackEntry),
    partnerAckId: ackEntry?.ackId ?? null,
    ackAt: ackEntry?.at ?? null,
    stagingContractMode,
  };
}

export function hasWorkshop2CeilingStagingContractAckInDossier(
  dossier: Workshop2DossierPhase1 | undefined,
  catalogId: Workshop2IntegrationCeilingCatalogId
): boolean {
  if (!dossier) return false;
  const hasPartnerAck = (
    mirror: Workshop2DossierPgMirror | undefined,
    opts?: { registryAck?: boolean; erpAck?: boolean }
  ): boolean => {
    if (!mirror) return false;
    if (mirror.partnerAckRecorded === true && mirror.ackId) return true;
    if (opts?.registryAck && mirror.registryAckRecorded === true) return true;
    if (opts?.erpAck && mirror.erpOrderIdAckInPg === true) return true;
    const journal = mirror.journal;
    if (!Array.isArray(journal)) return false;
    return journal.some((entry) => {
      const j = entry as Workshop2CeilingJournalEntry;
      return Boolean(j.partnerAckRecorded && j.ackId);
    });
  };
  switch (catalogId) {
    case 50:
      return hasPartnerAck(dossier.dppRegistryDraftMirror);
    case 53:
      return hasPartnerAck(dossier.sustainabilityStagingMirror, { registryAck: true });
    case 55:
      return hasPartnerAck(dossier.fit3dStagingMirror);
    case 63:
      return hasPartnerAck(dossier.nestingStagingMirror);
    case 66:
      return hasPartnerAck(dossier.factoryErpStagingMirror, { erpAck: true });
    case 78:
      return hasPartnerAck(dossier.plmTransportJournalMirror);
    default:
      return false;
  }
}

export function resolveWorkshop2StagingContractCeilingKind(
  catalogId: Workshop2IntegrationCeilingCatalogId
): Workshop2StagingContractCeilingKind {
  return CATALOG_TO_KIND[catalogId as keyof typeof CATALOG_TO_KIND];
}

/** Strict cap 9.0 когда contract mode включён и путь покрыт тестами wave40. */
export function workshop2CeilingStrictScoreCap(
  env: Workshop2ProcessEnvLike = process.env
): 8.9 | 9.0 {
  return isWorkshop2StagingContractModeEnabled(env) ? 9.0 : 8.9;
}

function firstEnvUrl(env: Workshop2ProcessEnvLike, keys: readonly string[]): string {
  for (const k of keys) {
    const v = String(env[k] ?? '').trim();
    if (v) return v;
  }
  return '';
}

/** Wave 7: staging_ok для ceilings без prod live (localhost mock + contract mode). */
export function resolveWorkshop2StagingContractProbeStatus(input: {
  configured: boolean;
  env: Workshop2ProcessEnvLike;
  envKeys: readonly string[];
}): {
  configured: boolean;
  live: boolean;
  stagingOk: boolean;
  modeLabelRu: 'production' | 'staging' | 'unconfigured';
} {
  const stagingMode = isWorkshop2StagingContractModeEnabled(input.env);
  const url = firstEnvUrl(input.env, input.envKeys);
  const configured = input.configured;
  const live =
    configured && url
      ? !isWorkshop2StagingContractLocalhostUrl(url) && url.startsWith('http')
      : false;
  const stagingOk =
    stagingMode && configured && Boolean(url) && isWorkshop2StagingContractLocalhostUrl(url);
  const modeLabelRu: 'production' | 'staging' | 'unconfigured' = live
    ? 'production'
    : stagingOk
      ? 'staging'
      : 'unconfigured';
  return { configured, live, stagingOk, modeLabelRu };
}

export function formatWorkshop2InvestorReadinessStagingNoteRu(
  env: Workshop2ProcessEnvLike = process.env
): string {
  if (!isWorkshop2StagingContractModeEnabled(env)) {
    return 'Production readiness: live env + E2E ACK required for ceilings 9.0.';
  }
  return 'Staging contract demo: ceilings staging_ok via localhost mock — это не production live.';
}
