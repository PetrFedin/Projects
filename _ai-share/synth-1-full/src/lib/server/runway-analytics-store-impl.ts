import 'server-only';

import fs from 'fs/promises';
import path from 'path';
import type {
  ScrollExperienceEventLogEntry,
  ScrollExperienceEventName,
  ScrollExperienceMetricsSnapshot,
} from '@/lib/scroll-experience-analytics';
import type { RunwayAnalyticsStore } from '@/lib/server/runway-analytics-store-interface';
import {
  aggregateRunwayAnalyticsFromEvents,
  type RunwayAnalyticsDashboard,
} from '@/lib/runway/runway-analytics-aggregation';
import {
  filterRunwayAnalyticsEventsByDateRange,
  paginateRunwayAnalyticsEvents,
  type RunwayAnalyticsQuery,
} from '@/lib/runway/runway-analytics-query';
import {
  formatRunwayAnalyticsDashboardCsv,
  formatRunwayAnalyticsEventsCsv,
} from '@/lib/runway/runway-analytics-export';
import { getRunwayPgPool, isRunwayPostgresConfigured } from '@/lib/server/runway-pg-pool';

const MAX_EVENTS = 500;

type AnalyticsStoreFile = {
  events: ScrollExperienceEventLogEntry[];
  updatedAt: string;
};

function storePath(): string {
  const fromEnv = process.env.RUNWAY_ANALYTICS_STORE_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'runway-analytics-events.json');
}

function eventKey(entry: ScrollExperienceEventLogEntry): string {
  return `${entry.timestamp}:${entry.event}:${entry.productSlug}:${entry.sectionIndex ?? -1}`;
}

function buildMetrics(events: ScrollExperienceEventLogEntry[]): ScrollExperienceMetricsSnapshot {
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

/** File-backed runway analytics store (default production path). */
export class FileRunwayAnalyticsStore implements RunwayAnalyticsStore {
  private chain: Promise<void> = Promise.resolve();

  private runExclusive<T>(fn: () => Promise<T>): Promise<T> {
    const next = this.chain.then(fn, fn) as Promise<T>;
    this.chain = next.then(
      () => undefined,
      () => undefined
    );
    return next;
  }

  private async readStore(): Promise<AnalyticsStoreFile> {
    try {
      const raw = await fs.readFile(storePath(), 'utf8');
      const parsed = JSON.parse(raw) as Partial<AnalyticsStoreFile>;
      return {
        events: Array.isArray(parsed.events) ? parsed.events : [],
        updatedAt:
          typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
      };
    } catch {
      return { events: [], updatedAt: new Date().toISOString() };
    }
  }

  private async writeStore(store: AnalyticsStoreFile): Promise<void> {
    const p = storePath();
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, JSON.stringify(store, null, 2), 'utf8');
  }

  async readEvents(): Promise<ScrollExperienceEventLogEntry[]> {
    return this.runExclusive(async () => {
      const store = await this.readStore();
      return store.events;
    });
  }

  async appendEvents(
    incoming: ScrollExperienceEventLogEntry[]
  ): Promise<{ accepted: number; total: number }> {
    if (!incoming.length) {
      const store = await this.readStore();
      return { accepted: 0, total: store.events.length };
    }

    return this.runExclusive(async () => {
      const store = await this.readStore();
      const seen = new Set(store.events.map(eventKey));
      let accepted = 0;

      for (const entry of incoming) {
        if (!entry?.event || !entry.productSlug || typeof entry.timestamp !== 'number') continue;
        const key = eventKey(entry);
        if (seen.has(key)) continue;
        seen.add(key);
        store.events.push(entry);
        accepted += 1;
      }

      store.events = store.events.slice(-MAX_EVENTS);
      store.updatedAt = new Date().toISOString();
      await this.writeStore(store);
      return { accepted, total: store.events.length };
    });
  }

  async reset(): Promise<void> {
    return this.runExclusive(async () => {
      await this.writeStore({ events: [], updatedAt: new Date().toISOString() });
    });
  }

  async readMetrics(): Promise<ScrollExperienceMetricsSnapshot> {
    const events = await this.readEvents();
    return buildMetrics(events);
  }

  async queryDashboard(query: RunwayAnalyticsQuery): Promise<RunwayAnalyticsDashboard> {
    const events = await this.readEvents();
    const filtered = filterRunwayAnalyticsEventsByDateRange(events, query.from, query.to);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 25;
    const eventsPage = paginateRunwayAnalyticsEvents(
      [...filtered].sort((a, b) => b.timestamp - a.timestamp),
      page,
      pageSize
    );
    return {
      ...aggregateRunwayAnalyticsFromEvents(filtered),
      dateRange: { from: query.from ?? null, to: query.to ?? null },
      eventsPage,
    };
  }

  async exportCsv(format: 'dashboard' | 'events'): Promise<string> {
    const events = await this.readEvents();
    const metrics = await this.readMetrics();
    if (format === 'events') {
      return formatRunwayAnalyticsEventsCsv(events);
    }
    const dashboard = aggregateRunwayAnalyticsFromEvents(events, metrics);
    return formatRunwayAnalyticsDashboardCsv(dashboard);
  }
}

