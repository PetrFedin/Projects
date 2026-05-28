import type { PartnerTierV1 } from './types';

/** Управление тирами и кредитными лимитами B2B партнеров. */
export function getPartnerTiers(): PartnerTierV1[] {
  return [
    {
      partnerId: 'P-001',
      tier: 'Platinum',
      creditLimit: 15000000,
      paymentTermDays: 60,
      discountPercentage: 15,
    },
    {
      partnerId: 'P-002',
      tier: 'Gold',
      creditLimit: 5000000,
      paymentTermDays: 30,
      discountPercentage: 10,
    },
    {
      partnerId: 'P-003',
      tier: 'Silver',
      creditLimit: 1000000,
      paymentTermDays: 14,
      discountPercentage: 5,
    },
  ];
}
