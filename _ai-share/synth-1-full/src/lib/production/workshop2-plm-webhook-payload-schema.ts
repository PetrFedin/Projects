/**
 * Wave P — строгая схема PLM webhook receipt (fail-closed до journal persist).
 */
export type Workshop2PlmWebhookPayload = {
  collectionId: string;
  articleId: string;
  eventId: string;
  actor?: string;
  payload?: Record<string, unknown>;
};

export type Workshop2PlmWebhookValidationResult =
  | { ok: true; data: Workshop2PlmWebhookPayload }
  | { ok: false; error: string; messageRu: string; fieldErrors?: string[] };

const ID_PATTERN = /^[\w.-]{1,128}$/;

function nonEmptyString(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length ? t : null;
}

/** Валидация тела POST /api/workshop2/plm/webhook-receipt. */
export function validateWorkshop2PlmWebhookPayload(
  body: unknown
): Workshop2PlmWebhookValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      ok: false,
      error: 'invalid_body',
      messageRu: 'PLM webhook: тело запроса должно быть JSON-объектом.',
    };
  }

  const raw = body as Record<string, unknown>;
  const fieldErrors: string[] = [];

  const collectionId = nonEmptyString(raw.collectionId);
  if (!collectionId) fieldErrors.push('collectionId');
  else if (!ID_PATTERN.test(collectionId)) fieldErrors.push('collectionId:format');

  const articleId = nonEmptyString(raw.articleId);
  if (!articleId) fieldErrors.push('articleId');
  else if (!ID_PATTERN.test(articleId)) fieldErrors.push('articleId:format');

  const eventId = nonEmptyString(raw.eventId) ?? nonEmptyString(raw.id);
  if (!eventId) fieldErrors.push('eventId');
  else if (eventId.length > 256) fieldErrors.push('eventId:length');

  const actor = nonEmptyString(raw.actor) ?? undefined;

  let payload: Record<string, unknown> | undefined;
  if (raw.payload !== undefined) {
    if (!raw.payload || typeof raw.payload !== 'object' || Array.isArray(raw.payload)) {
      fieldErrors.push('payload:type');
    } else {
      payload = raw.payload as Record<string, unknown>;
    }
  }

  if (fieldErrors.length) {
    return {
      ok: false,
      error: 'schema_validation_failed',
      messageRu: `PLM webhook: некорректная схема (${fieldErrors.join(', ')}) — journal не записан.`,
      fieldErrors,
    };
  }

  return {
    ok: true,
    data: {
      collectionId: collectionId!,
      articleId: articleId!,
      eventId: eventId!,
      ...(actor ? { actor } : {}),
      ...(payload ? { payload } : {}),
    },
  };
}
