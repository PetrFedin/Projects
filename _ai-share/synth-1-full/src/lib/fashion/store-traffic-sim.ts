import type { StoreZoneConversionV1 } from './types';

/** Симуляция трафика и конверсии зон в торговом зале. */
export function getStoreZoneConversions(storeId: string): StoreZoneConversionV1[] {
  return [
    {
      zoneName: 'Входная зона',
      footTraffic: 1200,
      conversionPercent: 8,
      recommendedVMScheme: 'Focus on SS26',
    },
    {
      zoneName: 'Аксессуарный стол',
      footTraffic: 450,
      conversionPercent: 15,
      recommendedVMScheme: 'Cross-selling',
    },
    {
      zoneName: 'Примерочные',
      footTraffic: 300,
      conversionPercent: 65,
      recommendedVMScheme: 'Staff presence required',
    },
    {
      zoneName: 'Кассовая зона',
      footTraffic: 250,
      conversionPercent: 95,
      recommendedVMScheme: 'Impulse buys only',
    },
  ];
}
