/**
 * POST /api/shop/b2b/orders/[id]/reorder — клон последнего заказа (JOOR reorder).
 */
import { NextRequest, NextResponse } from 'next/server';

import { cloneWorkshop2B2bOrderAsReorder } from '@/lib/production/workshop2-b2b-order-lifecycle';
import {
  getWorkshop2B2bOrder,
  putWorkshop2B2bOrder,
} from '@/lib/server/workshop2-b2b-orders-repository';

type RouteCtx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const sourceId = id?.trim();
  if (!sourceId) {
    return NextResponse.json({ ok: false, messageRu: 'Укажите id заказа.' }, { status: 400 });
  }

  const source = await getWorkshop2B2bOrder(sourceId);
  if (!source) {
    return NextResponse.json(
      { ok: false, messageRu: 'Исходный заказ не найден.' },
      { status: 404 }
    );
  }

  let repId: string | undefined;
  try {
    const body = (await req.json()) as { repId?: string };
    repId = body.repId?.trim();
  } catch {
    repId = undefined;
  }

  const newId = `B2B-RE-${Date.now().toString(36)}`;
  const cloned = cloneWorkshop2B2bOrderAsReorder({ source, newId, repId });
  const saved = await putWorkshop2B2bOrder(cloned);
  if (!saved.persisted) {
    return NextResponse.json(
      {
        ok: false,
        messageRu: 'Не удалось сохранить reorder — включите PG или снимите WORKSHOP2_PG_ONLY.',
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    order: cloned,
    sourceOrderId: sourceId,
    messageRu: `Создан черновик повторного заказа ${newId} из ${sourceId}.`,
  });
}
