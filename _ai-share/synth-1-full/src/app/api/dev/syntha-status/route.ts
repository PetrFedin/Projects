import { NextResponse } from 'next/server';

async function probeOllama(): Promise<boolean> {
  try {
    const r = await fetch('http://127.0.0.1:11434/api/tags', { cache: 'no-store' });
    return r.ok;
  } catch {
    return false;
  }
}

import {
  loadCursorApiKeyFromEnvFiles,
  plannerAgentRunnerInstalled,
} from '@/lib/server/platform-core-planner-agent-session.server';

/** Dev-only: доп. статус для панели SYNTHA (Ollama, planner). */
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  await loadCursorApiKeyFromEnvFiles();
  const ollamaOk = await probeOllama();
  let plannerLive = false;
  try {
    const base = `http://127.0.0.1:${process.env.PORT ?? 3001}`;
    const r = await fetch(`${base}/api/dev/platform-core/planner`, { cache: 'no-store' });
    plannerLive = r.ok;
  } catch {
    plannerLive = false;
  }
  const hasCursorKey = Boolean(process.env.CURSOR_API_KEY?.trim());
  const cursorAgentRunner = await plannerAgentRunnerInstalled();
  return NextResponse.json(
    {
      ok: true,
      ollamaOk,
      plannerLive,
      cursorAgentConfigured: hasCursorKey,
      cursorAgentRunner,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
