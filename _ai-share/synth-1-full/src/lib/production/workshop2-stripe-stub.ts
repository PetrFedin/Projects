/**
 * Stripe stub — mirrors workshop2-yukassa-stub for international payments.
 */
import type { Workshop2ProcessEnvLike } from '@/lib/production/workshop2-live-integration-probes-env';

export type Workshop2StripeConnectionStatus = 'not_connected' | 'configured' | 'live';

export function probeWorkshop2Stripe(env: Workshop2ProcessEnvLike = process.env): {
  integrationId: 'stripe_stub';
  status: Workshop2StripeConnectionStatus;
  secretConfigured: boolean;
  messageEn: string;
} {
  const secret = String(env.STRIPE_SECRET_KEY ?? env.WORKSHOP2_STRIPE_SECRET_KEY ?? '').trim();
  const secretConfigured = Boolean(secret);
  const status: Workshop2StripeConnectionStatus = secretConfigured ? 'configured' : 'not_connected';
  return {
    integrationId: 'stripe_stub',
    status,
    secretConfigured,
    messageEn:
      status === 'not_connected'
        ? 'Stripe: not connected — set STRIPE_SECRET_KEY.'
        : 'Stripe: secret configured (stub — no live charge without live API contract).',
  };
}

export type Workshop2StripeCreatePaymentInput = {
  amountCents: number;
  currency?: string;
  descriptionEn?: string;
  orderId?: string;
  returnUrl?: string;
  env?: Workshop2ProcessEnvLike;
};

export type Workshop2StripeCreatePaymentResult = {
  ok: boolean;
  paymentUrl: string | null;
  instructionEn: string;
  stub: boolean;
};

export function createWorkshop2StripePaymentLink(
  input: Workshop2StripeCreatePaymentInput
): Workshop2StripeCreatePaymentResult {
  const env = input.env ?? process.env;
  const probe = probeWorkshop2Stripe(env);
  const amount = Math.max(0, Math.round(input.amountCents));
  const currency = (input.currency ?? 'usd').toLowerCase();
  if (probe.status === 'not_connected') {
    return {
      ok: false,
      paymentUrl: null,
      stub: true,
      instructionEn:
        'Stripe not connected: set STRIPE_SECRET_KEY in .env, then retry. No payment URL without keys.',
    };
  }
  const orderRef = (input.orderId ?? `w2-${Date.now()}`).replace(/[^\w-]+/g, '-');
  const returnUrl = (input.returnUrl ?? 'https://example.invalid/stripe-return').trim();
  const paymentUrl = `https://checkout.stripe.com/stub?amount=${amount}&currency=${currency}&order=${encodeURIComponent(orderRef)}&return=${encodeURIComponent(returnUrl)}`;
  return {
    ok: true,
    paymentUrl,
    stub: true,
    instructionEn: `Stub payment link for ${amount} ${currency.toUpperCase()} — live redirect after Stripe live API.`,
  };
}
