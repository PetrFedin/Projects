import type { B2BLogisticsRouteV1 } from './types';

/** Оптимизатор маршрутов для СДЭК, ПЭК, Деловых Линий. */
export function getOptimizedLogisticsRoutes(
  from: string,
  to: string,
  weightKg: number
): B2BLogisticsRouteV1[] {
  return [
    {
      id: 'L-001',
      carrier: 'CDEK',
      from,
      to,
      estDays: 3,
      costRub: weightKg * 450,
      reliabilityScore: 92,
      carbonFootprintKg: weightKg * 0.12,
    },
    {
      id: 'L-002',
      carrier: 'PEK',
      from,
      to,
      estDays: 5,
      costRub: weightKg * 320,
      reliabilityScore: 85,
      carbonFootprintKg: weightKg * 0.08,
    },
    {
      id: 'L-003',
      carrier: 'Dellin',
      from,
      to,
      estDays: 4,
      costRub: weightKg * 380,
      reliabilityScore: 89,
      carbonFootprintKg: weightKg * 0.1,
    },
  ];
}
