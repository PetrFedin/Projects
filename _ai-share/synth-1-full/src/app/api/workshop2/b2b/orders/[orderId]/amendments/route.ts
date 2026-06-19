import { NextResponse } from 'next/server';
import {
  getPendingWorkshop2B2bAmendment,
  listWorkshop2B2bAmendmentsForOrder,
} from '@/lib/server/workshop2-b2b-amendment-repository';

type RouteCtx = { params: Promise<{ orderId: string }> };

/** GET — список заявок на изменение B2B заказа + pending shortcut. */
export async function GET(_req: Request, ctx: RouteCtx) {
  const { orderId: raw } = await ctx.params;
  const orderId = raw?.trim();
  if (!orderId) {
    return NextResponse.json({ ok: false, messageRu: 'Не указан orderId.' }, { status: 400 });
  }

  const [amendments, pending] = await Promise.all([
    listWorkshop2B2bAmendmentsForOrder(orderId),
    getPendingWorkshop2B2bAmendment(orderId),
  ]);

  return NextResponse.json({ ok: true, amendments, pending });
}
