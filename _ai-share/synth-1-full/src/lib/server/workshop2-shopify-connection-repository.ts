import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import { isWorkshop2PgOnlyMode } from '@/lib/production/workshop2-hub-pg-only-policy';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

export type Workshop2ShopifyConnectionRecord = {
  id: string;
  shop: string;
  accessToken: string;
  scopes?: string;
  connectedAt: string;
  organizationId?: string;
};

const memoryConnections: Workshop2ShopifyConnectionRecord[] = [];
const STORE_FILE = path.join(process.cwd(), 'data', 'workshop2-shopify-connections.json');
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
    const parsed = JSON.parse(raw) as Workshop2ShopifyConnectionRecord[];
    if (Array.isArray(parsed)) memoryConnections.push(...parsed);
  } catch {
    /* best-effort */
  }
}

function flushFile(): void {
  if (!canUseDiskPersistence()) return;
  try {
    fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
    fs.writeFileSync(STORE_FILE, JSON.stringify(memoryConnections, null, 2), 'utf8');
  } catch {
    /* best-effort */
  }
}

function newConnectionId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `w2shop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function upsertWorkshop2ShopifyConnection(input: {
  shop: string;
  accessToken: string;
  scopes?: string;
  organizationId?: string;
}): Promise<{ persisted: boolean; mode: 'postgres' | 'file' | 'memory' | 'pg_only_blocked' }> {
  const org = input.organizationId ?? 'org-brand-001';
  const shop = input.shop.trim();
  const record: Workshop2ShopifyConnectionRecord = {
    id: newConnectionId(),
    shop,
    accessToken: input.accessToken,
    scopes: input.scopes,
    connectedAt: new Date().toISOString(),
    organizationId: org,
  };

  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    await getWorkshop2PgPool().query(
      `INSERT INTO workshop2_shopify_connections
         (id, organization_id, shop, access_token, scopes, connected_at, payload)
       VALUES ($1, $2, $3, $4, $5, $6::timestamptz, $7::jsonb)
       ON CONFLICT (id) DO NOTHING`,
      [
        record.id,
        org,
        shop,
        input.accessToken,
        input.scopes ?? null,
        record.connectedAt,
        JSON.stringify({ source: 'oauth_callback' }),
      ]
    );
    await getWorkshop2PgPool().query(
      `DELETE FROM workshop2_shopify_connections
       WHERE organization_id = $1 AND shop = $2 AND id <> $3`,
      [org, shop, record.id]
    );
    return { persisted: true, mode: 'postgres' };
  }

  if (isWorkshop2PgOnlyMode()) {
    return { persisted: false, mode: 'pg_only_blocked' };
  }

  hydrateFileIfNeeded();
  const idx = memoryConnections.findIndex((c) => c.shop === shop && c.organizationId === org);
  if (idx >= 0) memoryConnections[idx] = record;
  else memoryConnections.push(record);
  flushFile();
  return { persisted: true, mode: canUseDiskPersistence() ? 'file' : 'memory' };
}

export async function getWorkshop2ShopifyConnection(input?: {
  shop?: string;
  organizationId?: string;
}): Promise<Workshop2ShopifyConnectionRecord | null> {
  const org = input?.organizationId ?? 'org-brand-001';
  const shop = input?.shop?.trim();

  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    const res = shop
      ? await getWorkshop2PgPool().query<{
          id: string;
          shop: string;
          access_token: string;
          scopes: string | null;
          connected_at: Date;
        }>(
          `SELECT id, shop, access_token, scopes, connected_at
           FROM workshop2_shopify_connections
           WHERE organization_id = $1 AND shop = $2
           ORDER BY connected_at DESC LIMIT 1`,
          [org, shop]
        )
      : await getWorkshop2PgPool().query<{
          id: string;
          shop: string;
          access_token: string;
          scopes: string | null;
          connected_at: Date;
        }>(
          `SELECT id, shop, access_token, scopes, connected_at
           FROM workshop2_shopify_connections
           WHERE organization_id = $1
           ORDER BY connected_at DESC LIMIT 1`,
          [org]
        );
    const row = res.rows[0];
    if (!row) return null;
    return {
      id: row.id,
      shop: row.shop,
      accessToken: row.access_token,
      scopes: row.scopes ?? undefined,
      connectedAt: row.connected_at.toISOString(),
      organizationId: org,
    };
  }

  if (isWorkshop2PgOnlyMode()) return null;

  hydrateFileIfNeeded();
  const filtered = memoryConnections.filter((c) => c.organizationId === org || !c.organizationId);
  if (shop) return filtered.find((c) => c.shop === shop) ?? null;
  return filtered.sort((a, b) => b.connectedAt.localeCompare(a.connectedAt))[0] ?? null;
}

export function clearWorkshop2ShopifyConnectionMemoryForTests(): void {
  memoryConnections.length = 0;
  fileHydrated = false;
}
