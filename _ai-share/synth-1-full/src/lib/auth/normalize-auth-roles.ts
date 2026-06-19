import type { FastApiSessionProfile } from '@/lib/fastapi-session-profile';
import type { UserProfile } from '@/lib/types';

/**
 * Собирает строковые роли из профиля Hub и локального `UserProfile` для RBAC / RouteGuard.
 */
export function normalizeAuthRoles(
  profile: FastApiSessionProfile | null | undefined,
  user: UserProfile | null | undefined
): string[] {
  const out = new Set<string>();
  const pu = profile?.user;
  if (typeof pu?.role === 'string' && pu.role) out.add(pu.role);
  if (Array.isArray(pu?.roles)) {
    for (const r of pu.roles) {
      if (typeof r === 'string' && r) out.add(r);
    }
  }
  if (Array.isArray(user?.roles)) {
    for (const r of user.roles) {
      if (r) out.add(String(r));
    }
  }
  return [...out];
}
