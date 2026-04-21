/**
 * Регрессия: столпы бренда (`BRAND_CORE_GROUP_ORDER`) согласованы с RBAC mapping в сайдбаре.
 */
jest.mock('lucide-react', () => {
  const C = () => null;
  return new Proxy(
    { __esModule: true },
    {
      get: (_t, prop) => {
        if (prop === '__esModule') return true;
        return C;
      },
    }
  );
});

import { BRAND_CORE_GROUP_ORDER } from '@/lib/data/syntha-nav-clusters';
import { NAV_GROUP_RESOURCE } from '@/lib/data/profile-page-features';

describe('brand navigation group ids (canonical)', () => {
  it('maps every BRAND_CORE_GROUP_ORDER id to RBAC resource (brand sidebar)', () => {
    for (const id of BRAND_CORE_GROUP_ORDER) {
      expect(NAV_GROUP_RESOURCE[id]).toBeDefined();
    }
  });
});
