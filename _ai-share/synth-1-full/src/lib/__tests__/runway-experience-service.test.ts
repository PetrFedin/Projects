import { mergeProductWithOverrides, patchProductOverride } from '../runway/RunwayExperienceService';
import {
  applyBrandOverridesToProduct,
  mergeProductsWithRunwayOverrides,
} from '../brand-runway-overrides';
import type { Product } from '../types';

const base: Product = {
  id: '1',
  slug: 'runway-tee',
  name: 'Runway Tee',
  brand: 'Nordic Wool',
  price: 5000,
  description: 'test',
  images: [{ id: 'i', url: '/x.jpg', alt: 'x', hint: '' }],
  category: 'Tops',
  sustainability: [],
  sku: 'RW-1',
  color: 'Black',
  season: 'SS',
  displayMode: 'scroll-video',
};

describe('RunwayExperienceService', () => {
  it('mergeProductWithOverrides — патч displayMode и scrollVideoUrl', () => {
    const overrides = {
      'Nordic Wool': {
        'runway-tee': { scrollVideoUrl: '/videos/custom.mp4' },
      },
    };
    const merged = mergeProductWithOverrides(base, overrides);
    expect(merged.scrollVideoUrl).toBe('/videos/custom.mp4');
    expect(merged.displayMode).toBe('scroll-video');
  });

  it('mergeProductsWithRunwayOverrides — без overrides возвращает исходный массив', () => {
    const result = mergeProductsWithRunwayOverrides([base], {});
    expect(result[0]).toEqual(base);
  });

  it('patchProductOverride — добавляет запись бренда', () => {
    const next = patchProductOverride({}, 'Nordic Wool', 'runway-tee', {
      featuredScrollExperience: true,
    });
    expect(next['Nordic Wool']?.['runway-tee']?.featuredScrollExperience).toBe(true);
  });

  it('applyBrandOverridesToProduct — патч одного SKU', () => {
    const overrides = {
      'Nordic Wool': {
        'runway-tee': { scrollVideoUrl: '/videos/patched.mp4' },
      },
    };
    const merged = applyBrandOverridesToProduct(base, overrides);
    expect(merged.scrollVideoUrl).toBe('/videos/patched.mp4');
  });
});
