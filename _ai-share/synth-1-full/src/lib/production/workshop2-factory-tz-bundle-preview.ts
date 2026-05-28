/**
 * M9: read-only excerpt TZ bundle для factory sample-queue (без полного ZIP).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2SampleOrderRecord } from '@/lib/server/workshop2-sample-order-repository';
import { buildWorkshop2RoutingStepsFromDossier } from '@/lib/production/workshop2-routing-steps';

export type Workshop2FactoryTzBundlePreview = {
  orderId: string;
  collectionId: string;
  articleId: string;
  status: string;
  quantity: number;
  dueDate?: string;
  articleLabelRu?: string;
  routingStepCount: number;
  routingStepsExcerpt: { stepNo: number; name: string; sashMin?: number }[];
  operationsCount: number;
  cutTicketCount: number;
  passportSku?: string;
  generatedAt: string;
};

export function buildWorkshop2FactoryTzBundlePreview(input: {
  order: Workshop2SampleOrderRecord;
  dossier: Workshop2DossierPhase1 | null;
  articleLabelRu?: string;
}): Workshop2FactoryTzBundlePreview {
  const routingSteps = input.dossier ? buildWorkshop2RoutingStepsFromDossier(input.dossier) : [];
  const ops = input.dossier?.productionModel?.operations ?? [];
  return {
    orderId: input.order.id,
    collectionId: input.order.collectionId,
    articleId: input.order.articleId,
    status: input.order.status,
    quantity: input.order.quantity,
    dueDate: input.order.dueDate,
    articleLabelRu: input.articleLabelRu,
    routingStepCount: routingSteps.length,
    routingStepsExcerpt: routingSteps.slice(0, 6).map((s) => ({
      stepNo: s.stepNo,
      name: s.name,
      sashMin: s.sashMin,
    })),
    operationsCount: ops.length,
    cutTicketCount: input.dossier?.cutTickets?.length ?? 0,
    passportSku: input.dossier?.passportProductionBrief?.sku?.trim(),
    generatedAt: new Date().toISOString(),
  };
}
