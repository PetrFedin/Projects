import 'server-only';

import { resolveWorkshop2PlatformSession } from '@/lib/server/workshop2-platform-session';

const RUNWAY_USER_ID_HEADER = 'x-runway-user-id';

function readBearerFromRequest(request: Request): string {
  const auth = request.headers.get('authorization');
  const fromHeader = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (fromHeader) return fromHeader;

  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(/(?:^|;\s*)syntha_access_token=([^;]+)/);
  return match?.[1] ? decodeURIComponent(match[1]).trim() : '';
}

/**
 * userId из JWT-сессии (Bearer / syntha_access_token cookie).
 * Возвращает uid платформы или null при отсутствии/невалидной сессии.
 */
export async function resolveRunwaySessionUserId(request: Request): Promise<string | null> {
  const bearer = readBearerFromRequest(request);
  if (!bearer) return null;

  const session = await resolveWorkshop2PlatformSession(bearer);
  return session?.uid?.trim() || null;
}

/** userId из X-Runway-User-Id (dev) или query/body fallback. */
export function resolveRunwayPreferencesUserId(
  request: Request,
  fallbackUserId?: string | null
): string | null {
  const headerUserId = request.headers.get(RUNWAY_USER_ID_HEADER)?.trim();
  if (headerUserId) return headerUserId;

  const queryUserId = new URL(request.url).searchParams.get('userId')?.trim();
  if (queryUserId) return queryUserId;

  const bodyUserId = fallbackUserId?.trim();
  if (bodyUserId) return bodyUserId;

  return null;
}

/**
 * Приоритет: JWT session → dev header/query/body.
 * Production: session cookie/header; dev fallback сохранён для mock auth без JWT.
 */
export async function resolveRunwayPreferencesUserIdWithSession(
  request: Request,
  fallbackUserId?: string | null
): Promise<string | null> {
  const sessionUserId = await resolveRunwaySessionUserId(request);
  if (sessionUserId) return sessionUserId;
  return resolveRunwayPreferencesUserId(request, fallbackUserId);
}

export { RUNWAY_USER_ID_HEADER };
