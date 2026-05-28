/**
 * Регрессия: path-index синхронизирован с shopNavGroups (без lucide в layout).
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

import { shopNavGroups } from '@/lib/data/shop-navigation-data';
import {
  shopMainNavLabelByValue,
  shopNavPathCandidates,
} from '@/lib/data/shop-navigation-path-index';
import { getMainShopNavTabValue } from '@/lib/data/shop-navigation-layout';

function buildExpectedFromGroups() {
  const candidates: { href: string; value: string; label: string }[] = [];
  const mainByValue: Record<string, string> = {};
  for (const g of shopNavGroups) {
    for (const link of g.links as {
      href: string;
      value: string;
      label: string;
      subsections?: { href: string; value: string; label: string }[];
    }[]) {
      mainByValue[link.value] = link.label;
      candidates.push({ href: link.href, value: link.value, label: link.label });
      if (link.subsections) {
        for (const sub of link.subsections) {
          candidates.push({ href: sub.href, value: link.value, label: link.label });
        }
      }
    }
  }
  return { candidates, mainByValue };
}

describe('shop-navigation-path-index sync', () => {
  it('matches shopNavGroups href/value/label index', () => {
    const { candidates, mainByValue } = buildExpectedFromGroups();
    expect(shopNavPathCandidates).toEqual(candidates);
    expect(shopMainNavLabelByValue).toEqual(mainByValue);
  });

  it('resolves nested shop paths to parent section value', () => {
    expect(getMainShopNavTabValue('/shop/orders')).toBe('orders');
    expect(getMainShopNavTabValue('/shop/b2b/matrix')).toBeTruthy();
  });
});
