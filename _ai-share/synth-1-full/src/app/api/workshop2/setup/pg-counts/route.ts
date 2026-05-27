import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextResponse } from 'next/server';
import { isWorkshop2PostgresEnabled, getWorkshop2PgPool } from '@/lib/server/workshop2-pg-pool';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';

export const dynamic = 'force-dynamic';

/** GET: счётчики основных таблиц W2 (только при postgres ok). */
async function getPgCounts() {
  if (!isWorkshop2PostgresEnabled()) {
    return NextResponse.json({
      ok: true,
      postgres: 'disabled',
      counts: null,
    });
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
    return NextResponse.json({
      ok: true,
      postgres: 'ok',
      counts: {
        collections: Number(collections.rows[0]?.c ?? 0),
        articles: Number(articles.rows[0]?.c ?? 0),
        dossiers: Number(dossiers.rows[0]?.c ?? 0),
        events: Number(events.rows[0]?.c ?? 0),
        sampleOrders: Number(sampleOrders.rows[0]?.c ?? 0),
      },
    });
  } catch {
    return jsonWorkshop2ErrorRu(503, 'postgres_down');
  }
}

export const GET = withWorkshop2ApiErrorRu(getPgCounts);
