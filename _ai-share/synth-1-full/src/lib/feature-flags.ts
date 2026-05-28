/**
 * Feature flags for new B2B/fashion modules.
 * Override via NEXT_PUBLIC_FEATURE_* (e.g. NEXT_PUBLIC_FEATURE_VIDEO_CONSULTATION=false).
 */

const env: Record<string, string | undefined> =
  typeof process !== 'undefined' && process.env ? { ...process.env } : {};

function flag(name: string, defaultValue: boolean): boolean {
  const key = `NEXT_PUBLIC_FEATURE_${name}`;
  const v = env[key];
  if (v === 'false' || v === '0') return false;
  if (v === 'true' || v === '1') return true;
  return defaultValue;
}

export const featureFlags = {
  videoConsultation: flag('VIDEO_CONSULTATION', true),
  vipRoomBooking: flag('VIP_ROOM_BOOKING', true),
  storeLocator: flag('STORE_LOCATOR', true),
  marginCalculator: flag('MARGIN_CALCULATOR', true),
  multiCurrency: flag('MULTI_CURRENCY', true),
  orderModes: flag('ORDER_MODES', true),
  shopifySync: flag('SHOPIFY_SYNC', true),
  partnerOnboarding: flag('PARTNER_ONBOARDING', true),
  socialFeed: flag('SOCIAL_FEED', true),
  gamification: flag('GAMIFICATION', true),
  flashDeals: flag('FLASH_DEALS', true),
  notificationsCenter: flag('NOTIFICATIONS_CENTER', true),
  unifiedSearchB2B: flag('UNIFIED_SEARCH_B2B', true),
  preOrderB2B: flag('PRE_ORDER_B2B', true),
  tryBeforeBuyB2B: flag('TRY_BEFORE_BUY_B2B', true),
  volumeDiscount: flag('VOLUME_DISCOUNT', true),
  exportOrdersCsv: flag('EXPORT_ORDERS_CSV', true),
  virtualCatwalk: flag('VIRTUAL_CATWALK', true),
  b2bMessages: flag('B2B_MESSAGES', true),
  b2bOnboardingTour: flag('B2B_ONBOARDING_TOUR', true),
  /** Sellty/Compo: личный кабинет дилера с документами и отчётами */
  dealerCabinet: flag('DEALER_CABINET', true),
  /** Fashion Cloud: Smart Replenishment по продажам и остаткам */
  smartReplenishment: flag('SMART_REPLENISHMENT', true),
  /** SparkLayer: списки заказов для быстрого повтора */
  b2bShoppingLists: flag('B2B_SHOPPING_LISTS', true),
  /** AI: черновик заказа из PDF/email (OroCommerce) */
  aiSmartOrder: flag('AI_SMART_ORDER', true),
  /** Uphance: несколько корзин, совместное редактирование */
  b2bMultipleCarts: flag('B2B_MULTIPLE_CARTS', true),
  /** Uphance: избранные товары байера */
  b2bProductFavorites: flag('B2B_PRODUCT_FAVORITES', true),
  /** Uphance: курированные ассортименты */
  b2bAssortmentCuration: flag('B2B_ASSORTMENT_CURATION', true),
  /** Uphance: баннеры — хиты, тренды, скидки */
  b2bProductBanners: flag('B2B_PRODUCT_BANNERS', true),
  /** WizCommerce: объёмные скидки, pack rules */
  b2bVolumePackRules: flag('B2B_VOLUME_PACK_RULES', true),
  /** WizCommerce: AI-поиск и рекомендации */
  b2bAiSearch: flag('B2B_AI_SEARCH', true),
} as const;

export type FeatureFlagKey = keyof typeof featureFlags;

export function isFeatureEnabled(key: FeatureFlagKey): boolean {
  return featureFlags[key] === true;
}
