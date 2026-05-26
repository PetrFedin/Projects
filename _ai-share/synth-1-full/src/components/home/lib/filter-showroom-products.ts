import type { CmsHomeConfig } from '@/data/cms.home.default';
import type { GlobalCategory, Product } from '@/lib/types';

/** Фильтрация showroom products — shared для HomeMidFoldStack. */
export function filterShowroomProducts(
  products: Product[],
  globalCategory: GlobalCategory,
  showroomTab: string,
  carousels: CmsHomeConfig['carousels']
): Product[] {
  let filteredByGlobal = products;
  if (globalCategory !== 'all') {
    filteredByGlobal = products.filter((p) => {
      if (globalCategory === 'women') return p.audience === 'Женский' || p.audience === 'Унисекс';
      if (globalCategory === 'men') return p.audience === 'Мужской' || p.audience === 'Унисекс';
      if (globalCategory === 'kids')
        return (
          p.audience === 'Детский' ||
          p.audience === 'Мальчики' ||
          p.audience === 'Девочки' ||
          p.audience === 'Новорожденные' ||
          p.category === 'Детям' ||
          p.category === 'Kids'
        );
      if (globalCategory === 'beauty') return p.category === 'Beauty' || p.category === 'Красота';
      if (globalCategory === 'home') return p.category === 'Home' || p.category === 'Дом';
      return true;
    });
  }

  if (showroomTab === 'all') {
    return filteredByGlobal.filter(
      (p) => !p.outlet && !(p.originalPrice && p.originalPrice > p.price)
    );
  }

  if (showroomTab === 'outlet') {
    return filteredByGlobal.filter(
      (p) => p.outlet || (p.originalPrice && p.originalPrice > p.price)
    );
  }

  const carousel = carousels.find((c) => c.id === showroomTab);
  if (!carousel) return filteredByGlobal;

  const filtered = filteredByGlobal.filter(
    (p) => carousel.productSlugs.includes(p.slug) || carousel.productSlugs.includes(p.sku)
  );

  if (filtered.length === 0) {
    if (carousel.title === 'Новинки') return filteredByGlobal.slice(0, 4);
    if (carousel.title === 'Хиты продаж') return filteredByGlobal.slice(4, 8);
    return filteredByGlobal;
  }

  return filtered;
}
