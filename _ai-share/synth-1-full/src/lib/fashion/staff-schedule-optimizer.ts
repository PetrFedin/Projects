import type { StaffShiftOptimizationV1 } from './types';

/** Оптимизация графика персонала магазина (Store Staff AI). */
export function getStaffShiftOptimization(storeId: string = 'STORE-MOSCOW-MAIN'): StaffShiftOptimizationV1 {
  const seedRaw = storeId.split('-').pop() || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = storeId.length * 7;

  return {
    storeId,
    date: new Date().toISOString().split('T')[0],
    totalStaffNeeded: (seed % 5) + 4,
    availableStaff: (seed % 4) + 3,
    shiftStatus: seed % 3 === 0 ? 'understaffed' : 'optimal',
    peakHours: ['14:00', '18:00', '19:30'],
  };
}
