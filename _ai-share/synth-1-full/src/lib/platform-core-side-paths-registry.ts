/**
 * Единый реестр side-paths Platform Core: legacy redirects + скрытые подразделы nav.
 * SoT для guards (`*-legacy-redirects.ts`) и `platform-core-nav-augment.ts`.
 */

import {
  PLATFORM_CORE_BRAND_B2B_LEGACY_REDIRECTS,
  type BrandB2bLegacyRedirectRule,
  type BrandB2bLegacyRedirectTarget,
} from '@/lib/platform-core-brand-b2b-legacy-redirects';
import { PLATFORM_CORE_BRAND_SUPPLIERS_LEGACY_REDIRECT } from '@/lib/platform-core-brand-suppliers-legacy-redirect';
import {
  PLATFORM_CORE_SHOP_B2B_LEGACY_REDIRECTS,
  type ShopB2bLegacyRedirectRule,
  type ShopB2bLegacyRedirectTarget,
} from '@/lib/platform-core-shop-b2b-legacy-redirects';

export {
  PLATFORM_CORE_SHOP_B2B_LEGACY_REDIRECTS,
  PLATFORM_CORE_BRAND_B2B_LEGACY_REDIRECTS,
  type ShopB2bLegacyRedirectRule,
  type ShopB2bLegacyRedirectTarget,
  type BrandB2bLegacyRedirectRule,
  type BrandB2bLegacyRedirectTarget,
};

/** Mock B2B-подразделы магазина вне golden path — скрываем в core-сайдбаре. */
export const PLATFORM_CORE_SHOP_B2B_NAV_HIDDEN = [
  'order-mode',
  'create-order',
  'quick-order',
  'order-drafts',
  'order-templates',
  'reorder',
] as const;

/** Mock логистика-подразделы вне golden path (один календарь — comms). */
export const PLATFORM_CORE_SHOP_LOGISTICS_NAV_HIDDEN = [
  'delivery-calendar',
  'fulfillment-dashboard',
  'replenishment',
  'inv-archive',
  'stock-map',
] as const;

/** Mock PIM-подразделы магазина вне golden path. */
export const PLATFORM_CORE_SHOP_PIM_NAV_HIDDEN = [
  'collection-terms',
  'assortment-planning',
  'selection-builder',
] as const;

/** Целые строки PIM магазина вне golden path (side-path планирования и дубль шоурума). */
export const PLATFORM_CORE_SHOP_PIM_LINK_HIDDEN = [
  'collection-planning',
  'showroom-suite',
] as const;

/** Mock подразделы производства (manufacturer) вне golden path. */
export const PLATFORM_CORE_MFR_PRODUCTION_NAV_HIDDEN = [
  'operations',
  'gantt',
  'daily-output',
  'worker-skills',
  'ready-made',
  'nesting',
] as const;

/** Mock PIM-подразделы поставщика вне golden path. */
export const PLATFORM_CORE_SUPPLIER_PIM_NAV_HIDDEN = [
  'materials',
  'reservation',
  'rfq',
  'vmi',
] as const;

export function platformCoreShopB2bNavHiddenSet(): ReadonlySet<string> {
  return new Set(PLATFORM_CORE_SHOP_B2B_NAV_HIDDEN);
}

export function platformCoreShopPimNavHiddenSet(): ReadonlySet<string> {
  return new Set(PLATFORM_CORE_SHOP_PIM_NAV_HIDDEN);
}

export function platformCoreShopPimLinkHiddenSet(): ReadonlySet<string> {
  return new Set(PLATFORM_CORE_SHOP_PIM_LINK_HIDDEN);
}

export function platformCoreShopLogisticsNavHiddenSet(): ReadonlySet<string> {
  return new Set(PLATFORM_CORE_SHOP_LOGISTICS_NAV_HIDDEN);
}

export function platformCoreMfrProductionNavHiddenSet(): ReadonlySet<string> {
  return new Set(PLATFORM_CORE_MFR_PRODUCTION_NAV_HIDDEN);
}

export function platformCoreSupplierPimNavHiddenSet(): ReadonlySet<string> {
  return new Set(PLATFORM_CORE_SUPPLIER_PIM_NAV_HIDDEN);
}

/** Все testId legacy-redirect guards — для e2e и аудита покрытия. */
export function allPlatformCoreLegacyRedirectTestIds(): string[] {
  return [
    ...PLATFORM_CORE_SHOP_B2B_LEGACY_REDIRECTS.map((r) => r.testId),
    ...PLATFORM_CORE_BRAND_B2B_LEGACY_REDIRECTS.map((r) => r.testId),
    PLATFORM_CORE_BRAND_SUPPLIERS_LEGACY_REDIRECT.testId,
  ];
}
