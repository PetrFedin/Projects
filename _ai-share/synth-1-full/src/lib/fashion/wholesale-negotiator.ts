import type { WholesalePriceNegotiatorV1 } from './types';

/** Помощник для согласования оптовых цен (Negotiator AI). */
export function getWholesaleNegotiationProposal(
  sku: string,
  targetPrice: number,
  qty: number
): WholesalePriceNegotiatorV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 41;

  const basePrice = 5000 + (seed % 2000);
  const negotiated = targetPrice > basePrice * 0.85 ? targetPrice : basePrice * 0.88;

  return {
    sku,
    baseWholesalePrice: basePrice,
    negotiatedPrice: Math.round(negotiated),
    qtyTier: qty,
    marginAtNegotiatedPrice: Math.round(((negotiated - 2000) / negotiated) * 100),
    status: negotiated === targetPrice ? 'approved' : 'counter_offered',
  };
}
