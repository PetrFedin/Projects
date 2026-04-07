import type { Product } from '@/lib/types';
import type { PriceWatchEntryV1 } from './types';

const STORAGE_KEY = 'synth.priceWatch.v1';

export function loadPriceWatchList(): PriceWatchEntryV1[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as PriceWatchEntryV1[];
    return Array.isArray(arr) ? arr.filter((x) => x?.sku && x?.slug) : [];
  } catch {
    return [];
  }
}

export function savePriceWatchList(entries: PriceWatchEntryV1[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addOrRefreshPriceWatch(product: Product): PriceWatchEntryV1[] {
  const list = loadPriceWatchList();
  const sku = product.sku;
  const next: PriceWatchEntryV1 = {
    sku,
    slug: product.slug,
    nameSnapshot: product.name,
    priceSnapshot: product.price,
    addedAt: Date.now(),
  };
  const idx = list.findIndex((x) => x.sku === sku);
  if (idx >= 0) list[idx] = { ...list[idx], ...next };
  else list.push(next);
  savePriceWatchList(list);
  return list;
}

export function removePriceWatch(sku: string): PriceWatchEntryV1[] {
  const list = loadPriceWatchList().filter((x) => x.sku !== sku);
  savePriceWatchList(list);
  return list;
}

export function priceDeltaPct(current: number, snapshot: number): number | null {
  if (!snapshot || snapshot <= 0) return null;
  return Math.round(((current - snapshot) / snapshot) * 1000) / 10;
}
