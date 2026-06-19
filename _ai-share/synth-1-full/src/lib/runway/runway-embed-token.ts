/**
 * Валидация token для /embed/runway/[slug].
 * RUNWAY_EMBED_REQUIRE_TOKEN=1 — строгий gate (401 JSON в middleware).
 * Без флага — опциональная проверка, если задан NEXT_PUBLIC_RUNWAY_EMBED_TOKEN.
 */

export type RunwayEmbedTokenFailureReason =
  | 'embed_token_not_configured'
  | 'embed_token_missing'
  | 'embed_token_invalid';

export interface RunwayEmbedTokenValidationResult {
  ok: boolean;
  reason?: RunwayEmbedTokenFailureReason;
}

export function isRunwayEmbedTokenRequired(): boolean {
  return process.env.RUNWAY_EMBED_REQUIRE_TOKEN === '1';
}

export function getExpectedRunwayEmbedToken(): string | null {
  const token = process.env.NEXT_PUBLIC_RUNWAY_EMBED_TOKEN?.trim();
  return token || null;
}

/** Чистая проверка token query vs env — unit-testable. */
export function validateRunwayEmbedToken(
  requestToken: string | null | undefined,
  options?: {
    requireToken?: boolean;
    expectedToken?: string | null;
  }
): RunwayEmbedTokenValidationResult {
  const requireToken = options?.requireToken ?? isRunwayEmbedTokenRequired();
  const expectedToken =
    options?.expectedToken !== undefined ? options.expectedToken : getExpectedRunwayEmbedToken();

  if (!requireToken) {
    if (expectedToken && requestToken !== expectedToken) {
      return {
        ok: false,
        reason: requestToken ? 'embed_token_invalid' : 'embed_token_missing',
      };
    }
    return { ok: true };
  }

  if (!expectedToken) {
    return { ok: false, reason: 'embed_token_not_configured' };
  }

  const trimmed = requestToken?.trim();
  if (!trimmed) {
    return { ok: false, reason: 'embed_token_missing' };
  }

  if (trimmed !== expectedToken) {
    return { ok: false, reason: 'embed_token_invalid' };
  }

  return { ok: true };
}

export function buildRunwayEmbedTokenDeniedPayload(reason: RunwayEmbedTokenFailureReason): {
  error: string;
  message: string;
  reason: RunwayEmbedTokenFailureReason;
} {
  const messages: Record<RunwayEmbedTokenFailureReason, string> = {
    embed_token_not_configured:
      'RUNWAY_EMBED_REQUIRE_TOKEN=1, но NEXT_PUBLIC_RUNWAY_EMBED_TOKEN не задан на сервере.',
    embed_token_missing: 'Отсутствует query-параметр token для embed runway.',
    embed_token_invalid: 'Неверный embed token.',
  };

  return {
    error: 'runway_embed_token_denied',
    message: messages[reason],
    reason,
  };
}
