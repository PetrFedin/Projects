import type { PartnerCreditScoreV1 } from './types';

/** Кредитный скоринг оптового партнера (B2B Credit Score). */
export function getPartnerCreditScore(partnerId: string): PartnerCreditScoreV1 {
  const seedRaw = partnerId.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = partnerId.length * 23;

  const score = 650 + (seed % 350);
  let rating: PartnerCreditScoreV1['riskRating'] = 'medium';
  if (score > 850) rating = 'low';
  else if (score < 700) rating = 'high';

  return {
    partnerId,
    creditScore: score,
    recommendedLimit: score * 15000,
    riskRating: rating,
    paymentHistoryPoints: 85 + (seed % 15),
  };
}
