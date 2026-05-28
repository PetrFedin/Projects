import type { Workshop2DossierMetricsPayload } from '@/lib/production/workshop2-dossier-metrics-ingest';
import {
  pickLatestW2DossierRowsPerArticle,
  type W2DossierMetricsDedupAggregate,
} from '@/lib/server/workshop2-dossier-metrics-store';

export type W2OpsDailyPoint = {
  day: string;
  articles: number;
  articlesPassport100: number;
  articlesVisualGate0: number;
  articlesSampleReady: number;
  articlesWithAbandon: number;
  rawEvents: number;
};

export type W2OpsAlert = { level: 'info' | 'warn' | 'error'; code: string; message: string };

function parseIntEnv(name: string, def: number, min: number, max: number): number {
  const v = parseInt(process.env[name] ?? '', 10);
  if (!Number.isFinite(v)) return def;
  return Math.min(max, Math.max(min, v));
}

function parseFloatEnv(name: string, def: number, min: number, max: number): number {
  const v = parseFloat(process.env[name] ?? '');
  if (!Number.isFinite(v)) return def;
  return Math.min(max, Math.max(min, v));
}

/** Пороги для buildW2OpsAlerts (переменные окружения, см. .env.example). */
export function getW2OpsAlertThresholds() {
  return {
    staleHours: parseIntEnv('W2_OPS_STALE_HOURS', 48, 1, 720),
    passportMinArticles: parseIntEnv('W2_OPS_PASSPORT_MIN_ARTICLES', 8, 0, 100_000),
    passportRatioWarnBelow: parseFloatEnv('W2_OPS_PASSPORT_RATIO_WARN_BELOW', 0.08, 0, 1),
    abandonMinRaw: parseIntEnv('W2_OPS_ABANDON_MIN_RAW', 10, 0, 100_000),
    abandonRatioWarnAbove: parseFloatEnv('W2_OPS_ABANDON_RATIO_WARN_ABOVE', 0.35, 0, 1),
  };
}

function utcDay(iso: string): string | null {
  if (!iso || typeof iso !== 'string') return null;
  const d = iso.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null;
}

/** По каждому календарному дню (UTC): последний снимок на SKU среди событий этого дня. */
export function buildW2OpsDailySeries(
  rows: Workshop2DossierMetricsPayload[],
  daysBack: number,
  collectionFilter?: Set<string>
): W2OpsDailyPoint[] {
  const filtered =
    collectionFilter && collectionFilter.size > 0
      ? rows.filter((r) => collectionFilter.has(r.collectionId))
      : rows;
  const byDay = new Map<string, Workshop2DossierMetricsPayload[]>();
  for (const r of filtered) {
    const day = utcDay(r.capturedAt);
    if (!day) continue;
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(r);
  }
  const days = [...byDay.keys()].sort();
  const tail = days.slice(-Math.max(1, daysBack));

  const points: W2OpsDailyPoint[] = [];
  for (const day of tail) {
    const dayRows = byDay.get(day) ?? [];
    const latest = pickLatestW2DossierRowsPerArticle(dayRows);
    let p100 = 0;
    let g0 = 0;
    let sample = 0;
    let aband = 0;
    for (const r of latest) {
      if (r.contour?.passportRoutePct100At) p100 += 1;
      if (r.contour?.visualGateOpen0At) g0 += 1;
      if (r.contour?.tzSampleReadyAt) sample += 1;
      if (r.abandonCount > 0) aband += 1;
    }
    points.push({
      day,
      articles: latest.length,
      articlesPassport100: p100,
      articlesVisualGate0: g0,
      articlesSampleReady: sample,
      articlesWithAbandon: aband,
      rawEvents: dayRows.length,
    });
  }
  return points;
}

export function buildW2OpsAlerts(
  rows: Workshop2DossierMetricsPayload[],
  dedup: W2DossierMetricsDedupAggregate
): W2OpsAlert[] {
  const alerts: W2OpsAlert[] = [];
  if (rows.length === 0) {
    alerts.push({
      level: 'warn',
      code: 'no_rows',
      message: 'В выбранном окне нет строк метрик — проверьте хранилище и limit.',
    });
    return alerts;
  }

  let maxIso = '';
  for (const r of rows) {
    if (r.capturedAt && r.capturedAt > maxIso) maxIso = r.capturedAt;
  }
  const th = getW2OpsAlertThresholds();

  if (maxIso) {
    const ageH = (Date.now() - new Date(maxIso).getTime()) / 3_600_000;
    if (ageH > th.staleHours) {
      alerts.push({
        level: 'warn',
        code: 'stale_tail',
        message: `Последнее событие старше ${Math.round(ageH)} ч (порог ${th.staleHours} ч) — клиенты не шлют снимки или окно узкое.`,
      });
    }
  }

  const totalArticles = dedup.byCollection.reduce((s, c) => s + c.articles, 0);
  const totalP100 = dedup.byCollection.reduce((s, c) => s + c.articlesPassport100, 0);
  if (
    totalArticles >= th.passportMinArticles &&
    totalP100 / totalArticles < th.passportRatioWarnBelow
  ) {
    alerts.push({
      level: 'info',
      code: 'low_passport_completion',
      message: `Доля SKU с паспортом 100% ниже ${Math.round(th.passportRatioWarnBelow * 100)}% при ≥${th.passportMinArticles} артикулах (последний снимок в окне).`,
    });
  }

  const rawAbandon = rows.filter((r) => r.abandonCount > 0).length;
  if (rows.length >= th.abandonMinRaw && rawAbandon / rows.length > th.abandonRatioWarnAbove) {
    alerts.push({
      level: 'info',
      code: 'high_abandon_signal',
      message: `Доля снимков с abandonCount>0 выше ${Math.round(th.abandonRatioWarnAbove * 100)}% (при ≥${th.abandonMinRaw} строках) — проверьте UX сохранения / уход со вкладки.`,
    });
  }

  return alerts;
}
