/**
 * Wave 38 #78: PLM transport journal + webhook receipt (без fake partner ACK).
 */
import type {
  Workshop2DossierPhase1,
  Workshop2PlmTransportJournalMirror,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  appendWorkshop2CeilingJournalEntry,
  workshop2CeilingJournalEntry,
  workshop2CeilingStagingHttpPost,
  type Workshop2CeilingFetchFn,
  type Workshop2CeilingJournalEntry,
} from '@/lib/production/workshop2-ceiling-staging-core';
import {
  isWorkshop2LivePlmTransportConfigured,
  type Workshop2ProcessEnvLike,
} from '@/lib/production/workshop2-live-integration-probes-env';
import {
  extractWorkshop2StagingPartnerAckId,
  shouldRecordWorkshop2StagingContractPartnerAck,
  workshop2StagingContractMirrorAckFields,
} from '@/lib/production/workshop2-staging-contract-mode';

export type { Workshop2PlmTransportJournalMirror };

function resolvePlmPartnerAckUrl(env?: Workshop2ProcessEnvLike): string | undefined {
  const e = env ?? (typeof process !== 'undefined' ? process.env : {});
  return (
    e.WORKSHOP2_PLM_PARTNER_ACK_URL?.trim() ||
    e.WORKSHOP2_PLM_EXTERNAL_ACK_ENDPOINT?.trim() ||
    e.WORKSHOP2_PLM_LIVE_TRANSPORT_URL?.trim() ||
    undefined
  );
}

export function buildWorkshop2PlmTransportJournalMirror(input: {
  actor: string;
  journal: Workshop2CeilingJournalEntry[];
  env?: Workshop2ProcessEnvLike;
}): Workshop2PlmTransportJournalMirror {
  const live = isWorkshop2LivePlmTransportConfigured(input.env);
  const ack = workshop2StagingContractMirrorAckFields({
    journal: input.journal,
    env: input.env,
  });
  const webhook = Boolean((input.env ?? process.env).WORKSHOP2_PLM_WEBHOOK_URL?.trim());
  const lastReceipt = [...input.journal].reverse().find((j) => j.event === 'webhook_receipt');
  const transportKind: Workshop2PlmTransportJournalMirror['transportKind'] = ack.partnerAckRecorded
    ? 'staging_contract'
    : live
      ? 'live_partner'
      : 'outbox_journal';
  return {
    mirroredAt: new Date().toISOString(),
    lastActor: input.actor,
    transportKind,
    webhookConfigured: webhook,
    partnerAckRecorded: ack.partnerAckRecorded,
    partnerAckId: ack.partnerAckId,
    ackAt: ack.ackAt,
    stagingContractMode: ack.stagingContractMode,
    lastReceiptAt: lastReceipt?.at,
    journal: input.journal,
    hintRu: ack.partnerAckRecorded
      ? `Staging contract partner ACK: ${ack.partnerAckId} (prod live — отдельный env).`
      : live
        ? 'Live PLM transport env задан — partner ACK только после HTTP 200 + ack id в journal.'
        : 'PLM outbox journal — webhook receipt stub без partner ACK (WORKSHOP2_PLM_PARTNER_ACK_URL).',
  };
}

export function persistWorkshop2PlmTransportJournalToDossier(
  dossier: Workshop2DossierPhase1,
  mirror: Workshop2PlmTransportJournalMirror
): Workshop2DossierPhase1 {
  return { ...dossier, plmTransportJournalMirror: mirror };
}

/** Webhook receipt — записывает событие; partnerAckRecorded остаётся false. */
export function recordWorkshop2PlmWebhookReceipt(input: {
  dossier: Workshop2DossierPhase1;
  actor: string;
  eventId: string;
  payloadPreview?: Record<string, unknown>;
}): Workshop2DossierPhase1 {
  const prevJournal = input.dossier.plmTransportJournalMirror?.journal;
  const prev = Array.isArray(prevJournal) ? prevJournal : undefined;
  const entry = workshop2CeilingJournalEntry({
    actor: input.actor,
    event: 'webhook_receipt',
    outcome: 'success',
    partnerAckRecorded: false,
    ackId: null,
    error: undefined,
  });
  const journal = appendWorkshop2CeilingJournalEntry(prev, {
    ...entry,
    stagingUrl: `event:${input.eventId}`,
  });
  const mirror = buildWorkshop2PlmTransportJournalMirror({
    actor: input.actor,
    journal,
  });
  return persistWorkshop2PlmTransportJournalToDossier(input.dossier, mirror);
}

