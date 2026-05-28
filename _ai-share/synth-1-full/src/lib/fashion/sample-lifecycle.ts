import type { SampleLifecycleV1 } from './types';

/** Трекинг жизненного цикла образцов (Samples) от производства до маркетинга. */
export function getSampleLifecycle(sku: string): SampleLifecycleV1[] {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 29;

  return [
    {
      sku,
      sampleType: 'SMS',
      location: 'Showroom',
      status: 'received',
    },
    {
      sku,
      sampleType: 'Proto',
      location: 'Factory',
      status: 'sent_back',
      trackingNumber: `SAMP-${seed}-TRK`,
    },
    {
      sku,
      sampleType: 'Gold',
      location: 'Atelier',
      status: 'in_transit',
    },
  ];
}
