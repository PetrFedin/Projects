/**
 * Wave 35 #1: PG-метрики хаба на сервере (без LS) — collection-scoped + global.
 */
import { isWorkshop2PostgresEnabled, getWorkshop2PgPool } from '@/lib/server/workshop2-pg-pool';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import type { Workshop2HubPgMetrics } from '@/lib/production/workshop2-hub-pg-metrics';

export type Workshop2HubCollectionPgCounts = {
  articles: number;
  dossiers: number;
  sampleOrders: number;
  events: number;
};

export async function loadWorkshop2HubPgMetricsServer(): Promise<Workshop2HubPgMetrics> {
  if (!isWorkshop2PostgresEnabled()) {
    return { postgres: 'disabled', counts: null };
  }
  try {
    await ensureWorkshop2PgSchema();
    const pool = getWorkshop2PgPool();
    const [collections, articles, dossiers, events, sampleOrders] = await Promise.all([
      pool.query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM workshop2_collections`),
      pool.query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM workshop2_articles`),
      pool.query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM workshop2_dossiers`),
      pool.query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM workshop2_dossier_events`),
      pool
        .query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM workshop2_sample_orders`)
        .catch(() => ({ rows: [{ c: '0' }] })),
    ]);
    return {
      postgres: 'ok',
      counts: {
        collections: Number(collections.rows[0]?.c ?? 0),
        articles: Number(articles.rows[0]?.c ?? 0),
        dossiers: Number(dossiers.rows[0]?.c ?? 0),
        events: Number(events.rows[0]?.c ?? 0),
        sampleOrders: Number(sampleOrders.rows[0]?.c ?? 0),
      },
    };
  } catch {
    return { postgres: 'down', counts: null };
  }
}

export async function loadWorkshop2HubCollectionPgCounts(
  collectionId: string
): Promise<Workshop2HubCollectionPgCounts | null> {
  if (!isWorkshop2PostgresEnabled()) return null;
  const cid = collectionId.trim();
  if (!cid) return null;
  try {
    await ensureWorkshop2PgSchema();
    const pool = getWorkshop2PgPool();
    const [articles, dossiers, sampleOrders, events] = await Promise.all([
      pool.query<{ c: string }>(
        `SELECT COUNT(*)::text AS c FROM workshop2_articles WHERE collection_id = $1`,
        [cid]
      ),
      pool.query<{ c: string }>(
        `SELECT COUNT(*)::text AS c FROM workshop2_dossiers WHERE collection_id = $1`,
        [cid]
      ),
      pool
        .query<{
          c: string;
        }>(`SELECT COUNT(*)::text AS c FROM workshop2_sample_orders WHERE collection_id = $1`, [
          cid,
        ])
        .catch(() => ({ rows: [{ c: '0' }] })),
      pool.query<{ c: string }>(
        `SELECT COUNT(*)::text AS c FROM workshop2_dossier_events WHERE collection_id = $1`,
        [cid]
      ),
    ]);
    return {
      articles: Number(articles.rows[0]?.c ?? 0),
      dossiers: Number(dossiers.rows[0]?.c ?? 0),
      sampleOrders: Number(sampleOrders.rows[0]?.c ?? 0),
      events: Number(events.rows[0]?.c ?? 0),
    };
  } catch {
    return null;
  }
}
