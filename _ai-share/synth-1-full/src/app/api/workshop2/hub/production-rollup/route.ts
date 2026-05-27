/**
 * GET — hub rollup: sample orders by status (collection или multi-article scope).
 *
 * Query:
 * - collectionId — одна коллекция
 * - articles — comma-separated `collectionId:articleId` для агрегации видимых карточек
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import type { Workshop2SampleOrderStatus } from '@/lib/production/workshop2-dossier-phase1.types';
import { NextRequest, NextResponse } from 'next/server';
import { buildWorkshop2ProductionAnalyticsSnapshot } from '@/lib/production/workshop2-production-analytics';
import {
  listWorkshop2SampleOrders,
  listWorkshop2SampleOrdersByCollection,
} from '@/lib/server/workshop2-sample-order-repository';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

const STATUSES: Workshop2SampleOrderStatus[] = [
  'draft',
  'sent',
  'in_progress',
  'received',
  'approved',
  'cancelled',
];

function parseArticleScope(raw: string | null): Array<{ collectionId: string; articleId: string }> {
  if (!raw?.trim()) return [];
  const out: Array<{ collectionId: string; articleId: string }> = [];
  for (const part of raw.split(',')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const [collectionId, articleId] = trimmed.split(':');
    if (collectionId?.trim() && articleId?.trim()) {
      out.push({ collectionId: collectionId.trim(), articleId: articleId.trim() });
    }
  }
  return out;
}

export const GET = withWorkshop2ApiErrorRu(async function getHubProductionRollup(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim() ?? '';
  const articleScope = parseArticleScope(req.nextUrl.searchParams.get('articles'));

  if (!collectionId && articleScope.length === 0) {
    return jsonWorkshop2ErrorRu(400, 'collection_id_required', {
      messageRu: 'Укажите collectionId или articles=col:art,col:art.',
    });
  }

  let orders: Awaited<ReturnType<typeof listWorkshop2SampleOrdersByCollection>> = [];
  let scopeLabel = '';

  if (articleScope.length > 0) {
    const seen = new Set<string>();
    for (const { collectionId: cid, articleId: aid } of articleScope.slice(0, 80)) {
      const key = `${cid}::${aid}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const articleOrders = await listWorkshop2SampleOrders({
        collectionId: cid,
        articleId: aid,
      });
      orders.push(...articleOrders);
    }
    scopeLabel = `видимые артикулы (${articleScope.length})`;
  } else {
    orders = await listWorkshop2SampleOrdersByCollection({ collectionId });
    scopeLabel = `коллекция ${collectionId}`;
  }

  const byStatus: Record<string, number> = {};
  for (const s of STATUSES) byStatus[s] = 0;
  for (const o of orders) {
    byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
  }

  const leadSamples = orders
    .map(
      (o) =>
        buildWorkshop2ProductionAnalyticsSnapshot({
          collectionId: o.collectionId,
          articleId: o.articleId,
          statusHistory: o.statusHistory,
        }).sampleLeadTimeDays
    )
    .filter((d): d is number => d != null);
  const avgLeadTimeDays =
    leadSamples.length > 0
      ? Math.round(leadSamples.reduce((a, b) => a + b, 0) / leadSamples.length)
      : null;

  return NextResponse.json({
    ok: true,
    collectionId: collectionId || null,
    scope: articleScope.length > 0 ? 'multi' : 'collection',
    articleCount: articleScope.length > 0 ? articleScope.length : undefined,
    total: orders.length,
    byStatus,
    avgLeadTimeDays,
    hintRu: `Образцы (${scopeLabel}): ${orders.length} заказов${avgLeadTimeDays != null ? ` · ср. lead ${avgLeadTimeDays} дн.` : ''}.`,
  });
});
