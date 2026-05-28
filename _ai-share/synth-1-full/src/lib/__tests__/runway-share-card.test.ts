import {
  buildRunwayShareCardViewModel,
  formatRunwayShareCardPlainText,
} from '../runway/runway-share-card';
import type { Product, ProductScrollSwitcherSection } from '../types';

const product: Product = {
  id: 'd4',
  slug: 'silk-midi-dress',
  name: 'Silk Midi Dress',
  brand: 'Syntha Atelier',
  price: 38900,
  description: 'test',
  images: [{ id: 'i', url: '/hero.jpg', alt: 'dress', hint: '' }],
  category: 'Dresses',
  sustainability: [],
  sku: 'SYN-D004',
  color: 'Sand',
  season: 'SS',
  displayMode: 'scroll-video',
};

const section: ProductScrollSwitcherSection = {
  id: 'sand',
  label: 'Песочный',
  color: '#C4A882',
  price: 38900,
  thumbImageUrl: '/images/demo/runway/silk-midi-dress-section-0.jpg',
};

describe('runway-share-card', () => {
  it('buildRunwayShareCardViewModel — headline and price', () => {
    const vm = buildRunwayShareCardViewModel(product, section, 0, 'https://x.test/runway');
    expect(vm.headline).toContain('Silk Midi Dress');
    expect(vm.headline).toContain('Песочный');
    expect(vm.priceFormatted).toBe('38 900 ₽');
    expect(vm.thumbUrl).toBe(section.thumbImageUrl);
    expect(vm.shareUrl).toBe('https://x.test/runway');
  });

  it('formatRunwayShareCardPlainText — multiline clipboard', () => {
    const vm = buildRunwayShareCardViewModel(product, section, 1, 'https://x.test/s=1');
    const plain = formatRunwayShareCardPlainText(vm);
    expect(plain).toContain('38');
    expect(plain).toContain('https://x.test/s=1');
  });

  it('buildRunwayShareCardViewModel — fallback thumb from product images', () => {
    const vm = buildRunwayShareCardViewModel(
      product,
      { ...section, thumbImageUrl: undefined },
      0,
      'https://x.test'
    );
    expect(vm.thumbUrl).toBe('/hero.jpg');
  });
});
