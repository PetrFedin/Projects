/**
 * PATCH — обновить заказ образца (статус, срок, размеры).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import type {
  Workshop2SampleOrderSizes,
  Workshop2SampleOrderStatus,
  Workshop2NestingRequest,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { normalizeWorkshop2NestingRequest } from '@/lib/production/workshop2-nesting-request';
import { updateWorkshop2SampleOrder } from '@/lib/server/workshop2-sample-order-repository';
import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = {
  params: Promise<{ collectionId: string; articleId: string; orderId: string }>;
};

export const PATCH = withWorkshop2ApiErrorRu(async function patchSampleOrder(
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
  const auth = guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  if (!cid || !aid || !oid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const order = await updateWorkshop2SampleOrder({
    id: oid,
    collectionId: cid,
    articleId: aid,
    status: b.status != null ? (String(b.status) as Workshop2SampleOrderStatus) : undefined,
    contractorId: b.contractorId != null ? String(b.contractorId) : undefined,
    dueDate: b.dueDate != null ? String(b.dueDate) : undefined,
    sizes:
      b.sizes && typeof b.sizes === 'object' ? (b.sizes as Workshop2SampleOrderSizes) : undefined,
    quantity: typeof b.quantity === 'number' ? b.quantity : undefined,
    notes: b.notes !== undefined ? String(b.notes ?? '') : undefined,
    nestingRequest:
      b.nestingRequest && typeof b.nestingRequest === 'object'
        ? normalizeWorkshop2NestingRequest(b.nestingRequest)
        : undefined,
  });

  if (!order) {
    return jsonWorkshop2ErrorRu(404, 'not_found');
  }

  if (b.status != null) {
    void enqueueWorkshop2DomainEvent({
      type: 'sample_order.status_changed',
      collectionId: cid,
      articleId: aid,
      payload: {
        orderId: order.id,
        status: order.status,
        requestedStatus: String(b.status),
      },
    }).catch(() => {
      /* best-effort */
    });
  }

  return NextResponse.json({ ok: true, order });
});
