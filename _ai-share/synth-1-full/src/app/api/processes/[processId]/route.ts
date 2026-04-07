/**
 * API процесса LIVE по ID.
 * TODO: CRUD через БД.
 */
import { NextResponse } from 'next/server';
import { getLiveProcessDefinition } from '@/lib/live-process/process-definitions';
import { getTemplateById } from '@/lib/live-process/process-templates';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ processId: string }> }
) {
  const { processId } = await params;

  try {
    let process = getLiveProcessDefinition(processId);
    if (!process) {
      process = getTemplateById(processId);
    }
    if (!process) {
      return NextResponse.json({ error: 'Process not found' }, { status: 404 });
    }
    return NextResponse.json(process);
  } catch (e) {
    console.error('GET /api/processes/[processId]:', e);
    return NextResponse.json({ error: 'Failed to fetch process' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ processId: string }> }
) {
  /**
   * Обновление процесса (схемы этапов).
   * TODO: сохранять в БД.
   */
  const { processId } = await params;

  try {
    const body = await request.json();
    // TODO: await db.processes.update(processId, body);
    return NextResponse.json({ ...body, id: processId });
  } catch (e) {
    console.error('PUT /api/processes/[processId]:', e);
    return NextResponse.json({ error: 'Failed to update process' }, { status: 500 });
  }
}
