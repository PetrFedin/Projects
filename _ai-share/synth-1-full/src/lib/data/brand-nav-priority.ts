/**
 * Приоритет разделов Brand Center.
 * После реструктуризации все ссылки — primary (нет overflow / «Ещё»).
 */
export const PRIMARY_LINK_VALUES: Record<string, string[]> = {
  team: ['team'],
  'brand-admin': ['profile', 'integrations', 'documents', 'settings', 'dashboard'],
  pim: ['pim', 'collections', 'showroom'],
  development: ['workshop2'],
  production: ['shop-floor'],
  'production-live': ['live-production'],
  comms: ['messages', 'calendar'],
  logistics: ['logistics-hub'],
  b2b: ['orders'],
  'b2b-showcase': ['retail-b2b-map', 'brand-trade-shows'],
  'buyer-retail-mirror': [
    'shop-home',
    'shop-b2b-trade-shows',
    'shop-b2b-trade-appointments',
    'shop-discover',
    'shop-b2b-map',
    'shop-b2b-payment',
    'shop-b2b-apply',
    'shop-passport',
    'buyer-applications',
    'shop-fulfillment',
    'shop-rfq',
    'shop-tenders',
    'shop-supplier-discovery',
    'brand-suppliers-rfq',
    'bopis',
  ],
  partners: ['retailers'],
  marketing: ['customer-intelligence', 'campaigns', 'samples', 'media'],
  analytics: ['analytics-360', 'analytics-bi', 'ai-analytics', 'ai-pricing'],
  finance: ['budget-actual', 'finance', 'disputes', 'esg'],
  tools: ['ai-tools', 'academy', 'hr-hub'],
};

export type SecondaryNavItem = {
  link: {
    label: string;
    value: string;
    href: string;
    icon: unknown;
    description?: string;
    subsections?: unknown[];
  };
  sourceGroupId: string;
  sourceGroupLabel: string;
};
