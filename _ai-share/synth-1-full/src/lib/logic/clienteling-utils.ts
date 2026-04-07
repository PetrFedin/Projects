import { CustomerProfile, RecommendationEngineResult } from '../types/clienteling';

/**
 * Clienteling 2.0 Utils
 * Планшет продавца с глубоким профилем клиента и AI-рекомендациями.
 */

export function calculateCustomerLTV(profile: CustomerProfile): number {
  return profile.purchaseHistory.reduce((sum, record) => sum + record.amount, 0);
}

/**
 * AI Recommendation Engine for Clienteling
 */
export async function getClientRecommendations(profile: CustomerProfile): Promise<RecommendationEngineResult> {
  // Имитация AI-анализа
  await new Promise(resolve => setTimeout(resolve, 1500));

  const favorites = profile.favoriteCategories;
  
  return {
    customerId: profile.id,
    suggestedProducts: [
      { productId: 'p-1', name: 'Silk Blouse', reason: 'Matches previous purchase of Silk Trousers', score: 98 },
      { productId: 'p-2', name: 'Wool Coat', reason: 'Fits your style preference for Oversized silhouettes', score: 92 },
      { productId: 'p-3', name: 'Leather Bag', reason: 'Top trending accessory in your favorite category', score: 85 }
    ] as any,
    styleInsight: "Клиент предпочитает натуральные ткани и свободный крой. Избегайте предложений из полиэстера."
  };
}

/**
 * Loyalty Tier Calculation
 */
export function updateLoyaltyTier(profile: CustomerProfile): 'silver' | 'gold' | 'platinum' {
  const ltv = calculateCustomerLTV(profile);
  if (ltv > 10000) return 'platinum';
  if (ltv > 2500) return 'gold';
  return 'silver';
}
