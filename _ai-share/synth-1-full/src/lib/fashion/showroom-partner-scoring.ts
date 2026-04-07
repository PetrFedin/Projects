import type { PartnerReliabilityScoreV1 } from './types';

/** Скоринг надежности партнера (B2B/Showroom). */
export function getPartnerReliability(partnerId: string): PartnerReliabilityScoreV1 {
  const seedRaw = partnerId.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = partnerId.length * 17;

  const fulfillment = 85 + (seed % 15);
  const payment = 90 + (seed % 10);
  const returns = 2 + (seed % 8);

  let tier: PartnerReliabilityScoreV1['reliabilityTier'] = 'B';
  if (fulfillment > 95 && payment > 95) tier = 'A+';
  else if (fulfillment > 90) tier = 'A';
  else if (fulfillment < 80) tier = 'C';

  return {
    partnerId,
    orderFulfillmentRate: fulfillment,
    paymentOnTimeRate: payment,
    returnRate: returns,
    reliabilityTier: tier,
  };
}
