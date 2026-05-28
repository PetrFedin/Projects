/**
 * Runway health — scroll-video catalog, assets, analytics store, config.
 * GET /api/runway/health
 */
import { NextResponse } from 'next/server';
import { evaluateRunwayHealth } from '@/lib/server/runway-health';
import {
  applyRunwayRouteRateLimit,
  runwayRateLimitJsonResponse,
} from '@/lib/server/runway-route-rate-limit';

export async function GET(request: Request) {
  const rate = await applyRunwayRouteRateLimit(request, 'read');
  if (!rate.allowed) return runwayRateLimitJsonResponse(rate);

  try {
    const snapshot = evaluateRunwayHealth();
    return NextResponse.json(snapshot, {
      status: snapshot.healthy ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Runway health check failed';
    return NextResponse.json({ healthy: false, error: message }, { status: 500 });
  }
}
