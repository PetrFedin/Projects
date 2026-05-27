import 'server-only';
import type { NextRequest } from 'next/server';
import { WORKSHOP2_DEFAULT_TZ_BRAND_ORG_ID } from '@/lib/production/workshop2-tz-signatory-options';
import { decodeWorkshop2HeaderValue } from '@/lib/production/workshop2-api-header-codec';
import type { Workshop2ServerActor } from '@/lib/server/workshop2-server-actor';

/** organizationId из query/header для multi-tenant фильтрации. */
export function resolveWorkshop2OrganizationId(req: NextRequest | Request): string {
  const rawOrg = req.headers.get('x-w2-organization-id')?.trim();
  const fromHeader = rawOrg ? decodeWorkshop2HeaderValue(rawOrg) : '';
  if (fromHeader) return fromHeader;
  const url = new URL(req.url);
  const fromQuery = url.searchParams.get('organizationId')?.trim();
  if (fromQuery) return fromQuery;
  return WORKSHOP2_DEFAULT_TZ_BRAND_ORG_ID;
}

/**
 * Метка автора изменений: сессия/API actor → header → body.
 * В production `updated_by` в PG берётся из JWT-сессии, а не только из `x-w2-actor-id`.
 */
export function resolveWorkshop2UpdatedBy(
  req: NextRequest | Request,
  fallback?: string,
  actor?: Workshop2ServerActor
): string | undefined {
  if (actor?.actorLabel?.trim()) return actor.actorLabel.trim().slice(0, 200);
  if (actor?.actorId?.trim()) return actor.actorId.trim().slice(0, 200);
  const trustClientHeaders =
    process.env.NODE_ENV !== 'production' ||
    process.env.WORKSHOP2_TRUST_ACTOR_HEADERS?.trim() === '1' ||
    process.env.WORKSHOP2_TRUST_ACTOR_HEADERS?.trim() === 'true';
  if (trustClientHeaders) {
    const fromHeader = req.headers.get('x-w2-updated-by')?.trim();
    if (fromHeader) return decodeWorkshop2HeaderValue(fromHeader).slice(0, 200);
  }
  const trimmedFallback = fallback?.trim().slice(0, 200);
  if (trimmedFallback) return trimmedFallback;
  return undefined;
}

/** В production PUT досье требует actor из JWT/сессии, не только body. */
export function workshop2RequiresJwtActorForPut(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.NODE_ENV === 'production';
}

/** Сообщение для dev без Postgres. */
export const WORKSHOP2_DB_SETUP_MESSAGE_RU =
  'Настройте WORKSHOP2_DATABASE_URL (PostgreSQL). См. .planning/workshop2-backend-enterprise-plan.md и docker-compose.workshop2.yml';

export function workshop2DatabaseNotConfiguredResponse() {
  return {
    ok: false as const,
    error: 'database_not_configured' as const,
    message: WORKSHOP2_DB_SETUP_MESSAGE_RU,
  };
}
