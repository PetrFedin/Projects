import { OrderAggregate } from '../order/order-aggregate';
import { ArticleAggregate } from '../article/article-aggregate';
import { ProductionCommitment } from '../production/execution-linkage';
import { CollectionAggregate, calculateCollectionReadiness } from '../article/collection-aggregate';
import { SampleAggregate, isSampleReady } from '../article/sample-aggregate';
import { calculateArticleReadiness } from '../article/article-readiness';
import { InventoryGrain, calculateATP } from '../logic/inventory-ledger';
import { triggerSmartSwap } from '../logic/stock-allocation';

import { CONTROL_REASON_CODES, ControlReasonCode } from './reason-codes';

/**
 * [Phase 2 — Control / Readiness / Next-action aggregation]
 * Канон: docs/domain-model/control-readiness.md.
 * Модель агрегации сигналов управления (Control Output Contract).
 */

export type ControlSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ControlAction {
  id: string;
  type: 'manual' | 'automated';
  label: string;
  ownerRole: string;
  deadline?: string;
  /** Обоснование действия (Explainability) */
  reasonCode: ControlReasonCode;
  sourceEntityId: string;
}

export interface ControlOutput {
  entityId: string;
  entityType: 'order' | 'article' | 'commitment' | 'collection' | 'sample' | 'inventory';

  /** Сводка готовности / здоровья */
  readinessScore: number; // 0-100
  status: 'healthy' | 'at_risk' | 'blocked';

  /** Список активных блокеров (условие + ссылка) */
  blockers: Array<{
    code: ControlReasonCode;
    message: string;
    refEntityId?: string;
  }>;

  /** Приоритетное следующее действие (derived + assigned) */
  nextAction?: ControlAction;

  /** Ссылки на связанные сущности для Explainability */
  links?: {
    dossierUrl?: string;
    techPackUrl?: string;
    orderUrl?: string;
  };

  /** Риски и предупреждения */
  risks: Array<{
    code: ControlReasonCode;
    message: string;
    severity: ControlSeverity;
    explainedBy?: string; // Ссылка на причину
  }>;

  /** [Phase 3] Многосторонние контрольные ворота (Multi-party Gates) */
  gates?: Array<{
    id: string;
    label: string;
    status: 'pending' | 'passed' | 'failed';
    ownerRole: 'brand' | 'factory' | 'logistics' | 'retailer';
    required: boolean;
  }>;

  /** [Phase 3 Prod] Предиктивные факторы риска (Predictive Risk Engine) */
  predictiveRisks?: RiskFactor[];

  metadata: {
    asOf: string;
    version: number;
    commitmentId?: string; // Опциональная привязка к производственному циклу
  };
}

/**
 * [Phase 3] Предиктивный анализ рисков.
 * Анализирует факторы задержек и дефицита.
 */
export interface RiskFactor {
  type: 'lead_time' | 'stock_out' | 'quality' | 'congestion';
  severity: number; // 0.0 - 1.0
  message: string;
}

export function analyzePredictiveRisks(params: {
  entityId: string;
  historicalLeadTimes: number[];
  currentCongestion: number;
  atp: number;
  salesVelocity: number;
}): RiskFactor[] {
  const { historicalLeadTimes, currentCongestion, atp, salesVelocity } = params;
  const factors: RiskFactor[] = [];

  // 1. Риск задержки из-за загрузки фабрики
  if (currentCongestion > 1.3) {
    factors.push({
      type: 'congestion',
      severity: (currentCongestion - 1) / 0.5,
      message: 'High factory congestion may delay production',
    });
  }

  // 2. Риск обнуления стока (Stock-out)
  const daysToStockOut = atp / (salesVelocity || 1);
  if (daysToStockOut < 7) {
    factors.push({
      type: 'stock_out',
      severity: (7 - daysToStockOut) / 7,
      message: `Predicted stock-out in ${Math.ceil(daysToStockOut)} days`,
    });
  }

  // 3. Нестабильность lead time по историческим окнам
  if (historicalLeadTimes.length >= 2) {
    const spread = Math.max(...historicalLeadTimes) - Math.min(...historicalLeadTimes);
    if (spread > 5) {
      factors.push({
        type: 'lead_time',
        severity: Math.min(1, spread / 25),
        message: `Lead time variability (${spread}d range) may delay commitments`,
      });
    }
  }

  return factors;
}

/** Демо-SKU для виджета предиктивных рисков в Control Center (узкий контур, не SoT прод-стока). */
export const CONTROL_CENTER_DEMO_SKU = 'DEMO-CC-SKU';

