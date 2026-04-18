/**
 * Мультибрендовый каталог (витрина): в демо — только Syntha Lab и Nordic Wool
 * (согласовано с `brands.json` и `demo-platform-brands.ts`).
 */

import { DEMO_BRAND_NORDIC_WOOL, DEMO_BRAND_SYNTHA_LAB } from '@/lib/data/demo-platform-brands';

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
    id: 'brand_syntha_lab',
    slug: 'syntha-lab',
    name: DEMO_BRAND_SYNTHA_LAB,
    description:
      'Нишевый бренд технологичной городской одежды: устойчивые материалы, AI-дизайн, функциональный минимализм.',
    segment: 'Premium / Contemporary',
    countryOfOrigin: 'Россия',
    priceRange: [8000, 95000],
    categories: ['Женщинам', 'Мужчинам', 'Верхняя одежда', 'Трикотаж'],
    logo: 'https://picsum.photos/seed/syntha-lab/200/200',
    coverImage: 'https://images.unsplash.com/photo-1542037104857-e6e23e20e153?w=800',
    tags: ['AI-Design', 'Techwear', 'Eco-friendly'],
  },
  {
    id: 'brand_nordic_wool',
    slug: 'nordic-wool',
    name: DEMO_BRAND_NORDIC_WOOL,
    description:
      'Премиальный трикотаж из мериноса и альпаки, эстетика Русского Севера и slow fashion.',
    segment: 'Luxury Heritage',
    countryOfOrigin: 'Россия',
    priceRange: [12000, 120000],
    categories: ['Женщинам', 'Мужчинам', 'Трикотаж', 'Аксессуары'],
    logo: 'https://picsum.photos/seed/nordic-wool/200/200',
    coverImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
    tags: ['Merino', 'Heritage', 'Slow Fashion'],
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
