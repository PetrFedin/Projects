/**
 * POST /api/runway/upload/presign — presigned PUT for runway MP4 (R2/S3).
 * Env: RUNWAY_UPLOAD_ENABLED=1 + RUNWAY_R2_* or RUNWAY_S3_* (see .env.production.example).
 */
import { NextResponse } from 'next/server';
import { formatZodError, runwayUploadPresignPostBodySchema } from '@/lib/server/runway-api-schemas';
import {
  applyRunwayRouteRateLimit,
  runwayRateLimitJsonResponse,
} from '@/lib/server/runway-route-rate-limit';
import {
  createRunwayUploadPresign,
  isRunwayUploadPresignEnabled,
  runwayUploadPresignDisabledMessage,
} from '@/lib/server/runway-upload-presign';

function jsonError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export async function POST(request: Request) {
  const rate = await applyRunwayRouteRateLimit(request, 'write');
  if (!rate.allowed) return runwayRateLimitJsonResponse(rate);

  if (!isRunwayUploadPresignEnabled()) {
    return jsonError(runwayUploadPresignDisabledMessage(), 503, { uploadEnabled: false });
  }

  try {
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return jsonError('Invalid JSON body', 400);
    }

    const parsed = runwayUploadPresignPostBodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(formatZodError(parsed.error), { status: 400 });
    }

    const result = await createRunwayUploadPresign(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Presign failed';
    const status =
      message.includes('disabled') ||
      message.includes('not configured') ||
      message.includes('отключ')
        ? 503
        : 400;
    return jsonError(message, status);
  }
}
