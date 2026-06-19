import type { LandedMarginFeedRow } from '@/lib/b2b/landed-margin-feed';

export type LandedMarginFeedResponse = {
  ok: boolean;
  collectionId?: string;
  orderId?: string;
  rows?: LandedMarginFeedRow[];
  summary?: {
    total: number;
    onTarget: number;
    avgMarginPct: number;
    orderSourced: number;
    pgSourced: number;
  };
  storageMode?: 'pg' | 'file' | 'memory' | 'demo';
  orderLinked?: boolean;
};

export type LandedMarginSkuDefaultsResponse = {
  ok: boolean;
  sku?: string;
  retailRub?: number;
  productionRub?: number;
  wholesaleRub?: number;
  landedRub?: number;
  storageMode?: 'pg' | 'file' | 'memory' | 'demo';
};

export async function fetchShopLandedMarginRollup(input?: {
  collectionId?: string;
  orderId?: string;
}): Promise<LandedMarginFeedResponse> {
  const params = new URLSearchParams();
  if (input?.collectionId?.trim()) params.set('collectionId', input.collectionId.trim());
  if (input?.orderId?.trim()) params.set('orderId', input.orderId.trim());
  const res = await fetch(`/api/shop/b2b/landed-margin/rollup?${params.toString()}`, {
    cache: 'no-store',
  });
  const json = (await res.json()) as LandedMarginFeedResponse;
  if (!res.ok || !json.ok) {
    return {
      ok: false,
      rows: [],
      summary: { total: 0, onTarget: 0, avgMarginPct: 0, orderSourced: 0, pgSourced: 0 },
    };
  }
  return json;
}

export async function refreshShopLandedMarginRollup(input: {
  collectionId: string;
  orderId?: string;
}): Promise<LandedMarginFeedResponse> {
  const res = await fetch('/api/shop/b2b/landed-margin/rollup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as LandedMarginFeedResponse;
  if (!res.ok || !json.ok) return { ok: false };
  return json;
}

export async function fetchBrandLandedMarginFeed(input?: {
  collectionId?: string;
  orderId?: string;
}): Promise<LandedMarginFeedResponse> {
  const params = new URLSearchParams();
  if (input?.collectionId?.trim()) params.set('collectionId', input.collectionId.trim());
  if (input?.orderId?.trim()) params.set('orderId', input.orderId.trim());
  const res = await fetch(`/api/brand/merch/landed-margin/feed?${params.toString()}`, {
    cache: 'no-store',
  });
  const json = (await res.json()) as LandedMarginFeedResponse;
  if (!res.ok || !json.ok) {
    return {
      ok: false,
      rows: [],
      summary: { total: 0, onTarget: 0, avgMarginPct: 0, orderSourced: 0, pgSourced: 0 },
    };
  }
  return json;
}

export async function fetchBrandLandedMarginSkuDefaults(input: {
  collectionId?: string;
  orderId?: string;
  sku: string;
}): Promise<LandedMarginSkuDefaultsResponse> {
  const params = new URLSearchParams();
  if (input.collectionId?.trim()) params.set('collectionId', input.collectionId.trim());
  if (input.orderId?.trim()) params.set('orderId', input.orderId.trim());
  params.set('sku', input.sku.trim());
  const res = await fetch(`/api/brand/merch/landed-margin/feed?${params.toString()}`, {
    cache: 'no-store',
  });
  return (await res.json()) as LandedMarginSkuDefaultsResponse;
}

export async function refreshBrandLandedMarginFeed(input: {
  collectionId: string;
  orderId?: string;
}): Promise<LandedMarginFeedResponse> {
  const res = await fetch('/api/brand/merch/landed-margin/feed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as LandedMarginFeedResponse;
  if (!res.ok || !json.ok) return { ok: false };
  return json;
}
