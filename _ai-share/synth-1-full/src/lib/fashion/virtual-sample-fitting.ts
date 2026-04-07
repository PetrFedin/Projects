import type { ShowroomVirtualSampleV1 } from './types';

/** Инфраструктура для виртуальных примерок образцов (Digital B2B VTO). */
export function getVirtualSampleData(sku: string): ShowroomVirtualSampleV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 13;

  return {
    sku,
    has3dModel: seed % 2 === 0,
    modelUrl: seed % 2 === 0 ? `/assets/vto/${sku}.glb` : undefined,
    avatarTypes: seed % 3 === 0 ? ['slavic', 'tall'] : ['slavic', 'asian', 'curvy'],
    fitAccuracy: 85 + (seed % 15),
  };
}
