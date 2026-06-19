/**
 * Реестр экранов вне golden path, которые ещё на placeholder-data / статичном JSON.
 * Platform Core: показывать `PlatformCoreDemoDataBadge` или мигрировать на API/PG.
 */
export type PlatformCorePlaceholderSurface = {
  route: string;
  /** Если true — совпадение по префиксу pathname (напр. `/brand/merch/*`). */
  routePrefix?: boolean;
  pillar?: string;
  source: 'placeholder-data' | 'static-json' | 'localStorage';
  noteRu: string;
};

export function matchPlatformCorePlaceholderSurface(
  pathname: string,
  surfaces: readonly PlatformCorePlaceholderSurface[] = PLATFORM_CORE_PLACEHOLDER_SURFACES
): PlatformCorePlaceholderSurface | undefined {
  const path = pathname.replace(/\/$/, '') || '/';
  return surfaces.find((s) =>
    s.routePrefix ? path === s.route || path.startsWith(`${s.route}/`) : path === s.route
  );
}

export const PLATFORM_CORE_PLACEHOLDER_SURFACES: readonly PlatformCorePlaceholderSurface[] = [
  {
    route: '/brand/analytics',
    pillar: 'sample_collection',
    source: 'placeholder-data',
    noteRu: 'brands + /data/products.json — KPI вне PG spine',
  },
  {
    route: '/brand/collaborations',
    source: 'placeholder-data',
    noteRu: 'brands seed',
  },
  {
    route: '/brand/suppliers',
    source: 'static-json',
    noteRu: 'legacy suppliers page — вне core cabinet',
  },
  {
    route: '/shop',
    source: 'static-json',
    noteRu: 'виджеты дашборда магазина — demo alerts',
  },
  {
    route: '/shop/b2b/rfq',
    pillar: 'comms',
    source: 'static-json',
    noteRu: 'RFQ-free core — чат вместо RFQ; legacy redirect в comms/orders',
  },
  {
    route: '/brand/production/workshop2/investor-summary',
    pillar: 'development',
    source: 'static-json',
    noteRu: 'investor path — readiness+brief read-only, вне Platform Core golden hub',
  },
  {
    route: '/brand/merch',
    routePrefix: true,
    source: 'static-json',
    noteRu: 'merch cluster (~41 mock screens) — вне golden spine; только archive в full app',
  },
  {
    route: '/brand/merchandising',
    routePrefix: true,
    source: 'static-json',
    noteRu: 'legacy merchandising hub — mock KPI, не pillar',
  },
];
