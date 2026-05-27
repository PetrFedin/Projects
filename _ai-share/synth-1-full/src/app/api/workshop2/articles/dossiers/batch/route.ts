/**
 * POST: пакетная сводка готовности ТЗ по списку артикулов (для хаба, без localStorage drift).
 */

import { NextRequest, NextResponse } from 'next/server';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import {
  batchWorkshop2DossierReadiness,
  type Workshop2BatchReadinessItemInput,
} from '@/lib/server/workshop2-dossier-readiness-batch';
import { getWorkshop2ServerDossierStoreMode } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export const dynamic = 'force-dynamic';

type BatchBody = {
  items?: {
    collectionId?: string;
    articleId?: string;
    categoryLeafId?: string;
    articleSkuDraft?: string;
    articleNameDraft?: string;
  }[];
};

async function postDossiersBatch(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  let body: BatchBody;
  try {
    body = (await req.json()) as BatchBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_json', message: 'Некорректное тело запроса (JSON)' },
      { status: 400 }
    );
  }

  const raw = Array.isArray(body.items) ? body.items : [];
  const items: Workshop2BatchReadinessItemInput[] = [];
  for (const row of raw) {
    const collectionId = row.collectionId?.trim() ?? '';
    const articleId = row.articleId?.trim() ?? '';
    if (!collectionId || !articleId) continue;
    items.push({
      collectionId,
      articleId,
      ...(row.categoryLeafId?.trim() ? { categoryLeafId: row.categoryLeafId.trim() } : {}),
      ...(row.articleSkuDraft?.trim() ? { articleSkuDraft: row.articleSkuDraft.trim() } : {}),
      ...(row.articleNameDraft?.trim() ? { articleNameDraft: row.articleNameDraft.trim() } : {}),
    });
  }

  if (!items.length) {
    return NextResponse.json(
      { ok: false, error: 'empty_items', message: 'Список items пуст или некорректен' },
      { status: 400 }
    );
  }

  const results = await batchWorkshop2DossierReadiness(items);

  return NextResponse.json({
    ok: true,
    storeMode: getWorkshop2ServerDossierStoreMode(),
    postgres: isWorkshop2PostgresEnabled(),
    items: results,
  });
}

export const POST = withWorkshop2ApiErrorRu(postDossiersBatch);
