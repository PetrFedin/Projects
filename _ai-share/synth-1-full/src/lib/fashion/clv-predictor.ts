import type { UserProfile } from '@/lib/types';
import type { FashionClvV1 } from './types';

/** Прогноз ценности клиента (Customer Lifetime Value for Fashion). */
export function predictFashionClv(user: UserProfile): FashionClvV1 {
  const points = user.loyaltyPoints || 0;
  const plan = user.loyaltyPlan || 'base';

  // Эвристический расчет LTV на основе тарифа лояльности
  const planMultiplier: Record<string, number> = {
    base: 10000,
    start: 30000,
    comfort: 100000,
    premium: 500000,
  };

  const ltv = planMultiplier[plan] + points * 10;
  const churn = Math.max(0, 100 - points / 50);

  return {
    customerId: user.uid,
    predictedLtv: ltv,
    propensityToChurn: churn,
    categoryAffinity: ['Outerwear', 'Accessories'],
    lastPurchaseDate: new Date().toISOString().split('T')[0],
  };
}
