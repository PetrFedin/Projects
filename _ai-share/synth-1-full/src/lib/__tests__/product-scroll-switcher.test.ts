import {
  productSupportsScrollVideo,
  productUsesPerSectionVideo,
  resolveScrollSwitcherSections,
  resolveScrollVideoSources,
  resolveScrollVideoUrl,
  resolveSectionVideoUrl,
  resolveSectionVideoSources,
  resolveSectionImage,
  resolveSectionStock,
  resolveSectionAvailability,
  buildRunwayProductViewModel,
  validateScrollVideoProduct,
  resolveSectionLookItems,
  resolveAnalyticsSocialProof,
  resolveBrandScrollVideoProducts,
  resolveAdjacentBrandScrollVideoProducts,
  filterHeroScrollProducts,
  isHeroRunwayProduct,
  resolveFeaturedScrollProduct,
  SCROLL_EXPERIENCE_DEFAULTS,
} from '../product-scroll-switcher';
import type { Product } from '../types';

const baseProduct: Product = {
  id: '99',
  slug: 'standard-tee',
  name: 'Standard Tee',
  brand: 'Test',
  price: 1000,
  description: 'test',
  images: [{ id: '1', url: '/x.jpg', alt: 'x', hint: '' }],
  category: 'Tops',
  sustainability: [],
  sku: 'SKU',
  color: 'Black',
  season: 'SS',
};

const scrollProduct: Product = {
  ...baseProduct,
  slug: 'runway-tee',
  displayMode: 'scroll-video',
  availableColors: [
    { id: 'c1', name: 'Black', hex: '#000', status: 'active' },
    { id: 'c2', name: 'White', hex: '#fff', status: 'active' },
  ],
};

