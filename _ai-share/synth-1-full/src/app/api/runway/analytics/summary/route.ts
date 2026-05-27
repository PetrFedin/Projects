/**
 * GET aggregated runway KPIs for scheduled email/reporting.
 * Query: ?period=day|week|month (default week)
 */
import { NextResponse } from 'next/server';
import { readRunwayAnalyticsEvents } from '@/lib/server/runway-analytics-store';
import {
  applyRunwayRouteRateLimit,
  runwayRateLimitJsonResponse,
} from '@/lib/server/runway-route-rate-limit';
import {
  buildRunwayAnalyticsSummary,
  resolveRunwayAnalyticsSummaryPeriod,
} from '@/lib/runway/runway-analytics-summary';

export async function GET(request: Request) {
  const rate = await applyRunwayRouteRateLimit(request, 'read');
  if (!rate.allowed) return runwayRateLimitJsonResponse(rate);

  try {
    const url = new URL(request.url);
    const period = resolveRunwayAnalyticsSummaryPeriod(url.searchParams.get('period'));
    const events = await readRunwayAnalyticsEvents();
    const summary = buildRunwayAnalyticsSummary(events, period);

    return NextResponse.json(summary, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to build analytics summary';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
