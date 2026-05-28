/**
 * Wave 9 RU: ЮKassa stub — status probe без fake payment ACK.
 */
import type { Workshop2ProcessEnvLike } from '@/lib/production/workshop2-live-integration-probes-env';

export type Workshop2YukassaConnectionStatus = 'not_connected' | 'configured' | 'live';

export function probeWorkshop2Yukassa(env: Workshop2ProcessEnvLike = process.env): {
  integrationId: 'yukassa_stub';
  status: Workshop2YukassaConnectionStatus;
  shopIdConfigured: boolean;
  secretConfigured: boolean;
  messageRu: string;
} {
  const shopId = String(env.YUKASSA_SHOP_ID ?? env.WORKSHOP2_YUKASSA_SHOP_ID ?? '').trim();
  const secret = String(env.YUKASSA_SECRET_KEY ?? env.WORKSHOP2_YUKASSA_SECRET_KEY ?? '').trim();
  const shopIdConfigured = Boolean(shopId);
  const secretConfigured = Boolean(secret);
  let status: Workshop2YukassaConnectionStatus = 'not_connected';
  if (shopIdConfigured && secretConfigured) {
    status = 'configured';
  }
  return {
    integrationId: 'yukassa_stub',
    status,
    shopIdConfigured,
    secretConfigured,
    messageRu:
      status === 'not_connected'
        ? 'ЮKassa: не подключено — задайте YUKASSA_SHOP_ID и YUKASSA_SECRET_KEY.'
        : 'ЮKassa: ключи заданы (stub — без списания без live-контракта).',
  };
}

export type Workshop2YukassaCreatePaymentInput = {
  amountRub: number;
  descriptionRu: string;
  orderId?: string;
  returnUrl?: string;
  env?: Workshop2ProcessEnvLike;
};

export type Workshop2YukassaCreatePaymentResult = {
  ok: boolean;
  paymentUrl: string | null;
  instructionRu: string;
  stub: boolean;
};

/**
 * POST create-payment: URL только при заданных ключах; иначе текст инструкции (без fake bank ACK).
 */
export function createWorkshop2YukassaPaymentLink(
  input: Workshop2YukassaCreatePaymentInput
): Workshop2YukassaCreatePaymentResult {
  const env = input.env ?? process.env;
  const probe = probeWorkshop2Yukassa(env);
  const amount = Math.max(0, Math.round(input.amountRub));
  if (probe.status === 'not_connected') {
    return {
      ok: false,
      paymentUrl: null,
      stub: true,
      instructionRu:
        'ЮKassa не подключена: задайте YUKASSA_SHOP_ID и YUKASSA_SECRET_KEY в .env, затем повторите. Без ключей платёжная ссылка не генерируется (нет fake ACK банка).',
    };
  }
  const shopId = String(env.YUKASSA_SHOP_ID ?? env.WORKSHOP2_YUKASSA_SHOP_ID ?? '').trim();
  const orderRef = (input.orderId ?? `w2-${Date.now()}`).replace(/[^\w-]+/g, '-');
  const returnUrl = (input.returnUrl ?? 'https://example.invalid/yukassa-return').trim();
  const paymentUrl = `https://yookassa.ru/checkout/stub?shopId=${encodeURIComponent(shopId)}&amount=${amount}&order=${encodeURIComponent(orderRef)}&return=${encodeURIComponent(returnUrl)}`;
  return {
    ok: true,
    paymentUrl,
    stub: true,
    instructionRu: `Stub-ссылка на оплату ${amount.toLocaleString('ru-RU')} ₽ — live redirect после подключения live API ЮKassa.`,
  };
}
