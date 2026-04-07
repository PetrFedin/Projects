import type { ShowroomOrderSimulationV1 } from './types';

/** Симуляция влияния оптового заказа на KPI магазина. */
export function simulateOrderImpact(sessionId: string): ShowroomOrderSimulationV1 {
  const seedRaw = sessionId.split('-').pop() || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sessionId.length * 13;

  return {
    sessionId,
    projectedSellThrough: 65 + (seed % 20),
    projectedMargin: 55 + (seed % 10),
    inventoryTurnoverWeeks: 8 + (seed % 4),
    markdownRiskScore: seed % 5 === 0 ? 45 : 15,
  };
}
