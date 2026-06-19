/**
 * POST — bulk повтор ERP sync для attention rows в очереди handoff.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  bulkRetryWorkshop2FactoryHandoffErpSync,
  type Workshop2FactoryHandoffBulkErpRetryItem,
} from '@/lib/server/workshop2-b2b-production-handoff';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';

export const POST = withWorkshop2ApiErrorRu(async function postBulkRetryErp(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const factoryId = String(body.factoryId ?? 'fact-1').trim();
  const rawItems = Array.isArray(body.items) ? body.items : [];
  const items: Workshop2FactoryHandoffBulkErpRetryItem[] = rawItems
    .map((row) => {
      const r = row as Record<string, unknown>;
      return {
        productionOrderId: String(r.productionOrderId ?? '').trim(),
        collectionId: String(r.collectionId ?? '').trim(),
        articleId: String(r.articleId ?? '').trim(),
      };
    })
    .filter((row) => row.productionOrderId && row.collectionId && row.articleId);

  const actor = resolveWorkshop2UpdatedBy(req, String(body.actor ?? ''), auth.actor);
  const result = await bulkRetryWorkshop2FactoryHandoffErpSync({
    factoryId,
    items: items.length > 0 ? items : undefined,
    actor: actor ?? undefined,
  });

  return NextResponse.json(result);
});
