'use client';

import { useMemo } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { getPlatformRole, canAccess, type Resource, type Action } from '@/lib/rbac';

function normalizeRoles(profile: any, user: any): string[] {
  const fromProfile = profile?.user?.roles ?? (profile?.user?.role ? [profile.user.role] : []);
  const fromUser = user?.roles ?? [];
  const merged = Array.isArray(fromProfile) ? fromProfile : [].concat(fromProfile).filter(Boolean);
  return merged.length ? merged : (Array.isArray(fromUser) ? fromUser : []);
}

export function useRbac() {
  const { user, profile } = useAuth();
  const roles = useMemo(() => normalizeRoles(profile, user), [profile?.user?.roles, profile?.user?.role, user?.roles]);
  const role = useMemo(() => getPlatformRole(roles), [roles]);

  const can = useMemo(
    () => (resource: Resource, action: Action) => canAccess(role, resource, action),
    [role]
  );

  return { role, can, roles };
}
