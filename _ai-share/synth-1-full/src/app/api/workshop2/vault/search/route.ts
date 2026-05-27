/**
 * GET /api/workshop2/vault/search?q=&collectionId=&articleId=
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { searchWorkshop2VaultDocuments } from '@/lib/production/workshop2-vault-search';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export async function GET(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim();
  const articleId = req.nextUrl.searchParams.get('articleId')?.trim();

  if (!collectionId || !articleId) {
    return jsonWorkshop2ErrorRu(400, 'missing_article', {
      messageRu: 'Укажите collectionId и articleId.',
    });
  }

  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'dossier_not_found');
  }

  const hits = searchWorkshop2VaultDocuments({
    dossier: record.dossier,
    query: q,
    limit: 30,
  });

  return NextResponse.json({
    ok: true,
    query: q,
    hitCount: hits.length,
    hits,
  });
}
