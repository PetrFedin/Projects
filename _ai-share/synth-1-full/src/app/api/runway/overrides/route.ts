/**
 * Brand runway overrides — GET public JSON, POST patch (dev-only by default).
 */
import { NextResponse } from 'next/server';
import {
  patchRunwayOverride,
  readRunwayOverridesFromDisk,
  writeRunwayOverridesToDisk,
} from '@/lib/server/runway-overrides-store';
import { patchBrandVideoCdnBaseUrl } from '@/lib/server/runway-scroll-config-store';
import { formatZodError, runwayOverridesPostBodySchema } from '@/lib/server/runway-api-schemas';

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function allowWrite(request: Request): boolean {
  if (process.env.NODE_ENV === 'development') return true;
  const secret = process.env.RUNWAY_OVERRIDES_WRITE_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get('x-runway-overrides-secret') === secret;
}

export async function GET() {
  try {
    const overrides = await readRunwayOverridesFromDisk();
    return NextResponse.json(overrides, {
      headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=120' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to read overrides';
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  if (!allowWrite(request)) {
    return jsonError('Overrides write disabled in this environment', 403);
  }

  try {
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return jsonError('Invalid JSON body', 400);
    }

    const parsed = runwayOverridesPostBodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(formatZodError(parsed.error), { status: 400 });
    }

    const body = parsed.data;

    if ('replace' in body) {
      await writeRunwayOverridesToDisk(body.replace);
      return NextResponse.json({ ok: true, overrides: body.replace });
    }

    if ('brandCdn' in body) {
      const url = body.brandCdn.videoCdnBaseUrl.trim();
      const config = await patchBrandVideoCdnBaseUrl({
        brandName: body.brandCdn.brandName,
        videoCdnBaseUrl: url || null,
      });
      return NextResponse.json({
        ok: true,
        brandVideoCdnBaseUrl: config.brandVideoCdnBaseUrl ?? {},
      });
    }

    const { brandName, slug, patch } = body;
    const overrides = await patchRunwayOverride({ brandName, slug, patch });
    return NextResponse.json({ ok: true, overrides });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to write overrides';
    return jsonError(message, 500);
  }
}
