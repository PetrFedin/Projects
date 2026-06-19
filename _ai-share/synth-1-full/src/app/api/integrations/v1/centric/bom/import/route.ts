import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import {
  importCentricBom,
  type CentricBomLineInput,
} from '@/lib/integrations/spine/centric-bom-import.service';
import { enqueueSyncJob } from '@/lib/integrations/spine/sync-jobs-persistence.file';

/** POST /api/integrations/v1/centric/bom/import · Wave B2 + E1 */
export async function POST(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const mode = getApiContractMode();

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: 'INVALID_BODY', message: 'JSON body required' },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 400, headers: { 'x-request-id': requestId } }
    );
  }

  const styleId = String(body.styleId ?? body.StyleId ?? '').trim();
  const collectionId = String(body.collectionId ?? '').trim();
  const articleId = String(body.articleId ?? '').trim();
  if (!styleId || !collectionId || !articleId) {
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: 'MISSING_FIELDS', message: 'styleId, collectionId, articleId required' },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 400, headers: { 'x-request-id': requestId } }
    );
  }

  const lines = (body.lines ?? body.bomLines ?? []) as CentricBomLineInput[];
  const result = await importCentricBom({
    styleId,
    collectionId,
    articleId,
    lines: Array.isArray(lines) ? lines : [],
  });

  enqueueSyncJob({ platform: 'centric', kind: 'bom_import', resultCount: 1 });

  return NextResponse.json(
    {
      ok: true as const,
      data: { result },
      meta: { requestId, mode, apiVersion: 'v1' as const },
    },
    { headers: { 'x-request-id': requestId } }
  );
}
