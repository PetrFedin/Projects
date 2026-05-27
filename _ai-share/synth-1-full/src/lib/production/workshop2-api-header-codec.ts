/**
 * Fetch/Headers допускают только ISO-8859-1 (ByteString).
 * Метки actor/displayName и др. кодируем с префиксом utf8: + encodeURIComponent.
 */
const UTF8_PREFIX = 'utf8:';
const PROBE_HEADER = 'x-w2-probe';

function isLatin1HeaderSafe(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) > 0xff) return false;
  }
  return true;
}

/** Кодирует значение для безопасной передачи в fetch (только ASCII в wire). */
export function encodeWorkshop2HeaderValue(value: string): string {
  const trimmed = value.trim().replace(/[\r\n]+/g, ' ');
  if (!trimmed) return trimmed;
  if (isLatin1HeaderSafe(trimmed)) return trimmed;
  return `${UTF8_PREFIX}${encodeURIComponent(trimmed)}`;
}

/** @deprecated используйте encodeWorkshop2HeaderValue */
export const encodeWorkshop2HeaderLabel = encodeWorkshop2HeaderValue;

export function decodeWorkshop2HeaderValue(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (!trimmed.startsWith(UTF8_PREFIX)) return trimmed;
  try {
    return decodeURIComponent(trimmed.slice(UTF8_PREFIX.length));
  } catch {
    return trimmed;
  }
}

/** @deprecated используйте decodeWorkshop2HeaderValue */
export const decodeWorkshop2HeaderLabel = decodeWorkshop2HeaderValue;

/**
 * Приводит значение к формату, принимаемому `fetch` (как Headers ByteString).
 * Authorization не трогаем — JWT должен остаться как есть.
 */
export function toFetchSafeHeaderValue(value: string, options?: { skipProbe?: boolean }): string {
  const trimmed = value.trim().replace(/[\r\n]+/g, ' ');
  if (!trimmed) return trimmed;

  if (!options?.skipProbe && typeof Headers !== 'undefined') {
    try {
      new Headers({ [PROBE_HEADER]: trimmed });
      return trimmed;
    } catch {
      return encodeWorkshop2HeaderValue(trimmed);
    }
  }

  return isLatin1HeaderSafe(trimmed) ? trimmed : encodeWorkshop2HeaderValue(trimmed);
}

export function sanitizeFetchRequestHeaders(
  headers: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (value == null || value === '') continue;
    const lower = key.toLowerCase();
    out[key] = lower === 'authorization' ? value.trim() : toFetchSafeHeaderValue(value);
  }
  return out;
}
