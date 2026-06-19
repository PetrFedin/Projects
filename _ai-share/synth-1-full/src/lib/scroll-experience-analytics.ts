import { mirrorScrollAnalyticsToAdapters } from '@/lib/runway/runway-analytics-adapters';

export type ScrollExperienceEventName =
  | 'scroll_experience_view'
  | 'scroll_experience_section_change'
  | 'scroll_experience_add_to_cart'
  | 'scroll_experience_share'
  | 'scroll_experience_wishlist_toggle'
  | 'runway_ab_cohort_assigned'
  | 'runway_lcp_hero';

export type ScrollExperienceInteractionType = 'wheel' | 'thumb' | 'keyboard' | 'url' | 'touch';

export interface ScrollExperienceEventPayload {
  productSlug: string;
  productId?: string;
  brand?: string;
  sectionIndex?: number;
  sectionId?: string;
  sectionLabel?: string;
  price?: number;
  hasVideo?: boolean;
  interactionType?: ScrollExperienceInteractionType;
  source?: string;
  /** compact | pdp | featured | brand-preview | brand-hero | pdp-ab */
  surface?: string;
  /** A/B cohort при runway_ab_cohort_assigned. */
  abCohort?: 'runway-first' | 'standard-first';
  /** runway_lcp_hero — ms от navigation start, без PII. */
  msSinceNavigation?: number;
  connectionType?: string;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const SCROLL_EXPERIENCE_METRICS_KEY = 'syntha-scroll-experience-metrics';
/** Журнал runway-событий — production persistence для аналитики и social proof. */
export const RUNWAY_ANALYTICS_EVENTS_KEY = 'syntha-runway-analytics-events';
const LEGACY_SCROLL_EXPERIENCE_EVENTS_KEY = 'syntha-scroll-experience-events';
const RUNWAY_ANALYTICS_EVENTS_MAX = 500;

export interface ScrollExperienceEventLogEntry extends ScrollExperienceEventPayload {
  event: ScrollExperienceEventName;
  timestamp: number;
}

export interface ScrollExperienceMetricsSnapshot {
  scroll_experience_view: number;
  scroll_experience_section_change: number;
  scroll_experience_add_to_cart: number;
  scroll_experience_share: number;
  scroll_experience_wishlist_toggle: number;
  updatedAt: string;
}

function readMetrics(): ScrollExperienceMetricsSnapshot {
  const empty: ScrollExperienceMetricsSnapshot = {
    scroll_experience_view: 0,
    scroll_experience_section_change: 0,
    scroll_experience_add_to_cart: 0,
    scroll_experience_share: 0,
    scroll_experience_wishlist_toggle: 0,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window === 'undefined') return empty;
  try {
    const raw = window.localStorage.getItem(SCROLL_EXPERIENCE_METRICS_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<ScrollExperienceMetricsSnapshot>;
    return { ...empty, ...parsed };
  } catch {
    return empty;
  }
}

function persistMetricIncrement(event: ScrollExperienceEventName): void {
  if (typeof window === 'undefined') return;
  const metrics = readMetrics();
  const key = event as keyof Pick<
    ScrollExperienceMetricsSnapshot,
    | 'scroll_experience_view'
    | 'scroll_experience_section_change'
    | 'scroll_experience_add_to_cart'
    | 'scroll_experience_share'
    | 'scroll_experience_wishlist_toggle'
  >;
  if (key in metrics) metrics[key] += 1;
  metrics.updatedAt = new Date().toISOString();
  try {
    window.localStorage.setItem(SCROLL_EXPERIENCE_METRICS_KEY, JSON.stringify(metrics));
  } catch {
    /* quota */
  }
}

function migrateLegacyEventLog(): ScrollExperienceEventLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const legacyRaw = window.localStorage.getItem(LEGACY_SCROLL_EXPERIENCE_EVENTS_KEY);
    if (!legacyRaw) return [];
    const legacy = JSON.parse(legacyRaw) as ScrollExperienceEventLogEntry[];
    if (!Array.isArray(legacy) || legacy.length === 0) return [];
    const currentRaw = window.localStorage.getItem(RUNWAY_ANALYTICS_EVENTS_KEY);
    const current: ScrollExperienceEventLogEntry[] = currentRaw
      ? (JSON.parse(currentRaw) as ScrollExperienceEventLogEntry[])
      : [];
    const merged = [...current, ...legacy].slice(-RUNWAY_ANALYTICS_EVENTS_MAX);
    window.localStorage.setItem(RUNWAY_ANALYTICS_EVENTS_KEY, JSON.stringify(merged));
    window.localStorage.removeItem(LEGACY_SCROLL_EXPERIENCE_EVENTS_KEY);
    return merged;
  } catch {
    return [];
  }
}

