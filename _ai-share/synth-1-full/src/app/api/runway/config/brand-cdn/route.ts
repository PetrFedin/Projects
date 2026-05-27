/**
 * POST — per-brand videoCdnBaseUrl override в scroll-experience.json.
 */
import { NextResponse } from 'next/server';
import { formatZodError, runwayBrandCdnPostBodySchema } from '@/lib/server/runway-api-schemas';
import { patchBrandVideoCdnBaseUrl } from '@/lib/server/runway-scroll-config-store';
import {
  applyRunwayRouteRateLimit,
  runwayRateLimitJsonResponse,
} from '@/lib/server/runway-route-rate-limit';

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function allowWrite(request: Request): boolean {
  if (process.env.NODE_ENV === 'development') return true;
  const secret = process.env.RUNWAY_OVERRIDES_WRITE_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get('x-runway-overrides-secret') === secret;
}

export async function POST(request: Request) {
  const rate = await applyRunwayRouteRateLimit(request, 'write');
  if (!rate.allowed) return runwayRateLimitJsonResponse(rate);

  if (!allowWrite(request)) {
    return jsonError('Brand CDN override write disabled in this environment', 403);
  }

  try {
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return jsonError('Invalid JSON body', 400);
    }

    const parsed = runwayBrandCdnPostBodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(formatZodError(parsed.error), { status: 400 });
    }

    const { brandName, videoCdnBaseUrl } = parsed.data;
    const config = await patchBrandVideoCdnBaseUrl({
      brandName,
      videoCdnBaseUrl: videoCdnBaseUrl ?? null,
    });

    return NextResponse.json({
      ok: true,
      brandName,
      videoCdnBaseUrl: config.brandVideoCdnBaseUrl?.[brandName] ?? null,
      brandVideoCdnBaseUrl: config.brandVideoCdnBaseUrl ?? {},
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save brand CDN override';
    return jsonError(message, 500);
  }
}
