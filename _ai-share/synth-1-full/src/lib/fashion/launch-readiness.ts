import type { Product } from '@/lib/types';
import type { LaunchReadinessV1 } from './types';

/** Готовность к запуску к праздникам/сезонам РФ. */
export function getLaunchReadiness(product: Product): LaunchReadinessV1 {
  const month = new Date().getMonth();

  // Определяем ближайший праздник
  let holiday: LaunchReadinessV1['targetHoliday'] = 'March 8';
  if (month >= 8 && month <= 11) holiday = 'New Year';
  else if (month === 0 || month === 1) holiday = 'Feb 23';
  else if (month >= 5 && month <= 7) holiday = 'Back to School';

  const readiness = 70 + (product.sku.length % 25);

  return {
    sku: product.sku,
    targetHoliday: holiday,
    stockReadiness: readiness,
    marketingContentReady: readiness > 80,
    honestMarkReady: readiness > 75,
    launchStatus: readiness > 90 ? 'on_track' : readiness > 75 ? 'at_risk' : 'delayed',
  };
}
