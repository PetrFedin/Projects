import type { Workshop2DossierMetricsPayload } from '@/lib/production/workshop2-dossier-metrics-ingest';

export type W2MetricsTimeFilterMeta = {
  sinceMs: number | null;
  rowsBeforeFilter: number;
  rowsAfterFilter: number;
};

/** ISO / часы / сутки — что указано первым по приоритету: sinceIso → sinceHours → sinceDays */
export function parseW2MetricsSinceCutoffMs(searchParams: URLSearchParams, nowMs: number = Date.now()): number | null {
  const iso = searchParams.get('sinceIso')?.trim();
  if (iso) {
    const t = Date.parse(iso);
    return Number.isFinite(t) ? t : null;
  }
  const h = parseInt(searchParams.get('sinceHours') ?? '', 10);
  if (Number.isFinite(h) && h > 0 && h <= 24 * 90) {
    return nowMs - h * 3_600_000;
  }
  const d = parseInt(searchParams.get('sinceDays') ?? '', 10);
  if (Number.isFinite(d) && d > 0 && d <= 366) {
    return nowMs - d * 86_400_000;
  }
  return null;
}

export function filterW2MetricsRowsBySince(
  rows: Workshop2DossierMetricsPayload[],
  sinceMs: number | null
): Workshop2DossierMetricsPayload[] {
  if (sinceMs == null) return rows;
  return rows.filter((r) => {
    const t = Date.parse(r.capturedAt);
    return Number.isFinite(t) && t >= sinceMs;
  });
}

export function applyW2MetricsTimeFilter(
  rows: Workshop2DossierMetricsPayload[],
  searchParams: URLSearchParams,
  nowMs?: number
): { rows: Workshop2DossierMetricsPayload[]; meta: W2MetricsTimeFilterMeta } {
  const before = rows.length;
  const sinceMs = parseW2MetricsSinceCutoffMs(searchParams, nowMs);
  const filtered = filterW2MetricsRowsBySince(rows, sinceMs);
  return {
    rows: filtered,
    meta: {
      sinceMs,
      rowsBeforeFilter: before,
      rowsAfterFilter: filtered.length,
    },
  };
}
