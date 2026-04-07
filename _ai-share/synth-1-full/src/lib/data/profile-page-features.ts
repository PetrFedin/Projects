/**
 * Единый mapping: профили → главные страницы → ресурсы/фичи.
 * Используется для RouteGuard, INVESTOR_DEMO, фильтрации Brand sidebar по RBAC.
 */

import type { Resource } from '@/lib/rbac';

export type ProfileKey =
  | 'admin'
  | 'brand'
  | 'shop'
  | 'retailer'
  | 'distributor'
  | 'factory'
  | 'manufacturer'
  | 'supplier'
  | 'client';

/** Главная страница профиля и основные маршруты */
export const PROFILE_MAIN_PAGES: Record<ProfileKey, string[]> = {
  admin: ['/admin', '/brand', '/shop', '/factory', '/distributor'],
  brand: ['/brand'],
  shop: ['/shop', '/shop/b2b'],
  retailer: ['/shop', '/shop/b2b'],
  distributor: ['/distributor'],
  factory: ['/factory'],
  manufacturer: ['/factory'],
  supplier: ['/factory'],
  client: ['/client', '/client/wardrobe', '/client/try-before-you-buy', '/client/wishlist', '/client/catalog', '/client/passport', '/client/returns', '/client/gift-registry', '/client/scanner'],
};

/** Resource → основные маршруты (для поиска, breadcrumb) */
export const RESOURCE_TO_ROUTES: Record<Resource, string[]> = {
  brand_profile: ['/brand', '/brand?group=profile'],
  production: ['/brand/production', '/brand/production/operations', '/brand/factories', '/brand/materials'],
  b2b_orders: ['/brand/b2b-orders', '/brand/showroom', '/brand/b2b/linesheets', '/shop/b2b/orders'],
  b2b_catalog: ['/brand/products', '/brand/collections', '/brand/products/matrix', '/shop/b2b/catalog'],
  warehouse: ['/brand/warehouse', '/brand/logistics', '/brand/inventory'],
  finance: ['/brand/finance', '/brand/pricing'],
  compliance: ['/brand/compliance', '/brand/documents', '/brand/disputes'],
  integrations: ['/brand/integrations'],
  team: ['/brand/team', '/brand/messages', '/brand/calendar', '/brand/tasks'],
  analytics: ['/brand/analytics', '/brand/analytics-bi', '/brand/control-center', '/brand/dashboard'],
  edo: ['/brand/documents', '/brand/compliance'],
  settings: ['/brand/settings', '/brand/security', '/brand/subscription'],
};

/** Nav group id → RBAC Resource. Группы без resource видны brand/admin. */
export const NAV_GROUP_RESOURCE: Record<string, Resource> = {
  org: 'brand_profile',
  catalog: 'b2b_catalog',
  production: 'production',
  logistics: 'warehouse',
  b2b: 'b2b_orders',
  partners: 'b2b_orders',
  marketing: 'analytics',
  analytics: 'analytics',
  tools: 'analytics',
};

/** Shop nav group id → Resource. Для фильтрации ритейл-центра по роли. */
export const SHOP_NAV_GROUP_RESOURCE: Record<string, Resource> = {
  overview: 'analytics',
  retail: 'warehouse',
  b2b: 'b2b_orders',
  partners: 'b2b_orders',
  analytics: 'analytics',
  management: 'settings',
};

/** Admin видит всё. Остальные — по can(resource, 'view'). */
export function canSeeNavGroup(
  role: string,
  groupId: string,
  can: (r: Resource, a: 'view') => boolean
): boolean {
  if (role === 'admin') return true;
  const resource = NAV_GROUP_RESOURCE[groupId];
  if (!resource) return true;
  return can(resource, 'view');
}

/** Shop sidebar: admin видит всё, retailer/buyer — по can(). */
export function canSeeShopNavGroup(
  role: string,
  groupId: string,
  can: (r: Resource, a: 'view') => boolean
): boolean {
  if (role === 'admin') return true;
  const resource = SHOP_NAV_GROUP_RESOURCE[groupId];
  if (!resource) return true;
  return can(resource, 'view');
}

export type HubKey = 'admin' | 'brand' | 'shop' | 'factory' | 'distributor' | 'client';

/** Доступ к хаб-страницам по PlatformRole. Для cross-hub навигации. */
export function canAccessHub(role: string, hub: HubKey): boolean {
  if (role === 'admin') return true;
  switch (hub) {
    case 'admin': return role === 'admin';
    case 'brand': return ['brand', 'manufacturer', 'supplier', 'designer', 'technologist', 'production_manager', 'finance_manager', 'sales_rep', 'merchandiser'].includes(role);
    case 'shop': return ['retailer', 'buyer', 'distributor', 'sales_rep', 'merchandiser'].includes(role);
    case 'factory': return ['manufacturer', 'supplier', 'designer', 'technologist', 'production_manager'].includes(role);
    case 'distributor': return role === 'distributor';
    case 'client': return role === 'client';
    default: return false;
  }
}
