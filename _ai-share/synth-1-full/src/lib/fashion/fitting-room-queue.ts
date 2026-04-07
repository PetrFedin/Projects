import type { FittingRoomQueueV1 } from './types';

/** Управление очередью в примерочные для розничного магазина. */
export function getFittingRoomQueue(sku: string, storeId: string = 'STORE-MOSCOW-MAIN'): FittingRoomQueueV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 11;

  const count = (seed % 8) + 1;
  const minutes = count * 4;

  return {
    storeId,
    sku,
    activeWaitlistCount: count,
    estimatedWaitMinutes: minutes,
    availableBooths: 10,
    isRushHour: count > 5,
  };
}
