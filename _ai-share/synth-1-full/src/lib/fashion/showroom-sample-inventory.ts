import type { ShowroomSampleStatusV1 } from './types';

/** Управление наличием образцов в шоуруме (Sample Inventory tracking). */
export function getShowroomSampleInventory(sku: string): ShowroomSampleStatusV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 11;

  const statuses: ShowroomSampleStatusV1['status'][] = ['available', 'with_buyer', 'maintenance'];
  const status = statuses[seed % statuses.length];

  return {
    id: `SMPL-${sku}-01`,
    sku,
    currentZone: seed % 2 === 0 ? 'Zone A (Main Hall)' : 'Zone B (Fittings)',
    lastScannedBy: seed % 3 === 0 ? 'Elena P.' : 'Igor V.',
    status,
  };
}
