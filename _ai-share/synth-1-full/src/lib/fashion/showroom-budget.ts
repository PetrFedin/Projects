import type { ShowroomSessionBudgetV1 } from './types';

/** Управление бюджетом сессии байера в шоуруме. */
export function getShowroomSessionBudget(sessionId: string): ShowroomSessionBudgetV1 {
  const seedRaw = sessionId.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sessionId.length * 17;

  const budget = 5000000 + (seed % 5000000);
  const orderVal = 2500000 + (seed % 1000000);

  return {
    sessionId,
    partnerId: `PARTNER-${seed % 10}`,
    allocatedBudget: budget,
    currentOrderValue: orderVal,
    remainingBudget: budget - orderVal,
    targetMargin: 65,
    currentEstimatedMargin: 62 + (seed % 5),
  };
}
