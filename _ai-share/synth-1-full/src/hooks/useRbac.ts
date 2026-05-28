'use client';

import { useMemo } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { getPlatformRole, canAccess, type Resource, type Action } from '@/lib/rbac';
import type { FastApiSessionProfile } from '@/lib/fastapi-session-profile';
import type { UserProfile } from '@/lib/types';

function normalizeRoles(profile: FastApiSessionProfile | null, user: UserProfile | null): string[] {
  const p = profile;
  const fromProfileRaw =
    p?.user?.roles ?? (p?.user?.role != null && p.user.role !== '' ? [p.user.role] : []);
  const merged = (
    Array.isArray(fromProfileRaw)
      ? fromProfileRaw
      : ([] as unknown[]).concat(fromProfileRaw).filter((v) => v != null && v !== '')
  )
    .map((x) => String(x))
    .filter(Boolean);
  const fromUser = (user?.roles ?? []).map((r) => String(r));
  return merged.length ? merged : fromUser;
}

export function useRbac() {
  const { user, profile } = useAuth();
  const roles = useMemo(() => normalizeRoles(profile, user), [profile, user]);
  const role = useMemo(() => getPlatformRole(roles), [roles]);

  const can = useMemo(
    () => (resource: Resource, action: Action) => canAccess(role, resource, action),
    [role]
  );

  return { role, can, roles };
}
