/** Добавляет заголовки v1 B2B API (роли актёра) к Init запроса. */
export function withB2BV1ApiActorRoleHeaders(
  init: RequestInit,
  opts?: { authRoleTokens?: string[] }
): RequestInit {
  const headers = new Headers(init.headers ?? undefined);
  if (opts?.authRoleTokens?.length) {
    headers.set('X-B2B-Actor-Roles', opts.authRoleTokens.join(','));
  }
  return { ...init, headers };
}
