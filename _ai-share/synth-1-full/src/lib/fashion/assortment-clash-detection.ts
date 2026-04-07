import type { AssortmentClashV1 } from './types';

/** Детекция конфликта ассортимента (Clash Detection) в радиусе магазина. */
export function detectAssortmentClash(sku: string, storeId: string = 'STORE-MOSCOW-MAIN'): AssortmentClashV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 17;

  const stores = seed % 5;
  let intensity: AssortmentClashV1['clashIntensity'] = 'low';
  let action: AssortmentClashV1['suggestedAction'] = 'proceed';

  if (stores > 3) {
    intensity = 'high';
    action = 'skip';
  } else if (stores > 1) {
    intensity = 'medium';
    action = 'diversify_color';
  }

  return {
    sku,
    nearbyCompetitorStores: stores,
    clashIntensity: intensity,
    suggestedAction: action,
    radiusKm: 2.5,
  };
}
