import type { FittingRoomFeedbackV1 } from './types';

/** Обратная связь из примерочных (физический ритейл). */
export function getFittingRoomFeedback(sku: string): FittingRoomFeedbackV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 19;
  
  const reasons = ['Fit issues', 'Color slightly off', 'Lining too thin', 'Length for taller person', 'Need more stretch'];
  
  return {
    sku,
    rejectedCount: 45 + (seed % 100),
    topReasons: reasons.slice(seed % 3, (seed % 3) + 3),
    conversionRate: 65 - (seed % 20),
  };
}
