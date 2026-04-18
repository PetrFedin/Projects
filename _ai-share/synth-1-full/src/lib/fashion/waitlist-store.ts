import type { WaitlistEntryV1, DemandForecastRow } from './types';
import type { Product } from '@/lib/types';

export type { WaitlistEntryV1 } from './types';

const STORAGE_KEY = 'synth.waitlist.v1';

export function loadWaitlist(): WaitlistEntryV1[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToWaitlist(product: Product, size: string): WaitlistEntryV1[] {
  if (typeof window === 'undefined') return [];
  const list = loadWaitlist();
  if (list.some((e) => e.sku === product.sku && e.size === size)) return list;

  const next: WaitlistEntryV1 = {
    sku: product.sku,
    slug: product.slug,
    name: product.name,
    size,
    addedAt: Date.now(),
  };
  const newList = [next, ...list];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  return newList;
}

export function removeFromWaitlist(sku: string, size: string): WaitlistEntryV1[] {
  if (typeof window === 'undefined') return [];
  const list = loadWaitlist();
  const newList = list.filter((e) => !(e.sku === sku && e.size === size));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  return newList;
}

/** Демо-агрегация для бренда (в проде — из БД / аналитики). */
export function buildDemandForecast(products: Product[]): DemandForecastRow[] {
  // Simulate waitlist counts based on product popularity and OOS status
  return products
    .map((p) => {
      const isOos = !p.sizes || p.sizes.length < 2; // Simple OOS heuristic
      const baseCount = isOos ? 12 : 2;
      const randomFactor = Math.floor(Math.random() * 20);
<<<<<<< HEAD
=======
      const trend: DemandForecastRow['trend'] =
        randomFactor > 10 ? 'up' : randomFactor < 5 ? 'down' : 'stable';
>>>>>>> recover/cabinet-wip-from-stash

      return {
        sku: p.sku,
        name: p.name,
        size: p.sizes?.[0]?.name || 'One Size',
        waitlistCount: baseCount + randomFactor,
<<<<<<< HEAD
        trend: randomFactor > 10 ? 'up' : randomFactor < 5 ? 'down' : 'stable',
=======
        trend,
>>>>>>> recover/cabinet-wip-from-stash
      };
    })
    .sort((a, b) => b.waitlistCount - a.waitlistCount)
    .slice(0, 20);
}
