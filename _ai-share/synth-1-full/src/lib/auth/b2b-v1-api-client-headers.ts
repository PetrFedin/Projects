/** Совпадает с `b2b-operational-api-server.ts` / e2e `b2b-v1-api-headers.ts`. */
export type B2BV1OperationalActorRole = 'brand' | 'shop';

const SYNTHA_ACTOR_HEADER = 'x-syntha-api-actor-role' as const;

/** Заголовок tenant/owner для списков и PATCH operational orders (demo read-model фильтр). */
export function b2bV1SynthaActorRoleHeaders(role: B2BV1OperationalActorRole) {
  return { [SYNTHA_ACTOR_HEADER]: role } as const;
}

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
