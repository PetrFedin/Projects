import type { Product } from '@/lib/types';
import type { LoyaltyRewardV1 } from './types';

/** Рассчитывает бонусы за покупку (Fashion Loyalty). */
export function calculateLoyaltyRewards(product: Product): LoyaltyRewardV1 {
  const basePoints = Math.floor(product.price * 0.05); // 5% base
  let multiplier = 1.0;
  const perks: string[] = [];

  // Eco-bonus
  if (product.sustainability.length > 0) {
    multiplier += 0.2;
    perks.push('Eco-Bonus: +20% points');
  }

  // New season boost
  if (product.tags?.includes('newSeason')) {
    multiplier += 0.1;
    perks.push('Early Adopter: +10% points');
  }

  return {
    pointsToEarn: Math.round(basePoints * multiplier),
    bonusMultiplier: multiplier,
    perks,
  };
}
