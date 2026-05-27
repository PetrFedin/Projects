/**
 * Регрессия: path-index синхронизирован с clientNavGroups (без lucide в layout shell).
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

import { clientNavGroups } from '@/lib/data/client-navigation';
import {
  clientMainNavLabelByValue,
  clientNavPathCandidates,
} from '@/lib/data/client-navigation-path-index';
import { getClientSectionLabel } from '@/lib/data/client-navigation-layout';

function buildExpectedFromGroups() {
  const candidates: { href: string; value: string; label: string }[] = [];
  const mainByValue: Record<string, string> = {};
  for (const g of clientNavGroups) {
    for (const link of g.links as { href: string; value: string; label: string }[]) {
      mainByValue[link.value] = link.label;
      candidates.push({ href: link.href, value: link.value, label: link.label });
    }
  }
  return { candidates, mainByValue };
}

describe('client-navigation-path-index sync', () => {
  it('matches clientNavGroups href/value/label index', () => {
    const { candidates, mainByValue } = buildExpectedFromGroups();
    expect(clientNavPathCandidates).toEqual(candidates);
    expect(clientMainNavLabelByValue).toEqual(mainByValue);
  });

  it('resolves nested client and cross-hub paths', () => {
    expect(getClientSectionLabel('/client/wardrobe')).toBe('Мой гардероб');
    expect(getClientSectionLabel('/orders')).toBe('Мои заказы');
    expect(getClientSectionLabel('/wallet/history')).toBeTruthy();
    expect(getClientSectionLabel('/academy')).toBeTruthy();
  });
});
