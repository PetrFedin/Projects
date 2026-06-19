import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import { importZedonkStyle } from '@/lib/integrations/spine/zedonk-style-import.service';
import { enqueueSyncJob } from '@/lib/integrations/spine/sync-jobs-persistence.file';

/** POST /api/integrations/v1/zedonk/styles/import · Wave D4 */
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

  const record = await importZedonkStyle({
    styleId,
    collectionId,
    articleId,
    makeCostUsd: body.makeCostUsd as number | undefined,
    freightUsd: body.freightUsd as number | undefined,
    dutyPct: body.dutyPct as number | undefined,
  });

  enqueueSyncJob({ platform: 'zedonk', kind: 'zedonk_style_import', resultCount: 1 });

  return NextResponse.json(
    {
      ok: true as const,
      data: { style: record },
      meta: { requestId, mode, apiVersion: 'v1' as const },
    },
    { headers: { 'x-request-id': requestId } }
  );
}
