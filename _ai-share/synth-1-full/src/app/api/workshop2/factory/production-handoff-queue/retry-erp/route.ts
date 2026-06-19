/**
 * POST — повторная синхронизация PO в ERP после factory ack (error / FACTORY-ACK).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import { retryWorkshop2FactoryHandoffErpSync } from '@/lib/server/workshop2-b2b-production-handoff';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';

export const POST = withWorkshop2ApiErrorRu(async function postRetryErp(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const productionOrderId = String(body.productionOrderId ?? '').trim();
  const collectionId = String(body.collectionId ?? '').trim();
  const articleId = String(body.articleId ?? '').trim();
  const factoryId = String(body.factoryId ?? 'fact-1').trim();

  if (!productionOrderId || !collectionId || !articleId) {
    return jsonWorkshop2ErrorRu(400, 'invalid_body', {
      messageRu: 'Укажите productionOrderId, collectionId, articleId.',
    });
  }

  const actor = resolveWorkshop2UpdatedBy(req, String(body.actor ?? ''), auth.actor);
  const result = await retryWorkshop2FactoryHandoffErpSync({
    productionOrderId,
    collectionId,
    articleId,
    factoryId,
    actor: actor ?? undefined,
  });

  return NextResponse.json(result);
});
