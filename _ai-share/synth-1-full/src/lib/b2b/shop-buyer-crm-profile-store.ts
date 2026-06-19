import type { ShopBuyerCrmProfile } from '@/lib/b2b/shop-buyer-crm-profile';

export async function fetchShopBuyerCrmProfile(buyerId: string): Promise<{
  profile: ShopBuyerCrmProfile | null;
  storageMode: 'pg' | 'file' | 'memory' | 'demo';
}> {
  const qs = new URLSearchParams({ buyerId });
  const res = await fetch(`/api/shop/b2b/buyer-crm-profile?${qs.toString()}`, {
    cache: 'no-store',
  });
  const json = (await res.json()) as {
    ok?: boolean;
    profile?: ShopBuyerCrmProfile | null;
    storageMode?: 'pg' | 'file' | 'memory' | 'demo';
  };
  if (!res.ok || !json.ok) {
    return { profile: null, storageMode: 'demo' };
  }
  return {
    profile: json.profile ?? null,
    storageMode: json.storageMode ?? 'demo',
  };
}
