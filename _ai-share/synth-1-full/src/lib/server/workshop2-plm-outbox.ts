import 'server-only';

import type { Workshop2PlmBridgeEnvelope } from '@/lib/production/workshop2-plm-bridge';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

export type Workshop2PlmOutboxStatus = 'pending' | 'sent' | 'acked' | 'failed';

export type Workshop2PlmOutboxRow = {
  id: string;
  eventType: string;
  payload: Record<string, unknown>;
  status: Workshop2PlmOutboxStatus;
  createdAt: string;
  sentAt?: string;
  ackedAt?: string;
  deliveryId?: string;
  lastError?: string;
};

const memoryOutbox: Workshop2PlmOutboxRow[] = [];

function newDeliveryId(rowId: string): string {
  return `w2plm-${rowId}-${Date.now()}`;
}

/** По умолчанию false: в prod нужен webhook или ручной ACK (`plm-outbox/ack`). */
function shouldAutoAck(): boolean {
  return process.env.WORKSHOP2_PLM_AUTO_ACK === 'true';
}

export function isWorkshop2PlmAutoAckEnabled(): boolean {
  return shouldAutoAck();
}

async function postPlmWebhook(
  deliveryId: string,
  envelope: Workshop2PlmBridgeEnvelope
): Promise<boolean> {
  const url = process.env.WORKSHOP2_PLM_WEBHOOK_URL?.trim();
  if (!url) return false;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.WORKSHOP2_PLM_WEBHOOK_SECRET
        ? { 'X-Workshop2-Secret': process.env.WORKSHOP2_PLM_WEBHOOK_SECRET }
        : {}),
    },
    body: JSON.stringify({
      deliveryId,
      type: envelope.type,
      emittedAt: envelope.emittedAt,
      source: envelope.source,
      payload: envelope.payload,
    }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) {
    throw new Error(`webhook_http_${res.status}`);
  }
  return true;
}

export async function enqueueWorkshop2PlmOutbox(
  env: Workshop2PlmBridgeEnvelope,
  organizationId = 'org-brand-001'
): Promise<Workshop2PlmOutboxRow> {
  const row: Workshop2PlmOutboxRow = {
    id: `mem-${memoryOutbox.length + 1}`,
    eventType: env.type,
    payload: { ...env.payload, emittedAt: env.emittedAt, source: env.source },
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  if (!isWorkshop2PostgresEnabled()) {
    memoryOutbox.push(row);
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info('[workshop2-plm-outbox:memory]', row.eventType, row.payload.collectionId);
    }
    return row;
  }

  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{ id: number; created_at: Date }>(
    `INSERT INTO workshop2_plm_outbox (organization_id, event_type, payload, status)
     VALUES ($1, $2, $3::jsonb, 'pending')
     RETURNING id, created_at`,
    [organizationId, env.type, JSON.stringify(row.payload)]
  );
  const pg = res.rows[0]!;
  return {
    id: String(pg.id),
    eventType: env.type,
    payload: row.payload,
    status: 'pending',
    createdAt: pg.created_at.toISOString(),
  };
}

export async function countWorkshop2PlmOutboxPending(
  organizationId = 'org-brand-001'
): Promise<number> {
  if (!isWorkshop2PostgresEnabled()) {
    return memoryOutbox.filter((r) => r.status === 'pending' || r.status === 'sent').length;
  }
  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{ c: string }>(
    `SELECT COUNT(*)::text AS c FROM workshop2_plm_outbox
     WHERE organization_id = $1 AND status IN ('pending', 'sent')`,
    [organizationId]
  );
  return Number(res.rows[0]?.c ?? 0);
}

export async function getWorkshop2PlmOutboxSummary(
  organizationId = 'org-brand-001'
): Promise<{ pending: number; sent: number; acked: number; failed: number }> {
  if (!isWorkshop2PostgresEnabled()) {
    const tally = { pending: 0, sent: 0, acked: 0, failed: 0 };
    for (const r of memoryOutbox) {
      tally[r.status] += 1;
    }
    return tally;
  }
  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{ status: string; c: string }>(
    `SELECT status, COUNT(*)::text AS c FROM workshop2_plm_outbox
     WHERE organization_id = $1
     GROUP BY status`,
    [organizationId]
  );
  const tally = { pending: 0, sent: 0, acked: 0, failed: 0 };
  for (const row of res.rows) {
    const key = row.status as keyof typeof tally;
    if (key in tally) tally[key] = Number(row.c);
  }
  return tally;
}

