/**
 * Wave 13 / M9: sample-order queue для factory dashboard — PG listByContractorId.
 */
import 'server-only';

import type { Workshop2SampleOrderStatus } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2SampleOrderRecord } from '@/lib/server/workshop2-sample-order-repository';
import { listWorkshop2SampleOrdersByContractorId } from '@/lib/server/workshop2-sample-order-repository';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';
import { summarizeWorkshop2InspectorPgMirror } from '@/lib/production/workshop2-operational-pg-mirror-status';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import {
  isWorkshop2FactorySampleQueueItemOverdue,
  parseWorkshop2FactorySampleQueueStatusFilter,
  sortWorkshop2FactorySampleQueueItems,
} from '@/lib/production/workshop2-factory-sample-queue-utils';

export {
  isWorkshop2FactorySampleQueueItemOverdue,
  parseWorkshop2FactorySampleQueueStatusFilter,
  sortWorkshop2FactorySampleQueueItems,
} from '@/lib/production/workshop2-factory-sample-queue-utils';

export type Workshop2FactorySampleQueueItem = {
  orderId: string;
  collectionId: string;
  articleId: string;
  status: string;
  movementStatus: string;
  quantity: number;
  dueDate?: string;
  contractorId?: string;
  workspaceFitQcHref: string;
  articleLabelRu?: string;
  /** Wave 15: badge из inspectorReportMirror / qcPanelMirror досье. */
  qcStatusBadgeRu?: string;
  qcStatusTone?: 'emerald' | 'amber' | 'rose' | 'slate';
  /** QW3: просрочка по due_date относительно сегодня. */
  dueOverdue?: boolean;
  dueOverdueLabelRu?: string;
};

export type Workshop2FactorySampleQueueResult = {
  factoryId: string;
  items: Workshop2FactorySampleQueueItem[];
  source: 'pg' | 'memory';
  /** Применённый фильтр статусов (если был). */
  statusFilter?: Workshop2SampleOrderStatus[];
};

export async function listWorkshop2FactorySampleQueue(input: {
  factoryId: string;
  organizationId?: string;
  statusFilter?: Workshop2SampleOrderStatus[];
}): Promise<Workshop2FactorySampleQueueResult> {
  const factoryId = input.factoryId.trim() || 'fact-1';
  const pgEnabled = isWorkshop2PostgresEnabled();

  const orders = await listWorkshop2SampleOrdersByContractorId({
    contractorId: factoryId,
    organizationId: input.organizationId,
    statusFilter: input.statusFilter,
  });

  const items: Workshop2FactorySampleQueueItem[] = [];
  for (const order of orders) {
    const dossierRec = await getWorkshop2ServerDossierRecord(order.collectionId, order.articleId);
    const label =
      dossierRec?.dossier?.passportProductionBrief?.articleCardOwnerName?.trim() || order.articleId;
    items.push(mapQueueItem(order, label, dossierRec?.dossier ?? null));
  }

  return {
    factoryId,
    items: sortWorkshop2FactorySampleQueueItems(items),
    source: pgEnabled ? 'pg' : 'memory',
    statusFilter: input.statusFilter,
  };
}

function mapQueueItem(
  order: Workshop2SampleOrderRecord,
  articleLabelRu?: string,
  dossier?: import('@/lib/production/workshop2-dossier-phase1.types').Workshop2DossierPhase1 | null
): Workshop2FactorySampleQueueItem {
  const qcChip = summarizeWorkshop2InspectorPgMirror(dossier);
  const dueOverdue = isWorkshop2FactorySampleQueueItemOverdue({
    dueDate: order.dueDate,
    status: order.status,
  });
  return {
    orderId: order.id,
    collectionId: order.collectionId,
    articleId: order.articleId,
    status: order.status,
    movementStatus: order.movementStatus,
    quantity: order.quantity,
    dueDate: order.dueDate,
    contractorId: order.contractorId,
    workspaceFitQcHref: workshop2ArticleHref(order.collectionId, order.articleId, {
      w2pane: 'fit',
      hash: 'w2article-section-qc',
    }),
    articleLabelRu,
    qcStatusBadgeRu: qcChip.label,
    qcStatusTone: qcChip.tone,
    dueOverdue,
    dueOverdueLabelRu: dueOverdue
      ? `Просрочено · ${order.dueDate}`
      : order.dueDate
        ? `Срок ${order.dueDate}`
        : undefined,
  };
}
