import { getPlatformRole, type PlatformRole } from '@/lib/rbac';

/**
 * Demo: brand (и смежные роли) могут открыть только ветку `/shop/inventory*`, не весь `/shop`.
 * См. `RouteGuard` и смок `unified-ecosystem-smoke` («Brand ↔ Shop inventory cross-links»).
 */
export const SHOP_INVENTORY_CROSS_CABINET_ROLES = [
  'brand',
  'brand_admin',
  'brand_owner',
  'manufacturer',
  'merchandiser',
  'sales_rep',
] as const;

export function isShopInventoryCrossCabinetPath(pathname: string): boolean {
  return pathname.startsWith('/shop/inventory');
}

export function userRolesAllowShopInventoryCrossCabinet(userRoles: string[]): boolean {
  const allow = new Set<string>(SHOP_INVENTORY_CROSS_CABINET_ROLES);
  return userRoles.some((r) => allow.has(r));
}

const PLATFORM_SHOP_INVENTORY_DEMO: PlatformRole[] = [
  'brand',
  'manufacturer',
  'merchandiser',
  'sales_rep',
];

/**
 * Демо-auth: не подменять сессию на shop@ под `/shop/inventory*`, если роль уже в кросс-контуре.
 */
export function preserveDemoSessionOnShopInventoryPath(
  pathname: string,
  normalizedRoles: string[]
): boolean {
  if (!pathname.startsWith('/shop/inventory')) return false;
  if (userRolesAllowShopInventoryCrossCabinet(normalizedRoles)) return true;
  return PLATFORM_SHOP_INVENTORY_DEMO.includes(getPlatformRole(normalizedRoles));
}
