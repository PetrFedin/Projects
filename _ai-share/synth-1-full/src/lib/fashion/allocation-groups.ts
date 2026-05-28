import type { AllocationGroupV1 } from './types';

/** Группировка магазинов для кластерной аллокации (Store Clustering). */
export function getAllocationGroups(): AllocationGroupV1[] {
  return [
    {
      groupId: 'Flagships (Tier A)',
      storeCount: 5,
      minAssortmentWidth: 45,
      maxOrderValuePerStore: 15000000,
      priority: 'high',
    },
    {
      groupId: 'Regional Hubs (Tier B)',
      storeCount: 12,
      minAssortmentWidth: 25,
      maxOrderValuePerStore: 5000000,
      priority: 'medium',
    },
    {
      groupId: 'Satellite Stores (Tier C)',
      storeCount: 30,
      minAssortmentWidth: 10,
      maxOrderValuePerStore: 1500000,
      priority: 'low',
    },
  ];
}
