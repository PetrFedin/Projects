import {
  CATALOG_BRANDS,
  getPlatformCorePartnerBrands,
  PLATFORM_CORE_CONNECTED_BRAND_ID,
  PLATFORM_CORE_CONNECTED_BRAND_SLUG,
  type CatalogBrand,
} from '@/lib/data/catalog-brands';
import { DEMO_BRAND_SYNTHA_LAB } from '@/lib/data/demo-platform-brands';
import { SHOP_CORE_DEMO_BUYER_ID } from '@/lib/order/shop-workshop2-b2b-order-ui';
import { ROUTES } from '@/lib/routes';

export type ShopB2bPartnershipStatus = 'connected' | 'profile' | 'requested';

export type ShopB2bPartnership = {
  brandId: string;
  slug: string;
  name: string;
  description: string;
  segment: string;
  countryOfOrigin: string;
  categories: string[];
  logo?: string;
  coverImage?: string;
  status: ShopB2bPartnershipStatus;
  /** pg = derived from W2 orders/showroom; fallback = static catalog when PG empty or fetch failed. */
  source: 'pg' | 'fallback';
  buyerId: string;
  collectionIds: string[];
  orderCount: number;
  showroomHref: string;
  matrixHref: string;
};

export function buildShopB2bPartnershipHrefs(collectionId: string): {
  showroomHref: string;
  matrixHref: string;
} {
  const q = encodeURIComponent(collectionId);
  return {
    showroomHref: `${ROUTES.shop.b2bShowroom}?collection=${q}`,
    matrixHref: `${ROUTES.shop.b2bMatrix}?collection=${q}`,
  };
}

export function catalogBrandToShopB2bPartnership(
  brand: CatalogBrand,
  input: {
    status: ShopB2bPartnershipStatus;
    source: 'pg' | 'fallback';
    buyerId?: string;
    collectionIds?: string[];
    orderCount?: number;
    collectionId?: string;
  }
): ShopB2bPartnership {
  const collectionId = input.collectionId ?? input.collectionIds?.[0] ?? 'SS27';
  const hrefs = buildShopB2bPartnershipHrefs(collectionId);
  return {
    brandId: brand.id,
    slug: brand.slug,
    name: brand.name,
    description: brand.description,
    segment: brand.segment,
    countryOfOrigin: brand.countryOfOrigin,
    categories: brand.categories,
    logo: brand.logo,
    coverImage: brand.coverImage,
    status: input.status,
    source: input.source,
    buyerId: input.buyerId ?? SHOP_CORE_DEMO_BUYER_ID,
    collectionIds: input.collectionIds ?? [collectionId],
    orderCount: input.orderCount ?? 0,
    showroomHref: hrefs.showroomHref,
    matrixHref: hrefs.matrixHref,
  };
}

/** Honest static fallback when PG/API unavailable — Syntha connected + profile каталог. */
export function buildShopB2bPartnershipsFallback(collectionId = 'SS27'): ShopB2bPartnership[] {
  const connectedBrand =
    getPlatformCorePartnerBrands()[0] ??
    CATALOG_BRANDS.find((b) => b.id === PLATFORM_CORE_CONNECTED_BRAND_ID);
  const connected = connectedBrand
    ? [
        catalogBrandToShopB2bPartnership(connectedBrand, {
          status: 'connected',
          source: 'fallback',
          collectionId,
        }),
      ]
    : [];
  const connectedIds = new Set(connected.map((p) => p.brandId));
  const profile = CATALOG_BRANDS.filter((b) => !connectedIds.has(b.id)).map((brand) =>
    catalogBrandToShopB2bPartnership(brand, {
      status: 'profile',
      source: 'fallback',
      collectionId,
    })
  );
  if (connected.length || profile.length) return [...connected, ...profile];

  const hrefs = buildShopB2bPartnershipHrefs(collectionId);
  return [
    {
      brandId: PLATFORM_CORE_CONNECTED_BRAND_ID,
      slug: PLATFORM_CORE_CONNECTED_BRAND_SLUG,
      name: DEMO_BRAND_SYNTHA_LAB,
      description:
        'Нишевый бренд технологичной городской одежды: устойчивые материалы, AI-дизайн, функциональный минимализм.',
      segment: 'Premium / Contemporary',
      countryOfOrigin: 'Россия',
      categories: ['Женщинам', 'Мужчинам', 'Верхняя одежда', 'Трикотаж'],
      status: 'connected',
      source: 'fallback',
      buyerId: SHOP_CORE_DEMO_BUYER_ID,
      collectionIds: [collectionId],
      orderCount: 0,
      showroomHref: hrefs.showroomHref,
      matrixHref: hrefs.matrixHref,
    },
  ];
}
