/**
 * Wave 37 #50: DPP registry draft в досье + optional staging POST (fail-closed).
 */
import type {
  Workshop2DossierPhase1,
  Workshop2DppRegistryDraftMirror,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  buildWorkshop2DppExportBlock,
  type Workshop2DppExportBlock,
} from '@/lib/production/workshop2-dpp-export';
import { isWorkshop2LiveDppConfigured } from '@/lib/production/workshop2-live-integration-probes-env';
import {
  extractWorkshop2StagingPartnerAckId,
  shouldRecordWorkshop2StagingContractPartnerAck,
  workshop2StagingContractMirrorAckFields,
} from '@/lib/production/workshop2-staging-contract-mode';
import {
  appendWorkshop2CeilingJournalEntry,
  workshop2CeilingJournalEntry,
  workshop2CeilingStagingHttpPost,
  type Workshop2CeilingFetchFn,
  type Workshop2CeilingJournalEntry,
} from '@/lib/production/workshop2-ceiling-staging-core';

export type { Workshop2DppRegistryDraftMirror };

export function resolveWorkshop2DppRegistryUrl(
  env?: Record<string, string | undefined>
): string | undefined {
  const e = env ?? (typeof process !== 'undefined' ? process.env : {});
  const url = e.WORKSHOP2_DPP_REGISTRY_URL?.trim() || e.WORKSHOP2_EU_DPP_REGISTRY_URL?.trim();
  return url || undefined;
}

export function buildWorkshop2DppRegistryDraftMirror(input: {
  block: Workshop2DppExportBlock;
  actor: string;
  journal: Workshop2CeilingJournalEntry[];
  env?: Record<string, string | undefined>;
  stagingResult?: { ok: boolean; httpStatus?: number; error?: string };
}): Workshop2DppRegistryDraftMirror {
  const url = resolveWorkshop2DppRegistryUrl(input.env);
  const configured = Boolean(url);
  let stagingMode: Workshop2DppRegistryDraftMirror['stagingMode'] = configured
    ? 'configured'
    : 'none';
  if (input.stagingResult) {
    stagingMode = input.stagingResult.ok ? 'posted' : 'failed';
  }
  const last = input.journal[input.journal.length - 1];
  const ack = workshop2StagingContractMirrorAckFields({
    journal: input.journal,
    env: input.env,
  });
  return {
    draftedAt: new Date().toISOString(),
    mirroredAt: new Date().toISOString(),
    lastActor: input.actor,
    passportId: input.block.passportId,
    registryId: null,
    scheme: input.block.registryStub.scheme,
    exportReady: Boolean(input.block.passportId?.trim()),
    stagingMode,
    stagingUrl: url,
    stagingHttpStatus: input.stagingResult?.httpStatus ?? last?.httpStatus,
    stagingError: input.stagingResult?.error ?? last?.error,
    partnerAckRecorded: ack.partnerAckRecorded,
    partnerAckId: ack.partnerAckId,
    ackAt: ack.ackAt,
    stagingContractMode: ack.stagingContractMode,
    journal: input.journal,
    hintRu: ack.partnerAckRecorded
      ? `Staging contract ACK в PG: ${ack.partnerAckId} (prod live registry — отдельный env).`
      : stagingMode === 'failed'
        ? `DPP registry staging failed: ${input.stagingResult?.error ?? last?.error ?? 'unknown'}`
        : stagingMode === 'none'
          ? 'EU registry URL не задан — JSON-LD draft only (strict 8.9 max).'
          : stagingMode === 'configured'
            ? 'Registry URL задан — staging POST (без fake ACK).'
            : 'Staging HTTP OK — registryId остаётся null до live ACK в PG.',
  };
}

export function persistWorkshop2DppRegistryDraftToDossier(
  dossier: Workshop2DossierPhase1,
  mirror: Workshop2DppRegistryDraftMirror
): Workshop2DossierPhase1 {
  return { ...dossier, dppRegistryDraftMirror: mirror };
}

