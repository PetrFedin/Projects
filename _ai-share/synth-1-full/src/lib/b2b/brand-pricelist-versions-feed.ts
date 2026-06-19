import type { PriceList } from '@/lib/b2b/price-lists';
import type { PriceTierId } from '@/lib/b2b/price-tiers';
import type { CustomerGroupId } from '@/lib/b2b/customer-groups';

export type BrandPricelistVersionsStorageMode = 'pg' | 'file' | 'memory' | 'demo';

export type BrandPricelistVersionRow = PriceList & {
  collectionId: string;
  source: 'pg' | 'seed';
};

export const BRAND_PRICELIST_VERSION_SEED: Omit<PriceList, 'id' | 'createdAt'>[] = [
  {
    name: 'Retail B −4% Q1',
    channel: 'retail_b',
    validFrom: '2025-01-01',
    validTo: '2025-03-31',
    type: 'multiplier',
    multiplier: 0.96,
  },
  {
    name: 'Outlet акция −5%',
    channel: 'outlet',
    validFrom: '2025-02-01',
    validTo: '2025-02-28',
    type: 'multiplier',
    multiplier: 0.95,
  },
  {
    name: 'Retail A base',
    channel: 'retail_a',
    validFrom: '2025-01-01',
    validTo: '2025-12-31',
    type: 'multiplier',
    multiplier: 1,
  },
];

export function buildBrandPricelistVersionSeedRows(collectionId: string): BrandPricelistVersionRow[] {
  return BRAND_PRICELIST_VERSION_SEED.map((seed, index) => ({
    ...seed,
    id: `pl-${seed.channel}-${index}`,
    createdAt: new Date().toISOString(),
    collectionId,
    source: 'seed' as const,
  }));
}

export function filterBrandPricelistVersions(
  rows: readonly BrandPricelistVersionRow[],
  groupId?: string | null
): BrandPricelistVersionRow[] {
  if (!groupId?.trim()) return [...rows];
  return rows.filter((row) => row.customerGroupIds?.includes(groupId as CustomerGroupId));
}

export function summarizeBrandPricelistVersionRows(rows: readonly BrandPricelistVersionRow[]): {
  total: number;
  active: number;
  channels: number;
  pgSourced: number;
} {
  const today = new Date().toISOString().slice(0, 10);
  const active = rows.filter((pl) => pl.validFrom <= today && pl.validTo >= today).length;
  const channels = new Set(rows.map((pl) => pl.channel)).size;
  return {
    total: rows.length,
    active,
    channels,
    pgSourced: rows.filter((row) => row.source === 'pg').length,
  };
}

export function brandPricelistChannelLabel(channel: PriceTierId): string {
  return channel;
}