function appendEventLog(entry: ScrollExperienceEventLogEntry): void {
  if (typeof window === 'undefined') return;
  try {
    let raw = window.localStorage.getItem(RUNWAY_ANALYTICS_EVENTS_KEY);
    if (!raw) {
      migrateLegacyEventLog();
      raw = window.localStorage.getItem(RUNWAY_ANALYTICS_EVENTS_KEY);
    }
    const list: ScrollExperienceEventLogEntry[] = raw
      ? (JSON.parse(raw) as ScrollExperienceEventLogEntry[])
      : [];
    list.push(entry);
    const trimmed = list.slice(-RUNWAY_ANALYTICS_EVENTS_MAX);
    window.localStorage.setItem(RUNWAY_ANALYTICS_EVENTS_KEY, JSON.stringify(trimmed));
  } catch {
    /* quota */
  }
}

/** Последние runway-события из localStorage (до 500 записей). */
export function readScrollExperienceEventLog(): ScrollExperienceEventLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    let raw = window.localStorage.getItem(RUNWAY_ANALYTICS_EVENTS_KEY);
    if (!raw) {
      const migrated = migrateLegacyEventLog();
      if (migrated.length > 0) return migrated;
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as ScrollExperienceEventLogEntry[]) : [];
  } catch {
    return [];
  }
}

export function resetScrollExperienceEventLog(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(RUNWAY_ANALYTICS_EVENTS_KEY);
  window.localStorage.removeItem(LEGACY_SCROLL_EXPERIENCE_EVENTS_KEY);
}

/** Агрегированные счётчики runway для бренд-админки. */
export function getScrollExperienceMetrics(): ScrollExperienceMetricsSnapshot {
  return readMetrics();
}

export function resetScrollExperienceMetrics(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SCROLL_EXPERIENCE_METRICS_KEY);
  window.localStorage.removeItem(RUNWAY_ANALYTICS_SYNCED_KEY);
  resetScrollExperienceEventLog();
}

/** Просмотры секции товара за сегодня — для честного social proof. */
export function countSectionViewsToday(
  productSlug: string,
  sectionIndex: number,
  events: ScrollExperienceEventLogEntry[] = readScrollExperienceEventLog()
): number {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const todayMs = startOfDay.getTime();

  return events.filter(
    (e) =>
      e.timestamp >= todayMs &&
      e.productSlug === productSlug &&
      e.sectionIndex === sectionIndex &&
      (e.event === 'scroll_experience_view' || e.event === 'scroll_experience_section_change')
  ).length;
}

const RUNWAY_ANALYTICS_SYNCED_KEY = 'syntha-runway-analytics-synced-count';
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function readSyncedCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem(RUNWAY_ANALYTICS_SYNCED_KEY);
    return raw ? Number.parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function writeSyncedCount(count: number): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(RUNWAY_ANALYTICS_SYNCED_KEY, String(count));
  } catch {
    /* quota */
  }
}

/** POST unsynced runway events to /api/runway/analytics (best-effort). */
export async function flushRunwayAnalyticsToServer(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const events = readScrollExperienceEventLog();
  const synced = readSyncedCount();
  const pending = events.slice(synced);
  if (pending.length === 0) return true;

  try {
    const res = await fetch('/api/runway/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: pending }),
      keepalive: true,
    });
    if (!res.ok) return false;
    writeSyncedCount(events.length);
    return true;
  } catch {
    return false;
  }
}

function scheduleAnalyticsFlush(): void {
  if (typeof window === 'undefined') return;
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushRunwayAnalyticsToServer();
  }, 1500);
}

export function trackScrollExperienceEvent(
  event: ScrollExperienceEventName,
  payload: ScrollExperienceEventPayload
): void {
  if (typeof window === 'undefined') return;

  const body = { event, ...payload, timestamp: Date.now() };

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(body);
  }

  persistMetricIncrement(event);
  appendEventLog(body as ScrollExperienceEventLogEntry);
  mirrorScrollAnalyticsToAdapters(event, payload);
  scheduleAnalyticsFlush();

  if (process.env.NODE_ENV === 'development') {
    console.debug('[scroll-experience]', body);
  }
}
