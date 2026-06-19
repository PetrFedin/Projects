import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import { importCentricStyle } from '@/lib/integrations/spine/centric-style-import.service';
import { enqueueSyncJob } from '@/lib/integrations/spine/sync-jobs-persistence.file';

/** POST /api/integrations/v1/centric/styles/import */
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
  if (!styleId) {
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: 'MISSING_STYLE_ID', message: 'styleId required' },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 400, headers: { 'x-request-id': requestId } }
    );
  }

  const result = importCentricStyle({
    styleId,
    styleCode: body.styleCode as string | undefined,
    lifecycleState: (body.lifecycleState ?? body.LifecycleState) as string | undefined,
    collectionId: body.collectionId as string | undefined,
    articleId: body.articleId as string | undefined,
  });

  enqueueSyncJob({ platform: 'centric', kind: 'styles_import', resultCount: 1 });

  return NextResponse.json(
    {
      ok: true as const,
      data: { result },
      meta: { requestId, mode, apiVersion: 'v1' as const },
    },
    { headers: { 'x-request-id': requestId } }
  );
}
