/**
 * POST /api/integrations/payments/yukassa/create-payment — stub ссылка или инструкция RU.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createWorkshop2YukassaPaymentLink } from '@/lib/production/workshop2-yukassa-stub';

export async function POST(req: NextRequest) {
  let body: { amountRub?: number; descriptionRu?: string; orderId?: string; returnUrl?: string } =
    {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    /* empty body ok */
  }
  const amountRub = Number(body.amountRub ?? 0);
  if (!Number.isFinite(amountRub) || amountRub <= 0) {
    return NextResponse.json(
      { ok: false, error: 'invalid_amount', messageRu: 'Укажите amountRub > 0.' },
      { status: 400 }
    );
  }
  const result = createWorkshop2YukassaPaymentLink({
    amountRub,
    descriptionRu: body.descriptionRu ?? 'Оплата заказа Workshop2',
    orderId: body.orderId,
    returnUrl: body.returnUrl,
  });
  return NextResponse.json({
    ok: result.ok,
    paymentUrl: result.paymentUrl,
    instructionRu: result.instructionRu,
    stub: result.stub,
  });
}
