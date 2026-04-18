import {
  dedupeEntityLinksByHref,
  finalizeRelatedModuleLinks,
  getIntegrationsLinks,
} from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { SHOP_B2B_ORDERS_HUB_LABEL } from '@/lib/ui/b2b-registry-label';

describe('entity-links — RelatedModules / B2B shop hub (full contour)', () => {
  it('dedupeEntityLinksByHref merges legacy /shop/b2b-orders with canonical /shop/b2b/orders', () => {
    const links = [
      { label: SHOP_B2B_ORDERS_HUB_LABEL, href: ROUTES.shop.b2bOrdersLegacy! },
      { label: SHOP_B2B_ORDERS_HUB_LABEL, href: ROUTES.shop.b2bOrders! },
    ];
    const d = dedupeEntityLinksByHref(links);
    expect(d).toHaveLength(1);
    expect(d[0].href).toBe(ROUTES.shop.b2bOrders);
  });

  it('finalizeRelatedModuleLinks exposes at most one «B2B Заказы» hub label', () => {
    const links = [
      { label: SHOP_B2B_ORDERS_HUB_LABEL, href: ROUTES.shop.b2bOrdersLegacy! },
      { label: SHOP_B2B_ORDERS_HUB_LABEL, href: ROUTES.shop.b2bOrders! },
    ];
    const f = finalizeRelatedModuleLinks(links);
    expect(f.filter((l) => l.label === SHOP_B2B_ORDERS_HUB_LABEL)).toHaveLength(1);
  });

  it('getIntegrationsLinks + finalizeRelatedModuleLinks stays stable (no duplicate hub rows)', () => {
    const f = finalizeRelatedModuleLinks(getIntegrationsLinks());
    const hub = f.filter((l) => l.label === SHOP_B2B_ORDERS_HUB_LABEL);
    expect(hub.length).toBeLessThanOrEqual(1);
  });
});
