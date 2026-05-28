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

import { adminNavGroups } from '@/lib/data/admin-navigation-normalized';
import { adminNavPathCandidates } from '@/lib/data/admin-navigation-path-index';
import { getAdminGroupLabel } from '@/lib/data/admin-navigation-layout';

function buildExpected() {
  const candidates: {
    href: string;
    value: string;
    label: string;
    groupLabel: string;
  }[] = [];
  for (const g of adminNavGroups) {
    for (const link of g.links as {
      href: string;
      value: string;
      label: string;
      subsections?: { href: string }[];
    }[]) {
      candidates.push({
        href: link.href,
        value: link.value,
        label: link.label,
        groupLabel: g.label,
      });
      if (link.subsections) {
        for (const sub of link.subsections) {
          candidates.push({
            href: sub.href,
            value: link.value,
            label: link.label,
            groupLabel: g.label,
          });
        }
      }
    }
  }
  return candidates;
}

describe('admin-navigation-path-index sync', () => {
  it('matches adminNavGroups path index', () => {
    expect(adminNavPathCandidates).toEqual(buildExpected());
  });

  it('resolves admin home group label', () => {
    expect(getAdminGroupLabel('/admin')).toBeTruthy();
  });
});
