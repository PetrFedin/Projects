/**
 * PATCH /api/shop/b2b/orders/[id]/status — lifecycle + domain event b2b.order.status_changed.
 */
import { NextRequest, NextResponse } from 'next/server';

import {
  isWorkshop2B2bOrderStatus,
  summarizeWorkshop2B2bOrderStatusChangeRu,
  WORKSHOP2_B2B_ORDER_CONTEXT_TYPE,
  workshop2B2bOrderContextId,
} from '@/lib/production/workshop2-b2b-order-lifecycle';
import { calculateWorkshop2B2bCommission } from '@/lib/production/workshop2-b2b-commission';
import { appendWorkshop2ContextualSystemMessage } from '@/lib/server/workshop2-contextual-messages-repository';
import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';
import { patchWorkshop2B2bOrderStatus } from '@/lib/server/workshop2-b2b-orders-repository';

type RouteCtx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const orderId = id?.trim();
  if (!orderId) {
    return NextResponse.json({ ok: false, messageRu: 'Укажите id заказа.' }, { status: 400 });
  }

  let body: { status?: string; repId?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, messageRu: 'Некорректное тело запроса.' },
      { status: 400 }
    );
  }

  const statusRaw = String(body.status ?? '').trim();
  if (!isWorkshop2B2bOrderStatus(statusRaw)) {
    return NextResponse.json(
      { ok: false, messageRu: 'status: draft|submitted|confirmed|allocated|shipped|cancelled' },
      { status: 400 }
    );
  }

  let commissionPreview: ReturnType<typeof calculateWorkshop2B2bCommission> | undefined;
  if (statusRaw === 'submitted' && body.repId?.trim()) {
    const existing = await import('@/lib/server/workshop2-b2b-orders-repository').then((m) =>
      m.getWorkshop2B2bOrder(orderId)
    );
    if (existing) {
      const line = calculateWorkshop2B2bCommission({
        orderId,
        repId: body.repId.trim(),
        orderTotalRub: existing.totalRub,
      });
      commissionPreview = {
        repId: line.repId,
        commissionRub: line.commissionRub,
        commissionPct: line.commissionPct,
      };
    }
  }

  const result = await patchWorkshop2B2bOrderStatus({
    orderId,
    status: statusRaw,
    commissionPreview,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, code: result.code, messageRu: result.messageRu },
      { status: result.code === 'not_found' ? 404 : 409 }
    );
  }

  if (result.previousStatus !== result.order.status) {
    const collectionId = result.order.collectionId ?? 'SS27';
    const articleId = result.order.articleId ?? 'demo-ss27-01';
    void enqueueWorkshop2DomainEvent({
      type: 'b2b.order.status_changed',
      collectionId,
      articleId,
      payload: {
        orderId,
        from: result.previousStatus,
        to: result.order.status,
        repId: result.order.repId,
        messageRu: summarizeWorkshop2B2bOrderStatusChangeRu({
          orderId,
          from: result.previousStatus,
          to: result.order.status,
        }),
      },
      dispatchNow: true,
    }).catch(() => {
      /* best-effort */
    });
    void appendWorkshop2ContextualSystemMessage({
      contextType: WORKSHOP2_B2B_ORDER_CONTEXT_TYPE,
      contextId: workshop2B2bOrderContextId(orderId),
      message: summarizeWorkshop2B2bOrderStatusChangeRu({
        orderId,
        from: result.previousStatus,
        to: result.order.status,
      }),
    }).catch(() => {
      /* best-effort */
    });
  }

  return NextResponse.json({
    ok: true,
    order: result.order,
    messageRu: `Статус заказа: ${result.order.status}.`,
  });
}
