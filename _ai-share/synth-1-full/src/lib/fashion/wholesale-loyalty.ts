import type { WholesaleRebateV1 } from './types';

/** Инструмент для мониторинга бонусов и ребейтов оптовых партнеров. */
export function getWholesaleLoyalty(partnerId: string): WholesaleRebateV1 {
  return {
    partnerId,
    currentTurnover: 14500000,
    targetForNextRebate: 20000000,
    estimatedRebatePercent: 2.5,
    activePromos: ['SS26 Pre-Order Early Bird', 'Volume Bonus Category-Top'],
  };
}

export function calculateRebate(turnover: number): number {
  if (turnover > 50000000) return 5;
  if (turnover > 20000000) return 2.5;
  if (turnover > 10000000) return 1.5;
  return 0;
}
