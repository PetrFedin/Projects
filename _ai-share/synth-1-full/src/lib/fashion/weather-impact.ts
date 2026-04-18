import type { StoreWeatherCorrelationV1 } from './types';

/** Корреляция трафика магазина с погодой (Local Weather Impact). */
export function getStoreWeatherImpact(): StoreWeatherCorrelationV1[] {
  return [
    {
      storeId: 'MSK-CITY',
      date: new Date().toISOString().split('T')[0],
      weatherCondition: 'rain',
      trafficImpact: -15,
      recommendedStock: ['SKU-UMBRELLA', 'SKU-TRENCH-01'],
    },
    {
      storeId: 'SPB-GALLERY',
      date: new Date().toISOString().split('T')[0],
      weatherCondition: 'cold',
      trafficImpact: +12,
      recommendedStock: ['SKU-KNIT-05', 'SKU-SCARF-02'],
    },
  ];
}
