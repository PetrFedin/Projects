import { NextResponse } from 'next/server';
import type { Workshop2DossierMetricsPayload } from '@/lib/production/workshop2-dossier-metrics-ingest';
import {
  aggregateW2DossierMetrics,
  aggregateW2DossierMetricsByOrgLatest,
  aggregateW2DossierMetricsByTeamLatest,
  aggregateW2DossierMetricsDedupLatest,
  getW2DossierMetricsFilePath,
} from '@/lib/server/workshop2-dossier-metrics-store';
import {
  appendW2DossierMetricUnified,
  readW2DossierMetricsUnified,
} from '@/lib/server/workshop2-dossier-metrics-backend';
import { w2DossierMetricsBackendLabel } from '@/lib/server/workshop2-dossier-metrics-upstash';
import { verifyW2DossierMetricsReadRequest } from '@/lib/server/workshop2-dossier-metrics-auth';
import { applyW2MetricsTimeFilter } from '@/lib/server/workshop2-dossier-metrics-time';
import { applyW2MetricsStampToRow } from '@/lib/server/workshop2-dossier-metrics-stamp';
import { verifyW2DossierMetricsPostRequest } from '@/lib/server/workshop2-dossier-metrics-post-guard';

export const dynamic = 'force-dynamic';

/**
 * POST — снимок (Upstash/KV при наличии env, иначе NDJSON; при сбое Redis — файл).
 * GET — агрегаты + dedup + teamTag. Секрет: W2_DOSSIER_METRICS_READ_SECRET или W2_ADMIN_DOSSIER_METRICS_SECRET;
 *       заголовок Authorization: Bearer … или X-W2-Metrics-Key.
 *       Время: sinceHours | sinceDays | sinceIso (после чтения хвоста limit).
 */
export async function POST(request: Request) {
  const postGuard = verifyW2DossierMetricsPostRequest(request);
  if (!postGuard.ok) {
    return NextResponse.json({ ok: false, error: postGuard.error }, { status: postGuard.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }
  const rec = body as Record<string, unknown>;
  if (typeof rec.collectionId !== 'string' || typeof rec.articleId !== 'string') {
    return NextResponse.json({ ok: false, error: 'missing_ids' }, { status: 400 });
  }
  const row = { ...(body as Workshop2DossierMetricsPayload) };
  const stampMeta = applyW2MetricsStampToRow(request, row);
  if (process.env.W2_DOSSIER_METRICS_STRIP_USER_IDS === '1') {
    delete row.appUserUid;
    delete row.orgId;
  }
  const { stored, target } = await appendW2DossierMetricUnified(row);
  if (process.env.W2_DOSSIER_METRICS_VERBOSE_POST_LOG === '1') {
    console.info('[workshop2-dossier-metrics]', JSON.stringify(row));
  } else {
    console.info(
      '[workshop2-dossier-metrics]',
      JSON.stringify({
        event: 'w2_dossier_metrics_post',
        collectionId: row.collectionId,
        articleId: row.articleId,
        stored,
        target,
        stampHeader: stampMeta.stampHeader,
        identityFromStamp: stampMeta.identityFromStamp,
        hasAppUserUid: Boolean(row.appUserUid),
        hasOrgId: Boolean(row.orgId),
      })
    );
  }
  return NextResponse.json({ ok: true, stored, target });
}

export async function GET(request: Request) {
  if (!verifyW2DossierMetricsReadRequest(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    Math.max(parseInt(searchParams.get('limit') ?? '500', 10) || 500, 1),
    5000
  );
  const colRaw =
    searchParams
      .get('collections')
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  const collectionFilter = colRaw.length > 0 ? new Set(colRaw) : undefined;

  try {
    const rawRows = await readW2DossierMetricsUnified(limit);
    const { rows, meta: timeFilter } = applyW2MetricsTimeFilter(rawRows, searchParams);
    const aggregate = aggregateW2DossierMetrics(rows, collectionFilter);
    const aggregateDedupLatest = aggregateW2DossierMetricsDedupLatest(rows, collectionFilter);
    const teamLatest = aggregateW2DossierMetricsByTeamLatest(rows, collectionFilter);
    const orgLatest = aggregateW2DossierMetricsByOrgLatest(rows, collectionFilter);
    return NextResponse.json({
      ok: true,
      storage: w2DossierMetricsBackendLabel(),
      aggregate,
      aggregateDedupLatest,
      teamLatest,
      orgLatest,
      storePath: getW2DossierMetricsFilePath(),
      rowsLoaded: rows.length,
      rowsRead: rawRows.length,
      timeFilter,
    });
  } catch (e) {
    console.error('[workshop2-dossier-metrics] GET', e);
    return NextResponse.json({ ok: false, error: 'read_failed' }, { status: 500 });
  }
}
