/**
 * GET PDF подтверждения B2B-заказа (RU, Wave 22).
 */
import { NextRequest, NextResponse } from 'next/server';
import { buildWorkshop2B2bOrderConfirmationPdfBytes } from '@/lib/production/workshop2-b2b-order-confirmation-pdf';
import { getWorkshop2B2bOrder } from '@/lib/server/workshop2-b2b-orders-repository';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  const { id } = await ctx.params;
  const orderId = id.trim();
  if (!orderId) {
    return NextResponse.json({ ok: false, messageRu: 'Некорректный id заказа.' }, { status: 400 });
  }

  const order = await getWorkshop2B2bOrder(orderId);
  if (!order) {
    return NextResponse.json({ ok: false, messageRu: 'B2B заказ не найден.' }, { status: 404 });
  }

  const bytes = buildWorkshop2B2bOrderConfirmationPdfBytes(order);
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="b2b-order-${orderId}.pdf"`,
    },
  });
}
