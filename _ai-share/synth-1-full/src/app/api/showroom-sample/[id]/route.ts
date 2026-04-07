import { NextResponse } from 'next/server';
import { showroomSampleMemoryGet } from '@/lib/server/showroom-sample-memory-store';

/**
 * Резолв бирки по короткому id (QR / штрихкод).
 * GET /api/showroom-sample/:id
 */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!id || id.length > 80) {
    return NextResponse.json({ ok: false, error: 'invalid_id' }, { status: 400 });
  }
  const rec = showroomSampleMemoryGet(decodeURIComponent(id));
  if (!rec) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    id,
    payload: rec.payload,
    createdAtMs: rec.createdAtMs,
  });
}