/** Staging POST — fail-closed; journal с actor. */
export async function postWorkshop2DppRegistryStaging(input: {
  dossier: Workshop2DossierPhase1;
  block: Workshop2DppExportBlock;
  actor: string;
  env?: Record<string, string | undefined>;
  fetchImpl?: Workshop2CeilingFetchFn;
}): Promise<{
  ok: boolean;
  dossier: Workshop2DossierPhase1;
  httpStatus?: number;
  error?: string;
  skipped?: boolean;
}> {
  const url = resolveWorkshop2DppRegistryUrl(input.env);
  const prevJournal = input.dossier.dppRegistryDraftMirror?.journal;
  const prev = Array.isArray(prevJournal) ? prevJournal : undefined;
  if (!url) {
    const journal = appendWorkshop2CeilingJournalEntry(
      prev,
      workshop2CeilingJournalEntry({
        actor: input.actor,
        event: 'dpp_registry_staging',
        outcome: 'skipped',
        error: 'registry_url_not_configured',
      })
    );
    const mirror = buildWorkshop2DppRegistryDraftMirror({
      block: input.block,
      actor: input.actor,
      journal,
      env: input.env,
    });
    return {
      ok: false,
      skipped: true,
      error: 'registry_url_not_configured',
      dossier: persistWorkshop2DppRegistryDraftToDossier(input.dossier, mirror),
    };
  }
  if (!isWorkshop2LiveDppConfigured(input.env)) {
    const journal = appendWorkshop2CeilingJournalEntry(
      prev,
      workshop2CeilingJournalEntry({
        actor: input.actor,
        event: 'dpp_registry_staging',
        outcome: 'skipped',
        stagingUrl: url,
        error: 'probe_not_configured',
      })
    );
    const mirror = buildWorkshop2DppRegistryDraftMirror({
      block: input.block,
      actor: input.actor,
      journal,
      env: input.env,
    });
    return {
      ok: false,
      error: 'dpp_registry_probe_not_configured',
      dossier: persistWorkshop2DppRegistryDraftToDossier(input.dossier, mirror),
    };
  }
  const result = await workshop2CeilingStagingHttpPost({
    baseUrl: url,
    path: '/draft',
    body: {
      passportId: input.block.passportId,
      collectionId: input.block.collectionId,
      articleId: input.block.articleId,
      registryStub: input.block.registryStub,
    },
    fetchImpl: input.fetchImpl,
  });
  const contractAck = shouldRecordWorkshop2StagingContractPartnerAck(input.env ?? process.env, url);
  const ackId = contractAck ? extractWorkshop2StagingPartnerAckId('dpp', result.json) : null;
  const partnerAckRecorded = Boolean(contractAck && result.ok && ackId);
  const journal = appendWorkshop2CeilingJournalEntry(
    prev,
    workshop2CeilingJournalEntry({
      actor: input.actor,
      event: 'dpp_registry_staging',
      outcome: result.ok ? 'success' : 'failed',
      httpStatus: result.httpStatus,
      error: result.error,
      stagingUrl: url,
      partnerAckRecorded,
      ackId,
    })
  );
  const mirror = buildWorkshop2DppRegistryDraftMirror({
    block: input.block,
    actor: input.actor,
    journal,
    env: input.env,
    stagingResult: result,
  });
  return {
    ok: result.ok,
    httpStatus: result.httpStatus,
    error: result.error,
    dossier: persistWorkshop2DppRegistryDraftToDossier(input.dossier, mirror),
  };
}

export function evaluateWorkshop2DppRegistryExportGate(input: {
  dossier: Workshop2DossierPhase1;
}): Workshop2HandoffReadinessCheck | null {
  const mirror = input.dossier.dppRegistryDraftMirror;
  if (!mirror) {
    return {
      id: 'dpp.registry.draft_missing',
      severity: 'warning',
      messageRu: 'DPP: зафиксируйте registry draft в досье перед export ZIP.',
    };
  }
  if (mirror.registryId != null) {
    return {
      id: 'dpp.registry.unexpected_id',
      severity: 'warning',
      messageRu: 'registryId должен оставаться null без live ACK.',
    };
  }
  if (mirror.stagingMode === 'failed') {
    return {
      id: 'dpp.registry.staging_failed',
      severity: 'warning',
      messageRu:
        mirror.hintRu ?? 'DPP registry staging failed — повторите или оставьте draft-only.',
    };
  }
  return null;
}
