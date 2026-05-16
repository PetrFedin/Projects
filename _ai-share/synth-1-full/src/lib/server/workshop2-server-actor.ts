import type { NextRequest } from 'next/server';

export type Workshop2ServerActor = {
  actorId: string;
  actorLabel: string;
  actorOrganization: string;
  roles: string[];
};

function readHeader(req: NextRequest, name: string): string {
  return req.headers.get(name)?.trim() ?? '';
}

function parseRoles(raw: string): string[] {
  return raw
    .split(',')
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

function bodyFallbackAllowed(): boolean {
  if (process.env.W2_TZ_ALLOW_BODY_ACTOR?.trim() === '1') return true;
  return process.env.NODE_ENV !== 'production';
}

export function resolveWorkshop2ServerActor(
  req: NextRequest,
  bodyActorLabel?: string,
  bodyActorOrganization?: string
): { ok: true; actor: Workshop2ServerActor } | { ok: false; error: 'actor_required' } {
  const headerActorId = readHeader(req, 'x-w2-actor-id');
  const headerActorLabel = readHeader(req, 'x-w2-actor-label');
  const headerActorOrg = readHeader(req, 'x-w2-actor-org');
  const headerRoles = parseRoles(readHeader(req, 'x-w2-actor-roles'));
  if (headerActorId && headerActorLabel) {
    return {
      ok: true,
      actor: {
        actorId: headerActorId.slice(0, 200),
        actorLabel: headerActorLabel.slice(0, 200),
        actorOrganization: headerActorOrg.slice(0, 200),
        roles: headerRoles,
      },
    };
  }
  if (!bodyFallbackAllowed()) return { ok: false, error: 'actor_required' };
  const fallback = (bodyActorLabel ?? '').trim();
  if (!fallback) return { ok: false, error: 'actor_required' };
  return {
    ok: true,
    actor: {
      actorId: `body:${fallback.slice(0, 120)}`,
      actorLabel: fallback.slice(0, 200),
      actorOrganization: (bodyActorOrganization ?? '').trim().slice(0, 200),
      roles: ['legacy_body_actor'],
    },
  };
}

export function actorHasAnyRole(actor: Workshop2ServerActor, required: readonly string[]): boolean {
  if (!required.length) return true;
  if (actor.roles.includes('legacy_body_actor') && bodyFallbackAllowed()) return true;
  const roleSet = new Set(actor.roles.map((r) => r.toLowerCase()));
  return required.some((r) => roleSet.has(r.toLowerCase()));
}