function buildControlCenterDemoInventoryGrains(): InventoryGrain[] {
  const updatedAt = new Date().toISOString();
  return [
    {
      grainId: 'cc-demo-b2c-1',
      productId: 'prod-cc-demo',
      sku: CONTROL_CENTER_DEMO_SKU,
      locationId: 'WH-DEMO',
      state: 'allocated',
      quantity: 35,
      ownerId: 'brand-demo',
      channelId: 'b2c',
      metadata: { updatedAt, version: 1 },
    },
  ];
}

function computeInventoryAtpForSku(
  grains: InventoryGrain[],
  sku: string,
  tenantId?: string
): { atpB2C: number; atpB2B: number } {
  const atpB2C = grains
    .filter(
      (g) =>
        g.sku === sku &&
        g.state === 'allocated' &&
        g.channelId === 'b2c' &&
        (!tenantId || g.tenantId === tenantId)
    )
    .reduce((acc, g) => acc + g.quantity, 0);

  const atpB2B = calculateATP({
    grains: grains.filter((g) => g.sku === sku),
    channelId: 'b2b',
    tenantId,
    strictIsolation: !!tenantId,
  });

  return { atpB2C, atpB2B };
}

/**
 * Снимок предиктивных рисков для Control Center: тот же `analyzePredictiveRisks`, что и в `aggregateInventoryControl`,
 * с демо-гранулами и входами, дающими читаемый микс факторов (stock-out / congestion / lead time).
 */
export function getControlCenterPredictiveRisks(): RiskFactor[] {
  const grains = buildControlCenterDemoInventoryGrains();
  const { atpB2C, atpB2B } = computeInventoryAtpForSku(grains, CONTROL_CENTER_DEMO_SKU);
  return analyzePredictiveRisks({
    entityId: CONTROL_CENTER_DEMO_SKU,
    historicalLeadTimes: [8, 14, 28],
    currentCongestion: 1.45,
    atp: atpB2C + atpB2B,
    salesVelocity: 15,
  });
}

/**
 * Агрегирует состояние инвентаря в Control Output.
 */
export function aggregateInventoryControl(params: {
  sku: string;
  grains: InventoryGrain[];
  safetyThreshold: number;
  tenantId?: string; // [Phase 2 Prod]
}): ControlOutput {
  const { sku, grains, safetyThreshold, tenantId } = params;
  const risks: ControlOutput['risks'] = [];
  const blockers: ControlOutput['blockers'] = [];
  let status: ControlOutput['status'] = 'healthy';

  const { atpB2C, atpB2B } = computeInventoryAtpForSku(grains, sku, tenantId);

  const rebalance = triggerSmartSwap({
    sku,
    currentB2CAllocated: atpB2C,
    availableB2BOnHand: atpB2B,
    b2cSalesVelocity: 10, // Мок-значение
    b2bSalesVelocity: 5, // Мок-значение
    leadTimeDays: 7, // Мок-значение
    tenantId: tenantId,
  });

  if (rebalance.action === 'allocate') {
    risks.push({
      code: CONTROL_REASON_CODES.INVENTORY_REBALANCE_REQUIRED,
      message: `Требуется ребалансировка для ${sku}: B2C сток (${atpB2C}) ниже порога (${safetyThreshold})`,
      severity: 'medium',
      explainedBy: 'stock_allocation_logic',
    });
    status = 'at_risk';
  }

  if (atpB2C === 0 && atpB2B === 0) {
    risks.push({
      code: CONTROL_REASON_CODES.STOCK_OUT,
      message: `Товар ${sku} полностью отсутствует на складе`,
      severity: 'high',
      explainedBy: 'inventory_ledger',
    });
    status = 'at_risk';
  }

  const lockedGrains = grains.filter(
    (g) => g.sku === sku && g.isLocked && (!tenantId || g.tenantId === tenantId)
  );
  if (lockedGrains.length > 0) {
    blockers.push({
      code: CONTROL_REASON_CODES.GRAIN_LOCKED,
      message: `Заблокировано ${lockedGrains.reduce((acc, g) => acc + g.quantity, 0)} единиц товара ${sku} из-за расхождений`,
      refEntityId: lockedGrains[0].grainId,
    });
    status = 'blocked';
  }

  // [Phase 3 Prod] Интеграция предиктивных рисков
  const predictiveFactors = analyzePredictiveRisks({
    entityId: sku,
    historicalLeadTimes: [7, 8, 10], // Мок
    currentCongestion: 1.1, // Мок
    atp: atpB2C + atpB2B,
    salesVelocity: 15, // Мок
  });

  predictiveFactors.forEach((f) => {
    risks.push({
      code:
        f.type === 'stock_out'
          ? CONTROL_REASON_CODES.PREDICTIVE_STOCKOUT_RISK
          : CONTROL_REASON_CODES.PREDICTIVE_DELAY_RISK,
      message: `[Predictive] ${f.message}`,
      severity: f.severity > 0.7 ? 'high' : 'medium',
      explainedBy: 'predictive_risk_engine',
    });
  });

  return {
    entityId: sku,
    entityType: 'inventory',
    readinessScore: atpB2C >= safetyThreshold ? 100 : 50,
    status,
    blockers,
    risks,
    predictiveRisks: predictiveFactors,
    metadata: {
      asOf: new Date().toISOString(),
      version: 1,
    },
    nextAction:
      rebalance.action === 'allocate'
        ? {
            id: `rebalance-${sku}`,
            type: 'automated',
            label: 'Выполнить ребалансировку стока',
            ownerRole: 'system',
            reasonCode: CONTROL_REASON_CODES.INVENTORY_REBALANCE_REQUIRED,
            sourceEntityId: sku,
          }
        : grains.some((g) => g.sku === sku && g.isLocked)
          ? {
              id: `resolve-lock-${sku}`,
              type: 'manual',
              label: 'Разрешить блокировку остатков (Investigation)',
              ownerRole: 'warehouse_manager',
              reasonCode: CONTROL_REASON_CODES.GRAIN_LOCKED,
              sourceEntityId: sku,
            }
          : undefined,
  };
}

