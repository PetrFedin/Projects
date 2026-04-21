import { LogisticsConsolidationRequest } from '../types/logistics';

/**
 * Smart Logistics Consolidation Utils
 * Группировка грузов разных брендов для снижения расходов на логистику.
 */

// Mock Consolidation Pool
export const CONSOLIDATION_POOL: LogisticsConsolidationRequest[] = [
  {
    id: 'REQ-001',
    brandId: 'Brand A',
    origin: 'Shanghai, CN',
    destination: 'Moscow, RU',
    volume: 5.2,
    weight: 1200,
    readyDate: '2026-03-20',
    status: 'pending',
  },
  {
    id: 'REQ-002',
    brandId: 'Brand B',
    origin: 'Shanghai, CN',
    destination: 'Moscow, RU',
    volume: 8.5,
    weight: 2100,
    readyDate: '2026-03-22',
    status: 'pending',
  },
  {
    id: 'REQ-003',
    brandId: 'Brand C',
    origin: 'Istanbul, TR',
    destination: 'Saint Petersburg, RU',
    volume: 12.0,
    weight: 3500,
    readyDate: '2026-03-15',
    status: 'pending',
  },
];

/**
 * Finds matching shipments for consolidation
 */
export function findConsolidationMatches(
  request: LogisticsConsolidationRequest
): LogisticsConsolidationRequest[] {
  return CONSOLIDATION_POOL.filter(
    (r) =>
      r.id !== request.id &&
      r.origin === request.origin &&
      r.destination === request.destination &&
      Math.abs(new Date(r.readyDate).getTime() - new Date(request.readyDate).getTime()) <
        7 * 24 * 60 * 60 * 1000 // Within 7 days
  );
}

/**
 * Calculates potential savings (mock)
 */
export function calculateConsolidationSavings(requests: LogisticsConsolidationRequest[]): {
  totalCBM: number;
  totalKG: number;
  estimatedSavings: number;
} {
  const totalCBM = requests.reduce((sum, r) => sum + r.volume, 0);
  const totalKG = requests.reduce((sum, r) => sum + r.weight, 0);

  // Оценка: экономия при объединении партий (оценочно ~25% к отдельным LCL), в ₽ за м³
  const estimatedSavings = Math.round(totalCBM * 4200);

  return { totalCBM, totalKG, estimatedSavings };
}
