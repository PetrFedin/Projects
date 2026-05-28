/**
 * Wave 11: deep links после PUT досье — клиент без дополнительного fetch.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { ROUTES, brandProductionFloorHref } from '@/lib/routes';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';
import { workshop2ContextToProductionFloorHubHref } from '@/lib/production/workshop2-floor-bridge';
import {
  WORKSHOP2_ARTICLE_CONTEXT_TYPE,
  workshop2ArticleContextId,
} from '@/lib/production/workshop2-domain-event-types';
import {
  buildWorkshop2InspectorUrlForArticle,
  buildWorkshop2Ss27RuJourneySteps,
  resolveWorkshop2Ss27RuJourneyActiveStep,
} from '@/lib/production/workshop2-ru-journey-ss27';

export type Workshop2DossierLinkedPaths = {
  chat: string;
  calendar: string;
  floor: string;
  b2bShowroom: string;
  schetOfferta: string | null;
  workspace: string;
  markingCsv: string;
  /** Wave 19: пакет соответствия РФ (compliance-pack.zip). */
  ruCompliancePack: string;
  /** Wave 12: id активного шага «Путь SS27» (collection | workspace | sample | gold | floor). */
  ruJourneyStep: string | null;
  /** Deep link inspector PWA при активном заказе образца. */
  inspectorUrl: string | null;
  /** Текущий edoStatus из досье (для клиента без повторного fetch). */
  edoStatus: string | null;
};

export function buildWorkshop2DossierLinkedPaths(input: {
  collectionId: string;
  articleId: string;
  articleUrlSegment?: string;
  dossier?: Workshop2DossierPhase1 | null;
}): Workshop2DossierLinkedPaths {
  const cid = input.collectionId.trim();
  const aid = input.articleId.trim();
  const segment = (input.articleUrlSegment ?? aid).trim();
  const orderId = input.dossier?.b2bIntegrationDraft?.lastMarketplaceOrderId?.trim();
  const sampleOrderId = input.dossier?.sampleWorkflow?.activeSampleOrderId?.trim();
  const journeySteps = buildWorkshop2Ss27RuJourneySteps({
    collectionId: cid,
    articleId: aid,
    articleUrlSegment: segment,
    dossier: input.dossier,
  });

  return {
    workspace: workshop2ArticleHref(cid, segment),
    chat: `${ROUTES.brand.productionWorkshop2}/c/${encodeURIComponent(cid)}/a/${encodeURIComponent(segment)}?w2pane=overview#w2-contextual-chat`,
    calendar: `${ROUTES.brand.calendar}?layers=tasks&w2col=${encodeURIComponent(cid)}&w2art=${encodeURIComponent(aid)}`,
    floor: workshop2ContextToProductionFloorHubHref({ collectionId: cid, articleLineId: segment }),
    b2bShowroom: ROUTES.shop.b2bShowroom,
    schetOfferta: orderId
      ? `/api/shop/b2b/orders/${encodeURIComponent(orderId)}/schet-offerta.pdf`
      : null,
    markingCsv: `/api/workshop2/articles/${encodeURIComponent(cid)}/${encodeURIComponent(aid)}/marking/export-csv`,
    ruCompliancePack: `/api/workshop2/articles/${encodeURIComponent(cid)}/${encodeURIComponent(aid)}/compliance-pack.zip`,
    ruJourneyStep: resolveWorkshop2Ss27RuJourneyActiveStep(journeySteps),
    inspectorUrl: buildWorkshop2InspectorUrlForArticle({
      collectionId: cid,
      articleId: aid,
      sampleOrderId,
    }),
    edoStatus: input.dossier?.edoSignoffMirror?.edoStatus ?? null,
  };
}

/** contextId для агрегированного списка threads brand/messages. */
export function workshop2ArticleContextDescriptor(
  collectionId: string,
  articleId: string
): {
  contextType: typeof WORKSHOP2_ARTICLE_CONTEXT_TYPE;
  contextId: string;
} {
  return {
    contextType: WORKSHOP2_ARTICLE_CONTEXT_TYPE,
    contextId: workshop2ArticleContextId(collectionId, articleId),
  };
}
