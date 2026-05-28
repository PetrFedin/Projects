import 'server-only';

import type {
  ScrollExperienceEventLogEntry,
  ScrollExperienceMetricsSnapshot,
} from '@/lib/scroll-experience-analytics';
import { getRunwayAnalyticsStore } from '@/lib/server/runway-analytics-store-interface';

/** Все runway-события с диска (до 500). */
export async function readRunwayAnalyticsEvents(): Promise<ScrollExperienceEventLogEntry[]> {
  return getRunwayAnalyticsStore().readEvents();
}

/** Добавить batch событий с дедупликацией по ключу. */
export async function appendRunwayAnalyticsEvents(
  incoming: ScrollExperienceEventLogEntry[]
): Promise<{ accepted: number; total: number }> {
  return getRunwayAnalyticsStore().appendEvents(incoming);
}

/** Сброс server-side журнала (dev / admin). */
export async function resetRunwayAnalyticsStore(): Promise<void> {
  return getRunwayAnalyticsStore().reset();
}

/** Агрегированные метрики из server store. */
export async function readRunwayAnalyticsMetrics(): Promise<ScrollExperienceMetricsSnapshot> {
  return getRunwayAnalyticsStore().readMetrics();
}

export type { ScrollExperienceEventName } from '@/lib/scroll-experience-analytics';
