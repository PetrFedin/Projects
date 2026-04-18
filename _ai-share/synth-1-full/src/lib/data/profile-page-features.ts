/**
 * Единый mapping: профили → главные страницы → ресурсы/фичи.
 * Используется для RouteGuard, INVESTOR_DEMO, фильтрации Brand sidebar по RBAC.
 */

import type { Resource, PlatformRole } from '@/lib/rbac';
import { ROUTES } from '@/lib/routes';

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
  admin: [
    ROUTES.admin.home,
    ROUTES.brand.home,
    ROUTES.shop.home,
    ROUTES.factory.production,
    ROUTES.factory.supplier,
    ROUTES.distributor.home,
  ],
  brand: ['/brand'],
  /** `/shop` — дашборд; `/shop/b2b` — редирект на `/shop`; сценарии — в сайдбаре. */
  shop: ['/shop', '/shop/b2b'],
  retailer: ['/shop', '/shop/b2b'],
<<<<<<< HEAD
  distributor: ['/distributor'],
  factory: ['/factory'],
  manufacturer: ['/factory'],
  supplier: ['/factory'],
  client: [
    '/client',
=======
  distributor: [ROUTES.distributor.home],
  factory: [ROUTES.factory.production, ROUTES.factory.supplier],
  manufacturer: [ROUTES.factory.production],
  supplier: [ROUTES.factory.supplier],
  client: [
    '/client',
    '/client/me',
>>>>>>> recover/cabinet-wip-from-stash
    '/client/wardrobe',
    '/client/try-before-you-buy',
    '/client/wishlist',
    '/client/catalog',
    '/client/passport',
    '/client/returns',
    '/client/gift-registry',
    '/client/scanner',
  ],
};

/** Resource → основные маршруты (для поиска, breadcrumb) */
export const RESOURCE_TO_ROUTES: Record<Resource, string[]> = {
<<<<<<< HEAD
  brand_profile: ['/brand', '/brand?group=profile'],
=======
  brand_profile: ['/brand/profile', '/brand/profile?group=profile', '/brand?group=profile'],
>>>>>>> recover/cabinet-wip-from-stash
  production: [
    '/brand/production',
    '/brand/production/operations',
    '/brand/factories',
    '/brand/materials',
  ],
<<<<<<< HEAD
  b2b_orders: ['/brand/b2b-orders', '/brand/showroom', '/brand/b2b/linesheets', '/shop/b2b/orders'],
=======
  b2b_orders: [
    ROUTES.brand.b2bOrders,
    '/brand/showroom',
    '/brand/b2b/linesheets',
    '/shop/b2b/orders',
  ],
>>>>>>> recover/cabinet-wip-from-stash
  b2b_catalog: [
    '/brand/products',
    '/brand/collections',
    '/brand/products/matrix',
    '/shop/b2b/catalog',
  ],
  warehouse: ['/brand/warehouse', '/brand/logistics', '/brand/inventory'],
  finance: ['/brand/finance', '/brand/pricing', ROUTES.shop.b2bFinance, ROUTES.shop.b2bPayment],
  compliance: ['/brand/compliance', '/brand/documents', '/brand/disputes'],
  integrations: ['/brand/integrations'],
  team: ['/brand/team', '/brand/messages', '/brand/calendar', '/brand/tasks'],
  analytics: [
    '/brand/analytics',
    '/brand/analytics-bi',
    '/brand/control-center',
    '/brand/dashboard',
<<<<<<< HEAD
  ],
=======
    ROUTES.shop.analytics,
    ROUTES.shop.analyticsFootfall,
    ROUTES.shop.b2bAnalytics,
    ROUTES.shop.b2bOrderAnalytics,
    ROUTES.shop.b2bReports,
    ROUTES.shop.b2bMarginAnalysis,
    ROUTES.shop.b2bMarginReport,
    ROUTES.shop.b2bMarginCalculator,
    ROUTES.shop.b2bLandedCost,
    ROUTES.shop.b2bDeliveryCalendar,
  ],
  /** Кампании, PR-образцы, медиа — группа сайдбара «Маркетинг» (ворота `marketing`). */
  marketing: [
    ROUTES.brand.kickstarter,
    ROUTES.brand.marketingSamples,
    ROUTES.brand.media,
    ROUTES.brand.promotions,
    ROUTES.brand.b2bCampaigns,
  ],
  /** AI, академия, HR — группа «AI и обучение» (ворота `learning`). */
  learning: [ROUTES.brand.aiDesign, ROUTES.brand.aiTools, ROUTES.brand.academy, ROUTES.brand.hrHub],
