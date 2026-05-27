/**
 * Runway user preferences — file persistence (data/runway-user-preferences.json).
 * GET/PUT: userId из JWT session (syntha_access_token) или dev X-Runway-User-Id.
 */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  readRunwayUserPreferences,
  resetRunwayUserPreferencesStore,
  writeRunwayUserPreferences,
} from '@/lib/server/runway-user-preferences-store';
import { resolveRunwayPreferencesUserIdWithSession } from '@/lib/server/runway-preferences-auth';
import {
  applyRunwayRouteRateLimit,
  runwayRateLimitJsonResponse,
} from '@/lib/server/runway-route-rate-limit';

const favoritesSchema = z.record(z.number());

const putBodySchema = z.object({
  userId: z.string().min(1).optional(),
  sectionFavorites: favoritesSchema,
});

export async function GET(request: Request) {
  const rate = await applyRunwayRouteRateLimit(request, 'read');
  if (!rate.allowed) return runwayRateLimitJsonResponse(rate);

  const userId = await resolveRunwayPreferencesUserIdWithSession(request);
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 401 });
  }

  const sectionFavorites = await readRunwayUserPreferences(userId);
  return NextResponse.json(
    { userId, sectionFavorites },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function PUT(request: Request) {
  const rate = await applyRunwayRouteRateLimit(request, 'write');
  if (!rate.allowed) return runwayRateLimitJsonResponse(rate);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = putBodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const userId = await resolveRunwayPreferencesUserIdWithSession(request, parsed.data.userId);
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 401 });
  }

  if (
    process.env.NODE_ENV === 'development' &&
    request.headers.get('x-runway-user-id')?.trim() &&
    parsed.data.userId &&
    parsed.data.userId !== userId
  ) {
    return NextResponse.json({ error: 'userId mismatch' }, { status: 403 });
  }

  await writeRunwayUserPreferences(userId, parsed.data.sectionFavorites);
  return NextResponse.json({ ok: true, userId });
}

/** Test helper — reset file store. */
export { resetRunwayUserPreferencesStore as __resetRunwayPreferencesStoreForTests };
