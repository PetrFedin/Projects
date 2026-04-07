/**
 * API runtime процесса (состояние инстанса: ответственные, даты, статусы).
 * TODO: хранение в БД, event sourcing для аудита.
 */
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ processId: string }> }
) {
  const { processId } = await params;
  const { searchParams } = new URL(request.url);
  const contextId = searchParams.get('contextId') ?? 'default';

  try {
    // TODO: await db.processRuntimes.find({ processId, contextId });
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
    const body = await request.json();
    // TODO: event sourcing — append status change event
    // TODO: await db.processRuntimes.upsert({ processId, contextId, ...body });
    return NextResponse.json({ processId, contextId, ...body });
  } catch (e) {
    console.error('PUT /api/processes/[processId]/runtime:', e);
    return NextResponse.json({ error: 'Failed to update runtime' }, { status: 500 });
  }
}
