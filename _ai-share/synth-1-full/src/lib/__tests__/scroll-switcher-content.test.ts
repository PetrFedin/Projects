import {
  validateScrollVideoProduct,
  validateScrollVideoContent,
  resolveSectionLookItems,
  productSupportsScrollVideo,
  resolveScrollSwitcherSections,
} from '../product-scroll-switcher';
import type { Product } from '../types';

const scrollProduct: Product = {
  id: '99',
  slug: 'runway-tee',
  name: 'Runway Tee',
  brand: 'Test',
  price: 1000,
  description: 'Runway demo product',
  images: [{ id: '1', url: '/x.jpg', alt: 'x', hint: '' }],
  category: 'Tops',
  sustainability: [],
  sku: 'SKU',
  color: 'Black',
  season: 'SS',
  displayMode: 'scroll-video',
  scrollSwitcherSections: [
    {
      id: 'a',
      label: 'Black',
      color: '#000',
      colorName: 'Black',
      thumbImageUrl: '/t0.jpg',
      sectionImageUrl: '/h0.jpg',
      sectionStory: 'Story A',
      sectionTitle: 'Title A',
      sectionDescription: 'Description A',
      sectionLookItems: [
        { name: 'Bag', price: 500, imageUrl: '/bag.jpg', slug: 'bag' },
        { name: 'Hat', price: 300, imageUrl: '/hat.jpg', slug: 'hat' },
      ],
    },
    {
      id: 'b',
      label: 'White',
      color: '#fff',
      colorName: 'White',
      thumbImageUrl: '/t1.jpg',
      sectionImageUrl: '/h1.jpg',
      sectionStory: 'Story B',
      sectionTitle: 'Title B',
      sectionDescription: 'Description B',
      sectionLookItems: [
        { name: 'Shoes', price: 900, imageUrl: '/shoes.jpg', slug: 'shoes' },
        { name: 'Belt', price: 200, imageUrl: '/belt.jpg', slug: 'belt' },
      ],
    },
    {
      id: 'c',
      label: 'Grey',
      color: '#888',
      colorName: 'Grey',
      thumbImageUrl: '/t2.jpg',
      sectionImageUrl: '/h2.jpg',
      sectionStory: 'Story C',
      sectionTitle: 'Title C',
      sectionDescription: 'Description C',
      sectionLookItems: [
        { name: 'Coat', price: 5000, imageUrl: '/coat.jpg', slug: 'coat' },
        { name: 'Scarf', price: 150, imageUrl: '/scarf.jpg', slug: 'scarf' },
      ],
    },
  ],
};

describe('scroll-switcher content validation', () => {
  it('validateScrollVideoContent — полный контент без ошибок', () => {
    const errors = validateScrollVideoContent(scrollProduct);
    expect(errors).toHaveLength(0);
  });

  it('validateScrollVideoContent — требует 3 секции', () => {
    const incomplete = {
      ...scrollProduct,
      scrollSwitcherSections: scrollProduct.scrollSwitcherSections!.slice(0, 2),
    };
    expect(validateScrollVideoContent(incomplete).some((e) => e.includes('3 секции'))).toBe(true);
  });

  it('validateScrollVideoContent — требует sectionStory', () => {
    const noStory = {
      ...scrollProduct,
      scrollSwitcherSections: [
        { ...scrollProduct.scrollSwitcherSections![0], sectionStory: undefined },
        ...scrollProduct.scrollSwitcherSections!.slice(1),
      ],
    };
    expect(validateScrollVideoContent(noStory).some((e) => e.includes('sectionStory'))).toBe(true);
  });

  it('validateScrollVideoContent — требует sectionTitle и sectionDescription', () => {
    const noTitle = {
      ...scrollProduct,
      scrollSwitcherSections: [
        { ...scrollProduct.scrollSwitcherSections![0], sectionTitle: undefined },
        ...scrollProduct.scrollSwitcherSections!.slice(1),
      ],
    };
    expect(validateScrollVideoContent(noTitle).some((e) => e.includes('sectionTitle'))).toBe(true);

    const noDesc = {
      ...scrollProduct,
      scrollSwitcherSections: [
        { ...scrollProduct.scrollSwitcherSections![0], sectionDescription: undefined },
        ...scrollProduct.scrollSwitcherSections!.slice(1),
      ],
    };
    expect(validateScrollVideoContent(noDesc).some((e) => e.includes('sectionDescription'))).toBe(
      true
    );
  });

  it('validateScrollVideoContent — требует sectionLookItems (2+)', () => {
    const oneLook = {
      ...scrollProduct,
      scrollSwitcherSections: [
        {
          ...scrollProduct.scrollSwitcherSections![0],
          sectionLookItems: [{ name: 'Only', price: 1, imageUrl: '/x.jpg', slug: 'x' }],
        },
        ...scrollProduct.scrollSwitcherSections!.slice(1),
      ],
    };
    expect(validateScrollVideoContent(oneLook).some((e) => e.includes('sectionLookItems'))).toBe(
      true
    );
  });

  it('validateScrollVideoContent — игнорирует non-scroll products', () => {
    expect(validateScrollVideoContent({ ...scrollProduct, displayMode: 'standard' })).toHaveLength(
      0
    );
  });

  it('validateScrollVideoContent — требует description', () => {
    expect(
      validateScrollVideoContent({ ...scrollProduct, description: '' }).some((e) =>
        e.includes('description')
      )
    ).toBe(true);
  });

  it('resolveSectionLookItems — отбрасывает пустые slug', () => {
    const section = {
      id: 'x',
      label: 'X',
      color: '#000',
      sectionLookItems: [
        { name: 'Ok', price: 10, imageUrl: '/a.jpg', slug: 'ok' },
        { name: 'Bad', price: 0, imageUrl: '', slug: '' },
      ],
    };
    expect(resolveSectionLookItems(scrollProduct, section)).toHaveLength(1);
  });

  it('resolveSectionLookItems — возвращает 2+ для demo секций', () => {
    const section = scrollProduct.scrollSwitcherSections![0];
    expect(resolveSectionLookItems(scrollProduct, section).length).toBeGreaterThanOrEqual(2);
  });

  it('validateScrollVideoProduct — warnings для несовпадения цвета', () => {
    const bad: Product = {
      ...scrollProduct,
      availableColors: [{ id: 'c1', name: 'Black', hex: '#000', status: 'active' }],
      scrollSwitcherSections: [{ id: 'x', label: 'Mystery', color: '#000', colorName: 'Mystery' }],
    };
    expect(validateScrollVideoProduct(bad).some((w) => w.includes('Mystery'))).toBe(true);
  });

  it('productSupportsScrollVideo — true для scroll-video', () => {
    expect(productSupportsScrollVideo(scrollProduct)).toBe(true);
  });

  it('resolveScrollSwitcherSections — 3 секции из JSON', () => {
    expect(resolveScrollSwitcherSections(scrollProduct)).toHaveLength(3);
  });
});
