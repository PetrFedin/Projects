import { buildRunwayProductViewModel } from '../product-scroll-switcher';
import type { Product } from '../types';

const scrollProduct: Product = {
  id: '1',
  slug: 'strict-vm',
  name: 'Strict VM',
  brand: 'Test',
  price: 1000,
  description: 'desc',
  images: [{ id: '1', url: '/a.jpg', alt: 'a', hint: '' }],
  category: 'Tops',
  sustainability: [],
  sku: 'SKU',
  color: 'Black',
  season: 'SS',
  displayMode: 'scroll-video',
  scrollSwitcherSections: [
    {
      id: 's0',
      label: 'Black',
      color: '#000',
      colorName: 'Black',
      price: 1100,
      sectionStory: 'Story',
      sectionLookItems: [
        { slug: 'a', name: 'Bag', price: 100, imageUrl: '/b.jpg' },
        { slug: 'b', name: 'Shoe', price: 200, imageUrl: '/s.jpg' },
      ],
      thumbImageUrl: '/a.jpg',
    },
    { id: 's1', label: 'White', color: '#fff', colorName: 'White', thumbImageUrl: '/w.jpg' },
    { id: 's2', label: 'Gold', color: '#fc0', colorName: 'Gold', thumbImageUrl: '/g.jpg' },
  ],
  availableColors: [
    { id: 'c1', name: 'Black', hex: '#000', status: 'active' },
    { id: 'c2', name: 'White', hex: '#fff', status: 'active' },
    { id: 'c3', name: 'Gold', hex: '#fc0', status: 'active' },
  ],
};

describe('buildRunwayProductViewModel strict null', () => {
  it('activeSection всегда определена при непустых sections', () => {
    const vm = buildRunwayProductViewModel(scrollProduct);
    expect(vm.activeSection).toBeDefined();
    expect(vm.activeSection.index).toBeGreaterThanOrEqual(0);
    expect(vm.displayPrice).toBe(1100);
  });

  it('activeSectionIndex clamped в диапазон sections', () => {
    const vm = buildRunwayProductViewModel(scrollProduct, { activeColorName: 'Unknown' });
    expect(vm.activeSectionIndex).toBe(0);
    expect(vm.sections[vm.activeSectionIndex]).toBeDefined();
  });

  it('sections VM содержат lookItems и availability', () => {
    const vm = buildRunwayProductViewModel(scrollProduct);
    expect(vm.sections[0].lookItems.length).toBeGreaterThanOrEqual(2);
    expect(vm.sections[0].availability.status).toBeDefined();
  });
});
