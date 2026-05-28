/**
 * Stable data-testid helpers for e2e and visual tests.
 */
export const tid = {
  page: (slug: string) => `page-${slug}`,
  header: (slug: string) => `header-${slug}`,
  panel: (slug: string) => `panel-${slug}`,
  panelBody: (slug: string) => `panel-body-${slug}`,
  brandRail: 'brand-rail',
  shopB2bOrdersTable: 'shop-b2b-orders-table',
  orderRow: (orderId: string) => `shop-b2b-order-row-${orderId}`,
  /** `/admin` — HQ dashboard shell */
  adminHqDashboard: 'admin-hq-dashboard',
  /** Brand digital collectibles panel root */
  brandDigitalCollectiblesCreator: 'brand-digital-collectibles-creator',
} as const;
