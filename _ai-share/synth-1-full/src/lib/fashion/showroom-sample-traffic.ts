import type { ShowroomSampleTrafficV1 } from './types';

/** Аналитика популярности образцов в шоуруме (Sample Heatmap). */
export function getShowroomSampleTraffic(sku: string): ShowroomSampleTrafficV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 37;

  const touches = 50 + (seed % 200);
  const fittings = Math.round(touches * 0.15 + (seed % 10));

  return {
    sku,
    totalTouches: touches,
    fittingsCount: fittings,
    scanDensityScore: (touches / 250) * 100,
    lastTouchTime: new Date(Date.now() - (seed % 3600000)).toISOString(),
  };
}

export function getAllShowroomSampleTraffic(): ShowroomSampleTrafficV1[] {
  return [
    getShowroomSampleTraffic('SKU-101'),
    getShowroomSampleTraffic('SKU-202'),
    getShowroomSampleTraffic('SKU-505'),
  ];
}
