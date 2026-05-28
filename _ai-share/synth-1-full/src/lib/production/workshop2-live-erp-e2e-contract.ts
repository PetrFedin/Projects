/**
 * Wave E (#66): live ERP POST /purchase-orders — env contract + journal в dossier PG mirror.
 * Без fake ACK: synced только при erpOrderId в ответе.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  appendWorkshop2CeilingJournalEntry,
  workshop2CeilingJournalEntry,
  type Workshop2CeilingJournalEntry,
} from '@/lib/production/workshop2-ceiling-staging-core';

function resolveErpOrderIdFromResponse(json: Record<string, unknown>): string | undefined {
  const candidates = [json.erpOrderId, json.externalId, json.id];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return undefined;
}

export type Workshop2LiveErpPostOutcome =
  | { ok: true; erpOrderId: string; httpStatus: number }
  | { ok: false; error: string; httpStatus?: number; messageRu: string };

/** Контракт ответа ERP: erpOrderId | externalId | id. */
export function evaluateWorkshop2LiveErpPostResponse(input: {
  httpStatus: number;
  json: Record<string, unknown>;
}): Workshop2LiveErpPostOutcome {
  if (input.httpStatus < 200 || input.httpStatus >= 300) {
    return {
      ok: false,
      error: `erp_http_${input.httpStatus}`,
      httpStatus: input.httpStatus,
      messageRu: `ERP POST /purchase-orders: HTTP ${input.httpStatus} — erpOrderId не получен (fail-closed).`,
    };
  }
  const erpOrderId = resolveErpOrderIdFromResponse(input.json);
  if (!erpOrderId) {
    return {
      ok: false,
      error: 'erp_missing_order_id',
      httpStatus: input.httpStatus,
      messageRu: 'ERP вернул 2xx без erpOrderId/externalId/id — синхронизация не подтверждена.',
    };
  }
  return { ok: true, erpOrderId, httpStatus: input.httpStatus };
}

/** Journal entry в factoryErpStagingMirror после live POST (не staging contract). */
export function appendWorkshop2LiveErpPostJournal(input: {
  dossier: Workshop2DossierPhase1;
  actor: string;
  outcome: Workshop2LiveErpPostOutcome;
  baseUrl?: string;
}): Workshop2DossierPhase1 {
  const prev = input.dossier.factoryErpStagingMirror?.journal;
  const entry: Workshop2CeilingJournalEntry = workshop2CeilingJournalEntry({
    actor: input.actor,
    event: 'erp_live_post',
    outcome: input.outcome.ok ? 'success' : 'failed',
    httpStatus: input.outcome.httpStatus,
    error: input.outcome.ok ? undefined : input.outcome.error,
    stagingUrl: input.baseUrl,
    partnerAckRecorded: false,
    ackId: input.outcome.ok ? input.outcome.erpOrderId : null,
  });
  const journal = appendWorkshop2CeilingJournalEntry(prev, entry);
  const hintRu = input.outcome.ok
    ? `Live ERP POST ACK: erpOrderId=${input.outcome.erpOrderId} в PG journal (prod live E2E).`
    : input.outcome.messageRu;

  return {
    ...input.dossier,
    factoryErpStagingMirror: {
      mirroredAt: new Date().toISOString(),
      lastActor: input.actor,
      stagingUrl: input.baseUrl,
      erpOrderIdAckInPg: input.outcome.ok,
      partnerAckRecorded: false,
      partnerAckId: input.outcome.ok ? input.outcome.erpOrderId : null,
      ackAt: input.outcome.ok ? new Date().toISOString() : null,
      stagingContractMode: false,
      journal,
      hintRu,
    },
    ...(input.outcome.ok
      ? {
          factoryErpSync: {
            ...input.dossier.factoryErpSync,
            syncStatus: 'synced' as const,
            erpOrderId: input.outcome.erpOrderId,
            validatedAt: new Date().toISOString(),
            hintRu,
          },
        }
      : {
          factoryErpSync: {
            ...input.dossier.factoryErpSync,
            syncStatus: 'error' as const,
            lastError: input.outcome.error,
            validatedAt: new Date().toISOString(),
            hintRu,
          },
        }),
  };
}
