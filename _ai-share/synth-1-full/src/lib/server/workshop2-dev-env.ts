/**
 * Env-only helpers для Workshop2 — без node:crypto.
 * Импортируется из middleware/edge; api-auth подтягивает crypto отдельно.
 */

/** Dev-only: WORKSHOP2_DEV_BYPASS_AUTH=true (запрещён в production). */
export function workshop2DevBypassAuthEnabled(): boolean {
  if (process.env.NODE_ENV === 'production') return false;
  const v = process.env.WORKSHOP2_DEV_BYPASS_AUTH?.trim();
  return v === '1' || v === 'true';
}

export function workshop2ApiSecret(): string | null {
  return (
    process.env.WORKSHOP2_API_SECRET?.trim() || process.env.W2_TECHPACK_API_SECRET?.trim() || null
  );
}

export function workshop2AllowSameOriginBrowser(): boolean {
  const v = process.env.WORKSHOP2_ALLOW_SAME_ORIGIN_BROWSER?.trim();
  if (v === '0' || v === 'false') return false;
  if (v === '1' || v === 'true') return true;
  return (
    process.env.W2_TECHPACK_ALLOW_SAME_ORIGIN_BROWSER === '1' ||
    process.env.W2_TECHPACK_ALLOW_SAME_ORIGIN_BROWSER === 'true'
  );
}
