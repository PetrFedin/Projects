/**
 * Реальные бренды одежды для раздела каталог.
 * Демо-данные для витрины мультибрендового каталога.
 */

export interface CatalogBrand {
  id: string;
  slug: string;
  name: string;
  description: string;
  segment: string;
  countryOfOrigin: string;
  priceRange: [number, number];
  categories: string[];
  logo?: string;
  coverImage?: string;
  tags: string[];
}

export const CATALOG_BRANDS: CatalogBrand[] = [
  {
    id: 'brand_zara',
    slug: 'zara',
    name: 'Zara',
    description:
      'Испанский масс-маркет премиум-класса. Быстрая мода, обновление коллекций каждые 2 недели.',
    segment: 'Mass Market Premium',
    countryOfOrigin: 'Испания',
    priceRange: [1990, 29990],
    categories: ['Женщинам', 'Мужчинам', 'Детям', 'Home'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/200px-Zara_Logo.svg.png',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    tags: ['fast-fashion', 'trendy', 'international'],
  },
  {
    id: 'brand_hm',
    slug: 'hm',
    name: 'H&M',
    description:
      'Шведский гигант. Демократичные цены, коллаборации с дизайнерами, устойчивая мода.',
    segment: 'Mass Market',
    countryOfOrigin: 'Швеция',
    priceRange: [990, 14990],
    categories: ['Женщинам', 'Мужчинам', 'Детям', 'Divided', 'Home'],
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    tags: ['sustainable', 'trendy', 'collabs'],
  },
  {
    id: 'brand_uniqlo',
    slug: 'uniqlo',
    name: 'Uniqlo',
    description: 'Японский функциональный минимализм. Качество базовых вещей, инновационные ткани.',
    segment: 'Mass Market Premium',
    countryOfOrigin: 'Япония',
    priceRange: [1290, 12990],
    categories: ['Женщинам', 'Мужчинам', 'Детям', 'UT', 'Collaborations'],
    coverImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800',
    tags: ['basics', 'functional', 'quality'],
  },
  {
    id: 'brand_mango',
    slug: 'mango',
    name: 'Mango',
    description: 'Испанская женская мода. Элегантный casual, офисный стиль, вечерние образы.',
    segment: 'Contemporary',
    countryOfOrigin: 'Испания',
    priceRange: [2990, 24990],
    categories: ['Женщинам', 'Мужчинам', 'Детям', 'Violeta'],
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    tags: ['elegant', 'contemporary', 'office'],
  },
  {
    id: 'brand_sela',
    slug: 'sela',
    name: 'Sela',
    description: 'Российский ритейлер. Молодёжная мода, доступные цены, широкая сеть магазинов.',
    segment: 'Mass Market',
    countryOfOrigin: 'Россия',
    priceRange: [790, 7990],
    categories: ['Женщинам', 'Мужчинам', 'Детям'],
    coverImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    tags: ['russian', 'youth', 'affordable'],
  },
  {
    id: 'brand_ostin',
    slug: 'ostin',
    name: "O'STIN",
    description: 'Российский семейный бренд. Качество по разумной цене, casual и детская одежда.',
    segment: 'Mass Market',
    countryOfOrigin: 'Россия',
    priceRange: [990, 6990],
    categories: ['Женщинам', 'Мужчинам', 'Детям', 'Home'],
    coverImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800',
    tags: ['russian', 'family', 'casual'],
  },
  {
    id: 'brand_gloria_jeans',
    slug: 'gloria-jeans',
    name: 'Gloria Jeans',
    description: 'Российский бренд джинсовой одежды. Дети и подростки, деним, casual.',
    segment: 'Mass Market',
    countryOfOrigin: 'Россия',
    priceRange: [890, 5990],
    categories: ['Детям', 'Подросткам', 'Женщинам', 'Мужчинам'],
    coverImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800',
    tags: ['russian', 'denim', 'kids'],
  },
  {
    id: 'brand_finn_flare',
    slug: 'finn-flare',
    name: 'Finn Flare',
    description: 'Финско-российский бренд. Одежда для активного отдыха, outdoor, Nordic style.',
    segment: 'Outdoor / Sport',
    countryOfOrigin: 'Финляндия / Россия',
    priceRange: [1990, 15990],
    categories: ['Одежда', 'Обувь', 'Аксессуары', 'Детям'],
    coverImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
    tags: ['outdoor', 'nordic', 'functional'],
  },
  {
    id: 'brand_12storeez',
    slug: '12-storeez',
    name: '12 Storeez',
    description:
      'Российский premium contemporary. Минимализм, качественные материалы, бежевая палитра.',
    segment: 'Premium Contemporary',
    countryOfOrigin: 'Россия',
    priceRange: [4990, 39990],
    categories: ['Женщинам', 'Аксессуары'],
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    tags: ['russian', 'premium', 'minimalist'],
  },
  {
    id: 'brand_les',
    slug: 'les',
    name: 'Les',
    description: 'Российский люксовый бренд. Кожа, авторитетный крой, made in Russia.',
    segment: 'Luxury',
    countryOfOrigin: 'Россия',
    priceRange: [19990, 299990],
    categories: ['Куртки', 'Пальто', 'Аксессуары'],
    coverImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    tags: ['russian', 'luxury', 'leather'],
  },
  {
    id: 'brand_reserved',
    slug: 'reserved',
    name: 'Reserved',
    description: 'Польский ритейлер. Модные тренды, большой ассортимент, доступные цены.',
    segment: 'Mass Market',
    countryOfOrigin: 'Польша',
    priceRange: [990, 9990],
    categories: ['Женщинам', 'Мужчинам', 'Детям', 'Home'],
    coverImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800',
    tags: ['trendy', 'affordable', 'european'],
  },
  {
    id: 'brand_lcwaikiki',
    slug: 'lc-waikiki',
    name: 'LC Waikiki',
    description: 'Турецкий семейный ритейлер. Семейная мода, низкие цены, тренды.',
    segment: 'Mass Market',
    countryOfOrigin: 'Турция',
    priceRange: [590, 5990],
    categories: ['Женщинам', 'Мужчинам', 'Детям', 'Home'],
    coverImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    tags: ['affordable', 'family', 'trendy'],
  },
];

export function getCatalogBrandBySlug(slug: string): CatalogBrand | undefined {
  return CATALOG_BRANDS.find((b) => b.slug === slug);
}

export function getCatalogBrandsBySegment(segment: string): CatalogBrand[] {
  return CATALOG_BRANDS.filter((b) => b.segment === segment);
}

export function getCatalogBrandsByCountry(country: string): CatalogBrand[] {
  return CATALOG_BRANDS.filter((b) => b.countryOfOrigin.includes(country));
}
