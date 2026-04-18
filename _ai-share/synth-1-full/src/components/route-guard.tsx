'use client';

import { useAuth } from '@/providers/auth-provider';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, type ReactNode } from 'react';
import { normalizeAuthRoles } from '@/lib/auth/normalize-auth-roles';
import {
  isShopInventoryCrossCabinetPath,
  SHOP_INVENTORY_CROSS_CABINET_ROLES,
  userRolesAllowShopInventoryCrossCabinet,
} from '@/lib/auth/shop-inventory-cross-cabinet';
import { ROUTES } from '@/lib/routes';

/** Roles allowed for each route prefix. Profile keys: admin, brand, shop, retailer, distributor, manufacturer, supplier, client */
const ROUTE_ROLES: Record<string, string[]> = {
<<<<<<< HEAD
  '/admin': ['admin', 'platform_admin'],
=======
  [ROUTES.admin.home]: ['admin', 'platform_admin'],
  '/brand/inventory': ['brand', 'production_manager', 'merchandiser', 'admin', 'platform_admin'],
  '/brand/warehouse': ['brand', 'production_manager', 'manufacturer', 'admin', 'platform_admin'],
  '/brand/logistics': ['brand', 'production_manager', 'finance_manager', 'admin', 'platform_admin'],
>>>>>>> recover/cabinet-wip-from-stash
  '/brand': [
    'brand',
    'brand_admin',
    'brand_owner',
    'manufacturer',
    'supplier',
    'designer',
    'technologist',
    'production_manager',
<<<<<<< HEAD
    'admin',
    'platform_admin',
  ],
  '/shop': ['shop', 'retailer', 'buyer', 'distributor', 'admin', 'platform_admin'],
  '/factory': [
    'manufacturer',
    'supplier',
=======
    'finance_manager',
    'sales_rep',
    'merchandiser',
    'admin',
    'platform_admin',
  ],
  /**
   * Должен идти **перед** `/shop`: иначе `pathname.startsWith('/shop')` схватывает `/shop/inventory`
   * и кабинет brand отрезается от stock-upload (см. unified-ecosystem-smoke).
   */
  '/shop/inventory': [
    ...SHOP_INVENTORY_CROSS_CABINET_ROLES,
    'shop',
    'retailer',
    'buyer',
    'distributor',
    'sales_rep',
    'merchandiser',
    'admin',
    'platform_admin',
  ],
  '/shop': [
    'shop',
    'retailer',
    'buyer',
    'distributor',
    'sales_rep',
    'merchandiser',
    'admin',
    'platform_admin',
  ],
  /**
   * Не использовать общий префикс `/factory`: он совпал бы и с `/factory/supplier`, и с `/factory/production`.
   * Порядок: более длинные префиксы не нужны — `supplier` и `production` не пересекаются.
   */
  [ROUTES.factory.supplier]: ['supplier', 'admin', 'platform_admin'],
  [ROUTES.factory.production]: [
    'manufacturer',
>>>>>>> recover/cabinet-wip-from-stash
    'designer',
    'technologist',
    'production_manager',
    'admin',
    'platform_admin',
  ],
<<<<<<< HEAD
  '/distributor': ['distributor', 'admin', 'platform_admin'],
  '/client': ['client', 'admin', 'platform_admin'],
};

function getRouteRoles(profile: any, user: any): string[] {
  const fromProfile = profile?.user?.roles ?? (profile?.user?.role ? [profile.user.role] : []);
  const fromUser = user?.roles ?? [];
  const merged = Array.isArray(fromProfile) ? fromProfile : [].concat(fromProfile).filter(Boolean);
  return merged.length ? merged : Array.isArray(fromUser) ? fromUser : [];
}

=======
  [ROUTES.distributor.home]: ['distributor', 'admin', 'platform_admin'],
  [ROUTES.client.home]: ['client', 'admin', 'platform_admin'],
};

>>>>>>> recover/cabinet-wip-from-stash
export function RouteGuard({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  const pathname = usePathname() ?? '';
  const router = useRouter();
<<<<<<< HEAD
  const userRoles = useMemo(
    () => getRouteRoles(profile, user),
    [profile?.user?.roles, profile?.user?.role, user?.roles]
  );
=======
  const userRoles = useMemo(() => normalizeAuthRoles(profile, user), [profile, user]);
>>>>>>> recover/cabinet-wip-from-stash

  useEffect(() => {
    if (loading) return;
    // Allow unauthenticated for public routes
    const isPublic =
      pathname === '/' ||
      pathname.startsWith('/b/') ||
      pathname.startsWith('/terms') ||
<<<<<<< HEAD
      pathname.startsWith('/auth');
=======
      pathname.startsWith('/privacy') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/auth') ||
      pathname.startsWith('/o/') ||
      pathname.startsWith('/s/');
>>>>>>> recover/cabinet-wip-from-stash
    if (isPublic) return;
    /** Кросс-кабинет (demo): из brand inventory → stock-sync; не открываем весь `/shop` для brand */
    if (
      isShopInventoryCrossCabinetPath(pathname) &&
      userRolesAllowShopInventoryCrossCabinet(userRoles)
    ) {
      return;
    }
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
