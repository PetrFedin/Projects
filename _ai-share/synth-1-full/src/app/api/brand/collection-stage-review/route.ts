import { NextRequest, NextResponse } from 'next/server';
import {
  createCollectionStageReviewRecord,
  listCollectionStageReviewRecords,
} from '@/lib/server/collection-stage-review-store';

type CollectionStageReviewRequestPayload = {
  collectionKey?: string;
  collectionIdLabel?: string;
  stepId?: string;
  stepTitle?: string;
  actorLabel?: string;
  channels?: unknown;
  summaryNote?: string;
};

function norm(s: unknown): string {
  return typeof s === 'string' ? s.trim() : '';
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const collectionKey = norm(url.searchParams.get('collectionKey'));
  const stepId = norm(url.searchParams.get('stepId'));
  const limitRaw = Number(url.searchParams.get('limit') ?? 30);
  const limit = Number.isFinite(limitRaw) ? Math.floor(limitRaw) : 30;
  const records = await listCollectionStageReviewRecords({
    ...(collectionKey ? { collectionKey } : {}),
    ...(stepId ? { stepId } : {}),
    limit,
  });
  return NextResponse.json({ ok: true, mode: 'store', records });
}

export async function POST(req: NextRequest) {
  let body: CollectionStageReviewRequestPayload;
  try {
    body = (await req.json()) as CollectionStageReviewRequestPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const collectionKey = norm(body.collectionKey);
  const collectionIdLabel = norm(body.collectionIdLabel);
  const stepId = norm(body.stepId);
  const stepTitle = norm(body.stepTitle);
  const actorLabel = norm(body.actorLabel);
  const summaryNote = norm(body.summaryNote);
  const channels = Array.isArray(body.channels)
    ? body.channels.filter((x): x is 'tasks' | 'messages' => x === 'tasks' || x === 'messages')
    : [];

  if (!collectionKey || !collectionIdLabel || !stepId || !stepTitle || !actorLabel || channels.length === 0) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  const rec = await createCollectionStageReviewRecord({
    collectionKey,
    collectionIdLabel,
    stepId,
    stepTitle,
    actorLabel,
    channels,
    ...(summaryNote ? { summaryNote } : {}),
  });

  return NextResponse.json({
    ok: true,
    mode: 'store',
    requestId: rec.requestId,
    taskRef: rec.taskRef,
    messageThreadRef: rec.messageThreadRef,
    status: rec.status,
    accepted: {
      collectionIdLabel,
      stepTitle,
      actorLabel,
      summaryNote: summaryNote || undefined,
      channels,
    },
  });
}
