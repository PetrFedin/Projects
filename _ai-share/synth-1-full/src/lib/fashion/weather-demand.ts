import type { WeatherDemandCorrelationV1 } from './types';

/** Корреляция спроса и погоды для регионов РФ. */
export function getWeatherDemandCorrelation(sku: string, region: string): WeatherDemandCorrelationV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 23;
  
  return {
    sku,
    region,
    temperatureSensitivity: 8,
    idealTempRange: region.includes('Siberia') ? '-10°C to +5°C' : '+5°C to +15°C',
    demandShiftFactor: 1.25,
    recommendation: `Expected late spring in ${region}. Increase light layer allocation by 15%.`,
  };
}
