/**
 * POST — переход статуса заказа образца с валидацией allowed transitions.
 * Body: { toStatus, actor?, note? }
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import type { Workshop2SampleOrderStatus } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  listWorkshop2SampleOrders,
  transitionWorkshop2SampleOrder,
} from '@/lib/server/workshop2-sample-order-repository';
import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';
import {
  normalizeWorkshop2SampleOrderStatus,
  validateWorkshop2SampleOrderTransition,
} from '@/lib/production/workshop2-sample-order-transitions';

type RouteCtx = {
  params: Promise<{ collectionId: string; articleId: string; orderId: string }>;
};

export const POST = withWorkshop2ApiErrorRu(async function postSampleOrderTransition(
  req: NextRequest,
  ctx: RouteCtx
) {
  const { collectionId, articleId, orderId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  const oid = orderId.trim();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const b = body as Record<string, unknown>;
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES, {
    bodyActorLabel: String(b.actor ?? ''),
  });
  if (auth instanceof NextResponse) return auth;

  if (!cid || !aid || !oid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const toStatus = normalizeWorkshop2SampleOrderStatus(String(b.toStatus ?? ''));
  if (!toStatus) {
    return jsonWorkshop2ErrorRu(400, 'invalid_status', {
      messageRu:
        'Укажите корректный toStatus (draft|sent|in_progress|received|approved|cancelled).',
    });
  }

  const orders = await listWorkshop2SampleOrders({ collectionId: cid, articleId: aid });
  const prev = orders.find((o) => o.id === oid);
  if (!prev) {
    return jsonWorkshop2ErrorRu(404, 'not_found');
  }

  const transition = validateWorkshop2SampleOrderTransition(prev.status, toStatus);
  if (!transition.allowed) {
    return jsonWorkshop2ErrorRu(409, 'invalid_transition', {
      messageRu: transition.messageRu,
      from: transition.from,
      to: transition.to,
    });
  }

  const actor =
    resolveWorkshop2UpdatedBy(req, String(b.actor ?? ''), auth.actor) ?? 'sample-order-transition';
  const note = b.note != null ? String(b.note) : undefined;

  const order = await transitionWorkshop2SampleOrder({
    id: oid,
    collectionId: cid,
    articleId: aid,
    toStatus: toStatus as Workshop2SampleOrderStatus,
    actor,
    note,
  });

  if (!order) {
    return jsonWorkshop2ErrorRu(404, 'not_found');
  }

  void enqueueWorkshop2DomainEvent({
    type: 'sample_order.status_changed',
    collectionId: cid,
    articleId: aid,
    payload: {
      orderId: order.id,
      status: order.status,
      previousStatus: prev.status,
      actor,
      note: note?.trim() || undefined,
      source: 'transition_api',
    },
  }).catch(() => {
    /* best-effort */
  });

  return NextResponse.json({
    ok: true,
    order,
    transition: { from: prev.status, to: order.status, actor },
  });
});
