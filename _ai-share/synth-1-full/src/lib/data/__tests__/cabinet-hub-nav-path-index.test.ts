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

import { distributorNavGroups } from '@/lib/data/distributor-navigation';
import { manufacturerNavGroups, supplierNavGroups } from '@/lib/data/factory-navigation';
import { distributorNavPathCandidates } from '@/lib/data/distributor-navigation-path-index';
import { factoryMfrNavPathCandidates } from '@/lib/data/factory-mfr-navigation-path-index';
import { factorySupNavPathCandidates } from '@/lib/data/factory-sup-navigation-path-index';
import { getDistributorSectionLabel } from '@/lib/data/distributor-navigation-layout';
import {
  getFactoryMfrSectionLabel,
  getFactorySupSectionLabel,
} from '@/lib/data/factory-navigation-layout';

function buildExpected(groups: { links: unknown[] }[]) {
  const candidates: { href: string; label: string }[] = [];
  for (const g of groups) {
    for (const link of g.links as {
      href: string;
      label: string;
      subsections?: { href: string; label: string }[];
    }[]) {
      candidates.push({ href: link.href, label: link.label });
      if (link.subsections) {
        for (const sub of link.subsections) {
          candidates.push({ href: sub.href, label: sub.label });
        }
      }
    }
  }
  return candidates;
}

describe('cabinet hub nav path-index sync', () => {
  it('distributor path-index matches distributorNavGroups', () => {
    expect(distributorNavPathCandidates).toEqual(buildExpected(distributorNavGroups));
  });

  it('factory mfr path-index matches manufacturerNavGroups', () => {
    expect(factoryMfrNavPathCandidates).toEqual(buildExpected(manufacturerNavGroups));
  });

  it('factory sup path-index matches supplierNavGroups', () => {
    expect(factorySupNavPathCandidates).toEqual(buildExpected(supplierNavGroups));
  });

  it('resolves section labels from path-index', () => {
    expect(getDistributorSectionLabel('/distributor')).toBeTruthy();
    expect(getFactoryMfrSectionLabel('/factory/production')).toBeTruthy();
    expect(getFactorySupSectionLabel('/factory/supplier')).toBeTruthy();
  });
});
