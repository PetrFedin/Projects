import 'server-only';

import type {
  ScrollExperienceEventLogEntry,
  ScrollExperienceMetricsSnapshot,
} from '@/lib/scroll-experience-analytics';
import type { RunwayAnalyticsDashboard } from '@/lib/runway/runway-analytics-aggregation';
import type { RunwayAnalyticsQuery } from '@/lib/runway/runway-analytics-query';
import {
  FileRunwayAnalyticsStore,
  PostgresRunwayAnalyticsStore,
} from '@/lib/server/runway-analytics-store-impl';
import { isRunwayPostgresConfigured } from '@/lib/server/runway-pg-pool';

/** Абстракция persistence runway analytics — file (default) или Postgres (production). */
export interface RunwayAnalyticsStore {
  readEvents(): Promise<ScrollExperienceEventLogEntry[]>;
  appendEvents(
    incoming: ScrollExperienceEventLogEntry[]
  ): Promise<{ accepted: number; total: number }>;
  reset(): Promise<void>;
  readMetrics(): Promise<ScrollExperienceMetricsSnapshot>;
  /** Dashboard с фильтрами даты и пагинацией событий. */
  queryDashboard(query: RunwayAnalyticsQuery): Promise<RunwayAnalyticsDashboard>;
  /** CSV export: dashboard summary или raw events. */
  exportCsv(format: 'dashboard' | 'events'): Promise<string>;
}

let singleton: RunwayAnalyticsStore | null = null;

export function createRunwayAnalyticsStore(): RunwayAnalyticsStore {
  const backend = process.env.RUNWAY_ANALYTICS_STORE?.trim().toLowerCase() || 'file';
  if (backend === 'postgres') {
    if (!isRunwayPostgresConfigured()) {
      throw new Error(
        'RUNWAY_ANALYTICS_STORE=postgres requires DATABASE_URL. Run: psql "$DATABASE_URL" -f docs/runway-analytics-migration.sql'
      );
    }
    return new PostgresRunwayAnalyticsStore();
  }
  return new FileRunwayAnalyticsStore();
}

export function getRunwayAnalyticsStore(): RunwayAnalyticsStore {
  if (!singleton) singleton = createRunwayAnalyticsStore();
  return singleton;
}

/** Сброс singleton (тесты). */
export function resetRunwayAnalyticsStoreSingleton(): void {
  singleton = null;
}
