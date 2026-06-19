import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import { integrationPlatformZ } from '@/lib/integrations/spine/integration-external-ref.schema';
import { getMatrixInventoryForPlatform } from '@/lib/integrations/spine/inventory-adapters';

type RouteCtx = { params: Promise<{ platform: string }> };

/** GET /api/integrations/v1/:platform/inventory */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  const requestId = getOrCreateRequestId(req);
  const mode = getApiContractMode();
  const { platform: platformRaw } = await ctx.params;
  const platformParsed = integrationPlatformZ.safeParse(platformRaw);
  if (!platformParsed.success) {
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: 'INVALID_PLATFORM', message: 'Unknown platform' },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 400, headers: { 'x-request-id': requestId } }
    );
  }

  const sku = new URL(req.url).searchParams.get('sku') ?? undefined;
  const items = getMatrixInventoryForPlatform(platformParsed.data, sku);

  return NextResponse.json(
    {
      ok: true as const,
      data: { platform: platformParsed.data, items },
      meta: { requestId, mode, apiVersion: 'v1' as const },
    },
    { headers: { 'x-request-id': requestId } }
  );
}
