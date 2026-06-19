import { NextResponse } from 'next/server';
import {
  forceScrubPlannerRuntimeClosedWave,
  isDevPlannerApiEnabled,
  PLATFORM_CORE_PLANNER_CLOSED_WAVE_GENERATION,
  readPlannerRuntimeState,
  runtimeToOverlay,
} from '@/lib/server/platform-core-planner-runtime.server';
import { buildPlatformCorePlanner } from '@/lib/platform-core-planner';
import { purgeClosedWaveAgentSessionFiles } from '@/lib/server/platform-core-planner-agent-session.server';

/** POST — принудительно вычистить закрытую e2e-волну из runtime + stale dispatch file. */
export async function POST(request: Request) {
  if (!isDevPlannerApiEnabled()) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  const url = new URL(request.url);
  const collectionId = url.searchParams.get('collection') ?? 'SS27';
  const before = await readPlannerRuntimeState();
  const after = await forceScrubPlannerRuntimeClosedWave();
  const removedAgentSessions = await purgeClosedWaveAgentSessionFiles();
  const snapshot = buildPlatformCorePlanner(collectionId, runtimeToOverlay(after));
  return NextResponse.json({
    ok: true,
    removedDiscovered:
      (before.discoveredDevelopment?.length ?? 0) - (after.discoveredDevelopment?.length ?? 0),
    removedAgentSessions,
    closedWaveGeneration: PLATFORM_CORE_PLANNER_CLOSED_WAVE_GENERATION,
    counts: snapshot.counts,
    p0Active: snapshot.counts.p0,
  });
}
