import 'server-only';
import { timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';
import {
  resolveWorkshop2ActorFromRequest,
  workshop2TrustActorHeaders,
} from '@/lib/server/workshop2-actor-from-request';
import {
  actorHasAnyRole,
  resolveWorkshop2ServerActor,
  type Workshop2ServerActor,
} from '@/lib/server/workshop2-server-actor';
import { isW2TechPackBrowserSameOriginRequest } from '@/lib/server/w2-tech-pack-api-auth';
import {
  workshop2AllowSameOriginBrowser,
  workshop2ApiSecret,
  workshop2DevBypassAuthEnabled,
} from '@/lib/server/workshop2-dev-env';

export {
  workshop2AllowSameOriginBrowser,
  workshop2ApiSecret,
  workshop2DevBypassAuthEnabled,
} from '@/lib/server/workshop2-dev-env';

export { workshop2TrustActorHeaders };

export type Workshop2ApiAuthMode = 'bypass' | 'same_origin' | 'api_secret' | 'actor' | 'session';

export type Workshop2ApiAccess =
  | { ok: true; mode: Workshop2ApiAuthMode; actor?: Workshop2ServerActor }
  | { ok: false; status: number; error: string; message: string };

function safeEq(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, 'utf8');
    const bb = Buffer.from(b, 'utf8');
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

function verifyApiSecret(req: NextRequest): boolean {
  const want = workshop2ApiSecret();
  if (!want) return false;
  const auth = req.headers.get('authorization');
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const xKey = (
    req.headers.get('x-w2-api-key') ??
    req.headers.get('x-workshop2-api-key') ??
    ''
  ).trim();
  return safeEq(bearer, want) || (xKey.length > 0 && safeEq(xKey, want));
}

/**
 * Базовый доступ к `/api/workshop2/*` (async: JWT session → actor).
 * Production: Bearer session, API secret, same-origin+actor, или доверенные actor headers.
 */
export async function assertWorkshop2ApiAccess(
  req: NextRequest,
  opts?: { bodyActorLabel?: string; bodyActorOrganization?: string }
): Promise<Workshop2ApiAccess> {
  if (workshop2DevBypassAuthEnabled()) {
    return { ok: true, mode: 'bypass' };
  }

  if (verifyApiSecret(req)) {
    return { ok: true, mode: 'api_secret' };
  }

  const actorFromRequest = await resolveWorkshop2ActorFromRequest(req, opts);
  if (actorFromRequest.ok && actorFromRequest.source === 'session') {
    return { ok: true, mode: 'session', actor: actorFromRequest.actor };
  }

  if (workshop2AllowSameOriginBrowser() && isW2TechPackBrowserSameOriginRequest(req)) {
    if (actorFromRequest.ok) {
      return { ok: true, mode: 'same_origin', actor: actorFromRequest.actor };
    }
    if (workshop2TrustActorHeaders()) {
      const actorRes = resolveWorkshop2ServerActor(
        req,
        opts?.bodyActorLabel,
        opts?.bodyActorOrganization
      );
      if (actorRes.ok) {
        return { ok: true, mode: 'same_origin', actor: actorRes.actor };
      }
    }
    if (process.env.NODE_ENV !== 'production') {
      return { ok: true, mode: 'same_origin' };
    }
  }

  if (actorFromRequest.ok) {
    return { ok: true, mode: 'actor', actor: actorFromRequest.actor };
  }

  if (workshop2TrustActorHeaders()) {
    const actorRes = resolveWorkshop2ServerActor(
      req,
      opts?.bodyActorLabel,
      opts?.bodyActorOrganization
    );
    if (actorRes.ok) {
      return { ok: true, mode: 'actor', actor: actorRes.actor };
    }
  }

  return {
    ok: false,
    status: 401,
    error: 'unauthorized',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Требуется авторизация (Bearer JWT или API key).'
        : 'Укажите Bearer, x-w2-actor-id/label или WORKSHOP2_DEV_BYPASS_AUTH=true для dev.',
  };
}

/** @deprecated Используйте `assertWorkshop2ApiAccess` (async). */
export function assertWorkshop2ApiAccessSync(
  req: NextRequest,
  opts?: { bodyActorLabel?: string; bodyActorOrganization?: string }
): Workshop2ApiAccess {
  if (workshop2DevBypassAuthEnabled()) {
    return { ok: true, mode: 'bypass' };
  }
  if (verifyApiSecret(req)) {
    return { ok: true, mode: 'api_secret' };
  }
  const actorRes = resolveWorkshop2ServerActor(
    req,
    opts?.bodyActorLabel,
    opts?.bodyActorOrganization
  );
  if (!actorRes.ok) {
    return {
      ok: false,
      status: 401,
      error: 'unauthorized',
      message: 'Требуется авторизация.',
    };
  }
  return { ok: true, mode: 'actor', actor: actorRes.actor };
}

export function assertWorkshop2ApiRole(
  access: Workshop2ApiAccess,
  required: readonly string[]
): Workshop2ApiAccess {
  if (!access.ok) return access;
  if (access.mode === 'bypass' || access.mode === 'api_secret') return access;
  if (!access.actor) {
    if (access.mode === 'same_origin' && process.env.NODE_ENV !== 'production') {
      return access;
    }
    return {
      ok: false,
      status: 403,
      error: 'forbidden',
      message: 'Недостаточно прав для операции.',
    };
  }
  if (!actorHasAnyRole(access.actor, required)) {
    return {
      ok: false,
      status: 403,
      error: 'forbidden',
      message: 'Недостаточно прав для операции.',
    };
  }
  return access;
}

export function workshop2AuthJsonResponse(denied: Extract<Workshop2ApiAccess, { ok: false }>) {
  return {
    ok: false as const,
    error: denied.error,
    message: denied.message,
  };
}
