import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_HOME_CMS, CmsHomeConfig } from '@/data/cms.home.default';

/**
 * MVP: “сервер” отдаёт дефолт.
 * Реально редактирование будет идти с клиента через localStorage repo.
 * Но API нужен, чтобы потом заменить на Firebase без смены интерфейса.
 */

export async function GET() {
  return NextResponse.json(DEFAULT_HOME_CMS);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CmsHomeConfig;
    // В MVP не сохраняем на сервер (без Firebase).
    // Возвращаем то, что пришло — UI сохранит локально.
    return NextResponse.json({ ...body, updatedAtISO: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
