import { NextRequest, NextResponse } from 'next/server';
import {
  isBrandTasksPgConfigured,
  listBrandTasksKanban,
  replaceBrandTasksKanban,
} from '@/lib/server/brand-tasks-repository';
import type { BrandTaskRecord } from '@/lib/production-data/port';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isBrandTasksPgConfigured()) {
    return NextResponse.json(
      { ok: false, mode: 'postgres_unavailable', tasks: [] },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
  const tasks = await listBrandTasksKanban();
  return NextResponse.json({ ok: true, mode: 'postgres', tasks }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(request: NextRequest) {
  if (!isBrandTasksPgConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'postgres_unavailable', messageRu: 'PostgreSQL недоступен — Kanban не сохранён.' },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as { tasks?: BrandTaskRecord[] } | null;
  if (!body?.tasks || !Array.isArray(body.tasks)) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  const result = await replaceBrandTasksKanban({ tasks: body.tasks });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.mode, messageRu: 'Сохранение в PG не выполнено.' },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, mode: 'postgres', count: body.tasks.length });
}
