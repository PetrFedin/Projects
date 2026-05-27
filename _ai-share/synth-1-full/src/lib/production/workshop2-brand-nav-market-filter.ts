/**
 * Wave 11 RU: скрытие global-only пунктов brand nav (JOOR Pay, Shopify sync и т.д.) — код сохранён, UI фильтруется.
 */
import { getWorkshop2MarketProfile } from '@/lib/production/workshop2-market-profile';
import type { brandNavGroups } from '@/lib/data/brand-navigation';

/** value link-ов, скрываемых при market=ru (global-only UX). */
export const WORKSHOP2_BRAND_NAV_HIDDEN_WHEN_RU = new Set<string>([
  'shop-b2b-payment', // JOOR Pay
  'shop-discover', // global marketplace radar (RU использует partners/discover отдельно при global)
]);

export function shouldHideBrandNavLinkForWorkshop2Market(
  linkValue: string,
  env: Record<string, string | undefined> = process.env
): boolean {
  if (getWorkshop2MarketProfile(env) !== 'ru') return false;
  return WORKSHOP2_BRAND_NAV_HIDDEN_WHEN_RU.has(linkValue);
}

export function filterWorkshop2BrandNavGroupsForMarket(
  groups: typeof brandNavGroups,
  env: Record<string, string | undefined> = process.env
): typeof brandNavGroups {
  if (getWorkshop2MarketProfile(env) !== 'ru') return groups;
  return groups
    .map((group) => ({
      ...group,
      links: group.links.filter(
        (link) => !shouldHideBrandNavLinkForWorkshop2Market(link.value, env)
      ),
    }))
    .filter((group) => group.links.length > 0) as typeof brandNavGroups;
}
