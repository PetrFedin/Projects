import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import { getZedonkStyleEnrich } from '@/lib/integrations/spine/zedonk-style-enrich-persistence.file';
import { formatZedonkCostingHintRu } from '@/lib/integrations/spine/zedonk-style-import.service';

/** GET /api/integrations/v1/zedonk/enrich?collectionId=&articleId= · Wave D4 */
export async function GET(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const mode = getApiContractMode();
  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim() ?? '';
  const articleId = req.nextUrl.searchParams.get('articleId')?.trim() ?? '';

  if (!collectionId || !articleId) {
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: 'MISSING_PARAMS', message: 'collectionId and articleId required' },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 400, headers: { 'x-request-id': requestId } }
    );
  }

  const record = getZedonkStyleEnrich(collectionId, articleId);

  return NextResponse.json(
    {
      ok: true as const,
      data: {
        enrich: record ?? null,
        hintRu: record ? formatZedonkCostingHintRu(record) : null,
      },
      meta: { requestId, mode, apiVersion: 'v1' as const },
    },
    { headers: { 'x-request-id': requestId } }
  );
}
