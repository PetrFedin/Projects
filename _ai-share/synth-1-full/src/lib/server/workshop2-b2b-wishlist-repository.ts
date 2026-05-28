import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import type {
  Workshop2B2bRepShareToken,
  Workshop2B2bWishlistEntry,
} from '@/lib/production/workshop2-b2b-wave22-parity';
import { isWorkshop2PgOnlyMode } from '@/lib/production/workshop2-hub-pg-only-policy';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

const memoryWishlist = new Map<string, Workshop2B2bWishlistEntry>();
const STORE_FILE = path.join(process.cwd(), 'data', 'workshop2-b2b-wishlist.json');
let fileHydrated = false;

function wishlistKey(buyerId: string, campaignId: string): string {
  return `${buyerId}::${campaignId}`;
}

function canUseDiskPersistence(): boolean {
  return process.env.NODE_ENV !== 'test' && !isWorkshop2PgOnlyMode();
}

function hydrateFileIfNeeded(): void {
  if (fileHydrated) return;
  fileHydrated = true;
  if (!canUseDiskPersistence()) return;
  try {
    if (!fs.existsSync(STORE_FILE)) return;
    const parsed = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8')) as Workshop2B2bWishlistEntry[];
    if (Array.isArray(parsed)) {
      for (const e of parsed) {
        if (e.buyerId && e.campaignId) {
          memoryWishlist.set(wishlistKey(e.buyerId, e.campaignId), e);
        }
      }
    }
  } catch {
    /* best-effort */
  }
}

function flushFile(): void {
  if (!canUseDiskPersistence()) return;
  try {
    fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
    fs.writeFileSync(STORE_FILE, JSON.stringify([...memoryWishlist.values()], null, 2), 'utf8');
  } catch {
    /* best-effort */
  }
}

export async function listWorkshop2B2bWishlist(
  buyerId: string
): Promise<Workshop2B2bWishlistEntry[]> {
  const bid = buyerId.trim() || 'buyer-demo';
  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    const res = await getWorkshop2PgPool().query<{
      campaign_id: string;
      collection_id: string;
      article_id: string;
      added_at: Date;
    }>(
      `SELECT campaign_id, collection_id, article_id, added_at
       FROM workshop2_b2b_wishlist WHERE buyer_id = $1 ORDER BY added_at DESC`,
      [bid]
    );
    return res.rows.map((r) => ({
      campaignId: r.campaign_id,
      collectionId: r.collection_id,
      articleId: r.article_id,
      buyerId: bid,
      addedAt: r.added_at.toISOString(),
    }));
  }
  if (isWorkshop2PgOnlyMode()) return [];
  hydrateFileIfNeeded();
  return [...memoryWishlist.values()].filter((e) => e.buyerId === bid);
}

export async function addWorkshop2B2bWishlistEntry(
  entry: Workshop2B2bWishlistEntry
): Promise<{ ok: true }> {
  const bid = entry.buyerId?.trim() || 'buyer-demo';
  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    await getWorkshop2PgPool().query(
      `INSERT INTO workshop2_b2b_wishlist
         (buyer_id, campaign_id, collection_id, article_id, added_at)
       VALUES ($1,$2,$3,$4,$5::timestamptz)
       ON CONFLICT (buyer_id, campaign_id) DO UPDATE SET added_at = EXCLUDED.added_at`,
      [bid, entry.campaignId, entry.collectionId, entry.articleId, entry.addedAt]
    );
    return { ok: true };
  }
  if (isWorkshop2PgOnlyMode()) return { ok: true };
  hydrateFileIfNeeded();
  memoryWishlist.set(wishlistKey(bid, entry.campaignId), { ...entry, buyerId: bid });
  flushFile();
  return { ok: true };
}

export async function removeWorkshop2B2bWishlistEntry(input: {
  buyerId: string;
  campaignId: string;
}): Promise<{ ok: true; removed: boolean }> {
  const bid = input.buyerId.trim() || 'buyer-demo';
  const cid = input.campaignId.trim();
  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    const res = await getWorkshop2PgPool().query(
      `DELETE FROM workshop2_b2b_wishlist WHERE buyer_id = $1 AND campaign_id = $2`,
      [bid, cid]
    );
    return { ok: true, removed: (res.rowCount ?? 0) > 0 };
  }
  if (isWorkshop2PgOnlyMode()) return { ok: true, removed: false };
  hydrateFileIfNeeded();
  const removed = memoryWishlist.delete(wishlistKey(bid, cid));
  if (removed) flushFile();
  return { ok: true, removed };
}

export function clearWorkshop2B2bWishlistMemoryForTests(): void {
  memoryWishlist.clear();
  fileHydrated = false;
}

const memoryRepShare = new Map<string, Workshop2B2bRepShareToken>();
const REP_SHARE_FILE = path.join(process.cwd(), 'data', 'workshop2-b2b-rep-share.json');
let repShareHydrated = false;

function hydrateRepShareIfNeeded(): void {
  if (repShareHydrated) return;
  repShareHydrated = true;
  if (!canUseDiskPersistence()) return;
  try {
    if (!fs.existsSync(REP_SHARE_FILE)) return;
    const parsed = JSON.parse(
      fs.readFileSync(REP_SHARE_FILE, 'utf8')
    ) as Workshop2B2bRepShareToken[];
    if (Array.isArray(parsed)) {
      for (const t of parsed) memoryRepShare.set(t.token, t);
    }
  } catch {
    /* best-effort */
  }
}

function flushRepShare(): void {
  if (!canUseDiskPersistence()) return;
  try {
    fs.mkdirSync(path.dirname(REP_SHARE_FILE), { recursive: true });
    fs.writeFileSync(REP_SHARE_FILE, JSON.stringify([...memoryRepShare.values()], null, 2), 'utf8');
  } catch {
    /* best-effort */
  }
}

export async function issueWorkshop2B2bRepShareToken(input: {
  campaignId: string;
  repId: string;
  ttlHours?: number;
}): Promise<Workshop2B2bRepShareToken> {
  const token =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `rep-${Date.now()}`;
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + (input.ttlHours ?? 168) * 60 * 60 * 1000).toISOString();
  const record: Workshop2B2bRepShareToken = {
    token,
    campaignId: input.campaignId.trim(),
    repId: input.repId.trim(),
    createdAt,
    expiresAt,
  };

  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    await getWorkshop2PgPool().query(
      `INSERT INTO workshop2_b2b_rep_share_journal (token, campaign_id, rep_id, created_at, expires_at)
       VALUES ($1,$2,$3,$4::timestamptz,$5::timestamptz)
       ON CONFLICT (token) DO UPDATE SET expires_at = EXCLUDED.expires_at`,
      [token, record.campaignId, record.repId, createdAt, expiresAt]
    );
    return record;
  }

  if (!isWorkshop2PgOnlyMode()) {
    hydrateRepShareIfNeeded();
    memoryRepShare.set(token, record);
    flushRepShare();
  }
  return record;
}

export function clearWorkshop2B2bRepShareMemoryForTests(): void {
  memoryRepShare.clear();
  repShareHydrated = false;
}