/**
 * Агрегирует состояние заказа в Control Output.
 */
export function aggregateOrderControl(order: OrderAggregate): ControlOutput {
  const risks: ControlOutput['risks'] = [];
  const blockers: ControlOutput['blockers'] = [];
  let status: ControlOutput['status'] = 'healthy';

  if (order.projections.payment === 'overdue') {
    risks.push({
      code: CONTROL_REASON_CODES.PAYMENT_OVERDUE,
      message: 'Оплата просрочена',
      severity: 'high',
      explainedBy: 'payment_projection',
    });
    status = 'at_risk';
  }

  if (order.status === 'pending_approval') {
    status = 'at_risk';
  }

  return {
    entityId: order.id,
    entityType: 'order',
    readinessScore: order.status === 'confirmed' ? 100 : 50,
    status,
    blockers,
    risks,
    metadata: {
      asOf: new Date().toISOString(),
      version: 1,
    },
    nextAction:
      order.status === 'pending_approval'
        ? {
            id: `approve-${order.id}`,
            type: 'manual',
            label: 'Согласовать заказ',
            ownerRole: 'brand',
            reasonCode: CONTROL_REASON_CODES.AWAITING_BRAND_APPROVAL,
            sourceEntityId: order.id,
          }
        : undefined,
  };
}

/**
 * Агрегирует состояние производства в Control Output.
 */
export function aggregateCommitmentControl(commitment: ProductionCommitment): ControlOutput {
  const risks: ControlOutput['risks'] = [];
  const blockers: ControlOutput['blockers'] = [];

  const isDelayed = commitment.dates.confirmed && new Date(commitment.dates.confirmed) < new Date();
  if (isDelayed && commitment.status !== 'completed') {
    risks.push({
      code: CONTROL_REASON_CODES.PRODUCTION_DELAY,
      message: 'Задержка производства',
      severity: 'critical',
      explainedBy: 'schedule_milestone',
    });
  }

  if (commitment.qc?.status === 'failed') {
    blockers.push({
      code: CONTROL_REASON_CODES.QC_FAILED,
      message: 'Контроль качества не пройден',
      refEntityId: commitment.id,
    });
  }

  return {
    entityId: commitment.id,
    entityType: 'commitment',
    readinessScore: commitment.status === 'completed' ? 100 : 70,
    status: blockers.length > 0 ? 'blocked' : risks.length > 0 ? 'at_risk' : 'healthy',
    blockers,
    risks,
    metadata: {
      asOf: new Date().toISOString(),
      version: 1,
      commitmentId: commitment.id,
    },
    nextAction:
      commitment.status === 'in_production'
        ? {
            id: `ship-${commitment.id}`,
            type: 'manual',
            label: 'Зафиксировать отгрузку (Ex-Factory)',
            ownerRole: 'factory',
            reasonCode: CONTROL_REASON_CODES.PRODUCTION_COMPLETED,
            sourceEntityId: commitment.id,
          }
        : commitment.qc?.status === 'failed'
          ? {
              id: `rework-${commitment.id}`,
              type: 'manual',
              label: 'Отправить на доработку',
              ownerRole: 'production_manager',
              reasonCode: CONTROL_REASON_CODES.REWORK_REQUIRED,
              sourceEntityId: commitment.id,
            }
          : undefined,
  };
}

