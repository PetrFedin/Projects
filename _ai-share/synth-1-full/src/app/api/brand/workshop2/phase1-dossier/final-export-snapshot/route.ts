import { NextRequest, NextResponse } from 'next/server';
import type {
  Workshop2FinalExportSnapshotMeta,
  Workshop2FinalExportSnapshotRecord,
  Workshop2TzActionLogEntry,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  getWorkshop2ServerDossierRecord,
  listWorkshop2FinalExportSnapshotMetas,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

function makeId(prefix: string): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return `${prefix}-${c.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const collectionId = String(u.searchParams.get('collectionId') ?? '').trim();
  const articleId = String(u.searchParams.get('articleId') ?? '').trim();
  const limitRaw = Number(u.searchParams.get('limit') ?? 30);
  const limit = Number.isFinite(limitRaw) ? Math.floor(limitRaw) : 30;
  if (!collectionId || !articleId) {
    return NextResponse.json({ ok: false, error: 'invalid_query' }, { status: 400 });
  }
  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  const snapshots = await listWorkshop2FinalExportSnapshotMetas({
    collectionId,
    articleId,
    limit,
  });
  return NextResponse.json({ ok: true, snapshots });
}

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
    actorLabel?: unknown;
    exportContext?: unknown;
  };
  const collectionId = String(b.collectionId ?? '').trim();
  const articleId = String(b.articleId ?? '').trim();
  const actorLabel = String(b.actorLabel ?? '').trim() || 'system';
  if (!collectionId || !articleId) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }
  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  const snapshot: Workshop2FinalExportSnapshotMeta = {
    snapshotId: makeId('w2-exp-snap'),
    createdAt: new Date().toISOString(),
    createdBy: actorLabel.slice(0, 200),
    dossierVersion: record.version,
    dossierUpdatedAtSnapshot: record.dossier.updatedAt,
    lifecycleState: record.dossier.lifecycleState,
  };
  const exportContext =
    b.exportContext && typeof b.exportContext === 'object'
      ? (b.exportContext as Workshop2FinalExportSnapshotRecord['exportContextSnapshot'])
      : undefined;
  const dossierSnapshot = {
    ...record.dossier,
    finalExportSnapshots: undefined,
    finalExportSnapshotRecords: undefined,
  };
  const recordSnapshot: Workshop2FinalExportSnapshotRecord = {
    ...snapshot,
    dossierSnapshot,
    ...(exportContext ? { exportContextSnapshot: exportContext } : {}),
  };
  const log: Workshop2TzActionLogEntry = {
    entryId: makeId('w2-log'),
    at: snapshot.createdAt,
    by: actorLabel.slice(0, 200),
    action: {
      type: 'dossier_edit',
      summaries: [`Final export snapshot created: ${snapshot.snapshotId}`],
    },
  };
  const next = {
    ...record.dossier,
    finalExportSnapshots: [snapshot, ...(record.dossier.finalExportSnapshots ?? [])].slice(0, 80),
    finalExportSnapshotRecords: [recordSnapshot, ...(record.dossier.finalExportSnapshotRecords ?? [])].slice(
      0,
      80
    ),
    tzActionLog: [log, ...(record.dossier.tzActionLog ?? [])].slice(0, 120),
    updatedAt: snapshot.createdAt,
    updatedBy: actorLabel.slice(0, 200),
  };
  const put = await putWorkshop2ServerDossierRecord({
    collectionId,
    articleId,
    dossier: next,
    baseVersion: record.version,
    txMeta: {
      eventType: 'final_export_snapshot_create',
      finalExportSnapshotRecord: recordSnapshot,
    },
  });
  if (!put.ok) {
    return NextResponse.json(
      { ok: false, error: 'version_conflict', currentVersion: put.currentVersion },
      { status: 409 }
    );
  }
  return NextResponse.json({
    ok: true,
    snapshotId: snapshot.snapshotId,
    version: put.record.version,
    updatedAt: put.record.updatedAt,
    dossier: put.record.dossier,
  });
}