describe('product-scroll-switcher', () => {
  it('productSupportsScrollVideo — только displayMode scroll-video', () => {
    expect(productSupportsScrollVideo(baseProduct)).toBe(false);
    expect(productSupportsScrollVideo(scrollProduct)).toBe(true);
    expect(productSupportsScrollVideo({ ...scrollProduct, displayMode: 'standard' })).toBe(false);
  });

  it('resolveScrollSwitcherSections — секции из availableColors', () => {
    const sections = resolveScrollSwitcherSections(scrollProduct, SCROLL_EXPERIENCE_DEFAULTS);
    expect(sections).toHaveLength(2);
    expect(sections[0].colorName).toBe('Black');
    expect(sections[1].colorName).toBe('White');
  });

  it('resolveScrollVideoSources — MP4 + WebM fallback и poster', () => {
    const withMp4: Product = {
      ...scrollProduct,
      scrollVideoUrl: '/videos/demo-runway-hero.mp4',
      scrollSwitcherSections: [
        { id: 'a', label: 'Black', color: '#000', thumbImageUrl: '/poster.jpg' },
      ],
    };
    const sources = resolveScrollVideoSources(withMp4);
    expect(sources.mp4).toBe('/videos/demo-runway-hero.mp4');
    expect(sources.webm).toBe('/videos/demo-runway-hero.webm');
    expect(sources.poster).toBe('/poster.jpg');
    expect(resolveScrollVideoUrl(withMp4)).toBe('/videos/demo-runway-hero.mp4');
  });

  it('resolveSectionImage — sectionImageUrl приоритетнее thumb и product.images', () => {
    const withSections: Product = {
      ...scrollProduct,
      images: [
        { id: '1', url: '/img-a.jpg', alt: 'a', hint: '', colorName: 'Black' },
        { id: '2', url: '/img-b.jpg', alt: 'b', hint: '', colorName: 'White' },
      ],
      scrollSwitcherSections: [
        {
          id: 'a',
          label: 'Black',
          color: '#000',
          colorName: 'Black',
          thumbImageUrl: '/thumb.jpg',
          sectionImageUrl: '/hero-black.jpg',
        },
      ],
    };
    const section = resolveScrollSwitcherSections(withSections)[0];
    expect(resolveSectionImage(withSections, section, 0)).toBe('/hero-black.jpg');
  });

  it('resolveSectionStock — in_stock из sizeAvailability', () => {
    const withStock: Product = {
      ...scrollProduct,
      availableColors: [
        {
          id: 'c1',
          name: 'Black',
          hex: '#000',
          status: 'active',
          isBase: true,
          lifecycleStatus: 'in_stock',
          noSale: false,
          carryOver: false,
          sizeAvailability: [{ size: 'M', status: 'in_stock', quantity: 3 }],
        },
      ],
    };
    const section = resolveScrollSwitcherSections(withStock)[0];
    const stock = resolveSectionStock(withStock, section);
    expect(stock.status).toBe('in_stock');
    expect(stock.label).toBe('В наличии');
    expect(resolveSectionAvailability(withStock, section)).toEqual(stock);
  });

  it('buildRunwayProductViewModel — единая VM с ценой и SKU', () => {
    const vm = buildRunwayProductViewModel(scrollProduct, { activeColorName: 'White' });
    expect(vm.sections.length).toBe(2);
    expect(vm.activeSectionIndex).toBe(1);
    expect(vm.variantSku).toContain('White');
    expect(vm.displayPrice).toBe(1000);
  });

  it('buildRunwayProductViewModel — sectionStory и lookItems в VM', () => {
    const withExtras: Product = {
      ...scrollProduct,
      scrollSwitcherSections: [
        {
          id: 'a',
          label: 'Black',
          color: '#000',
          colorName: 'Black',
          sectionStory: 'Test story',
          sectionLookItems: [{ name: 'Bag', price: 500, imageUrl: '/bag.jpg', slug: 'bag-slug' }],
        },
      ],
    };
    const vm = buildRunwayProductViewModel(withExtras);
    expect(vm.sections[0].sectionStory).toBe('Test story');
    expect(vm.sections[0].lookItems).toHaveLength(1);
    expect(vm.sections[0].lookItems[0].slug).toBe('bag-slug');
  });

  it('resolveSectionLookItems — фильтрует невалидные элементы', () => {
    const section = {
      id: 'a',
      label: 'Black',
      color: '#000',
      sectionLookItems: [
        { name: 'Valid', price: 100, imageUrl: '/v.jpg', slug: 'valid' },
        { name: '', price: 0, imageUrl: '', slug: '' },
      ],
    };
    expect(resolveSectionLookItems(scrollProduct, section)).toHaveLength(1);
  });

  it('resolveAnalyticsSocialProof — честные просмотры из events', () => {
    const now = Date.now();
    const events = [
      {
        event: 'scroll_experience_view' as const,
        productSlug: 'silk-midi-dress',
        sectionIndex: 0,
        timestamp: now,
      },
    ];
    const a = resolveAnalyticsSocialProof('silk-midi-dress', 0, events);
    const b = resolveAnalyticsSocialProof('silk-midi-dress', 0, events);
    expect(a).toEqual(b);
    expect(a?.viewsToday).toBe(1);
    expect(resolveAnalyticsSocialProof('silk-midi-dress', 0, [])).toBeNull();
  });

  it('resolveAdjacentBrandScrollVideoProducts — prev/next в бренде', () => {
    const catalog: Product[] = [
      { ...scrollProduct, slug: 'a', brand: 'Test' },
      { ...scrollProduct, slug: 'b', brand: 'Test' },
      { ...scrollProduct, slug: 'c', brand: 'Other' },
    ];
    const adjacent = resolveAdjacentBrandScrollVideoProducts(catalog[1], catalog);
    expect(adjacent.prev?.slug).toBe('a');
    expect(adjacent.next).toBeUndefined();
    expect(resolveBrandScrollVideoProducts(catalog, 'Test')).toHaveLength(2);
  });

  it('validateScrollVideoProduct — предупреждение при несовпадении секции и цвета', () => {
    const mismatch: Product = {
      ...scrollProduct,
      scrollSwitcherSections: [{ id: 'x', label: 'Mystery', color: '#111', colorName: 'Mystery' }],
    };
    const warnings = validateScrollVideoProduct(mismatch);
    expect(warnings.some((w) => w.includes('Mystery'))).toBe(true);
  });

  it('resolveSectionVideoUrl — sectionVideoUrl приоритетнее product scrollVideoUrl', () => {
    const withClips: Product = {
      ...scrollProduct,
      scrollVideoUrl: '/videos/demo-runway-hero.mp4',
      scrollSwitcherSections: [
        { id: 'a', label: 'Black', color: '#000', sectionVideoUrl: '/videos/clip-a.mp4' },
        { id: 'b', label: 'White', color: '#fff', sectionVideoUrl: '/videos/clip-b.mp4' },
      ],
    };
    const sections = resolveScrollSwitcherSections(withClips);
    expect(resolveSectionVideoUrl(withClips, sections[0], 0)).toBe('/videos/clip-a.mp4');
    expect(resolveSectionVideoUrl(withClips, sections[1], 1)).toBe('/videos/clip-b.mp4');
    const sources = resolveSectionVideoSources(withClips, sections[0], 0);
    expect(sources.mp4).toBe('/videos/clip-a.mp4');
    expect(sources.webm).toBe('/videos/clip-a.webm');
    expect(productUsesPerSectionVideo(withClips)).toBe(true);
  });

  it('buildRunwayProductViewModel — usesPerSectionVideo и videoSources на секции', () => {
    const withClips: Product = {
      ...scrollProduct,
      scrollSwitcherSections: [
        { id: 'a', label: 'Black', color: '#000', sectionVideoUrl: '/videos/a.mp4' },
      ],
    };
    const vm = buildRunwayProductViewModel(withClips);
    expect(vm.usesPerSectionVideo).toBe(true);
    expect(vm.sections[0].videoSources.mp4).toBe('/videos/a.mp4');
    expect(vm.sections[0].hasSectionVideo).toBe(true);
  });

  it('resolveSectionImage — локальные runway hero из sectionImageUrl', () => {
    const withLocal: Product = {
      ...scrollProduct,
      scrollSwitcherSections: [
        {
          id: 'a',
          label: 'Black',
          color: '#000',
          colorName: 'Black',
          thumbImageUrl: '/images/demo/runway/test-section-0.jpg',
          sectionImageUrl: '/images/demo/runway/test-section-0.jpg',
        },
        {
          id: 'b',
          label: 'White',
          color: '#fff',
          colorName: 'White',
          thumbImageUrl: '/images/demo/runway/test-section-1.jpg',
          sectionImageUrl: '/images/demo/runway/test-section-1.jpg',
        },
      ],
    };
    const sections = resolveScrollSwitcherSections(withLocal);
    expect(resolveSectionImage(withLocal, sections[0], 0)).toBe(
      '/images/demo/runway/test-section-0.jpg'
    );
    expect(resolveSectionImage(withLocal, sections[1], 1)).toBe(
      '/images/demo/runway/test-section-1.jpg'
    );
    expect(sections[0].heroUrl ?? sections[0].sectionImageUrl).toBeTruthy();
  });

  it('heroProductSlugs — featured и badge фильтруют по списку', () => {
    const config = {
      ...SCROLL_EXPERIENCE_DEFAULTS,
      heroProductSlugs: ['runway-tee', 'other-hero'],
      featuredProductSlug: 'ignored-if-hero-list',
    };
    const products = [
      scrollProduct,
      { ...scrollProduct, id: '2', slug: 'other-hero', name: 'Other' },
      { ...scrollProduct, id: '3', slug: 'not-hero', name: 'Not hero' },
    ];
    expect(filterHeroScrollProducts(products, config).map((p) => p.slug)).toEqual([
      'runway-tee',
      'other-hero',
    ]);
    expect(isHeroRunwayProduct(products[2]!, config)).toBe(false);
    expect(resolveFeaturedScrollProduct(products, config)?.slug).toBe('runway-tee');
  });
});
