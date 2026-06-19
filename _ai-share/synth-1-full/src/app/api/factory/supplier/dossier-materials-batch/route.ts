/**
 * POST: пакетные названия материалов из BOM досье (Platform Core supplier — один PG round-trip).
 */

import { NextRequest, NextResponse } from 'next/server';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { batchWorkshop2DossierMaterialNames } from '@/lib/server/workshop2-dossier-materials-batch';
import { getWorkshop2ServerDossierStoreMode } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export const dynamic = 'force-dynamic';

type BatchBody = {
  collectionId?: string;
  articleIds?: string[];
  limitPerArticle?: number;
};

async function postDossierMaterialsBatch(req: NextRequest) {
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

  const collectionId = body.collectionId?.trim() ?? '';
  const articleIds = Array.isArray(body.articleIds)
    ? body.articleIds.map((id) => id?.trim()).filter(Boolean)
    : [];
  const limitPerArticle =
    typeof body.limitPerArticle === 'number' && body.limitPerArticle > 0
      ? Math.min(body.limitPerArticle, 20)
      : 4;

  if (!collectionId || !articleIds.length) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_body',
        message: 'Требуются collectionId и непустой articleIds[]',
      },
      { status: 400 }
    );
  }

  const items = await batchWorkshop2DossierMaterialNames({
    collectionId,
    articleIds,
    limitPerArticle,
  });

  return NextResponse.json({
    ok: true,
    collectionId,
    storeMode: getWorkshop2ServerDossierStoreMode(),
    postgres: isWorkshop2PostgresEnabled(),
    items,
  });
}

export const POST = withWorkshop2ApiErrorRu(postDossierMaterialsBatch);
