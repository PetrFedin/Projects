/**
 * Phase 4: sparkline из daily metrics (7 дней) или fallback snapshot.
 */
import type { Workshop2ProductionAnalyticsSnapshot } from '@/lib/production/workshop2-production-analytics';

/** Нормализует lead time (дни) в 0–100 для mini-chart. */
export function normalizeWorkshop2LeadTimeSpark(value: number | null | undefined): number {
  if (value == null || !Number.isFinite(value)) return 0;
  return Math.min(100, Math.round((value / 30) * 100));
}

/** Инвертирует rework rate (0–1) в «качество» 0–100. */
export function normalizeWorkshop2ReworkSpark(reworkRate: number | null | undefined): number {
  if (reworkRate == null || !Number.isFinite(reworkRate)) return 50;
  return Math.round((1 - reworkRate) * 100);
}

/** Компактный sparkline из одного snapshot (ops / lead / rework). */
export function buildWorkshop2ProductionSparklineFromSnapshot(
  snapshot: Pick<
    Workshop2ProductionAnalyticsSnapshot,
    'operationsProgressPct' | 'sampleLeadTimeDays' | 'reworkRate'
  >
): number[] {
  return [
    snapshot.operationsProgressPct ?? 0,
    normalizeWorkshop2LeadTimeSpark(snapshot.sampleLeadTimeDays),
    normalizeWorkshop2ReworkSpark(snapshot.reworkRate),
  ];
}

/**
 * Серия ops% за последние N дней (старые → новые).
 * Fallback: одна точка из snapshot.
 */
export function buildWorkshop2ProductionSparklineSeries(input: {
  dailySnapshots: Workshop2ProductionAnalyticsSnapshot[];
  fallbackSnapshot?: Pick<Workshop2ProductionAnalyticsSnapshot, 'operationsProgressPct'>;
  days?: number;
}): number[] {
  const days = input.days ?? 7;
  const sorted = [...input.dailySnapshots]
    .filter((s) => Number.isFinite(s.operationsProgressPct))
    .slice(0, days)
    .reverse();
  if (sorted.length >= 2) {
    return sorted.map((s) => s.operationsProgressPct);
  }
  const pct =
    input.fallbackSnapshot?.operationsProgressPct ?? sorted[0]?.operationsProgressPct ?? 0;
  return [pct];
}
