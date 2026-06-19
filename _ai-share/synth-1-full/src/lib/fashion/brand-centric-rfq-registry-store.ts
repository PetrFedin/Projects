import type { BrandCentricRfqRegistryRow } from '@/lib/fashion/brand-centric-rfq-registry';

export async function fetchBrandCentricRfqRegistry(): Promise<BrandCentricRfqRegistryRow[]> {
  const res = await fetch('/api/integrations/v1/centric/rfq', { cache: 'no-store' });
  const json = (await res.json()) as { ok?: boolean; rows?: BrandCentricRfqRegistryRow[] };
  if (!res.ok || !json.ok || !Array.isArray(json.rows)) return [];
  return json.rows;
}
