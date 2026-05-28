import 'server-only';
import type { NextRequest } from 'next/server';
import {
  resolveWorkshop2ServerActor,
  type Workshop2ServerActor,
} from '@/lib/server/workshop2-server-actor';
import { resolveWorkshop2PlatformSession } from '@/lib/server/workshop2-platform-session';

/** Dev или явный флаг — доверять x-w2-actor-* без JWT. */
export function workshop2TrustActorHeaders(): boolean {
  return (
    process.env.NODE_ENV !== 'production' ||
    process.env.WORKSHOP2_TRUST_ACTOR_HEADERS?.trim() === '1' ||
    process.env.WORKSHOP2_TRUST_ACTOR_HEADERS?.trim() === 'true'
  );
}

function readBearer(req: NextRequest | Request): string {
  const auth = req.headers.get('authorization');
  const fromHeader = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (fromHeader) return fromHeader;
  if ('cookies' in req) {
    const cookieToken = (req as NextRequest).cookies.get('syntha_access_token')?.value?.trim();
    if (cookieToken) return cookieToken;
  }
  return '';
}

function sessionToActor(
  session: NonNullable<Awaited<ReturnType<typeof resolveWorkshop2PlatformSession>>>
): Workshop2ServerActor {
  return {
    actorId: session.uid,
    actorLabel: session.displayName,
    actorOrganization: session.organizationId,
    roles: session.workshop2Roles,
  };
}

/**
 * Актор для workshop2 API: в production приоритет — JWT/Bearer сессия Hub;
 * заголовки `x-w2-actor-*` — только dev или при `WORKSHOP2_TRUST_ACTOR_HEADERS=1`.
 */
export async function resolveWorkshop2ActorFromRequest(
  req: NextRequest,
  opts?: { bodyActorLabel?: string; bodyActorOrganization?: string }
): Promise<
  { ok: true; actor: Workshop2ServerActor; source: 'session' | 'header' | 'body' } | { ok: false }
> {
  const bearer = readBearer(req);
  if (bearer) {
    const session = await resolveWorkshop2PlatformSession(bearer);
    if (session && session.workshop2Roles.length > 0) {
      return { ok: true, actor: sessionToActor(session), source: 'session' };
    }
    if (session) {
      return {
        ok: true,
        actor: { ...sessionToActor(session), roles: ['production:view'] },
        source: 'session',
      };
    }
  }

  const trustHeaders = workshop2TrustActorHeaders();

  if (trustHeaders) {
    const headerRes = resolveWorkshop2ServerActor(
      req,
      opts?.bodyActorLabel,
      opts?.bodyActorOrganization
    );
    if (headerRes.ok) {
      return {
        ok: true,
        actor: headerRes.actor,
        source: headerRes.actor.actorId.startsWith('body:') ? 'body' : 'header',
      };
    }
  }

  return { ok: false };
}
