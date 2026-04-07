/**
 * POST /api/b2b/fashion-cloud/webhook — приём вебхуков от Fashion Cloud (заказы, события).
 * Body: произвольный JSON. Возвращает 200; при необходимости — сохранить заказ в B2B заказы.
 */

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    // TODO: validate signature if FC sends one; persist order to B2B orders if type is order/draft
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }
}
