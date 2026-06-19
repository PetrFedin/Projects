import { NextResponse } from 'next/server';
import { buildPlatformCorePlanner } from '@/lib/platform-core-planner';
import {
  isDevPlannerApiEnabled,
  patchPlannerTaskStatus,
  readPlannerRuntimeState,
  runtimeToOverlay,
  writePlannerRuntimeState,
} from '@/lib/server/platform-core-planner-runtime.server';

export async function POST(request: Request) {
  if (!isDevPlannerApiEnabled()) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  const body = (await request.json().catch(() => ({}))) as {
    id?: string;
    by?: string;
    note?: string;
    collection?: string;
  };
  if (!body.id) {
    return NextResponse.json({ ok: false, reason: 'id_required' }, { status: 400 });
  }
  const by = body.by?.trim() || 'cursor-agent';
  const collectionId = body.collection ?? 'SS27';
  await patchPlannerTaskStatus(body.id, 'done', by, body.note);
  const runtime = await readPlannerRuntimeState();
  if (runtime.agentDispatch?.taskId === body.id) {
    runtime.agentDispatch = null;
    await writePlannerRuntimeState(runtime);
  }
  const snapshot = buildPlatformCorePlanner(collectionId, runtimeToOverlay(runtime));
  return NextResponse.json({
    ok: true,
    id: body.id,
    counts: snapshot.counts,
  });
}
