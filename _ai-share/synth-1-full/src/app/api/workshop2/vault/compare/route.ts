/**
 * GET /api/workshop2/vault/compare?left=&right=&collectionId=&articleId=
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { compareWorkshop2VaultRevisions } from '@/lib/production/workshop2-vault-compare';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export async function GET(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const left = req.nextUrl.searchParams.get('left')?.trim();
  const right = req.nextUrl.searchParams.get('right')?.trim();
  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim();
  const articleId = req.nextUrl.searchParams.get('articleId')?.trim();

  if (!left || !right) {
    return jsonWorkshop2ErrorRu(400, 'missing_params', {
      messageRu: 'Укажите left и right (id vault-документов).',
    });
  }

  let docs: Array<{
    id: string;
    title?: string;
    storagePath?: string | null;
    metadata?: Record<string, unknown> | null;
  }> = [];

  if (collectionId && articleId) {
    const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
    docs = (record?.dossier.vaultDocuments ?? []).map((d) => {
      const ext = d as {
        storagePath?: string | null;
        metadata?: Record<string, unknown> | null;
      };
      return {
        id: d.id,
        title: typeof d.title === 'string' ? d.title : undefined,
        storagePath: ext.storagePath,
        metadata: ext.metadata,
      };
    });
  }

  const leftDoc = docs.find((d) => d.id === left);
  const rightDoc = docs.find((d) => d.id === right);
  if (!leftDoc || !rightDoc) {
    return jsonWorkshop2ErrorRu(404, 'revision_not_found', {
      messageRu: 'Ревизии не найдены в dossier vaultDocuments (нужны collectionId+articleId).',
    });
  }

  const compare = compareWorkshop2VaultRevisions({ left: leftDoc, right: rightDoc });
  return NextResponse.json({ ok: true, compare });
}