/** Попытка доставки partner ACK — fail-closed; ack id только из JSON ответа. */
export async function attemptWorkshop2PlmPartnerAckStaging(input: {
  dossier: Workshop2DossierPhase1;
  actor: string;
  outboxEventId: string;
  env?: Workshop2ProcessEnvLike;
  fetchImpl?: Workshop2CeilingFetchFn;
}): Promise<{
  ok: boolean;
  dossier: Workshop2DossierPhase1;
  httpStatus?: number;
  error?: string;
  skipped?: boolean;
}> {
  const ackUrl = resolvePlmPartnerAckUrl(input.env);
  const prevJournal = input.dossier.plmTransportJournalMirror?.journal;
  const prev = Array.isArray(prevJournal) ? prevJournal : undefined;
  if (!ackUrl) {
    const journal = appendWorkshop2CeilingJournalEntry(
      prev,
      workshop2CeilingJournalEntry({
        actor: input.actor,
        event: 'partner_ack_staging',
        outcome: 'skipped',
        error: 'partner_ack_url_not_configured',
      })
    );
    const mirror = buildWorkshop2PlmTransportJournalMirror({
      actor: input.actor,
      journal,
      env: input.env,
    });
    return {
      ok: false,
      skipped: true,
      dossier: persistWorkshop2PlmTransportJournalToDossier(input.dossier, mirror),
    };
  }

  const result = await workshop2CeilingStagingHttpPost({
    baseUrl: ackUrl,
    path: '/ack',
    body: { eventId: input.outboxEventId },
    fetchImpl: input.fetchImpl,
  });
  const contractAck = shouldRecordWorkshop2StagingContractPartnerAck(
    input.env ?? process.env,
    ackUrl
  );
  const ackId =
    result.ok && result.json
      ? (extractWorkshop2StagingPartnerAckId('plmTransport', result.json) ??
        (String(result.json.ackId ?? result.json.id ?? '').trim() || null))
      : null;
  const partnerAckRecorded = Boolean(contractAck && result.ok && ackId);
  const journal = appendWorkshop2CeilingJournalEntry(
    prev,
    workshop2CeilingJournalEntry({
      actor: input.actor,
      event: 'partner_ack_staging',
      outcome: result.ok && ackId ? 'success' : 'failed',
      httpStatus: result.httpStatus,
      error: result.error,
      stagingUrl: ackUrl,
      partnerAckRecorded,
      ackId,
    })
  );
  const mirror = buildWorkshop2PlmTransportJournalMirror({
    actor: input.actor,
    journal,
    env: input.env,
  });
  return {
    ok: Boolean(result.ok && ackId),
    httpStatus: result.httpStatus,
    error: result.ok && !ackId ? 'partner_ack_missing_id' : result.error,
    dossier: persistWorkshop2PlmTransportJournalToDossier(input.dossier, mirror),
  };
}

export function evaluateWorkshop2PlmTransportHandoffGate(input: {
  dossier: Workshop2DossierPhase1;
}): Workshop2HandoffReadinessCheck | null {
  const mirror = input.dossier.plmTransportJournalMirror;
  if (!mirror) {
    return {
      id: 'plm.transport.journal_missing',
      severity: 'warning',
      messageRu:
        'PLM transport journal не в досье — «PLM journal → PG» или webhook receipt перед handoff.',
    };
  }
  const failed = mirror.journal.filter((j) => j.outcome === 'failed');
  if (failed.length > 0) {
    return {
      id: 'plm.transport.staging_failed',
      severity: 'warning',
      messageRu: `PLM staging: ${failed.length} failed — см. journal (без fake ACK).`,
    };
  }
  return null;
}

export function evaluateWorkshop2PlmTransportExportGate(input: {
  dossier: Workshop2DossierPhase1;
}): Workshop2HandoffReadinessCheck | null {
  return evaluateWorkshop2PlmTransportHandoffGate(input);
}
