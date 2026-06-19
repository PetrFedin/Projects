/**
 * GET/POST — синхронизация T&A milestones Workshop2 → brand calendar events.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import { buildWorkshop2BrandCalendarEventsForArticle } from '@/lib/production/workshop2-brand-calendar-sync';
import {
  listWorkshop2BrandCalendarEventsForArticle,
  replaceWorkshop2BrandCalendarEventsForArticle,
} from '@/lib/server/workshop2-brand-calendar-repository';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { listWorkshop2SampleOrders } from '@/lib/server/workshop2-sample-order-repository';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2OrganizationId } from '@/lib/server/workshop2-api-context';
import {
  WORKSHOP2_ARTICLE_CONTEXT_TYPE,
  workshop2ArticleContextId,
} from '@/lib/production/workshop2-domain-event-types';
import { appendWorkshop2ContextualSystemMessage } from '@/lib/server/workshop2-contextual-messages-repository';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export const GET = withWorkshop2ApiErrorRu(async function getCalendarSync(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const events = await listWorkshop2BrandCalendarEventsForArticle({
    collectionId: cid,
    articleId: aid,
    organizationId: resolveWorkshop2OrganizationId(req),
  });

  return NextResponse.json({ ok: true, events, synced: events.length > 0 });
});

export const POST = withWorkshop2ApiErrorRu(async function postCalendarSync(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'dossier_not_found');
  }

  const org = resolveWorkshop2OrganizationId(req);

  const orders = await listWorkshop2SampleOrders({
    collectionId: cid,
    articleId: aid,
    organizationId: org,
  });
  const latestDue = orders.find((o) => o.dueDate)?.dueDate ?? null;

  const events = buildWorkshop2BrandCalendarEventsForArticle({
    collectionId: cid,
    articleId: aid,
    dossier: record.dossier,
    sampleOrderDueDate: latestDue,
    sampleOrders: orders.map((o) => ({
      id: o.id,
      movementStatus: o.movementStatus,
      movementLog: o.movementLog,
    })),
  });

  const result = await replaceWorkshop2BrandCalendarEventsForArticle({
    collectionId: cid,
    articleId: aid,
    events,
    organizationId: org,
  });

  void appendWorkshop2ContextualSystemMessage({
    contextType: WORKSHOP2_ARTICLE_CONTEXT_TYPE,
    contextId: workshop2ArticleContextId(cid, aid),
    message: `[Система] Calendar sync: ${result.synced} событий T&A → brand calendar`,
    organizationId: org,
  }).catch(() => {
    /* best-effort */
  });

  return NextResponse.json({
    ok: true,
    synced: result.synced,
    events,
    messageRu:
      result.synced > 0
        ? `Синхронизировано ${result.synced} событий T&A в brand calendar.`
        : 'Нет taMilestones для синхронизации — добавьте вехи на вкладке «План».',
  });
});
