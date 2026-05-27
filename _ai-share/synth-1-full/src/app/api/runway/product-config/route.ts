/**
 * GET /api/runway/product-config?slug= — patch одного SKU
 * GET /api/runway/product-config — все patches
 * POST — сохранить scroll-video config (overrides + patch file)
 */
import { NextResponse } from 'next/server';
import { formatZodError, runwayProductConfigPostBodySchema } from '@/lib/server/runway-api-schemas';
import { patchRunwayOverride } from '@/lib/server/runway-overrides-store';
import {
  mergeRunwayProductPatch,
  readAllRunwayProductPatches,
  readRunwayProductPatch,
} from '@/lib/server/runway-product-patches-store';

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function allowWrite(request: Request): boolean {
  if (process.env.NODE_ENV === 'development') return true;
  const secret = process.env.RUNWAY_OVERRIDES_WRITE_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get('x-runway-overrides-secret') === secret;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug')?.trim();

    if (slug) {
      const patch = await readRunwayProductPatch(slug);
      return NextResponse.json({ slug, patch }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const patches = await readAllRunwayProductPatches();
    return NextResponse.json({ patches }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to read product config';
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  if (!allowWrite(request)) {
    return jsonError('Product config write disabled in this environment', 403);
  }

  try {
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return jsonError('Invalid JSON body', 400);
    }

    const parsed = runwayProductConfigPostBodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(formatZodError(parsed.error), { status: 400 });
    }

    const { brandName, slug, config, persistTo = 'both' } = parsed.data;
    let overrides = undefined;
    let patch = config;

    if (persistTo === 'overrides' || persistTo === 'both') {
      overrides = await patchRunwayOverride({ brandName, slug, patch: config });
    }

    if (persistTo === 'patch' || persistTo === 'both') {
      patch = await mergeRunwayProductPatch(slug, config);
    }

    return NextResponse.json({
      ok: true,
      brandName,
      slug,
      config: patch,
      overrides,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save product config';
    return jsonError(message, 500);
  }
}
