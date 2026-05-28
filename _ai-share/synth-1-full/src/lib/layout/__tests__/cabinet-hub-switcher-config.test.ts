import {
  DISTRIBUTOR_HUB_SWITCHER,
  FACTORY_PRODUCTION_HUB_SWITCHER,
  FACTORY_SUPPLIER_HUB_SWITCHER,
} from '@/lib/layout/cabinet-hub-switcher-config';
import { ROUTES } from '@/lib/routes';

describe('cabinet-hub-switcher-config', () => {
  it('presets point at canonical hub home routes', () => {
    expect(DISTRIBUTOR_HUB_SWITCHER.map((h) => h.href)).toEqual([
      ROUTES.brand.home,
      ROUTES.shop.home,
      ROUTES.factory.production,
      ROUTES.factory.supplier,
    ]);
    expect(FACTORY_PRODUCTION_HUB_SWITCHER.some((h) => h.hub === 'distributor')).toBe(true);
    expect(FACTORY_SUPPLIER_HUB_SWITCHER.some((h) => h.hub === 'factory')).toBe(true);
  });
});
