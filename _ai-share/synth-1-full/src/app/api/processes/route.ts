/**
 * API процессов LIVE.
 * Определения: встроенные в код + переопределения/кастом из `.data/workflow-store.json`
 * (см. `process-workflow-store.ts`). Отключение: `WORKFLOW_STORE_DISABLED=1`.
 */
import { NextResponse } from 'next/server';
import { readJsonBody } from '@/lib/http/read-json-body';
import { mergeAllProcessDefinitionsForApi, upsertDefinition } from '@/lib/server/process-workflow-store';
import { PROCESS_TEMPLATES } from '@/lib/live-process/process-templates';
import type { LiveProcessDefinition } from '@/lib/live-process/types';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'custom' | 'templates' | 'all'

  try {
    if (type === 'templates') {
      const templates = PROCESS_TEMPLATES.map((t) => t.definition);
      return NextResponse.json(templates);
    }

    const processes = mergeAllProcessDefinitionsForApi();
    return NextResponse.json(processes);
  } catch (e) {
    console.error('GET /api/processes:', e);
    return NextResponse.json({ error: 'Failed to fetch processes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, contextKey, stages } = await readJsonBody<{
      name?: string;
      description?: string;
      contextKey?: string;
      stages?: unknown;
    }>(request);

    const id = `custom-${Date.now()}`;
    const process: LiveProcessDefinition = {
      id,
      name: name ?? 'Новый процесс',
      description: description ?? '',
      contextKey: contextKey || undefined,
      stages: Array.isArray(stages) ? (stages as LiveProcessDefinition['stages']) : [],
      meta: { isTemplate: false },
    };

    upsertDefinition(process);
    return NextResponse.json(process, { status: 201 });
  } catch (e) {
    console.error('POST /api/processes:', e);
    return NextResponse.json({ error: 'Failed to create process' }, { status: 500 });
  }
}
