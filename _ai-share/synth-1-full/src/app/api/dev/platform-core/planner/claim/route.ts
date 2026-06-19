import { NextResponse } from 'next/server';
import { buildPlatformCorePlanner } from '@/lib/platform-core-planner';
import {
  isDevPlannerApiEnabled,
  patchPlannerTaskStatus,
  readPlannerRuntimeState,
  runtimeToOverlay,
} from '@/lib/server/platform-core-planner-runtime.server';

function pickNextOpen(snapshot: ReturnType<typeof buildPlatformCorePlanner>) {
  return snapshot.queue.find((t) => t.status === 'open') ?? null;
}

export async function POST(request: Request) {
  if (!isDevPlannerApiEnabled()) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  const body = (await request.json().catch(() => ({}))) as {
    by?: string;
    collection?: string;
    id?: string;
  };
  const by = body.by?.trim() || 'cursor-agent';
  const collectionId = body.collection ?? 'SS27';
  const runtime = await readPlannerRuntimeState();
  const snapshot = buildPlatformCorePlanner(collectionId, runtimeToOverlay(runtime));

  const target = body.id
    ? snapshot.queue.find((t) => t.id === body.id && t.status === 'open')
    : pickNextOpen(snapshot);

  if (!target) {
    return NextResponse.json({ ok: false, reason: 'no_open_tasks' }, { status: 404 });
  }

  await patchPlannerTaskStatus(target.id, 'in_progress', by);
  const runtimeAfter = await readPlannerRuntimeState();
  const refreshed = buildPlatformCorePlanner(collectionId, runtimeToOverlay(runtimeAfter));

  const task = refreshed.queue.find((t) => t.id === target.id) ?? target;

  return NextResponse.json({
    ok: true,
    task,
    message: `Claimed by ${by}. Implement in repo; POST complete when done.`,
  });
}
