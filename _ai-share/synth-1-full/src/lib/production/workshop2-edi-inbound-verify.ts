/**
 * Wave 4: EDI inbound webhook secret verification (fail-closed без секрета в production).
 */
export type Workshop2EdiInboundVerifyResult =
  | { ok: true }
  | { ok: false; status: 401 | 403; messageRu: string };

export function verifyWorkshop2EdiInboundWebhook(input: {
  authorizationHeader?: string | null;
  secretHeader?: string | null;
  env?: Record<string, string | undefined>;
}): Workshop2EdiInboundVerifyResult {
  const env = input.env ?? process.env;
  const expected = String(env.WORKSHOP2_EDI_WEBHOOK_SECRET ?? '').trim();
  if (!expected) {
    if (process.env.NODE_ENV === 'production') {
      return {
        ok: false,
        status: 403,
        messageRu:
          'EDI inbound: задайте WORKSHOP2_EDI_WEBHOOK_SECRET — без секрета webhook отклонён (fail-closed).',
      };
    }
    return { ok: true };
  }

  const provided =
    input.secretHeader?.trim() ||
    input.authorizationHeader?.replace(/^Bearer\s+/i, '').trim() ||
    '';
  if (provided !== expected) {
    return { ok: false, status: 401, messageRu: 'EDI inbound: неверный секрет webhook.' };
  }
  return { ok: true };
}
