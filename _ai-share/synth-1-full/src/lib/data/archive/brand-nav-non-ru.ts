/**
 * Архив: пункты навигации, неактуальные для РФ.
 * Извлечено из brand-navigation.ts для российского фэшн-рынка.
 * 
 * Организация: NetSuite, SAP (ERP); SSO (Google/Microsoft)
 * Логистика: Global Duty Engine (DDP cross-border)
 * B2B: Shopify Sync, Credit Risk Scoring (Western bureaus)
 * Маркетинг: Trend Sentiment (TikTok/Instagram — Meta blocked), Local Inventory (Google Maps), Design Copyright (Western marketplaces)
 * Контент: Instagram в Content Hub
 * Финансы: JOOR Pay
 */

export type ArchivedNavLink = {
  label: string;
  value: string;
  href: string;
  description: string;
  sectionId: string;
};

/** Архивные пункты — для восстановления при расширении на другие рынки */
export const ARCHIVED_NAV_LINKS: ArchivedNavLink[] = [
  { label: 'ERP (NetSuite, SAP)', value: 'erp-plm-western', href: '/brand/integrations/erp-plm', description: 'NetSuite, SAP — Western ERP', sectionId: 'org' },
  { label: 'SSO (Google/Microsoft)', value: 'sso-western', href: '/brand/integrations/sso', description: 'Корпоративная аутентификация Google/Microsoft', sectionId: 'org' },
  { label: 'Global Duty Engine', value: 'duty-calculator', href: '/brand/logistics/duty-calculator', description: 'Расчет пошлин DDP — cross-border Western', sectionId: 'logistics' },
  { label: 'Shopify Sync', value: 'shopify-sync', href: '/brand/shopify-sync', description: 'Синхронизация с Shopify — blocked в РФ', sectionId: 'b2b_wholesale' },
  { label: 'Credit Risk Scoring', value: 'credit-risk', href: '/brand/credit-risk', description: 'Western credit bureaus', sectionId: 'b2b_wholesale' },
  { label: 'Trend Sentiment (TikTok/Instagram)', value: 'trend-sentiment', href: '/brand/marketing/trend-sentiment', description: 'Meta blocked', sectionId: 'marketing' },
  { label: 'Local Inventory (Google Maps)', value: 'local-inventory-ads', href: '/brand/marketing/local-inventory-ads', description: 'Google restricted в РФ', sectionId: 'marketing' },
  { label: 'Design Copyright AI', value: 'design-copyright', href: '/brand/marketing/design-copyright', description: 'Western маркетплейсы', sectionId: 'marketing' },
  { label: 'Content Hub (Instagram)', value: 'content-hub-instagram', href: '/brand/content-hub', description: 'Meta blocked', sectionId: 'content' },
  { label: 'JOOR Pay', value: 'embedded-payment', href: '/brand/finance/embedded-payment', description: 'Western', sectionId: 'finance' },
];