/**
 * Агрегирует состояние артикула в Control Output.
 */
export function aggregateArticleControl(
  article: ArticleAggregate,
  samples: SampleAggregate[]
): ControlOutput {
  const readiness = calculateArticleReadiness(article, samples);
  const risks: ControlOutput['risks'] = readiness.blockers.map((b) => ({
    code: CONTROL_REASON_CODES.ARTICLE_BLOCKER,
    message: b,
    severity: 'critical',
    explainedBy: 'article_readiness',
  }));

  return {
    entityId: article.id,
    entityType: 'article',
    readinessScore: readiness.score,
    status: readiness.isReady ? 'healthy' : 'blocked',
    blockers: readiness.blockers.map((b) => ({
      code: CONTROL_REASON_CODES.ARTICLE_BLOCKER,
      message: b,
      refEntityId: article.id,
    })),
    risks,
    metadata: {
      asOf: new Date().toISOString(),
      version: 1,
    },
    links: article.externalReferences.workshop2Key
      ? {
          dossierUrl: `/brand/production/workshop2?article=${article.id}`,
          techPackUrl: `/brand/production/tech-pack?article=${article.id}`,
        }
      : undefined,
    nextAction:
      readiness.nextActions.length > 0
        ? {
            id: `fix-article-${article.id}`,
            type: 'manual',
            label: readiness.nextActions[0],
            ownerRole: 'designer',
            reasonCode: CONTROL_REASON_CODES.ARTICLE_INCOMPLETE,
            sourceEntityId: article.id,
          }
        : undefined,
  };
}

/**
 * Агрегирует состояние коллекции в Control Output.
 */
export function aggregateCollectionControl(
  collection: CollectionAggregate,
  articles: ArticleAggregate[]
): ControlOutput {
  const readiness = calculateCollectionReadiness(collection, articles);
  const status = readiness.score === 100 ? 'healthy' : readiness.score > 70 ? 'at_risk' : 'blocked';

  return {
    entityId: collection.id,
    entityType: 'collection',
    readinessScore: readiness.score,
    status,
    blockers:
      readiness.score < 100
        ? [
            {
              code: CONTROL_REASON_CODES.COLLECTION_NOT_READY,
              message: `Не все артикулы готовы (${readiness.readyArticles}/${readiness.totalArticles})`,
              refEntityId: collection.id,
            },
          ]
        : [],
    risks: [],
    metadata: {
      asOf: new Date().toISOString(),
      version: 1,
    },
    nextAction:
      readiness.score < 100
        ? {
            id: `finalize-collection-${collection.id}`,
            type: 'manual',
            label: 'Завершить подготовку артикулов',
            ownerRole: 'merchandiser',
            reasonCode: CONTROL_REASON_CODES.COLLECTION_NOT_READY,
            sourceEntityId: collection.id,
          }
        : undefined,
  };
}

/**
 * Агрегирует состояние образца в Control Output.
 */
export function aggregateSampleControl(sample: SampleAggregate): ControlOutput {
  const isReady = isSampleReady(sample);

  return {
    entityId: sample.id,
    entityType: 'sample',
    readinessScore: isReady ? 100 : 50,
    status: isReady ? 'healthy' : sample.status === 'rejected' ? 'blocked' : 'at_risk',
    blockers:
      sample.status === 'rejected'
        ? [
            {
              code: CONTROL_REASON_CODES.SAMPLE_REJECTED,
              message: 'Образец отклонен',
              refEntityId: sample.id,
            },
          ]
        : [],
    risks: [],
    metadata: {
      asOf: new Date().toISOString(),
      version: 1,
    },
    nextAction: !isReady
      ? {
          id: `review-sample-${sample.id}`,
          type: 'manual',
          label:
            sample.status === 'received' ? 'Провести ревью образца' : 'Дождаться получения образца',
          ownerRole: 'technologist',
          reasonCode: CONTROL_REASON_CODES.SAMPLE_PENDING,
          sourceEntityId: sample.id,
        }
      : undefined,
  };
}
