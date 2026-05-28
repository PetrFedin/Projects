import 'server-only';

import {
  readRunwayAnalyticsEvents,
  readRunwayAnalyticsMetrics,
} from '@/lib/server/runway-analytics-store';
import {
  aggregateRunwayAnalyticsFromEvents,
  type RunwayAnalyticsDashboard,
} from '@/lib/runway/runway-analytics-aggregation';

/** Снимок dashboard для SSE / poll — единая точка сборки. */
export async function buildRunwayAnalyticsDashboardSnapshot(): Promise<RunwayAnalyticsDashboard> {
  const events = await readRunwayAnalyticsEvents();
  const metrics = await readRunwayAnalyticsMetrics();
  return aggregateRunwayAnalyticsFromEvents(events, metrics);
}

/** Формат SSE payload (data: JSON + двойной перевод строки). */
export function formatRunwayAnalyticsSseEvent(dashboard: RunwayAnalyticsDashboard): string {
  return `data: ${JSON.stringify(dashboard)}\n\n`;
}
