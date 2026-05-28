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

import { allBrandNavLinks } from '@/lib/data/brand-navigation';
import {
  brandNavMetaByValue,
  brandNavPathCandidates,
} from '@/lib/data/brand-navigation-path-index';
import { getBrandNavTabValue, getBrandSectionLabel } from '@/lib/data/brand-navigation-layout';

function buildExpected() {
  const candidates: {
    href: string;
    value: string;
    label: string;
    description?: string;
  }[] = [];
  const metaByValue: Record<string, { label: string; description?: string }> = {};

  for (const link of allBrandNavLinks as {
    href: string;
    value: string;
    label: string;
    description?: string;
    subsections?: { href: string }[];
  }[]) {
    const description =
      typeof link.description === 'string' && link.description.length > 0
        ? link.description
        : undefined;
    metaByValue[link.value] = { label: link.label, ...(description ? { description } : {}) };
    candidates.push({
      href: link.href,
      value: link.value,
      label: link.label,
      ...(description ? { description } : {}),
    });
    if (link.subsections) {
      for (const sub of link.subsections) {
        candidates.push({
          href: sub.href,
          value: link.value,
          label: link.label,
          ...(description ? { description } : {}),
        });
      }
    }
  }

  return { candidates, metaByValue };
}

describe('brand-navigation-path-index sync', () => {
  it('matches allBrandNavLinks path index', () => {
    const { candidates, metaByValue } = buildExpected();
    expect(brandNavPathCandidates).toEqual(candidates);
    expect(brandNavMetaByValue).toEqual(metaByValue);
  });

  it('resolves brand section labels', () => {
    expect(getBrandSectionLabel('/brand')).toBe('Профиль');
    expect(getBrandNavTabValue('/brand/profile')).toBeTruthy();
  });
});
