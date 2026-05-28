'use client';

import {
  b2bHubTabLinks,
  b2bNavLinks,
  mainShopNavLinks,
  shopNavGroups,
  type ShopNavLinkFlat,
} from './shop-navigation-data';

const B2B_HUB_TAB_VALUES = new Set<string>(b2bHubTabLinks.map((l) => l.value));

/** Родительский пункт B2B → вкладка таббара, если страница не входит в `b2bHubTabLinks`. */
const B2B_NAV_VALUE_TO_HUB_TAB: Record<string, string> = {
  'b2b-catalog': 'matrix',
  inventory: 'fulfillment-dashboard',
  'trade-events': 'partner-funnel',
  'collection-planning': 'partner-funnel',
  'margin-suite': 'b2b-analytics',
  whiteboard: 'matrix',
  'landed-cost': 'b2b-orders',
  claims: 'b2b-orders',
  'size-mapping': 'partner-funnel',
  'multi-currency': 'payment',
  'indirect-procurement': 'partner-funnel',
  scanner: 'showroom-suite',
  'social-feed': 'ai-suite',
};

/**
 * Активная вкладка горизонтального таббара B2B по URL (сайдбар B2B + аналитика по `/shop/b2b/*`).
 */
export function getB2bHubTabValue(pathname: string): string {
  const candidates: { href: string; parentValue: string }[] = [];
  const push = (href: string, parentValue: string) => {
    candidates.push({ href, parentValue });
  };
  for (const link of b2bNavLinks) {
    push(link.href, link.value);
    if (link.subsections) {
      for (const sub of link.subsections) {
        push(sub.href, link.value);
      }
    }
  }
  for (const g of shopNavGroups) {
    if (g.id !== 'analytics') continue;
    for (const link of g.links as ShopNavLinkFlat[]) {
      if (!link.href.startsWith('/shop/b2b')) continue;
      push(link.href, link.value);
      if (link.subsections) {
        for (const sub of link.subsections) {
          if (!sub.href.startsWith('/shop/b2b')) continue;
          push(sub.href, link.value);
        }
      }
    }
  }
  candidates.sort((a, b) => b.href.length - a.href.length);
  const hit = candidates.find((c) => pathname.startsWith(c.href));
  if (!hit) return 'partner-funnel';
  if (B2B_HUB_TAB_VALUES.has(hit.parentValue)) return hit.parentValue;
  return B2B_NAV_VALUE_TO_HUB_TAB[hit.parentValue] ?? 'partner-funnel';
}

/**
 * Активный пункт верхнего уровня кабинета `/shop/*` по URL (path-index, единый с layout).
 */
export { getMainShopNavTabValue } from './shop-navigation-layout';

export function findShopSubsection(sectionValue: string, subsectionValue: string) {
  const section = mainShopNavLinks.find((link) => link.value === sectionValue);
  return section?.subsections?.find((sub) => sub.value === subsectionValue);
}

export function getShopSubsections(sectionValue: string) {
  const section = mainShopNavLinks.find((link) => link.value === sectionValue);
  return section?.subsections || [];
}

export type ShopNavDisplayMode = 'full' | 'mvp';

/** Режим `mvp`: скрыть пункты с `navTier: 'phase2'`. Задаётся `NEXT_PUBLIC_SHOP_NAV_MVP=1`. */
export function getShopNavDisplayMode(): ShopNavDisplayMode {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SHOP_NAV_MVP === '1') return 'mvp';
  return 'full';
}

export function filterShopNavGroupsByTier(
  groups: typeof shopNavGroups,
  mode: ShopNavDisplayMode
): typeof shopNavGroups {
  if (mode === 'full') return groups;
  return groups.map((g) => ({
    ...g,
    links: g.links.filter((l) => (l as { navTier?: string }).navTier !== 'phase2'),
  })) as typeof shopNavGroups;
}