function runwayEventKey(entry: ScrollExperienceEventLogEntry): string {
  return `${entry.timestamp}:${entry.event}:${entry.productSlug}:${entry.sectionIndex ?? -1}`;
}

async function ensureRunwayAnalyticsTable(): Promise<void> {
  const pool = getRunwayPgPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS runway_analytics_events (
      event_key TEXT PRIMARY KEY,
      event_name TEXT NOT NULL,
      product_slug TEXT NOT NULL,
      timestamp_ms BIGINT NOT NULL,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS runway_analytics_events_ts_idx
      ON runway_analytics_events (timestamp_ms DESC);
  `);
}

/**
 * Postgres-backed runway analytics (RUNWAY_ANALYTICS_STORE=postgres).
 * Требует DATABASE_URL; таблица создаётся автоматически или через docs/runway-analytics-migration.sql.
 */
export class PostgresRunwayAnalyticsStore implements RunwayAnalyticsStore {
  private chain: Promise<void> = Promise.resolve();

  constructor() {
    if (!isRunwayPostgresConfigured()) {
      throw new Error(
        'PostgresRunwayAnalyticsStore: set DATABASE_URL or use RUNWAY_ANALYTICS_STORE=file'
      );
    }
  }

  private runExclusive<T>(fn: () => Promise<T>): Promise<T> {
    const next = this.chain.then(fn, fn) as Promise<T>;
    this.chain = next.then(
      () => undefined,
      () => undefined
    );
    return next;
  }

  async readEvents(): Promise<ScrollExperienceEventLogEntry[]> {
    return this.runExclusive(async () => {
      await ensureRunwayAnalyticsTable();
      const res = await getRunwayPgPool().query<{ payload: ScrollExperienceEventLogEntry }>(
        `SELECT payload FROM runway_analytics_events ORDER BY timestamp_ms ASC LIMIT $1`,
        [MAX_EVENTS]
      );
      return res.rows.map((row) => row.payload);
    });
  }

  async appendEvents(
    incoming: ScrollExperienceEventLogEntry[]
  ): Promise<{ accepted: number; total: number }> {
    if (!incoming.length) {
      const events = await this.readEvents();
      return { accepted: 0, total: events.length };
    }

    return this.runExclusive(async () => {
      await ensureRunwayAnalyticsTable();
      const pool = getRunwayPgPool();
      let accepted = 0;

      for (const entry of incoming) {
        if (!entry?.event || !entry.productSlug || typeof entry.timestamp !== 'number') {
          continue;
        }
        const key = runwayEventKey(entry);
        const ins = await pool.query(
          `INSERT INTO runway_analytics_events (event_key, event_name, product_slug, timestamp_ms, payload)
           VALUES ($1, $2, $3, $4, $5::jsonb)
           ON CONFLICT (event_key) DO NOTHING`,
          [key, entry.event, entry.productSlug, entry.timestamp, JSON.stringify(entry)]
        );
        if ((ins.rowCount ?? 0) > 0) accepted += 1;
      }

      await pool.query(
        `DELETE FROM runway_analytics_events
         WHERE event_key NOT IN (
           SELECT event_key FROM runway_analytics_events
           ORDER BY timestamp_ms DESC
           LIMIT $1
         )`,
        [MAX_EVENTS]
      );

      const countRes = await pool.query<{ c: string }>(
        'SELECT COUNT(*)::text AS c FROM runway_analytics_events'
      );
      const total = Number(countRes.rows[0]?.c ?? 0);
      return { accepted, total };
    });
  }

  async reset(): Promise<void> {
    return this.runExclusive(async () => {
      await ensureRunwayAnalyticsTable();
      await getRunwayPgPool().query('TRUNCATE runway_analytics_events');
    });
  }

  async readMetrics(): Promise<ScrollExperienceMetricsSnapshot> {
    const events = await this.readEvents();
    return buildMetrics(events);
  }

  async queryDashboard(query: RunwayAnalyticsQuery): Promise<RunwayAnalyticsDashboard> {
    const events = await this.readEvents();
    const filtered = filterRunwayAnalyticsEventsByDateRange(events, query.from, query.to);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 25;
    const eventsPage = paginateRunwayAnalyticsEvents(
      [...filtered].sort((a, b) => b.timestamp - a.timestamp),
      page,
      pageSize
    );
    return {
      ...aggregateRunwayAnalyticsFromEvents(filtered),
      dateRange: { from: query.from ?? null, to: query.to ?? null },
      eventsPage,
    };
  }

  async exportCsv(format: 'dashboard' | 'events'): Promise<string> {
    const events = await this.readEvents();
    const metrics = buildMetrics(events);
    if (format === 'events') {
      return formatRunwayAnalyticsEventsCsv(events);
    }
    const dashboard = aggregateRunwayAnalyticsFromEvents(events, metrics);
    return formatRunwayAnalyticsDashboardCsv(dashboard);
  }
}

export type { ScrollExperienceEventName };
