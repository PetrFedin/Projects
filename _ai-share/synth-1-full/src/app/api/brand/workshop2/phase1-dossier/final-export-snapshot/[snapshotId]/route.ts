import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkshop2FinalExportSnapshotMeta,
  getWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

export async function GET(req: NextRequest, ctx: { params: Promise<{ snapshotId: string }> }) {
  const { snapshotId: rawSnapshotId } = await ctx.params;
  const snapshotId = String(rawSnapshotId ?? '').trim();
  const u = new URL(req.url);
  const collectionId = String(u.searchParams.get('collectionId') ?? '').trim();
  const articleId = String(u.searchParams.get('articleId') ?? '').trim();
  if (!collectionId || !articleId || !snapshotId) {
    return NextResponse.json({ ok: false, error: 'invalid_query' }, { status: 400 });
  }
  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  const snapshot = await getWorkshop2FinalExportSnapshotMeta({
    collectionId,
    articleId,
    snapshotId,
  });
  if (!snapshot)
    return NextResponse.json({ ok: false, error: 'snapshot_not_found' }, { status: 404 });
  return NextResponse.json({ ok: true, snapshot });
}