/** Диспетчер: POST webhook → status=sent; при auto-ack → acked. */
export async function processWorkshop2PlmOutboxBatch(limit = 20): Promise<{
  dispatched: number;
  acked: number;
  failed: number;
}> {
  const result = { dispatched: 0, acked: 0, failed: 0 };

  if (!isWorkshop2PostgresEnabled()) {
    let n = 0;
    for (const row of memoryOutbox) {
      if (row.status !== 'pending') continue;
      const deliveryId = newDeliveryId(row.id);
      try {
        const posted = await postPlmWebhook(deliveryId, {
          type: row.eventType as Workshop2PlmBridgeEnvelope['type'],
          emittedAt: String(row.payload.emittedAt ?? row.createdAt),
          source: 'workshop2',
          payload: row.payload,
        });
        if (!posted) continue;
        row.status = 'sent';
        row.sentAt = new Date().toISOString();
        row.deliveryId = deliveryId;
        result.dispatched += 1;
        if (shouldAutoAck()) {
          row.status = 'acked';
          row.ackedAt = new Date().toISOString();
          result.acked += 1;
        }
      } catch (e) {
        row.status = 'failed';
        row.lastError = e instanceof Error ? e.message : 'dispatch_failed';
        result.failed += 1;
      }
      n += 1;
      if (n >= limit) break;
    }
    return result;
  }

  await ensureWorkshop2PgSchema();
  const pending = await getWorkshop2PgPool().query<{
    id: number;
    event_type: string;
    payload: Record<string, unknown>;
    created_at: Date;
  }>(
    `SELECT id, event_type, payload, created_at FROM workshop2_plm_outbox
     WHERE status = 'pending' ORDER BY created_at ASC LIMIT $1`,
    [limit]
  );

  for (const row of pending.rows) {
    const deliveryId = newDeliveryId(String(row.id));
    const envelope: Workshop2PlmBridgeEnvelope = {
      type: row.event_type as Workshop2PlmBridgeEnvelope['type'],
      emittedAt: String(row.payload.emittedAt ?? row.created_at.toISOString()),
      source: 'workshop2',
      payload: row.payload,
    };
    try {
      const posted = await postPlmWebhook(deliveryId, envelope);
      if (!posted) continue;
      if (shouldAutoAck()) {
        await getWorkshop2PgPool().query(
          `UPDATE workshop2_plm_outbox
           SET status = 'acked', sent_at = NOW(), acked_at = NOW(), delivery_id = $2, last_error = NULL
           WHERE id = $1`,
          [row.id, deliveryId]
        );
        result.dispatched += 1;
        result.acked += 1;
      } else {
        await getWorkshop2PgPool().query(
          `UPDATE workshop2_plm_outbox
           SET status = 'sent', sent_at = NOW(), delivery_id = $2, last_error = NULL
           WHERE id = $1`,
          [row.id, deliveryId]
        );
        result.dispatched += 1;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'dispatch_failed';
      await getWorkshop2PgPool().query(
        `UPDATE workshop2_plm_outbox SET status = 'failed', last_error = $2 WHERE id = $1`,
        [row.id, msg]
      );
      result.failed += 1;
    }
  }

  return result;
}

/** Сброс failed → pending и повторная отправка (ручной retry в UI). */
export async function retryWorkshop2PlmOutboxFailed(limit = 20): Promise<{
  reset: number;
  dispatched: number;
  acked: number;
  failed: number;
}> {
  let reset = 0;

  if (!isWorkshop2PostgresEnabled()) {
    for (const row of memoryOutbox) {
      if (row.status !== 'failed') continue;
      row.status = 'pending';
      row.lastError = undefined;
      reset += 1;
    }
    const batch = await processWorkshop2PlmOutboxBatch(limit);
    return { reset, ...batch };
  }

  await ensureWorkshop2PgSchema();
  const upd = await getWorkshop2PgPool().query(
    `UPDATE workshop2_plm_outbox SET status = 'pending', last_error = NULL
     WHERE status = 'failed'
     RETURNING id`
  );
  reset = upd.rowCount ?? 0;
  const batch = await processWorkshop2PlmOutboxBatch(limit);
  return { reset, ...batch };
}

/** Внешний PLM подтверждает доставку (ERP write-back ACK). */
export async function ackWorkshop2PlmOutboxDelivery(input: {
  deliveryId: string;
  organizationId?: string;
}): Promise<{ ok: boolean; updated: number }> {
  const deliveryId = input.deliveryId.trim();
  if (!deliveryId) return { ok: false, updated: 0 };

  if (!isWorkshop2PostgresEnabled()) {
    let updated = 0;
    for (const row of memoryOutbox) {
      if (row.deliveryId !== deliveryId || row.status === 'acked') continue;
      row.status = 'acked';
      row.ackedAt = new Date().toISOString();
      updated += 1;
    }
    return { ok: updated > 0, updated };
  }

  await ensureWorkshop2PgSchema();
  const org = input.organizationId ?? 'org-brand-001';
  const res = await getWorkshop2PgPool().query(
    `UPDATE workshop2_plm_outbox
     SET status = 'acked', acked_at = NOW()
     WHERE organization_id = $1 AND delivery_id = $2 AND status IN ('sent', 'pending')`,
    [org, deliveryId]
  );
  return { ok: (res.rowCount ?? 0) > 0, updated: res.rowCount ?? 0 };
}

export function clearWorkshop2PlmOutboxMemoryForTests(): void {
  memoryOutbox.length = 0;
}

export function listWorkshop2PlmOutboxMemoryForTests(): Workshop2PlmOutboxRow[] {
  return [...memoryOutbox];
}

/** @deprecated используйте processWorkshop2PlmOutboxBatch — оставлено для совместимости тестов */
export async function processWorkshop2PlmOutboxBatchLegacyCount(limit = 20): Promise<number> {
  const r = await processWorkshop2PlmOutboxBatch(limit);
  return r.dispatched + r.acked;
}
