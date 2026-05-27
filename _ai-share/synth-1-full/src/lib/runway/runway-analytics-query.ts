/**
 * Фильтрация и пагинация runway analytics events для GET /api/runway/analytics.
 */
import type { ScrollExperienceEventLogEntry } from '@/lib/scroll-experience-analytics';

export const RUNWAY_ANALYTICS_DEFAULT_PAGE_SIZE = 50;

export interface RunwayAnalyticsDateRange {
  from: string | null;
  to: string | null;
}

export interface RunwayAnalyticsEventsPage {
  items: ScrollExperienceEventLogEntry[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface RunwayAnalyticsQueryParams {
  from?: string | null;
  to?: string | null;
  page?: number;
  pageSize?: number;
}

/** Alias для RunwayAnalyticsStore.queryDashboard. */
export type RunwayAnalyticsQuery = RunwayAnalyticsQueryParams;

/** Парсит YYYY-MM-DD в UTC midnight ms. */
export function parseRunwayAnalyticsDateParam(value: string | null | undefined): number | null {
  if (!value?.trim()) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, y, m, d] = match;
  const ms = Date.UTC(Number(y), Number(m) - 1, Number(d));
  if (Number.isNaN(ms)) return null;
  return ms;
}

/** Конец дня UTC для inclusive to= filter. */
export function endOfRunwayAnalyticsDayUtc(dayStartMs: number): number {
  return dayStartMs + 86_400_000 - 1;
}

export function filterRunwayAnalyticsEventsByDateRange(
  events: ScrollExperienceEventLogEntry[],
  from: string | null | undefined,
  to: string | null | undefined
): ScrollExperienceEventLogEntry[] {
  const fromMs = parseRunwayAnalyticsDateParam(from);
  const toStartMs = parseRunwayAnalyticsDateParam(to);
  const toMs = toStartMs != null ? endOfRunwayAnalyticsDayUtc(toStartMs) : null;

  return events.filter((event) => {
    const ts = event.timestamp;
    if (fromMs != null && ts < fromMs) return false;
    if (toMs != null && ts > toMs) return false;
    return true;
  });
}

export function paginateRunwayAnalyticsEvents(
  events: ScrollExperienceEventLogEntry[],
  page = 1,
  pageSize = RUNWAY_ANALYTICS_DEFAULT_PAGE_SIZE
): RunwayAnalyticsEventsPage {
  const safePageSize = Math.min(Math.max(1, pageSize), 200);
  const totalCount = events.length;
  const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / safePageSize);
  const safePage = totalPages === 0 ? 1 : Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * safePageSize;

  return {
    items: events.slice(start, start + safePageSize),
    page: safePage,
    pageSize: safePageSize,
    totalCount,
    totalPages,
  };
}

export function resolveRunwayAnalyticsQueryFromUrl(url: URL): RunwayAnalyticsQueryParams {
  const pageRaw = url.searchParams.get('page');
  const pageSizeRaw = url.searchParams.get('pageSize');
  const page = pageRaw ? Number.parseInt(pageRaw, 10) : 1;
  const pageSize = pageSizeRaw
    ? Number.parseInt(pageSizeRaw, 10)
    : RUNWAY_ANALYTICS_DEFAULT_PAGE_SIZE;

  return {
    from: url.searchParams.get('from'),
    to: url.searchParams.get('to'),
    page: Number.isFinite(page) ? page : 1,
    pageSize: Number.isFinite(pageSize) ? pageSize : RUNWAY_ANALYTICS_DEFAULT_PAGE_SIZE,
  };
}

/** Последние N дней в формате YYYY-MM-DD (UTC). */
export function runwayAnalyticsPresetRange(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - Math.max(0, days - 1));

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { from: fmt(from), to: fmt(to) };
}