>>>>>>> recover/cabinet-wip-from-stash
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
  marketing: 'marketing',
  analytics: 'analytics',
  tools: 'learning',
};

/** Shop nav group id → Resource. Для фильтрации ритейл-центра по роли. */
export const SHOP_NAV_GROUP_RESOURCE: Record<string, Resource> = {
  overview: 'analytics',
  /** @deprecated — см. retail-ops, inventory-precision */
  retail: 'warehouse',
  'retail-ops': 'warehouse',
  'inventory-precision': 'warehouse',
  /** @deprecated монолит разбит на секции B2B ниже */
  b2b: 'b2b_orders',
  'b2b-procurement': 'b2b_orders',
  'b2b-execution': 'b2b_orders',
  'b2b-service': 'b2b_orders',
  /** @deprecated старые id групп до схлопывания навигации */
  'b2b-trade-entry': 'b2b_orders',
  'b2b-order-writing': 'b2b_orders',
  'b2b-ops-execution': 'b2b_orders',
  'b2b-ai-experience': 'b2b_orders',
  'b2b-channels-budget': 'b2b_orders',
  partners: 'b2b_orders',
  analytics: 'analytics',
  management: 'settings',
};

/**
 * Уточнение ролей для сайдбара Shop поверх `SHOP_NAV_GROUP_RESOURCE` + `can()`.
 * Если для группы задан список — роль должна входить в него (и пройти проверку resource, если задана).
 * См. `docs/shop-retailer-cabinet-roadmap.md` §4.
 */
export const SHOP_NAV_GROUP_ROLES: Partial<Record<string, readonly PlatformRole[]>> = {
  /** Розница и склад сети: операционные роли, не чистый HQ-buyer. */
  'retail-ops': ['retailer', 'distributor', 'sales_rep', 'merchandiser', 'admin'],
  'inventory-precision': ['retailer', 'distributor', 'merchandiser', 'admin'],
  /** Сеть, бюджет, команда: магазин + финконтур + дистрибутор. */
  management: ['retailer', 'finance_manager', 'distributor', 'admin'],
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

/** Shop sidebar: admin видит всё; далее роль из `SHOP_NAV_GROUP_ROLES` (если есть) и `can()`. */
export function canSeeShopNavGroup(
  role: string,
  groupId: string,
  can: (r: Resource, a: 'view') => boolean
): boolean {
  if (role === 'admin') return true;
  const allowedRoles = SHOP_NAV_GROUP_ROLES[groupId];
  if (allowedRoles?.length) {
    const pr = role as PlatformRole;
    if (!allowedRoles.includes(pr)) return false;
  }
  const resource = SHOP_NAV_GROUP_RESOURCE[groupId];
  if (!resource) return true;
  return can(resource, 'view');
}

export type HubKey = 'admin' | 'brand' | 'shop' | 'factory' | 'supplier' | 'distributor' | 'client';

/** Доступ к хаб-страницам по PlatformRole. Для cross-hub навигации. */
export function canAccessHub(role: string, hub: HubKey): boolean {
  if (role === 'admin') return true;
  switch (hub) {
    case 'admin':
      return role === 'admin';
    case 'brand':
      return [
        'brand',
        'manufacturer',
        'supplier',
        'designer',
        'technologist',
        'production_manager',
        'finance_manager',
        'sales_rep',
        'merchandiser',
      ].includes(role);
    case 'shop':
<<<<<<< HEAD
      return ['retailer', 'buyer', 'distributor', 'sales_rep', 'merchandiser'].includes(role);
    case 'factory':
      return [
        'manufacturer',
        'supplier',
        'designer',
        'technologist',
        'production_manager',
      ].includes(role);
=======
      return [
        'retailer',
        'buyer',
        'distributor',
        'sales_rep',
        'merchandiser',
        'finance_manager',
      ].includes(role);
    case 'factory':
      return ['manufacturer', 'designer', 'technologist', 'production_manager'].includes(role);
    case 'supplier':
      return role === 'supplier';
>>>>>>> recover/cabinet-wip-from-stash
    case 'distributor':
      return role === 'distributor';
    case 'client':
      return role === 'client';
    default:
      return false;
  }
}
