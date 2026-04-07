import type { ShowroomLookInterestV1 } from './types';

/** Аналитика интереса к образам в шоуруме для планирования производства. */
export function getShowroomLookInterest(lookId: string): ShowroomLookInterestV1 {
  const seedRaw = lookId.split('-').pop() || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = lookId.length * 23;

  const hearts = 12 + (seed % 40);
  let priority: ShowroomLookInterestV1['productionPriority'] = 'medium';
  if (hearts > 35) priority = 'urgent';
  else if (hearts > 25) priority = 'high';

  return {
    lookId,
    skus: ['SKU-101', 'SKU-202', 'SKU-303'],
    totalHearts: hearts,
    productionPriority: priority,
    trendingStatus: seed % 2 === 0 ? 'rising' : 'stable',
  };
}

export function getTopTrendingShowroomLooks(): ShowroomLookInterestV1[] {
  return [
    getShowroomLookInterest('LOOK-SS26-01'),
    getShowroomLookInterest('LOOK-SS26-02'),
    getShowroomLookInterest('LOOK-SS26-03'),
  ];
}
