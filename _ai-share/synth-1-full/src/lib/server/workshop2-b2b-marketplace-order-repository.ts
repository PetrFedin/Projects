import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import type { Workshop2B2bMarketplaceOrderStub } from '@/lib/production/workshop2-b2b-marketplace-inbound';
import { isWorkshop2PgOnlyMode } from '@/lib/production/workshop2-hub-pg-only-policy';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

const memoryOrders: Workshop2B2bMarketplaceOrderStub[] = [];
const STORE_FILE = path.join(process.cwd(), 'data', 'workshop2-b2b-marketplace-orders.json');
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
    const parsed = JSON.parse(
      fs.readFileSync(STORE_FILE, 'utf8')
    ) as Workshop2B2bMarketplaceOrderStub[];
    if (Array.isArray(parsed)) memoryOrders.push(...parsed);
  } catch {
    /* best-effort */
  }
}

function flushFile(): void {
  if (!canUseDiskPersistence()) return;
  try {
    fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
    fs.writeFileSync(STORE_FILE, JSON.stringify(memoryOrders, null, 2), 'utf8');
  } catch {
    /* best-effort */
  }
}

export async function persistWorkshop2B2bMarketplaceOrderStub(input: {
  stub: Workshop2B2bMarketplaceOrderStub;
  organizationId?: string;
}): Promise<{ persisted: boolean; mode: 'postgres' | 'file' | 'memory' | 'pg_only_blocked' }> {
  const org = input.organizationId ?? 'org-brand-001';
  const stub = input.stub;

  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    await getWorkshop2PgPool().query(
      `INSERT INTO workshop2_b2b_marketplace_orders
         (id, organization_id, external_order_id, provider, campaign_id, status, payload, received_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::timestamptz)
       ON CONFLICT (id) DO NOTHING`,
      [
        stub.id,
        org,
        stub.externalOrderId,
        stub.provider,
        stub.campaignId ?? null,
        stub.status,
        JSON.stringify(stub.payload),
        stub.receivedAt,
      ]
    );
    return { persisted: true, mode: 'postgres' };
  }

  if (isWorkshop2PgOnlyMode()) {
    return { persisted: false, mode: 'pg_only_blocked' };
  }

  hydrateFileIfNeeded();
  memoryOrders.push(stub);
  flushFile();
  return { persisted: true, mode: canUseDiskPersistence() ? 'file' : 'memory' };
}

export function clearWorkshop2B2bMarketplaceOrdersMemoryForTests(): void {
  memoryOrders.length = 0;
  fileHydrated = false;
}
