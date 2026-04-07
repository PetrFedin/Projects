import type { WholesalePartnerTierV1 } from './types';

/** Система лояльности и кредитные лимиты для оптовых партнеров. */
export function getWholesalePartnerProfile(partnerId: string): WholesalePartnerTierV1 {
  const seed = partnerId.length * 23;
  const creditLine = 5000000 + (seed % 10) * 1000000;
  const unpaid = (seed % 5) * 500000;

  return {
    partnerId,
    partnerName: `Partner ${partnerId.split('-')[1] || 'Retailer'}`,
    tier: seed % 4 === 0 ? 'Diamond' : (seed % 4 === 1 ? 'Platinum' : 'Gold'),
    creditLine,
    unpaidInvoices: unpaid,
    availableLimit: creditLine - unpaid,
    loyaltyPoints: 1200 + (seed % 5000),
  };
}
