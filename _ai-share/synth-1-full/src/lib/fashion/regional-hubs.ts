import type { RegionalHubFulfillmentV1, RegionalHubStockV1 } from './types';

/** Управление фулфилментом через региональные хабы (B2B Reservation). */
export function getRegionalHubFulfillment(sku: string): RegionalHubFulfillmentV1[] {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 17;

  return [
    { 
      hubId: 'HUB-CENTRAL-MSK', 
      sku, 
      stockInHub: 5000, 
      availableForB2B: 3500, 
      reservedForRetail: 1500, 
      nextReplenishmentDate: '2026-04-10' 
    },
    { 
      hubId: 'HUB-SOUTH-KRD', 
      sku, 
      stockInHub: 1200, 
      availableForB2B: 800, 
      reservedForRetail: 400, 
      nextReplenishmentDate: '2026-04-15' 
    },
  ];
}

/** Наличие товара в региональных хабах РФ (Regional Stock). */
export function getRegionalHubStock(sku: string): RegionalHubStockV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 13;

  return {
    sku,
    hubs: [
      { name: 'Moscow Central', available: 450 + (seed % 200), transitDays: 1 },
      { name: 'Saint Petersburg', available: 120 + (seed % 100), transitDays: 2 },
      { name: 'Ekaterinburg', available: 85 + (seed % 50), transitDays: 4 },
      { name: 'Novosibirsk', available: 40 + (seed % 30), transitDays: 6 },
      { name: 'Krasnodar', available: 210 + (seed % 80), transitDays: 3 },
    ],
  };
}
