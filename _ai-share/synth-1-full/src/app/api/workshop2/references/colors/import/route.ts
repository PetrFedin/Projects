import { NextRequest, NextResponse } from 'next/server';
import {
  importWorkshop2ColorsCsv,
  listWorkshop2RefColors,
} from '@/lib/server/workshop2-references-repository';
import {
  guardWorkshop2Route,
  WORKSHOP2_REFERENCES_IMPORT_ROLES,
} from '@/lib/server/workshop2-route-auth';

export const dynamic = 'force-dynamic';

/**
 * POST: импорт палитры сезона из CSV (code,name,hex[,pantone]).
 * Доступ: technologist, manager или production:edit.
 */
export async function POST(req: NextRequest) {
  const auth = guardWorkshop2Route(req, WORKSHOP2_REFERENCES_IMPORT_ROLES);
  if (auth instanceof NextResponse) return auth;

  const body = (await req.json().catch(() => null)) as {
    csv?: string;
    seasonId?: string;
  } | null;
  const csv = body?.csv?.trim() ?? '';
  const seasonId = body?.seasonId?.trim() || 'SS27';

  if (!csv) {
    return NextResponse.json(
      { ok: false, error: 'empty_csv', message: 'Передайте поле csv с содержимым файла.' },
      { status: 400 }
    );
  }

  const result = await importWorkshop2ColorsCsv(csv, seasonId);
  if (!result.ok) {
    const messages: Record<string, string> = {
      empty_csv: 'Файл пуст или не распознан.',
      pg_disabled: 'PostgreSQL не настроен — импорт палитры недоступен.',
    };
    return NextResponse.json(
      {
        ok: false,
        error: result.reason,
        message: messages[result.reason] ?? 'Ошибка импорта палитры.',
      },
      { status: result.reason === 'pg_disabled' ? 503 : 400 }
    );
  }

  const colors = await listWorkshop2RefColors();

  return NextResponse.json({
    ok: true,
    imported: result.imported,
    seasonId,
    source: colors.source,
    totalColors: colors.items.length,
    message: `Импортировано в PG: ${result.imported}. Всего в палитре: ${colors.items.length}.`,
  });
}
