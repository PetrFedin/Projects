import type { BrandSupplierBomFeedRow } from '@/lib/fashion/brand-supplier-bom-feed';
import type { SupplierProcurementBomLine } from '@/lib/platform-core-pillar-snapshot.types';

export async function fetchBrandSupplierBomFeed(input: {
  collectionId: string;
  articleId: string;
  snapshotLines?: readonly SupplierProcurementBomLine[];
}): Promise<{
  ok: boolean;
  rows?: BrandSupplierBomFeedRow[];
  summary?: { total: number; filled: number; pgSourced: number };
  storageMode?: string;
}> {
  const res = await fetch('/api/brand/merch/supplier-bom', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as {
    ok?: boolean;
    rows?: BrandSupplierBomFeedRow[];
    summary?: { total: number; filled: number; pgSourced: number };
    storageMode?: string;
  };
  if (!res.ok || !json.ok) return { ok: false, rows: [] };
  return { ok: true, ...json };
}

export async function refreshBrandSupplierBomFeed(input: {
  collectionId: string;
  articleId: string;
  snapshotLines?: readonly SupplierProcurementBomLine[];
}): Promise<{
  ok: boolean;
  rows?: BrandSupplierBomFeedRow[];
  summary?: { total: number; filled: number; pgSourced: number };
  storageMode?: string;
}> {
  const res = await fetch('/api/brand/merch/supplier-bom', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as {
    ok?: boolean;
    rows?: BrandSupplierBomFeedRow[];
    summary?: { total: number; filled: number; pgSourced: number };
    storageMode?: string;
  };
  if (!res.ok || !json.ok) return { ok: false };
  return { ok: true, ...json };
}
