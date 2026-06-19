import { NextRequest, NextResponse } from 'next/server';

import { buildWorkshop2RepAppointmentsFromOrders } from '@/lib/production/workshop2-rep-appointments';
import { listWorkshop2B2bOrdersAll } from '@/lib/server/workshop2-b2b-orders-repository';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';

/** GET /api/shop/b2b/rep/appointments — встречи rep из PG/file B2B orders. */
export async function GET(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  const repId = req.nextUrl.searchParams.get('repId')?.trim() || undefined;
  const orders = await listWorkshop2B2bOrdersAll();
  const appointments = buildWorkshop2RepAppointmentsFromOrders(orders, repId);
  return NextResponse.json({
    ok: true,
    source: 'b2b_orders',
    appointments,
    messageRu: appointments.length
      ? `Загружено ${appointments.length} встреч из заказов B2B.`
      : 'Нет запланированных встреч — создайте заказ или showroom-сессию.',
  });
}
