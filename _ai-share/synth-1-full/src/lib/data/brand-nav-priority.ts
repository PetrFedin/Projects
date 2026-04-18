/**
 * Приоритет разделов Brand Center.
 * После реструктуризации все ссылки — primary (нет overflow / «Ещё»).
 */
export const PRIMARY_LINK_VALUES: Record<string, string[]> = {
  org: ['profile', 'team', 'integrations', 'documents', 'settings', 'dashboard'],
  catalog: ['collections', 'pim'],
  production: ['shop-floor', 'workshop2', 'factories', 'materials'],
  logistics: ['logistics-hub', 'warehouse', 'bopis', 'suppliers'],
  b2b: ['showroom', 'linesheets', 'orders'],
  partners: ['retailers', 'commercial', 'customer-intelligence', 'disputes'],
  marketing: ['campaigns', 'samples', 'media'],
  analytics: [
    'analytics-360',
    'analytics-bi',
    'budget-actual',
    'ai-analytics',
    'ai-pricing',
    'finance',
    'esg',
  ],
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
