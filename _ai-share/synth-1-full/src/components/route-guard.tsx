'use client';

import { useAuth } from '@/providers/auth-provider';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, type ReactNode } from 'react';

/** Roles allowed for each route prefix. Profile keys: admin, brand, shop, retailer, distributor, manufacturer, supplier, client */
const ROUTE_ROLES: Record<string, string[]> = {
  '/admin': ['admin', 'platform_admin'],
  '/brand': ['brand', 'brand_admin', 'brand_owner', 'manufacturer', 'supplier', 'designer', 'technologist', 'production_manager', 'admin', 'platform_admin'],
  '/shop': ['shop', 'retailer', 'buyer', 'distributor', 'admin', 'platform_admin'],
  '/factory': ['manufacturer', 'supplier', 'designer', 'technologist', 'production_manager', 'admin', 'platform_admin'],
  '/distributor': ['distributor', 'admin', 'platform_admin'],
  '/client': ['client', 'admin', 'platform_admin'],
};

function getRouteRoles(profile: any, user: any): string[] {
  const fromProfile = profile?.user?.roles ?? (profile?.user?.role ? [profile.user.role] : []);
  const fromUser = user?.roles ?? [];
  const merged = Array.isArray(fromProfile) ? fromProfile : [].concat(fromProfile).filter(Boolean);
  return merged.length ? merged : (Array.isArray(fromUser) ? fromUser : []);
}

export function RouteGuard({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const userRoles = useMemo(() => getRouteRoles(profile, user), [profile?.user?.roles, profile?.user?.role, user?.roles]);

  useEffect(() => {
    if (loading) return;
    // Allow unauthenticated for public routes
    const isPublic = pathname === '/' || pathname.startsWith('/b/') || pathname.startsWith('/terms') || pathname.startsWith('/auth');
    if (isPublic) return;
    const allowed = Object.entries(ROUTE_ROLES).find(([prefix]) => pathname.startsWith(prefix));
    if (!allowed) return; // Unknown route, let it through

    const [, roles] = allowed;
    const hasAccess = userRoles.some((r) => roles.includes(r));
    if (!user && !profile) {
      router.replace('/');
      return;
    }
    if (!hasAccess && userRoles.length > 0) {
      router.replace('/');
    }
  }, [loading, user, profile, pathname, router, userRoles]);

  return <>{children}</>;
}
