import { NextRequest, NextResponse } from 'next/server';
import { buildWorkshop2FinalTzSpecDocumentHtml, type Workshop2FinalTzSpecExportContext } from '@/lib/production/workshop2-final-tz-spec-export';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import {
  getWorkshop2FinalExportSnapshotRecord,
  getWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }
  const b = body as {
    collectionId?: unknown;
    articleId?: unknown;
    snapshotId?: unknown;
  };
  const collectionId = String(b.collectionId ?? '').trim();
  const articleId = String(b.articleId ?? '').trim();
  const snapshotId = String(b.snapshotId ?? '').trim();
  if (!collectionId || !articleId || !snapshotId) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }
  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  const snap = await getWorkshop2FinalExportSnapshotRecord({ collectionId, articleId, snapshotId });
  if (!snap) return NextResponse.json({ ok: false, error: 'snapshot_not_found' }, { status: 404 });
  const cx = snap.exportContextSnapshot as Partial<Workshop2FinalTzSpecExportContext> | undefined;
  if (!cx) return NextResponse.json({ ok: false, error: 'snapshot_context_missing' }, { status: 409 });
  const categoryLeafId = String(cx.categoryLeafId ?? '').trim();
  const ctx: Workshop2FinalTzSpecExportContext = {
    articleSku: String(cx.articleSku ?? '').trim(),
    articleName: String(cx.articleName ?? '').trim(),
    pathLabel: String(cx.pathLabel ?? '').trim(),
    l2Name: String(cx.l2Name ?? '').trim(),
    tzPhase: (cx.tzPhase === '2' || cx.tzPhase === '3' ? cx.tzPhase : '1') as '1' | '2' | '3',
    categoryLeafId,
    measurementsLeaf: categoryLeafId ? findHandbookLeafById(categoryLeafId) ?? null : null,
    preflightOk: Boolean(cx.preflightOk),
    preflightIssueCount: Number(cx.preflightIssueCount ?? 0),
    sectionSignoffsFull: Number(cx.sectionSignoffsFull ?? 0),
    gateLifecycleState: String(cx.gateLifecycleState ?? 'draft'),
  };
  const html = buildWorkshop2FinalTzSpecDocumentHtml(snap.dossierSnapshot, ctx);
  return NextResponse.json({ ok: true, snapshotId, html });
}
