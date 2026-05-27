/**
 * Агрегация runway-метрик из localStorage (бренд-админка).
 * Данные — реальные события сессии/браузера, не синтетика.
 */

import {
  getScrollExperienceMetrics,
  readScrollExperienceEventLog,
  type ScrollExperienceEventLogEntry,
  type ScrollExperienceMetricsSnapshot,
} from '@/lib/scroll-experience-analytics';
import { t } from '@/lib/runway/runway-i18n';

export interface RunwaySectionPopularityRow {
  sectionIndex: number;
  sectionLabel: string;
  views: number;
}

export interface RunwayFunnelStep {
  step: string;
  label: string;
  count: number;
  rateFromPrevious: number | null;
}

export interface RunwayAbCohortSplit {
  runwayFirst: number;
  standardFirst: number;
  total: number;
  runwayFirstPct: number | null;
  standardFirstPct: number | null;
}

export interface RunwayAnalyticsDashboard {
  metrics: ScrollExperienceMetricsSnapshot;
  sectionPopularity: RunwaySectionPopularityRow[];
  funnel: RunwayFunnelStep[];
  eventCount: number;
  /** Split A/B cohort из runway_ab_cohort_assigned событий. */
  abCohortSplit?: RunwayAbCohortSplit;
  /** Заполняется GET /api/runway/analytics при from/to/page. */
  dateRange?: { from: string | null; to: string | null };
  eventsPage?: import('@/lib/runway/runway-analytics-query').RunwayAnalyticsEventsPage;
}

function aggregateSectionViews(
  events: ScrollExperienceEventLogEntry[]
): RunwaySectionPopularityRow[] {
  const map = new Map<number, { label: string; views: number }>();

  for (const e of events) {
    if (e.event !== 'scroll_experience_section_change' && e.event !== 'scroll_experience_view') {
      continue;
    }
    const idx = e.sectionIndex;
    if (idx == null || idx < 0) continue;
    const prev = map.get(idx) ?? {
      label: e.sectionLabel ?? t('runway.analyticsSectionFallback', { n: idx + 1 }),
      views: 0,
    };
    prev.views += 1;
    if (e.sectionLabel) prev.label = e.sectionLabel;
    map.set(idx, prev);
  }

  return [...map.entries()]
    .map(([sectionIndex, { label, views }]) => ({ sectionIndex, sectionLabel: label, views }))
    .sort((a, b) => b.views - a.views);
}

function buildFunnel(metrics: ScrollExperienceMetricsSnapshot): RunwayFunnelStep[] {
  const view = metrics.scroll_experience_view;
  const section = metrics.scroll_experience_section_change;
  const cart = metrics.scroll_experience_add_to_cart;
  const share = metrics.scroll_experience_share;

  const steps: Omit<RunwayFunnelStep, 'rateFromPrevious'>[] = [
    { step: 'view', label: t('runway.funnel.view'), count: view },
    { step: 'section_change', label: t('runway.funnel.sectionChange'), count: section },
    { step: 'add_to_cart', label: t('runway.funnel.addToCart'), count: cart },
    { step: 'share', label: t('runway.funnel.share'), count: share },
  ];

  return steps.map((step, i) => {
    const prev = i > 0 ? steps[i - 1]!.count : null;
    const rateFromPrevious =
      prev != null && prev > 0 ? Math.round((step.count / prev) * 1000) / 10 : null;
    return { ...step, rateFromPrevious };
  });
}

/** Пустой dashboard — GET /api/runway/analytics при 0 событий или сбое store (не 500). */
export function buildEmptyRunwayAnalyticsDashboard(): RunwayAnalyticsDashboard {
  return aggregateRunwayAnalyticsFromEvents([]);
}

/** A/B split из сохранённых runway_ab_cohort_assigned событий. */
export function aggregateAbCohortSplit(
  events: ScrollExperienceEventLogEntry[]
): RunwayAbCohortSplit {
  const abEvents = events.filter((e) => e.event === 'runway_ab_cohort_assigned');
  let runwayFirst = 0;
  let standardFirst = 0;

  for (const e of abEvents) {
    const cohort = e.abCohort ?? e.source;
    if (cohort === 'runway-first') runwayFirst += 1;
    else if (cohort === 'standard-first') standardFirst += 1;
  }

  const total = runwayFirst + standardFirst;
  return {
    runwayFirst,
    standardFirst,
    total,
    runwayFirstPct: total > 0 ? Math.round((runwayFirst / total) * 1000) / 10 : null,
    standardFirstPct: total > 0 ? Math.round((standardFirst / total) * 1000) / 10 : null,
  };
}

/** Агрегация из произвольного набора событий (server API или merged client). */
export function aggregateRunwayAnalyticsFromEvents(
  events: ScrollExperienceEventLogEntry[],
  metrics?: ScrollExperienceMetricsSnapshot
): RunwayAnalyticsDashboard {
  const resolvedMetrics = metrics ?? deriveMetricsFromEvents(events);
  return {
    metrics: resolvedMetrics,
    sectionPopularity: aggregateSectionViews(events),
    funnel: buildFunnel(resolvedMetrics),
    eventCount: events.length,
    abCohortSplit: aggregateAbCohortSplit(events),
  };
}

function deriveMetricsFromEvents(
  events: ScrollExperienceEventLogEntry[]
): ScrollExperienceMetricsSnapshot {
  const metrics: ScrollExperienceMetricsSnapshot = {
    scroll_experience_view: 0,
    scroll_experience_section_change: 0,
    scroll_experience_add_to_cart: 0,
    scroll_experience_share: 0,
    scroll_experience_wishlist_toggle: 0,
    updatedAt: new Date().toISOString(),
  };

  for (const entry of events) {
    const key = entry.event as keyof Pick<
      ScrollExperienceMetricsSnapshot,
      | 'scroll_experience_view'
      | 'scroll_experience_section_change'
      | 'scroll_experience_add_to_cart'
      | 'scroll_experience_share'
      | 'scroll_experience_wishlist_toggle'
    >;
    if (key in metrics) metrics[key] += 1;
  }

  return metrics;
}

/** Merge server + local events (server wins on duplicate keys). */
export function mergeRunwayAnalyticsEvents(
  serverEvents: ScrollExperienceEventLogEntry[],
  localEvents: ScrollExperienceEventLogEntry[]
): ScrollExperienceEventLogEntry[] {
  const map = new Map<string, ScrollExperienceEventLogEntry>();
  const keyOf = (e: ScrollExperienceEventLogEntry) =>
    `${e.timestamp}:${e.event}:${e.productSlug}:${e.sectionIndex ?? -1}`;

  for (const e of localEvents) map.set(keyOf(e), e);
  for (const e of serverEvents) map.set(keyOf(e), e);

  return [...map.values()].sort((a, b) => a.timestamp - b.timestamp).slice(-500);
}

/** Дашборд из реальных localStorage-событий runway. */
export function aggregateRunwayAnalytics(): RunwayAnalyticsDashboard {
  const metrics = getScrollExperienceMetrics();
  const events = readScrollExperienceEventLog();
  return aggregateRunwayAnalyticsFromEvents(events, metrics);
}
