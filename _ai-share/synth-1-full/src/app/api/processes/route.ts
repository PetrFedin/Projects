/**
 * API процессов LIVE.
 * TODO: заменить на БД (Postgres, SQLite). Сейчас — чтение из определений.
 */
import { NextResponse } from 'next/server';
import {
  getAllLiveProcessIds,
  getLiveProcessDefinition,
} from '@/lib/live-process/process-definitions';
import { PROCESS_TEMPLATES } from '@/lib/live-process/process-templates';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'custom' | 'templates' | 'all'

  try {
    if (type === 'templates') {
      const templates = PROCESS_TEMPLATES.map((t) => t.definition);
      return NextResponse.json(templates);
    }

    const ids = getAllLiveProcessIds();
    const processes = ids.map((id) => getLiveProcessDefinition(id)).filter(Boolean);

    return NextResponse.json(processes);
  } catch (e) {
    console.error('GET /api/processes:', e);
    return NextResponse.json({ error: 'Failed to fetch processes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  /**
   * Создание кастомного процесса.
   * TODO: сохранять в БД, возвращать id.
   */
  try {
    const body = await request.json();
    const { name, description, contextKey, stages } = body;

    // Временная реализация: возвращаем как "созданный"
    const id = `custom-${Date.now()}`;
    const process = {
      id,
      name: name ?? 'Новый процесс',
      description: description ?? '',
      contextKey: contextKey ?? null,
      stages: stages ?? [],
      meta: { isTemplate: false },
    };

    // TODO: await db.processes.create(process);
    return NextResponse.json(process, { status: 201 });
  } catch (e) {
    console.error('POST /api/processes:', e);
    return NextResponse.json({ error: 'Failed to create process' }, { status: 500 });
  }
}
