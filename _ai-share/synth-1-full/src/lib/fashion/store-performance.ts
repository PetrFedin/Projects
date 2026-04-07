import type { StorePerformanceV1 } from './types';

/** Аналитика производительности разных типов торговых точек. */
export function getStorePerformanceAnalytics(sku: string): StorePerformanceV1[] {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 11;
  
  return [
    { storeType: 'Flagship', predictedSellThrough: 85 + (seed % 10), bestSellingSize: 'M', trafficIntensity: 9 },
    { storeType: 'Mall', predictedSellThrough: 75 + (seed % 15), bestSellingSize: 'L', trafficIntensity: 10 },
    { storeType: 'Street', predictedSellThrough: 60 + (seed % 20), bestSellingSize: 'S', trafficIntensity: 6 },
    { storeType: 'Corner', predictedSellThrough: 90 + (seed % 5), bestSellingSize: 'M', trafficIntensity: 4 },
  ];
}
