import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import { resolveEligibleForCollection } from '@/lib/integrations/spine/eligible-gate';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

/** GET /api/integrations/v1/articles/:collectionId/:articleId/eligible */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  const requestId = getOrCreateRequestId(req);
  const mode = getApiContractMode();
  const { collectionId, articleId } = await ctx.params;

  let dossier;
  try {
    const record = await getWorkshop2ServerDossierRecord(collectionId.trim(), articleId.trim());
    dossier = record?.dossier ?? null;
  } catch {
    dossier = null;
  }

  const result = resolveEligibleForCollection({
    collectionId: collectionId.trim(),
    articleId: articleId.trim(),
    dossier,
  });

  return NextResponse.json(
    {
      ok: true as const,
      data: result,
      meta: { requestId, mode, apiVersion: 'v1' as const },
    },
    { headers: { 'x-request-id': requestId } }
  );
}
