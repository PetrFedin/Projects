/**
 * API runtime процесса: снимок состояния по `processId` + `contextId` в `.data/workflow-store.json`.
 * Клиентский UI по-прежнему использует localStorage; этот endpoint — для синхронизации/интеграций.
 */
import { NextResponse } from 'next/server';
import { readJsonBody } from '@/lib/http/read-json-body';
import { getStoredRuntimePayload, upsertRuntime } from '@/lib/server/process-workflow-store';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ processId: string }> }
) {
  const { processId } = await params;
  const { searchParams } = new URL(request.url);
  const contextId = searchParams.get('contextId') ?? 'default';

  try {
    const stored = getStoredRuntimePayload(processId, contextId);
    if (stored && typeof stored === 'object') {
      return NextResponse.json(stored);
    }
    return NextResponse.json({ processId, contextId, runtimes: {} });
  } catch (e) {
    console.error('GET /api/processes/[processId]/runtime:', e);
    return NextResponse.json({ error: 'Failed to fetch runtime' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ processId: string }> }
) {
  const { processId } = await params;
  const { searchParams } = new URL(request.url);
  const contextId = searchParams.get('contextId') ?? 'default';

  try {
    const body = await readJsonBody<Record<string, unknown>>(request);
    const merged = { processId, contextId, ...body };
    upsertRuntime(processId, contextId, merged);
    return NextResponse.json(merged);
  } catch (e) {
    console.error('PUT /api/processes/[processId]/runtime:', e);
    return NextResponse.json({ error: 'Failed to update runtime' }, { status: 500 });
  }
}
