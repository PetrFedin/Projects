import { NextRequest, NextResponse } from 'next/server';
import { workshop2B2bOrderStatusLabelRu } from '@/lib/production/workshop2-b2b-order-lifecycle';
import { workshop2B2bPaymentTermsLabelRu } from '@/lib/production/workshop2-b2b-wave22-parity';
import { workshop2BuyerLabelRu } from '@/lib/order/brand-workshop2-b2b-order-ui';
import { getWorkshop2B2bOrder } from '@/lib/server/workshop2-b2b-orders-repository';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ orderId: string }> };

/** GET — W2 B2B заказ по id (Platform Core / order detail). */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { orderId: raw } = await ctx.params;
  const orderId = raw?.trim();
  if (!orderId) {
    return NextResponse.json({ ok: false, messageRu: 'Не указан orderId.' }, { status: 400 });
  }

  const order = await getWorkshop2B2bOrder(orderId);
  if (!order) {
    return NextResponse.json({ ok: false, messageRu: 'B2B заказ не найден.' }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    order: {
      ...order,
      statusLabelRu: workshop2B2bOrderStatusLabelRu(order.status),
      buyerLabelRu: workshop2BuyerLabelRu(order.buyerId),
      paymentTermsLabelRu: order.paymentTermsRu
        ? workshop2B2bPaymentTermsLabelRu(order.paymentTermsRu)
        : null,
    },
    messageRu: `Заказ ${orderId} · ${workshop2B2bOrderStatusLabelRu(order.status)}.`,
  });
}
