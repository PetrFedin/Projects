/**
 * GET счёт-оферта — JSON payload (client PDF) или Accept: application/json.
 */
import { NextRequest, NextResponse } from 'next/server';
import { buildWorkshop2SchetOffertaPayload } from '@/lib/production/workshop2-schet-offerta';

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const orderId = id.trim();
  if (!orderId) {
    return NextResponse.json({ ok: false, error: 'invalid_order_id' }, { status: 400 });
  }

  const payload = buildWorkshop2SchetOffertaPayload({
    orderId,
    lines: [
      { name: 'Артикул коллекции (демо)', qty: 10, priceRub: 12_500 },
      { name: 'Доставка (оценка)', qty: 1, priceRub: 3_200 },
    ],
  });

  const accept = req.headers.get('accept') ?? '';
  if (accept.includes('application/json')) {
    return NextResponse.json({ ok: true, payload });
  }

  return NextResponse.json({
    ok: true,
    payload,
    clientPdfHintRu:
      'Сформируйте PDF на клиенте из payload (jsPDF) — stub без фискального чека и без fake bank ACK.',
  });
}
