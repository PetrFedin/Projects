/**
 * POST — batch chain-status для списка B2B-заказов (один round-trip вместо N+1).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { getWorkshop2B2bChainStatus } from '@/lib/server/workshop2-b2b-production-handoff';
import { getOperationalImportChainStatus } from '@/lib/integrations/spine/operational-import-handoff.service';
import { applyShopBuyerChainVisibility } from '@/lib/platform-core-shop-production-visibility';
import { resolveShopProductionVisibilityPolicyForOrder } from '@/lib/server/workshop2-shop-production-visibility-repository';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';
import { NextRequest, NextResponse } from 'next/server';

const MAX_BATCH = 32;

export const POST = withWorkshop2ApiErrorRu(async function postChainStatusBatch(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const raw = body.orderIds;
  if (!Array.isArray(raw)) {
    return jsonWorkshop2ErrorRu(400, 'invalid_order_ids', {
      messageRu: 'Укажите orderIds: string[].',
    });
  }

  const orderIds = [...new Set(raw.map((id) => String(id ?? '').trim()).filter(Boolean))].slice(
    0,
    MAX_BATCH
  );
  if (orderIds.length === 0) {
    return NextResponse.json({ ok: true, chains: {} });
  }

  const buyerView = body.buyerView === true || body.buyerView === '1' || body.buyerView === 1;

  const entries = await Promise.all(
    orderIds.map(async (orderId) => {
      let chain = await getWorkshop2B2bChainStatus(orderId);
      if (!chain) {
        chain = await getOperationalImportChainStatus(orderId);
      }
      if (buyerView && chain) {
        const policy = await resolveShopProductionVisibilityPolicyForOrder({
          orderId,
          collectionId: chain.collectionId,
        });
        chain = applyShopBuyerChainVisibility(chain, policy) ?? chain;
      }
      return [orderId, chain] as const;
    })
  );

  const chains: Record<
    string,
    NonNullable<Awaited<ReturnType<typeof getWorkshop2B2bChainStatus>>>
  > = {};
  for (const [orderId, chain] of entries) {
    if (chain) chains[orderId] = chain;
  }

  return NextResponse.json({ ok: true, chains });
});
