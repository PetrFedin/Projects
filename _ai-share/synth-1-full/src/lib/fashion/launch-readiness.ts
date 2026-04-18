import type { Product } from '@/lib/types';
import type { LaunchReadinessV1 } from './types';

export type LaunchReadinessCheckRow = { id: string; ok: boolean };

export type LaunchReadinessAssessment = {
  percent: number;
  checks: LaunchReadinessCheckRow[];
};

/** Агрегированная «go-live» готовность для таблицы и CSV (чек-лист на карточку). */
export type LaunchReadinessScoreRow = { sku: string; score: number };

/** Строки для агрегатов ассортимента (средний % готовности к запуску). */
export function buildLaunchReadinessRows(products: Product[]): LaunchReadinessScoreRow[] {
  return products.map((product) => ({
    sku: product.sku,
    score: assessLaunchReadiness(product).percent,
  }));
}

export function assessLaunchReadiness(product: Product): LaunchReadinessAssessment {
  const lr = getLaunchReadiness(product);
  const checks: LaunchReadinessCheckRow[] = [
    { id: 'stock', ok: lr.stockReadiness >= 85 },
    { id: 'marketing', ok: lr.marketingContentReady },
    { id: 'honest_mark', ok: lr.honestMarkReady },
    { id: 'launch_window', ok: lr.launchStatus === 'on_track' },
  ];
  const passed = checks.filter((c) => c.ok).length;
  const percent = Math.round((passed / checks.length) * 100);
  return { percent, checks };
}

export function launchReadinessToCsv(
  payload: { sku: string; slug: string; percent: number; failed: string }[]
): string {
  const header = 'sku,slug,percent,failed';
  const lines = payload.map((r) => {
    const failed = `"${r.failed.replace(/"/g, '""')}"`;
    return `${r.sku},${r.slug},${r.percent},${failed}`;
  });
  return [header, ...lines].join('\n');
}

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
