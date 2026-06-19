import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import { getSpineProcurementContext } from '@/lib/integrations/spine/procurement-context.service';

type RouteCtx = { params: Promise<{ orderId: string }> };

/** GET /api/integrations/v1/procurement/:orderId · Wave D3 supplier context */
export async function GET(_req: NextRequest, ctx: RouteCtx) {
  const requestId = getOrCreateRequestId(_req);
  const mode = getApiContractMode();
  const { orderId } = await ctx.params;
  const context = await getSpineProcurementContext(orderId);

  if (!context) {
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: 'NOT_FOUND', message: 'Procurement context not found' },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 404, headers: { 'x-request-id': requestId } }
    );
  }

  return NextResponse.json(
    {
      ok: true as const,
      data: { procurement: context },
      meta: { requestId, mode, apiVersion: 'v1' as const },
    },
    { headers: { 'x-request-id': requestId } }
  );
}
