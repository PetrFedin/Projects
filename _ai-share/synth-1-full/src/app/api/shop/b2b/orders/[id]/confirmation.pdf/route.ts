/**
 * GET PDF подтверждения B2B-заказа (RU, Wave 22).
 */
import { NextRequest, NextResponse } from 'next/server';
import { buildWorkshop2B2bOrderConfirmationPdfBytes } from '@/lib/production/workshop2-b2b-order-confirmation-pdf';
import { getWorkshop2B2bOrder } from '@/lib/server/workshop2-b2b-orders-repository';

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: RouteCtx) {
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
