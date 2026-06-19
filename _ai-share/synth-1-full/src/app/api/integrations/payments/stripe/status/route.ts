/**
 * GET /api/integrations/payments/stripe/status — stub probe Stripe.
 */
import { probeWorkshop2Stripe } from '@/lib/production/workshop2-stripe-stub';
import { NextResponse } from 'next/server';

export async function GET() {
  const probe = probeWorkshop2Stripe();
  return NextResponse.json({
    ok: true,
    provider: 'stripe',
    ...probe,
  });
}
