import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  assembleWorkshop2ArticleImportRows,
  parseWorkshop2ArticlesImportCsv,
  WORKSHOP2_ARTICLES_IMPORT_MAX_ROWS,
  type Workshop2ArticleImportInputRow,
} from '@/lib/production/workshop2-articles-import';
import { resolveWorkshop2ActorFromRequest } from '@/lib/server/workshop2-actor-from-request';
import { putWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

export const dynamic = 'force-dynamic';

/**
 * POST: пакетное создание артикулов (validate + assembler).
 * Body: { csv?: string, rows?: { sku, name?, audience?, leafId }[], collectionId? }
 * Максимум 50 строк. Возвращает сборку для клиентского commit в local inventory.
 */
export async function POST(req: NextRequest) {
  const auth = guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const b = body as {
    csv?: string;
    rows?: Workshop2ArticleImportInputRow[];
    collectionId?: string;
    /** При true — PUT досье на сервер для каждой успешной строки (articleId = sku). */
    commit?: boolean;
  };

  let inputRows: Workshop2ArticleImportInputRow[] = [];
  if (Array.isArray(b.rows) && b.rows.length) {
    inputRows = b.rows;
  } else if (b.csv?.trim()) {
    inputRows = parseWorkshop2ArticlesImportCsv(b.csv);
  }

  if (!inputRows.length) {
    return NextResponse.json(
      {
        ok: false,
        error: 'empty_input',
        message: 'Передайте rows[] или csv (sku,name,audience,leafId).',
      },
      { status: 400 }
    );
  }

  if (inputRows.length > WORKSHOP2_ARTICLES_IMPORT_MAX_ROWS) {
    return NextResponse.json(
      {
        ok: false,
        error: 'too_many_rows',
        message: `Максимум ${WORKSHOP2_ARTICLES_IMPORT_MAX_ROWS} строк за запрос.`,
        maxRows: WORKSHOP2_ARTICLES_IMPORT_MAX_ROWS,
      },
      { status: 400 }
    );
  }

  const actorRes = await resolveWorkshop2ActorFromRequest(req);
  const updatedBy = actorRes.ok ? actorRes.actor.actorLabel : 'csv-import';
  const results = assembleWorkshop2ArticleImportRows(inputRows, { updatedBy });

  const okRows = results.filter((r) => r.ok);
  const failedRows = results.filter((r) => !r.ok);
  const collectionId = b.collectionId?.trim() || 'SS27';
  let committed = 0;
  const commitErrors: { sku: string; error: string }[] = [];

  if (b.commit === true && collectionId) {
    for (const row of okRows) {
      if (!row.ok) continue;
      const articleId = row.sku.trim();
      try {
        const putRes = await putWorkshop2ServerDossierRecord({
          collectionId,
          articleId,
          dossier: row.assembly.dossier,
          updatedBy,
        });
        if (!putRes.ok) {
          commitErrors.push({
            sku: row.sku,
            error: putRes.error === 'version_conflict' ? 'version_conflict' : 'put_failed',
          });
          continue;
        }
        committed += 1;
      } catch (e) {
        commitErrors.push({
          sku: row.sku,
          error: e instanceof Error ? e.message : 'commit_failed',
        });
      }
    }
  }

  return NextResponse.json({
    ok: failedRows.length === 0 && commitErrors.length === 0,
    collectionId,
    commit: b.commit === true,
    committed,
    commitErrors,
    maxRows: WORKSHOP2_ARTICLES_IMPORT_MAX_ROWS,
    total: results.length,
    imported: okRows.length,
    failed: failedRows.length,
    rows: results.map((r) =>
      r.ok
        ? {
            ok: true,
            rowIndex: r.rowIndex,
            sku: r.sku,
            name: r.name,
            audienceId: r.audienceId,
            leafId: r.leafId,
            preview: r.assembly.preview.oneLineRu,
            taTemplateId: r.assembly.preview.taTemplateId,
            dossier: r.assembly.dossier,
          }
        : { ok: false, rowIndex: r.rowIndex, sku: r.sku, error: r.error }
    ),
  });
}
