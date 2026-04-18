import type { UserProfile } from '@/lib/types';

/** Минимальный контракт профиля Hub API (см. `AuthProvider` / synthetic profile). */
type HubLike = {
  user?: { role?: string; roles?: string[] };
};

/**
 * Собирает строковые роли из профиля Hub и локального `UserProfile` для RBAC / RouteGuard.
 */
export function normalizeAuthRoles(
  profile: HubLike | null | undefined,
  user: UserProfile | null | undefined
): string[] {
  const out = new Set<string>();
  const pu = profile?.user;
  if (pu?.role) out.add(String(pu.role));
  if (Array.isArray(pu?.roles)) {
    for (const r of pu.roles) {
      if (r) out.add(String(r));
    }
  }
  if (Array.isArray(user?.roles)) {
    for (const r of user.roles) {
      if (r) out.add(String(r));
    }
  }
  return [...out];
}
