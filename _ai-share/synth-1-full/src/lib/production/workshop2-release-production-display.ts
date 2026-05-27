/**
 * Модель полоски «Производство» на вкладке release: SKU, версии ТЗ, заказ образца, маршрут.
 */
import type {
  Workshop2DossierPhase1,
  Workshop2SampleOrderStatus,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2SampleOrderDto } from '@/lib/production/workshop2-sample-api-client';
import { summarizeWorkshop2ArticleDevelopmentStateDisplay } from '@/lib/production/workshop2-article-development-state-display';
import {
  WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU,
  type Workshop2SampleGoodsMovementStatus,
} from '@/lib/production/workshop2-sample-goods-movement';
import { workshop2ArticleHref, W2_ARTICLE_SECTION_DOM } from '@/lib/production/workshop2-url';

export const WORKSHOP2_SAMPLE_ORDER_STATUS_LABELS_RU: Record<Workshop2SampleOrderStatus, string> = {
  draft: 'Черновик',
  sent: 'Отправлен',
  in_progress: 'В работе',
  received: 'Получен',
  approved: 'Утверждён',
  cancelled: 'Отменён',
};

export type Workshop2ReleaseProductionStripChipLink = {
  href: string;
  testId: string;
};

export type Workshop2ReleaseProductionStripModel = {
  skuLabel: string;
  dossierVersionLabel: string;
  patternPackVersionLabel: string;
  activeSampleOrderId: string | null;
  sampleOrderStatusLabel: string | null;
  movementStatusLabel: string | null;
  routingStepCount: number;
  operationsCount: number;
  /** Production Strip 2.0 — critical path из articleDevelopmentStateMirror. */
  developmentPathLabelRu: string | null;
  developmentPathTone: 'emerald' | 'amber' | 'neutral';
  criticalPathReady: boolean;
  /** Кликабельные chips → fit / qc / plan. */
  chipLinks: {
    fit: Workshop2ReleaseProductionStripChipLink;
    qc: Workshop2ReleaseProductionStripChipLink;
    plan: Workshop2ReleaseProductionStripChipLink;
  };
};

export function resolveWorkshop2ReleaseActiveSampleOrder(
  orders: Workshop2SampleOrderDto[],
  activeSampleOrderId?: string | null
): Workshop2SampleOrderDto | null {
  const id = activeSampleOrderId?.trim();
  if (id) {
    const hit = orders.find((o) => o.id === id);
    if (hit) return hit;
  }
  return orders[0] ?? null;
}

export function labelWorkshop2SampleOrderStatusRu(
  status: Workshop2SampleOrderStatus | string | undefined
): string {
  if (!status) return '—';
  return (
    WORKSHOP2_SAMPLE_ORDER_STATUS_LABELS_RU[status as Workshop2SampleOrderStatus] ?? String(status)
  );
}

export function labelWorkshop2SampleMovementStatusRu(
  movement: Workshop2SampleGoodsMovementStatus | string | undefined
): string {
  if (!movement) return '—';
  return (
    WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU[movement as Workshop2SampleGoodsMovementStatus] ??
    String(movement)
  );
}

export function buildWorkshop2ReleaseProductionStripModel(input: {
  dossier: Workshop2DossierPhase1 | null;
  activeOrder: Workshop2SampleOrderDto | null;
  routingStepCount: number;
  operationsCount: number;
  collectionId: string;
  articleUrlSegment: string;
}): Workshop2ReleaseProductionStripModel {
  const d = input.dossier;
  const sku = d?.articleSkuSnapshot?.trim() || d?.articleSkuValidationMirror?.sku?.trim() || '—';
  const dossierVersionLabel =
    d?.dossierVersionLabel?.trim() || (d?.dossierVersion != null ? `v${d.dossierVersion}` : 'v1');
  const patternPackVersionLabel = d?.categorySketchCompliance?.patternPackVersion?.trim() || '—';
  const activeSampleOrderId =
    input.activeOrder?.id ?? d?.sampleWorkflow?.activeSampleOrderId?.trim() ?? null;

  const devDisplay = summarizeWorkshop2ArticleDevelopmentStateDisplay({
    dossier: d,
    latestSampleOrder: input.activeOrder
      ? {
          id: input.activeOrder.id,
          status: input.activeOrder.status,
          movementStatus: input.activeOrder.movementStatus ?? 'created',
          movementLogLength: input.activeOrder.movementLog?.length ?? 0,
        }
      : null,
  });

  const { collectionId, articleUrlSegment } = input;

  return {
    skuLabel: sku,
    dossierVersionLabel,
    patternPackVersionLabel,
    activeSampleOrderId,
    sampleOrderStatusLabel: input.activeOrder
      ? labelWorkshop2SampleOrderStatusRu(input.activeOrder.status)
      : null,
    movementStatusLabel: input.activeOrder?.movementStatus
      ? labelWorkshop2SampleMovementStatusRu(input.activeOrder.movementStatus)
      : null,
    routingStepCount: input.routingStepCount,
    operationsCount: input.operationsCount,
    developmentPathLabelRu: devDisplay.labelRu,
    developmentPathTone:
      devDisplay.tone === 'emerald'
        ? 'emerald'
        : devDisplay.tone === 'neutral'
          ? 'neutral'
          : 'amber',
    criticalPathReady: devDisplay.criticalPathReady,
    chipLinks: {
      fit: {
        href: workshop2ArticleHref(collectionId, articleUrlSegment, {
          w2pane: 'fit',
          hash: W2_ARTICLE_SECTION_DOM.fit,
        }),
        testId: 'workshop2-release-chip-fit',
      },
      qc: {
        href: workshop2ArticleHref(collectionId, articleUrlSegment, {
          w2pane: 'qc',
          hash: W2_ARTICLE_SECTION_DOM.qc,
        }),
        testId: 'workshop2-release-chip-qc',
      },
      plan: {
        href: workshop2ArticleHref(collectionId, articleUrlSegment, {
          w2pane: 'plan',
          hash: W2_ARTICLE_SECTION_DOM.planPo,
        }),
        testId: 'workshop2-release-chip-plan',
      },
    },
  };
}
