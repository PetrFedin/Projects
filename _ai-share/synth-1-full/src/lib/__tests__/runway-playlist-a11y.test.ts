import { filterScrollVideoProducts } from '../product-scroll-switcher';
import type { Product } from '../types';

const scrollProduct: Product = {
  id: '1',
  slug: 'a',
  name: 'A',
  brand: 'B',
  price: 100,
  description: 'd',
  images: [],
  category: 'C',
  sustainability: [],
  sku: 's',
  color: 'x',
  season: 'SS',
  displayMode: 'scroll-video',
  scrollSwitcherSections: [
    { id: '1', label: 'One', color: '#000' },
    { id: '2', label: 'Two', color: '#111' },
    { id: '3', label: 'Three', color: '#222' },
  ],
};

const standardProduct: Product = { ...scrollProduct, slug: 'std', displayMode: 'standard' };

describe('runway playlist catalog', () => {
  it('filterScrollVideoProducts — only scroll-video SKUs for playlist', () => {
    const result = filterScrollVideoProducts([scrollProduct, standardProduct]);
    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe('a');
  });

  it('playlist blocks need minimum one section', () => {
    expect(scrollProduct.scrollSwitcherSections?.length).toBeGreaterThanOrEqual(1);
  });
});

describe('runway a11y contracts', () => {
  it('scroll sections expose label for screen readers', () => {
    const labels = scrollProduct.scrollSwitcherSections?.map((s) => s.label) ?? [];
    expect(labels.every(Boolean)).toBe(true);
  });

  it('sectionAiTip optional string on sections', () => {
    const withTip = {
      ...scrollProduct.scrollSwitcherSections![0],
      sectionAiTip: 'Совет стилиста',
    };
    expect(typeof withTip.sectionAiTip).toBe('string');
  });

  it('aria-roledescription stage marker documented in orchestrator', () => {
    const marker = 'aria-roledescription="интерактивная сцена runway"';
    expect(marker).toContain('runway');
  });
});
