/**
 * Server-side runway analytics — GET aggregated dashboard, POST batch events.
 */
import { NextResponse } from 'next/server';
import {
  appendRunwayAnalyticsEvents,
  readRunwayAnalyticsEvents,
  readRunwayAnalyticsMetrics,
  resetRunwayAnalyticsStore,
} from '@/lib/server/runway-analytics-store';
import {
  aggregateRunwayAnalyticsFromEvents,
  buildEmptyRunwayAnalyticsDashboard,
  type RunwayAnalyticsDashboard,
} from '@/lib/runway/runway-analytics-aggregation';
import {
  filterRunwayAnalyticsEventsByDateRange,
  paginateRunwayAnalyticsEvents,
  resolveRunwayAnalyticsQueryFromUrl,
} from '@/lib/runway/runway-analytics-query';
import { formatZodError, runwayAnalyticsPostBodySchema } from '@/lib/server/runway-api-schemas';
import {
  applyRunwayRouteRateLimit,
  runwayRateLimitJsonResponse,
} from '@/lib/server/runway-route-rate-limit';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  normalizeScrollExperienceConfig,
  resolveAnalyticsWebhookUrl,
  SCROLL_EXPERIENCE_V3_DEFAULTS,
} from '@/lib/runway/scroll-experience-schema';
import { fireRunwayAnalyticsWebhook } from '@/lib/server/runway-analytics-webhook';

function loadScrollExperienceWebhookUrl(): string | undefined {
  try {
    const path = join(process.cwd(), 'public/data/scroll-experience.json');
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    const config = normalizeScrollExperienceConfig(raw, SCROLL_EXPERIENCE_V3_DEFAULTS);
    return resolveAnalyticsWebhookUrl(config);
  } catch {
    return undefined;
  }
}

function jsonError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

function buildRunwayAnalyticsDashboardResponse(
  events: Awaited<ReturnType<typeof readRunwayAnalyticsEvents>>,
  query: ReturnType<typeof resolveRunwayAnalyticsQueryFromUrl>
): RunwayAnalyticsDashboard {
  const filtered = filterRunwayAnalyticsEventsByDateRange(events, query.from, query.to);
  const eventsPage = paginateRunwayAnalyticsEvents(
    [...filtered].sort((a, b) => b.timestamp - a.timestamp),
    query.page,
    query.pageSize
  );

  return {
    ...aggregateRunwayAnalyticsFromEvents(filtered),
    dateRange: { from: query.from ?? null, to: query.to ?? null },
    eventsPage,
  };
}

export async function GET(request: Request) {
  const rate = await applyRunwayRouteRateLimit(request, 'read');
  if (!rate.allowed) return runwayRateLimitJsonResponse(rate);

  const url = new URL(request.url);
  const query = resolveRunwayAnalyticsQueryFromUrl(url);

  try {
    if (url.searchParams.get('reset') === '1' && process.env.NODE_ENV === 'development') {
      await resetRunwayAnalyticsStore();
    }

    const allEvents = await readRunwayAnalyticsEvents();
    const dashboard = buildRunwayAnalyticsDashboardResponse(allEvents, query);

    return NextResponse.json(dashboard, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    // Пустой store / postgres недоступен — стабильный JSON 200, не 500 (e2e + brand tab).
    if (process.env.NODE_ENV === 'development') {
      console.warn('[runway/analytics] GET fallback empty dashboard:', err);
    }
    const empty = buildEmptyRunwayAnalyticsDashboard();
    const dashboard: RunwayAnalyticsDashboard = {
      ...empty,
      dateRange: { from: query.from ?? null, to: query.to ?? null },
      eventsPage: paginateRunwayAnalyticsEvents([], query.page, query.pageSize),
    };
    return NextResponse.json(dashboard, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}

export async function POST(request: Request) {
  const rate = await applyRunwayRouteRateLimit(request, 'write');
  if (!rate.allowed) return runwayRateLimitJsonResponse(rate);

  try {
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return jsonError('Invalid JSON body', 400);
    }

    const parsed = runwayAnalyticsPostBodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(formatZodError(parsed.error), { status: 400 });
    }

    const events = parsed.data.events;
    const result = await appendRunwayAnalyticsEvents(events);
    void fireRunwayAnalyticsWebhook(loadScrollExperienceWebhookUrl(), events);
    const allEvents = await readRunwayAnalyticsEvents();
    const metrics = await readRunwayAnalyticsMetrics();
    const dashboard = aggregateRunwayAnalyticsFromEvents(allEvents, metrics);

    return NextResponse.json({ ok: true, ...result, dashboard });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to persist runway analytics';
    return jsonError(message, 500);
  }
}
