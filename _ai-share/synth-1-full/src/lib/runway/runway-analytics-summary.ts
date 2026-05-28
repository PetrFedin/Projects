/**
 * Агрегированные KPI runway для email/отчётов — GET /api/runway/analytics/summary.
 * Только реальные события из store, без синтетики.
 */
import type { ScrollExperienceEventLogEntry } from '@/lib/scroll-experience-analytics';
import {
  aggregateRunwayAnalyticsFromEvents,
  type RunwayAnalyticsDashboard,
} from '@/lib/runway/runway-analytics-aggregation';
import {
  filterRunwayAnalyticsEventsByDateRange,
  runwayAnalyticsPresetRange,
} from '@/lib/runway/runway-analytics-query';

export type RunwayAnalyticsSummaryPeriod = 'day' | 'week' | 'month';

export interface RunwayAnalyticsTopProductRow {
  productSlug: string;
  views: number;
  sectionChanges: number;
}

export interface RunwayAnalyticsSummary {
  period: RunwayAnalyticsSummaryPeriod;
  from: string;
  to: string;
  generatedAt: string;
  dashboard: RunwayAnalyticsDashboard;
  topProducts: RunwayAnalyticsTopProductRow[];
  uniqueProductSlugs: number;
}

const PERIOD_DAYS: Record<RunwayAnalyticsSummaryPeriod, number> = {
  day: 1,
  week: 7,
  month: 30,
};

export function resolveRunwayAnalyticsSummaryPeriod(
  raw: string | null | undefined
): RunwayAnalyticsSummaryPeriod {
  if (raw === 'day' || raw === 'month' || raw === 'week') return raw;
  return 'week';
}

export function buildRunwayAnalyticsSummary(
  events: ScrollExperienceEventLogEntry[],
  period: RunwayAnalyticsSummaryPeriod = 'week'
): RunwayAnalyticsSummary {
  const days = PERIOD_DAYS[period];
  const { from, to } = runwayAnalyticsPresetRange(days);
  const filtered = filterRunwayAnalyticsEventsByDateRange(events, from, to);
  const dashboard = aggregateRunwayAnalyticsFromEvents(filtered);

  const productMap = new Map<string, { views: number; sectionChanges: number }>();
  for (const event of filtered) {
    const slug = event.productSlug;
    if (!slug) continue;
    const row = productMap.get(slug) ?? { views: 0, sectionChanges: 0 };
    if (event.event === 'scroll_experience_view') row.views += 1;
    if (event.event === 'scroll_experience_section_change') row.sectionChanges += 1;
    productMap.set(slug, row);
  }

  const topProducts = [...productMap.entries()]
    .map(([productSlug, stats]) => ({ productSlug, ...stats }))
    .sort((a, b) => b.views - a.views || b.sectionChanges - a.sectionChanges)
    .slice(0, 10);

  return {
    period,
    from,
    to,
    generatedAt: new Date().toISOString(),
    dashboard,
    topProducts,
    uniqueProductSlugs: productMap.size,
  };
}
