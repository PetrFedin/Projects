/**
 * POST multipart upload MP4 → public/videos/brands/{brandSlug}/ (dev/local).
 */
import { NextResponse } from 'next/server';
import {
  applyRunwayRouteRateLimit,
  runwayRateLimitJsonResponse,
} from '@/lib/server/runway-route-rate-limit';
import { saveRunwayBrandVideoUpload } from '@/lib/server/runway-upload';

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const rate = await applyRunwayRouteRateLimit(request, 'write');
  if (!rate.allowed) return runwayRateLimitJsonResponse(rate);

  try {
    const form = await request.formData();
    const brandSlug = form.get('brandSlug');
    const file = form.get('file');

    if (typeof brandSlug !== 'string' || !brandSlug.trim()) {
      return jsonError('brandSlug обязателен', 400);
    }

    if (!(file instanceof File)) {
      return jsonError('file обязателен (multipart field "file")', 400);
    }

    const result = await saveRunwayBrandVideoUpload(brandSlug, file);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    const status = message.includes('production') ? 503 : 400;
    return jsonError(message, status);
  }
}
