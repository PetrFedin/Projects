/**
 * Wave 3 #78: inbound PLM webhook verification stub — partner ACK только при valid signature/env.
 */
import { createHash, timingSafeEqual } from 'node:crypto';

export type Workshop2PlmInboundVerifyResult =
  | { ok: true; mode: 'secret' | 'env_bypass' | 'mock_dev' }
  | { ok: false; mode: 'missing_secret' | 'invalid_signature'; error: string; messageRu: string };

function readHeaderSecret(
  headers: Headers | Record<string, string | undefined>
): string | undefined {
  if (headers instanceof Headers) {
    return (
      headers.get('x-workshop2-secret')?.trim() ||
      headers.get('x-plm-signature')?.trim() ||
      undefined
    );
  }
  const h = headers as Record<string, string | undefined>;
  return h['x-workshop2-secret']?.trim() || h['x-plm-signature']?.trim() || undefined;
}

/** Проверка подписи inbound webhook (stub: shared secret или HMAC body). */
export function verifyWorkshop2PlmInboundWebhook(input: {
  headers: Headers | Record<string, string | undefined>;
  rawBody?: string;
  env?: Record<string, string | undefined>;
}): Workshop2PlmInboundVerifyResult {
  const env = input.env ?? (typeof process !== 'undefined' ? process.env : {});
  const expected = env.WORKSHOP2_PLM_WEBHOOK_SECRET?.trim();
  const bypass = env.WORKSHOP2_PLM_INBOUND_VERIFY_BYPASS === 'true';
  const nodeEnv = env.NODE_ENV ?? process.env.NODE_ENV;

  if (bypass) {
    return { ok: true, mode: 'env_bypass' };
  }

  if (!expected) {
    if (nodeEnv !== 'production') {
      return { ok: true, mode: 'mock_dev' };
    }
    return {
      ok: false,
      mode: 'missing_secret',
      error: 'plm_webhook_secret_missing',
      messageRu:
        'PLM inbound: задайте WORKSHOP2_PLM_WEBHOOK_SECRET — без секрета webhook отклонён (fail-closed).',
    };
  }

  const provided = readHeaderSecret(input.headers);
  if (!provided) {
    return {
      ok: false,
      mode: 'invalid_signature',
      error: 'plm_signature_missing',
      messageRu: 'PLM inbound: отсутствует X-Workshop2-Secret / X-Plm-Signature.',
    };
  }

  if (provided === expected) {
    return { ok: true, mode: 'secret' };
  }

  if (input.rawBody) {
    const digest = createHash('sha256').update(`${expected}:${input.rawBody}`).digest('hex');
    try {
      const a = Buffer.from(provided);
      const b = Buffer.from(digest);
      if (a.length === b.length && timingSafeEqual(a, b)) {
        return { ok: true, mode: 'secret' };
      }
    } catch {
      /* fall through */
    }
  }

  return {
    ok: false,
    mode: 'invalid_signature',
    error: 'plm_signature_invalid',
    messageRu: 'PLM inbound: неверная подпись webhook.',
  };
}

/** Partner ACK разрешён только при live env + valid inbound verification (или explicit bypass). */
export function isWorkshop2PlmPartnerAckAllowed(input: {
  inboundVerified: boolean;
  env?: Record<string, string | undefined>;
}): boolean {
  const env = input.env ?? process.env;
  if (env.WORKSHOP2_PLM_AUTO_ACK === 'true') {
    return Boolean(env.WORKSHOP2_PLM_WEBHOOK_URL?.trim()) && input.inboundVerified;
  }
  const ackUrl =
    env.WORKSHOP2_PLM_PARTNER_ACK_URL?.trim() ||
    env.WORKSHOP2_PLM_EXTERNAL_ACK_ENDPOINT?.trim() ||
    env.WORKSHOP2_PLM_LIVE_TRANSPORT_URL?.trim();
  return Boolean(ackUrl) && input.inboundVerified;
}
