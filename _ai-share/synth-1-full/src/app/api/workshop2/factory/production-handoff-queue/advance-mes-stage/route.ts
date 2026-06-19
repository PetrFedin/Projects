/**
 * POST — продвижение MES-этапа выпуска (cut → sew → qc → released).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { advanceWorkshop2FactoryMesReleaseStage } from '@/lib/server/workshop2-b2b-production-handoff';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';
import { NextRequest, NextResponse } from 'next/server';

export const POST = withWorkshop2ApiErrorRu(async function postAdvanceMesStage(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES, {
    bodyActorLabel: String(body.actor ?? ''),
  });
  if (auth instanceof NextResponse) return auth;

  const factoryId = String(body.factoryId ?? 'fact-1').trim();
  const productionOrderId = String(body.productionOrderId ?? '').trim();
  const collectionId = String(body.collectionId ?? '').trim();
  const articleId = String(body.articleId ?? '').trim();
  if (!productionOrderId || !collectionId || !articleId) {
    return jsonWorkshop2ErrorRu(400, 'invalid_po', {
      messageRu: 'Укажите productionOrderId, collectionId и articleId.',
    });
  }

  const actor =
    resolveWorkshop2UpdatedBy(req, String(body.actor ?? ''), auth.actor) ?? 'factory_mes_advance';
  const result = await advanceWorkshop2FactoryMesReleaseStage({
    factoryId,
    productionOrderId,
    collectionId,
    articleId,
    actor,
  });

  if (!result.ok) {
    return jsonWorkshop2ErrorRu(409, 'mes_advance_blocked', {
      messageRu: result.messageRu ?? 'MES-этап недоступен.',
    });
  }

  return NextResponse.json({
    ok: true,
    factoryId,
    productionOrderId,
    previousStage: result.previousStage,
    stage: result.stage,
    messageRu: result.messageRu,
  });
});
