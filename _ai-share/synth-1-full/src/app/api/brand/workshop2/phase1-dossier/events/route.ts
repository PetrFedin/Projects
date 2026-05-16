import { NextRequest, NextResponse } from 'next/server';
import { actorHasAnyRole, resolveWorkshop2ServerActor } from '@/lib/server/workshop2-server-actor';
import {
  getWorkshop2ServerDossierRecord,
  listWorkshop2DossierEvents,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

export async function GET(req: NextRequest) {
  const actorResolved = resolveWorkshop2ServerActor(req);
  if (!actorResolved.ok) return NextResponse.json({ ok: false, error: 'actor_required' }, { status: 401 });
  const actor = actorResolved.actor;
  if (!actorHasAnyRole(actor, ['production:edit', 'w2:audit_read', 'w2:events_read'])) {
    return NextResponse.json({ ok: false, error: 'forbidden_actor_role' }, { status: 403 });
  }
  const u = new URL(req.url);
  const collectionId = String(u.searchParams.get('collectionId') ?? '').trim();
  const articleId = String(u.searchParams.get('articleId') ?? '').trim();
  const eventType = String(u.searchParams.get('eventType') ?? '').trim();
  const limitRaw = Number(u.searchParams.get('limit') ?? 40);
  const limit = Number.isFinite(limitRaw) ? Math.floor(limitRaw) : 40;
  if (!collectionId || !articleId) {
    return NextResponse.json({ ok: false, error: 'invalid_query' }, { status: 400 });
  }
  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  const events = await listWorkshop2DossierEvents({
    collectionId,
    articleId,
    limit,
    ...(eventType ? { eventType } : {}),
  });
  return NextResponse.json({ ok: true, events });
}
