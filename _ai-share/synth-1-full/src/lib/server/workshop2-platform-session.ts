import 'server-only';
import { canAccess, getPlatformRole } from '@/lib/rbac';

/** Снимок пользователя из Hub/FastAPI `GET /profile/me` (Bearer). */
export type Workshop2PlatformSession = {
  uid: string;
  email?: string;
  displayName: string;
  organizationId: string;
  platformRoles: string[];
  workshop2Roles: string[];
};

function pickString(...vals: unknown[]): string {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

function collectPlatformRoles(data: Record<string, unknown>): string[] {
  const user = (data.user ?? data) as Record<string, unknown>;
  const out = new Set<string>();
  const single = user.role ?? data.role;
  if (typeof single === 'string' && single.trim()) out.add(single.trim());
  const roles = user.roles ?? data.roles;
  if (Array.isArray(roles)) {
    for (const r of roles) {
      if (typeof r === 'string' && r.trim()) out.add(r.trim());
    }
  }
  return [...out];
}

/** Маппинг платформенных ролей → workshop2 API roles (см. `workshop2-route-auth`). */
export function workshop2RolesFromPlatformRoles(userRoles: string[]): string[] {
  const platform = getPlatformRole(userRoles);
  const out: string[] = [];
  if (canAccess(platform, 'production', 'view')) out.push('production:view');
  if (canAccess(platform, 'production', 'edit')) {
    out.push('production:edit', 'w2:audit_read', 'w2:events_read');
  } else if (canAccess(platform, 'production', 'view')) {
    out.push('w2:audit_read');
  }
  return [...new Set(out)];
}

/**
 * Разрешает сессию по Bearer JWT (FastAPI / Hub).
 * Возвращает null при отсутствии токена, ошибке сети или 401.
 */
export async function resolveWorkshop2PlatformSession(
  bearer: string
): Promise<Workshop2PlatformSession | null> {
  const token = bearer.trim();
  if (!token) return null;

  const base = (
    process.env.WORKSHOP2_PROFILE_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    'http://127.0.0.1:8000/api/v1'
  ).replace(/\/$/, '');

  try {
    const res = await fetch(`${base}/profile/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const j = (await res.json()) as Record<string, unknown>;
    const data = (j.data ?? j) as Record<string, unknown>;
    const user = (data.user ?? data) as Record<string, unknown>;

    const uid = pickString(user.id, user.uid, data.uid).slice(0, 128);
    if (!uid) return null;

    const email = pickString(user.email, data.email).slice(0, 200) || undefined;
    const displayName =
      pickString(user.displayName, user.name, data.displayName, email, uid).slice(0, 200) || uid;
    const organizationId = pickString(
      data.activeOrganizationId,
      user.activeOrganizationId,
      data.organizationId
    ).slice(0, 200);

    const platformRoles = collectPlatformRoles(data);
    const workshop2Roles = workshop2RolesFromPlatformRoles(platformRoles);

    return {
      uid,
      email,
      displayName,
      organizationId,
      platformRoles,
      workshop2Roles,
    };
  } catch {
    return null;
  }
}
