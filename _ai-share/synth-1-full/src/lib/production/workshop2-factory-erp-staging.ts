/**
 * Wave 38 #66: Factory ERP staging attempt + journal (не health-as-synced).
 */
import type {
  Workshop2DossierPhase1,
  Workshop2FactoryErpStagingMirror,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  appendWorkshop2CeilingJournalEntry,
  workshop2CeilingJournalEntry,
  workshop2CeilingStagingHttpPost,
  type Workshop2CeilingFetchFn,
  type Workshop2CeilingJournalEntry,
} from '@/lib/production/workshop2-ceiling-staging-core';
import { isWorkshop2LiveErpConfigured } from '@/lib/production/workshop2-live-integration-probes-env';
import {
  extractWorkshop2StagingPartnerAckId,
  shouldRecordWorkshop2StagingContractPartnerAck,
  workshop2StagingContractMirrorAckFields,
} from '@/lib/production/workshop2-staging-contract-mode';
import {
  buildWorkshop2FactoryErpAuditMirror,
  persistWorkshop2FactoryErpAuditToDossier,
} from '@/lib/production/workshop2-factory-erp-audit-trail';
import type { Workshop2PurchaseOrderErpRow } from '@/lib/production/workshop2-purchase-order-erp-dossier-persist';

export type { Workshop2FactoryErpStagingMirror } from '@/lib/production/workshop2-dossier-phase1.types';

function buildWorkshop2FactoryErpStagingMirror(input: {
  actor: string;
  stagingUrl?: string;
  journal: Workshop2CeilingJournalEntry[];
  env?: Record<string, string | undefined>;
  erpOrderIdAckInPg?: boolean;
  hintRu?: string;
}): Workshop2FactoryErpStagingMirror {
  const ack = workshop2StagingContractMirrorAckFields({
    journal: input.journal,
    env: input.env,
  });
  return {
    mirroredAt: new Date().toISOString(),
    lastActor: input.actor,
    stagingUrl: input.stagingUrl,
    erpOrderIdAckInPg: Boolean(input.erpOrderIdAckInPg ?? ack.partnerAckRecorded),
    partnerAckRecorded: ack.partnerAckRecorded,
    partnerAckId: ack.partnerAckId,
    ackAt: ack.ackAt,
    stagingContractMode: ack.stagingContractMode,
    journal: input.journal,
    hintRu: input.hintRu,
  };
}

export async function attemptWorkshop2FactoryErpStaging(input: {
  dossier: Workshop2DossierPhase1;
  purchaseOrders: Workshop2PurchaseOrderErpRow[];
  erpConfigured: boolean;
  actor: string;
  collectionId: string;
  articleId: string;
  baseUrl?: string;
  env?: Record<string, string | undefined>;
  fetchImpl?: Workshop2CeilingFetchFn;
}): Promise<{
  ok: boolean;
  dossier: Workshop2DossierPhase1;
  httpStatus?: number;
  error?: string;
  skipped?: boolean;
}> {
  const url =
    input.baseUrl?.trim() || (input.env ?? process.env).WORKSHOP2_FACTORY_ERP_BASE_URL?.trim();
  const prev = input.dossier.factoryErpStagingMirror?.journal;

  let dossier = persistWorkshop2FactoryErpAuditToDossier(input.dossier, {
    purchaseOrders: input.purchaseOrders,
    erpConfigured: input.erpConfigured,
  });

  if (!url) {
    const journal = appendWorkshop2CeilingJournalEntry(
      prev,
      workshop2CeilingJournalEntry({
        actor: input.actor,
        event: 'erp_staging',
        outcome: 'skipped',
        error: 'factory_erp_base_url_not_configured',
      })
    );
    dossier = {
      ...dossier,
      factoryErpStagingMirror: buildWorkshop2FactoryErpStagingMirror({
        actor: input.actor,
        journal,
        env: input.env,
        hintRu: 'WORKSHOP2_FACTORY_ERP_BASE_URL не задан — journal-only PO audit.',
      }),
    };
    return { ok: false, skipped: true, dossier };
  }

  if (!isWorkshop2LiveErpConfigured(input.env)) {
    const journal = appendWorkshop2CeilingJournalEntry(
      prev,
      workshop2CeilingJournalEntry({
        actor: input.actor,
        event: 'erp_staging',
        outcome: 'skipped',
        stagingUrl: url,
        error: 'probe_not_configured',
      })
    );
    dossier = {
      ...dossier,
      factoryErpStagingMirror: buildWorkshop2FactoryErpStagingMirror({
        actor: input.actor,
        stagingUrl: url,
        journal,
        env: input.env,
      }),
    };
    return { ok: false, dossier };
  }

  const result = await workshop2CeilingStagingHttpPost({
    baseUrl: url,
    path: '/staging-probe',
    body: { collectionId: input.collectionId, articleId: input.articleId },
    fetchImpl: input.fetchImpl,
  });
  const contractAck = shouldRecordWorkshop2StagingContractPartnerAck(input.env ?? process.env, url);
  const ackId = contractAck ? extractWorkshop2StagingPartnerAckId('erp', result.json) : null;
  const partnerAckRecorded = Boolean(contractAck && result.ok && ackId);
  const journal = appendWorkshop2CeilingJournalEntry(
    prev,
    workshop2CeilingJournalEntry({
      actor: input.actor,
      event: 'erp_staging',
      outcome: result.ok ? 'success' : 'failed',
      httpStatus: result.httpStatus,
      error: result.error,
      stagingUrl: url,
      partnerAckRecorded,
      ackId,
    })
  );
  dossier = {
    ...dossier,
    factoryErpStagingMirror: buildWorkshop2FactoryErpStagingMirror({
      actor: input.actor,
      stagingUrl: url,
      journal,
      env: input.env,
      erpOrderIdAckInPg: partnerAckRecorded,
      hintRu: partnerAckRecorded
        ? `Staging contract ACK в PG: ${ackId} (prod live — отдельный env).`
        : result.ok
          ? 'Staging probe OK — erpOrderId только из POST /purchase-orders или staging contract.'
          : `ERP staging failed: ${result.error ?? 'http error'}`,
    }),
    factoryErpAuditMirror: buildWorkshop2FactoryErpAuditMirror({
      purchaseOrders: input.purchaseOrders,
      erpConfigured: input.erpConfigured,
    }),
  };
  return { ok: result.ok, httpStatus: result.httpStatus, error: result.error, dossier };
}

import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function evaluateWorkshop2FactoryErpStagingHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const audit = dossier.factoryErpAuditMirror;
  if (audit?.blocksFakeSyncedUi) {
    return {
      id: 'erp.staging.fake_synced_blocker',
      severity: 'blocker',
      messageRu: audit.hintRu ?? 'PO synced без erpOrderId — handoff заблокирован (fail-closed).',
    };
  }
  const staging = dossier.factoryErpStagingMirror;
  if (staging?.journal.some((j) => j.outcome === 'failed')) {
    return {
      id: 'erp.staging.attempt_failed',
      severity: 'warning',
      messageRu: staging.hintRu ?? 'ERP staging attempt failed.',
    };
  }
  return null;
}
