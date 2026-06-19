import 'server-only';

import { CATALOG_BRANDS } from '@/lib/data/catalog-brands';
import { SHOP_CORE_DEMO_BUYER_ID } from '@/lib/order/shop-workshop2-b2b-order-ui';
import type {
  PlatformB2bPartnerOnboardingRow,
  PlatformB2bPartnersOnboardingCounts,
} from '@/lib/platform/platform-b2b-partners-onboarding-types';
import { buildShopB2bPartnershipsFallback } from '@/lib/shop/shop-b2b-partnerships';
import { listShopB2bPartnerships } from '@/lib/server/shop-b2b-partnerships';
import { listShopB2bPartnershipRowsPg } from '@/lib/server/shop-b2b-partnerships-repository';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

export type { PlatformB2bPartnerOnboardingRow } from '@/lib/platform/platform-b2b-partners-onboarding-types';

export async function listPlatformB2bPartnersOnboarding(input?: {
  buyerId?: string;
  collectionId?: string;
}): Promise<{
  buyerId: string;
  collectionId: string;
  rows: PlatformB2bPartnerOnboardingRow[];
  counts: PlatformB2bPartnersOnboardingCounts;
  storageMode: 'pg' | 'fallback';
}> {
  const buyerId = input?.buyerId?.trim() || SHOP_CORE_DEMO_BUYER_ID;
  const collectionId = input?.collectionId?.trim() || 'SS27';

  const partnerships = await listShopB2bPartnerships(buyerId);
  const pgRows = isWorkshop2PostgresEnabled() ? await listShopB2bPartnershipRowsPg(buyerId) : [];
  const pgByBrand = new Map(pgRows.map((r) => [r.brandId, r]));

  const items =
    partnerships.length > 0 ? partnerships : buildShopB2bPartnershipsFallback(collectionId);

  const rows: PlatformB2bPartnerOnboardingRow[] = items.map((p) => {
    const pg = pgByBrand.get(p.brandId);
    return {
      ...p,
      buyerId,
      connectedAt: pg?.connectedAt,
      pgRowStatus: pg?.status,
    };
  });

  const counts = {
    connected: rows.filter((r) => r.status === 'connected').length,
    requested: rows.filter((r) => r.status === 'requested').length,
    profile: rows.filter((r) => r.status === 'profile').length,
  };

  const storageMode =
    partnerships.some((p) => p.source === 'pg') || pgRows.length || isWorkshop2PostgresEnabled()
      ? ('pg' as const)
      : ('fallback' as const);

  return { buyerId, collectionId, rows, counts, storageMode };
}

export function resolvePlatformPartnerBrandName(brandId: string): string {
  return CATALOG_BRANDS.find((b) => b.id === brandId)?.name ?? brandId;
}
