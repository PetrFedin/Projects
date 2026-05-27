import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import type { Workshop2B2bCommissionLine } from '@/lib/production/workshop2-b2b-commission';
import { isWorkshop2PgOnlyMode } from '@/lib/production/workshop2-hub-pg-only-policy';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

const memoryLines: Workshop2B2bCommissionLine[] = [];
const STORE_FILE = path.join(process.cwd(), 'data', 'workshop2-b2b-commissions.json');
let fileHydrated = false;

function canUseDiskPersistence(): boolean {
  return process.env.NODE_ENV !== 'test' && !isWorkshop2PgOnlyMode();
}

function hydrateFileIfNeeded(): void {
  if (fileHydrated) return;
  fileHydrated = true;
  if (!canUseDiskPersistence()) return;
  try {
    if (!fs.existsSync(STORE_FILE)) return;
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Workshop2B2bCommissionLine[];
    if (Array.isArray(parsed)) memoryLines.push(...parsed);
  } catch {
    /* best-effort */
  }
}

function flushFile(): void {
  if (!canUseDiskPersistence()) return;
  try {
    fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
    fs.writeFileSync(STORE_FILE, JSON.stringify(memoryLines, null, 2), 'utf8');
  } catch {
    /* best-effort */
  }
}

function newCommissionId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `w2comm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function mapPgRow(r: {
  id: string;
  rep_id: string;
  order_id: string;
  order_total_rub: string | number;
  commission_pct: string | number;
  commission_rub: string | number;
  customer_name: string | null;
  attributed_at: Date;
}): Workshop2B2bCommissionLine {
  return {
    orderId: r.order_id,
    repId: r.rep_id,
    orderTotalRub: Number(r.order_total_rub) || 0,
    commissionPct: Number(r.commission_pct) || 0,
    commissionRub: Number(r.commission_rub) || 0,
    customerName: r.customer_name ?? undefined,
    attributedAt: r.attributed_at.toISOString(),
  };
}

export async function persistWorkshop2B2bCommissionLine(input: {
  line: Workshop2B2bCommissionLine;
  organizationId?: string;
}): Promise<{ persisted: boolean; mode: 'postgres' | 'file' | 'memory' | 'pg_only_blocked' }> {
  const line = input.line;
  const org = input.organizationId ?? 'org-brand-001';
  const id = newCommissionId();

  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    await getWorkshop2PgPool().query(
      `INSERT INTO workshop2_b2b_commissions
         (id, organization_id, rep_id, order_id, order_total_rub, commission_pct, commission_rub,
          customer_name, attributed_at, payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::timestamptz, $10::jsonb)
       ON CONFLICT (id) DO NOTHING`,
      [
        id,
        org,
        line.repId,
        line.orderId,
        line.orderTotalRub,
        line.commissionPct,
        line.commissionRub,
        line.customerName ?? null,
        line.attributedAt,
        JSON.stringify({ source: 'calculated' }),
      ]
    );
    return { persisted: true, mode: 'postgres' };
  }

  if (isWorkshop2PgOnlyMode()) {
    return { persisted: false, mode: 'pg_only_blocked' };
  }

  hydrateFileIfNeeded();
  memoryLines.push(line);
  flushFile();
  return { persisted: true, mode: canUseDiskPersistence() ? 'file' : 'memory' };
}

export async function listWorkshop2B2bCommissionLinesForRep(input: {
  repId: string;
  organizationId?: string;
}): Promise<Workshop2B2bCommissionLine[]> {
  const repId = input.repId.trim();
  const org = input.organizationId ?? 'org-brand-001';

  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    const res = await getWorkshop2PgPool().query<{
      id: string;
      rep_id: string;
      order_id: string;
      order_total_rub: string | number;
      commission_pct: string | number;
      commission_rub: string | number;
      customer_name: string | null;
      attributed_at: Date;
    }>(
      `SELECT id, rep_id, order_id, order_total_rub, commission_pct, commission_rub,
              customer_name, attributed_at
       FROM workshop2_b2b_commissions
       WHERE organization_id = $1 AND rep_id = $2
       ORDER BY attributed_at DESC`,
      [org, repId]
    );
    return res.rows.map(mapPgRow);
  }

  if (isWorkshop2PgOnlyMode()) {
    return [];
  }

  hydrateFileIfNeeded();
  return memoryLines.filter((l) => l.repId === repId);
}

export async function markWorkshop2B2bCommissionsPayoutPending(input: {
  repId: string;
  orderIds?: string[];
  organizationId?: string;
}): Promise<{
  updatedCount: number;
  mode: 'postgres' | 'file' | 'memory' | 'pg_only_blocked';
}> {
  const repId = input.repId.trim();
  const org = input.organizationId ?? 'org-brand-001';
  const orderFilter = input.orderIds?.length ? input.orderIds : undefined;

  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    if (orderFilter?.length) {
      const res = await getWorkshop2PgPool().query(
        `UPDATE workshop2_b2b_commissions
         SET payout_status = $4
         WHERE organization_id = $1 AND rep_id = $2 AND payout_status <> $4 AND order_id = ANY($3::text[])`,
        [org, repId, orderFilter, 'payout_pending']
      );
      return { updatedCount: res.rowCount ?? 0, mode: 'postgres' };
    }
    const res = await getWorkshop2PgPool().query(
      `UPDATE workshop2_b2b_commissions
       SET payout_status = $3
       WHERE organization_id = $1 AND rep_id = $2 AND payout_status <> $3`,
      [org, repId, 'payout_pending']
    );
    return { updatedCount: res.rowCount ?? 0, mode: 'postgres' };
  }

  if (isWorkshop2PgOnlyMode()) {
    return { updatedCount: 0, mode: 'pg_only_blocked' };
  }

  hydrateFileIfNeeded();
  let updated = 0;
  for (const line of memoryLines) {
    if (line.repId !== repId) continue;
    if (orderFilter && !orderFilter.includes(line.orderId)) continue;
    updated += 1;
  }
  flushFile();
  return { updatedCount: updated, mode: canUseDiskPersistence() ? 'file' : 'memory' };
}

export function clearWorkshop2B2bCommissionMemoryForTests(): void {
  memoryLines.length = 0;
  fileHydrated = false;
}
