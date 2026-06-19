import { NextResponse } from 'next/server';
import {
  collapseSessionMessages,
  readSessionMessages,
  readSessionMeta,
} from '@/lib/server/platform-core-planner-agent-session.server';
import { isDevPlannerApiEnabled } from '@/lib/server/platform-core-planner-runtime.server';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  if (!isDevPlannerApiEnabled()) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  const { id } = await params;
  const raw = await readSessionMessages(id);
  const messages = collapseSessionMessages(raw);
  const meta = await readSessionMeta(id);

  return NextResponse.json(
    {
      ok: true,
      sessionId: id,
      meta,
      messages,
      status: meta?.status ?? 'unknown',
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
