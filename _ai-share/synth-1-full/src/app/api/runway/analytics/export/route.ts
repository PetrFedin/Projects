/**
 * CSV export runway analytics — dashboard summary + raw events.
 */
import { NextResponse } from 'next/server';
import {
  readRunwayAnalyticsEvents,
  readRunwayAnalyticsMetrics,
} from '@/lib/server/runway-analytics-store';
import { aggregateRunwayAnalyticsFromEvents } from '@/lib/runway/runway-analytics-aggregation';
import {
  formatRunwayAnalyticsDashboardCsv,
  formatRunwayAnalyticsEventsCsv,
} from '@/lib/runway/runway-analytics-export';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const format = url.searchParams.get('format') ?? 'dashboard';
    const events = await readRunwayAnalyticsEvents();
    const metrics = await readRunwayAnalyticsMetrics();
    const dashboard = aggregateRunwayAnalyticsFromEvents(events, metrics);

    const body =
      format === 'events'
        ? formatRunwayAnalyticsEventsCsv(events)
        : formatRunwayAnalyticsDashboardCsv(dashboard);

    const filename =
      format === 'events'
        ? `runway-events-${Date.now()}.csv`
        : `runway-analytics-${Date.now()}.csv`;

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to export runway analytics';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
