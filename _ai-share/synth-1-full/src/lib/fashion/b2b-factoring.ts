import type { B2BFactoringV1 } from './types';

/** Управление лимитами факторинга и кредитования для B2B партнеров (Финтех). */
export function getB2BFactoringStatus(partnerId: string): B2BFactoringV1 {
  const seedRaw = partnerId.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = partnerId.length * 19;

  const limit = 10000000 + (seed % 20000000);
  const available = seed % 4 === 0 ? limit * 0.1 : limit * 0.6; // Low limit every 4th partner

  return {
    partnerId,
    totalLimit: limit,
    availableLimit: available,
    factoringStatus: available < limit * 0.2 ? 'under_review' : 'eligible',
    averageDaysToPay: 30 + (seed % 15),
    overdueAmount: seed % 10 === 0 ? 450000 : 0, // Mock overdue for every 10th
  };
}
