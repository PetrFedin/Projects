import { NextResponse } from 'next/server';
import { buildPlatformCorePlanner } from '@/lib/platform-core-planner';
import {
  isDevPlannerApiEnabled,
  PLATFORM_CORE_PLANNER_CLOSED_WAVE_GENERATION,
  readPlannerRuntimeState,
  runtimeToOverlay,
} from '@/lib/server/platform-core-planner-runtime.server';

export async function GET(request: Request) {
  if (!isDevPlannerApiEnabled()) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  const url = new URL(request.url);
  const collectionId = url.searchParams.get('collection') ?? 'SS27';
  const runtime = await readPlannerRuntimeState();
  const snapshot = buildPlatformCorePlanner(collectionId, runtimeToOverlay(runtime));
  return NextResponse.json(
    {
      ok: true,
      ...snapshot,
      plannerMeta: {
        closedWaveGeneration: PLATFORM_CORE_PLANNER_CLOSED_WAVE_GENERATION,
        p0Active: snapshot.counts.p0,
        runtimeUpdatedAt: runtime.updatedAt,
      },
      runtimeUpdatedAt: runtime.updatedAt,
      agentEndpoints: {
        claim: '/api/dev/platform-core/planner/claim',
        complete: '/api/dev/platform-core/planner/complete',
        next: '/api/dev/platform-core/planner/next',
        runAgents: '/api/dev/platform-core/planner/run-agents',
        analyze: '/api/dev/platform-core/planner/analyze',
      },
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
