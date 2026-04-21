/**
 * Регрессия: устаревшие id групп навигации магазина (b2b-procurement / execution / service,
 * inventory-precision) не возвращаются в данных; столпы опта согласованы с SHOP_CORE_GROUP_ORDER.
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

import { SHOP_CORE_GROUP_ORDER } from '@/lib/data/syntha-nav-clusters';
import { SHOP_NAV_GROUP_RESOURCE } from '@/lib/data/profile-page-features';
import {
  SHOP_B2B_HUB_GROUP_IDS,
  SHOP_B2B_NAV_GROUP_IDS,
  shopNavGroups,
} from '@/lib/data/shop-navigation-normalized';

const DEPRECATED_SHOP_GROUP_IDS = [
  'b2b-procurement',
  'b2b-execution',
  'b2b-service',
  'inventory-precision',
] as const;

describe('shop navigation group ids (canonical)', () => {
  it('does not use deprecated group ids in shopNavGroups', () => {
    const ids = shopNavGroups.map((g) => g.id);
    for (const banned of DEPRECATED_SHOP_GROUP_IDS) {
      expect(ids).not.toContain(banned);
    }
  });

  it('keeps B2B sidebar pillar ids aligned with SHOP_CORE_GROUP_ORDER', () => {
    const core = new Set(SHOP_CORE_GROUP_ORDER);
    for (const id of SHOP_B2B_NAV_GROUP_IDS) {
      expect(core.has(id)).toBe(true);
    }
  });

  it('maps every SHOP_CORE_GROUP_ORDER id to RBAC resource (shop sidebar)', () => {
    for (const id of SHOP_CORE_GROUP_ORDER) {
      expect(SHOP_NAV_GROUP_RESOURCE[id]).toBeDefined();
    }
  });

  it('lists expected B2B hub groups including retail and extended opt', () => {
    expect(SHOP_B2B_NAV_GROUP_IDS).toEqual(['partners', 'pim', 'b2b', 'logistics']);
    expect(SHOP_B2B_HUB_GROUP_IDS).toEqual(
      expect.arrayContaining([
        'retail-ops',
        'partners',
        'pim',
        'b2b',
        'logistics',
        'shop-b2b-extended',
        'analytics',
      ])
    );
  });
});
