import type { PartnerPerkV1 } from './types';

/** Прогресс разблокировки партнерских привилегий (Showroom Perk Progress). */
export function getPartnerPerks(partnerId: string, currentOrderValue: number): PartnerPerkV1[] {
  return [
    {
      perkId: 'MARKETING-KIT',
      title: 'Marketing POS Kit',
      requirementDescription: 'Order value > 1M ₽',
      isUnlocked: currentOrderValue >= 1000000,
      progressPercent: Math.min(100, (currentOrderValue / 1000000) * 100),
    },
    {
      perkId: 'FREE-FREIGHT',
      title: 'Free Regional Shipping',
      requirementDescription: 'Order value > 5M ₽',
      isUnlocked: currentOrderValue >= 5000000,
      progressPercent: Math.min(100, (currentOrderValue / 5000000) * 100),
    },
    {
      perkId: 'STAFF-TRAINING',
      title: 'Dedicated Staff Training',
      requirementDescription: 'Assortment width > 50 SKU',
      isUnlocked: false,
      progressPercent: 65,
    }
  ];
}
