import type {
  PlatformB2bPartnerOnboardingRow,
  PlatformB2bPartnersOnboardingCounts,
} from '@/lib/platform/platform-b2b-partners-onboarding-types';

export async function fetchPlatformB2bPartnersOnboarding(input?: {
  buyerId?: string;
  collectionId?: string;
}): Promise<{
  rows: PlatformB2bPartnerOnboardingRow[];
  counts: PlatformB2bPartnersOnboardingCounts;
  storageMode: 'pg' | 'fallback';
}> {
  const qs = new URLSearchParams();
  if (input?.buyerId?.trim()) qs.set('buyerId', input.buyerId.trim());
  if (input?.collectionId?.trim()) qs.set('collectionId', input.collectionId.trim());
  const suffix = qs.toString() ? `?${qs.toString()}` : '';

  const res = await fetch(`/api/platform/b2b/partners/onboarding${suffix}`, { cache: 'no-store' });
  const json = (await res.json()) as {
    ok?: boolean;
    rows?: PlatformB2bPartnerOnboardingRow[];
    counts?: { connected: number; requested: number; profile: number };
    storageMode?: 'pg' | 'fallback';
  };
  if (!res.ok || !json.ok) {
    return {
      rows: [],
      counts: { connected: 0, requested: 0, profile: 0 },
      storageMode: 'fallback',
    };
  }
  return {
    rows: json.rows ?? [],
    counts: json.counts ?? { connected: 0, requested: 0, profile: 0 },
    storageMode: json.storageMode ?? 'fallback',
  };
}

export async function postShopB2bPartnershipAction(input: {
  action: 'request' | 'connect';
  brandId: string;
  buyerId?: string;
  collectionId?: string;
}): Promise<{ ok: boolean; messageRu?: string }> {
  const res = await fetch('/api/shop/b2b/partnerships', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as { ok?: boolean; messageRu?: string };
  return { ok: res.ok && json.ok === true, messageRu: json.messageRu };
}
