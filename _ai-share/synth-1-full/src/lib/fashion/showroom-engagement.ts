import type { ShowroomEngagementV1 } from './types';

/** Аналитика вовлеченности в шоуруме (Interaction Tracking). */
export function getShowroomEngagement(skus: string[]): ShowroomEngagementV1[] {
  return skus.map(sku => {
    const seedRaw = sku.split('-')[1] || '100';
    let seed = parseInt(seedRaw, 10);
    if (isNaN(seed)) seed = sku.length * 53;
    return {
      sku,
      totalViewTimeSec: 120 + (seed % 300),
      interactedWith3d: seed % 2 === 0,
      engagementScore: 40 + (seed % 60),
      sentiment: seed % 3 === 0 ? 'positive' : (seed % 2 === 0 ? 'neutral' : 'skeptical'),
    };
  });
}
