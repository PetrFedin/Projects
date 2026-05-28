import { NextRequest, NextResponse } from 'next/server';
import { w2TechPackRemoteUploadServerConfigured } from '@/lib/server/w2-tech-pack-remote-s3';
import { updateW2TechPackHandoff } from '@/lib/server/w2-tech-pack-index';
import { logW2TechPackOps } from '@/lib/server/w2-tech-pack-ops-telemetry';
import { verifyW2TechPackWriteRequest } from '@/lib/server/w2-tech-pack-api-auth';
import { getUnknownErrorDetail } from '@/lib/unknown-error-message';

const HANDOFF_DEFAULT = ['none', 'pending', 'sent', 'ack', 'rejected'] as const;
const rawStatuses = process.env.W2_TECHPACK_HANDOFF_STATUSES?.trim();
const fromEnv = rawStatuses
  ? rawStatuses
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  : null;
const HANDOFF_ALLOWED = new Set(fromEnv && fromEnv.length > 0 ? fromEnv : [...HANDOFF_DEFAULT]);

/**
 * Обновить статус handoff в индексе (после complete, без localStorage).
 */
export async function POST(req: NextRequest) {
  if (!w2TechPackRemoteUploadServerConfigured()) {
    return NextResponse.json({ error: 'remote_disabled' }, { status: 503 });
  }
  const auth = verifyW2TechPackWriteRequest(req);
  if (!auth.ok) {
    logW2TechPackOps('handoff_unauthorized', { status: auth.status });
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  if (typeof body !== 'object' || !body) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const collectionId = String(b.collectionId ?? '').trim();
  const articleId = String(b.articleId ?? '').trim();
  const attachmentId = String(b.attachmentId ?? '').trim();
  const handoffStatus = String(b.handoffStatus ?? '')
    .trim()
    .toLowerCase();
  const packageRevision =
    b.packageRevision != null ? String(b.packageRevision).trim().slice(0, 120) : null;
  if (!collectionId || !articleId || !attachmentId || !handoffStatus) {
    return NextResponse.json({ error: 'ids_required' }, { status: 400 });
  }
  if (!HANDOFF_ALLOWED.has(handoffStatus)) {
    return NextResponse.json({ error: 'handoff_status_rejected' }, { status: 400 });
  }
  try {
    await updateW2TechPackHandoff(
      collectionId,
      articleId,
      attachmentId,
      handoffStatus,
      packageRevision
    );
  } catch (e) {
    const d = getUnknownErrorDetail(e);
    logW2TechPackOps('handoff_index_err', { detail: d.slice(0, 200) });
    return NextResponse.json({ error: 'handoff_failed' }, { status: 500 });
  }
  logW2TechPackOps('handoff_ok', { collectionId, articleId, attachmentId, handoffStatus });
  return NextResponse.json({
    ok: true,
    collectionId,
    articleId,
    attachmentId,
    handoffStatus,
    packageRevision,
  });
}
