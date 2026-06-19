/**
 * POST /api/integrations/payments/stripe/create-payment — stub link or instruction.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createWorkshop2StripePaymentLink } from '@/lib/production/workshop2-stripe-stub';

export async function POST(req: NextRequest) {
  let body: {
    amountCents?: number;
    currency?: string;
    descriptionEn?: string;
    orderId?: string;
    returnUrl?: string;
  } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    /* empty body ok */
  }
  const amountCents = Number(body.amountCents ?? 0);
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return NextResponse.json(
      { ok: false, error: 'invalid_amount', messageEn: 'Provide amountCents > 0.' },
      { status: 400 }
    );
  }
  const result = createWorkshop2StripePaymentLink({
    amountCents,
    currency: body.currency,
    descriptionEn: body.descriptionEn ?? 'Workshop2 order payment',
    orderId: body.orderId,
    returnUrl: body.returnUrl,
  });
  return NextResponse.json({
    ok: result.ok,
    paymentUrl: result.paymentUrl,
    instructionEn: result.instructionEn,
    stub: result.stub,
  });
}
