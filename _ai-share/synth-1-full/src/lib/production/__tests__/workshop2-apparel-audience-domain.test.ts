/**
 * @jest-environment node
 */
import {
  isApparelFootwearAccessoriesCategory,
  resolveWorkshop2AttributeProfile,
} from '@/lib/production/workshop2-apparel-audience-domain';

describe('workshop2-apparel-audience-domain', () => {
  it('detects footwear by leaf prefix', () => {
    expect(isApparelFootwearAccessoriesCategory({ leafId: 'catalog-shoes-g0-l0' })).toBe(true);
    expect(isApparelFootwearAccessoriesCategory({ l1Name: 'Обувь' })).toBe(true);
    expect(isApparelFootwearAccessoriesCategory({ l1Name: 'Дом и стиль жизни' })).toBe(false);
  });

  it('resolveWorkshop2AttributeProfile: unisex footwear dual scale', () => {
    const p = resolveWorkshop2AttributeProfile({
      l1Name: 'Обувь',
      audienceId: 'men',
      isUnisex: true,
    });
    expect(p.domain).toBe('footwear');
    expect(p.dualSizeScale).toBe(true);
    expect(p.showFootwearAxes).toBe(true);
  });
});
