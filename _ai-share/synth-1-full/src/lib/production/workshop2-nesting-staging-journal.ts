/**
 * Wave 38 #63: nesting simulate journal persist (external_api fail-closed).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  appendWorkshop2CeilingJournalEntry,
  workshop2CeilingJournalEntry,
  type Workshop2CeilingJournalEntry,
} from '@/lib/production/workshop2-ceiling-staging-core';
import { callWorkshop2NestingSimulationStub } from '@/lib/production/workshop2-nesting-request';
import type { Workshop2NestingRequest } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2CeilingFetchFn } from '@/lib/production/workshop2-ceiling-staging-core';
import {
  extractWorkshop2StagingPartnerAckId,
  shouldRecordWorkshop2StagingContractPartnerAck,
  workshop2StagingContractMirrorAckFields,
} from '@/lib/production/workshop2-staging-contract-mode';

export type Workshop2NestingStagingMirror = {
  mirroredAt: string;
  lastActor: string;
  lastSource?: 'external_api' | 'local_heuristic';
  partnerAckRecorded: boolean;
  partnerAckId: string | null;
  ackAt: string | null;
  stagingContractMode: boolean;
  journal: Workshop2CeilingJournalEntry[];
  hintRu?: string;
};

export async function runWorkshop2NestingStagingWithJournal(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  sampleOrderId: string;
  nesting: Workshop2NestingRequest;
  actor: string;
  env?: Record<string, string | undefined>;
  fetchImpl?: Workshop2CeilingFetchFn;
}): Promise<{
  ok: boolean;
  source: 'external_api' | 'local_heuristic';
  dossier: Workshop2DossierPhase1;
  error?: string;
}> {
  const result = await callWorkshop2NestingSimulationStub({
    collectionId: input.collectionId,
    articleId: input.articleId,
    sampleOrderId: input.sampleOrderId,
    nesting: input.nesting,
    env: input.env,
    fetchImpl: input.fetchImpl,
  });
  const apiUrl =
    input.env?.WORKSHOP2_NESTING_API_URL?.trim() ||
    (typeof process !== 'undefined' ? process.env.WORKSHOP2_NESTING_API_URL?.trim() : undefined);
  const contractAck =
    apiUrl && shouldRecordWorkshop2StagingContractPartnerAck(input.env ?? process.env, apiUrl);
  const ackId =
    contractAck && result.ok ? extractWorkshop2StagingPartnerAckId('nesting', result.json) : null;
  const partnerAckRecorded = Boolean(contractAck && result.ok && ackId);
  const prev = input.dossier.nestingStagingMirror?.journal;
  const journal = appendWorkshop2CeilingJournalEntry(
    prev,
    workshop2CeilingJournalEntry({
      actor: input.actor,
      event: 'nesting_simulate',
      outcome: result.ok ? 'success' : 'failed',
      error: result.error,
      stagingUrl: result.source === 'external_api' ? apiUrl : undefined,
      partnerAckRecorded,
      ackId,
    })
  );
  const ackMirror = workshop2StagingContractMirrorAckFields({
    journal,
    env: input.env,
  });
  const mirror: Workshop2NestingStagingMirror = {
    mirroredAt: new Date().toISOString(),
    lastActor: input.actor,
    lastSource: result.source,
    partnerAckRecorded: ackMirror.partnerAckRecorded,
    partnerAckId: ackMirror.partnerAckId,
    ackAt: ackMirror.ackAt,
    stagingContractMode: ackMirror.stagingContractMode,
    journal,
    hintRu: partnerAckRecorded
      ? `Staging contract nesting ACK: ${ackId} (prod CAD engine — отдельный env).`
      : result.source === 'external_api' && !result.ok
        ? `Nesting API fail-closed: ${result.error ?? 'error'}`
        : result.source === 'local_heuristic'
          ? 'Local heuristic — не CAD engine (8.9 max).'
          : 'External nesting API OK — yield в sample order.',
  };
  return {
    ok: result.ok,
    source: result.source,
    error: result.error,
    dossier: { ...input.dossier, nestingStagingMirror: mirror },
  };
}

export function evaluateWorkshop2NestingStagingExportGate(input: {
  dossier: Workshop2DossierPhase1;
}): Workshop2HandoffReadinessCheck | null {
  const mirror = input.dossier.nestingStagingMirror;
  if (!mirror) return null;
  if (mirror.lastSource === 'external_api' && mirror.journal.some((j) => j.outcome === 'failed')) {
    return {
      id: 'nesting.staging.external_failed',
      severity: 'warning',
      messageRu: mirror.hintRu ?? 'Nesting external_api failed — повторите simulate.',
    };
  }
  return null;
}
