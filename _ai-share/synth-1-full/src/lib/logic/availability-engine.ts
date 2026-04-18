import { ArticleAggregate } from '../article/article-aggregate';
import { OrderAggregate } from '../order/order-aggregate';
import { InventoryGrain, calculateATP } from './inventory-ledger';
import { SizeAvailabilityStatus } from '../types';

/**
 * [Phase 2 — Availability Engine foundation]
 * Канон: docs/domain-model/availability-engine.md.
 * Модель вычисляемой коммерческой проекции продаваемости.
 */

export type AvailabilityStatus =
  | 'NOT_VISIBLE' // Нет права/публикации
  | 'PREVIEW' // Показ без возможности заказа
  | 'PREORDER' // Режим предзаказа
  | 'READY_TO_ORDER' // Можно оформить (B2B/Retail)
  | 'IN_STOCK' // Достаточно ATP
  | 'LIMITED' // Низкий остаток
  | 'ON_HOLD' // Временный запрет (compliance/hold)
  | 'OUT_OF_STOCK'; // Нет в наличии

export interface AvailabilityInput {
  article: ArticleAggregate;
  orders: OrderAggregate[];
  inventoryGrains: InventoryGrain[];
  policy: {
    channelId: 'b2b' | 'b2c' | 'retail';
    lowStockThreshold: number;
    allowPreorder: boolean;
    preorderQuota?: number;
  };
  context?: {
    actorId?: string;
    actorRole?: string;
    sessionId?: string;
    /** [Phase 2 Prod] Приоритет канала (0 - высший) */
    priority?: number;
    /** [Phase 2 Prod] ID арендатора */
    tenantId?: string;
    /** [Phase 2 Prod] Прогнозируемая дата отгрузки (для Lead Time) */
    expectedShipDate?: string;
    /** [Phase 3] Виртуальный пул (для изоляции стока под кампанию/событие) */
    virtualPoolId?: string;
  };
}

export interface LeadTimePolicy {
  baseDays: number;
  bufferDays: number;
  factoryCongestionFactor: number; // 1.0 = normal, 1.5 = busy
}

export function calculateLeadTime(policy: LeadTimePolicy): number {
  return Math.ceil(policy.baseDays * policy.factoryCongestionFactor) + policy.bufferDays;
}

export interface AvailabilityOutput {
  status: AvailabilityStatus;
  riskLevel: 'low' | 'medium' | 'high' | 'blocked';
  reasons: string[];
  nextAction?: string;
  quantityHints: {
    atp: number;
    preorderCap?: number;
    /** [Phase 2 Prod] Расчетное время ожидания */
    leadTimeDays?: number;
  };
  /** Публичный срез для PDP/листингов */
  publicStatus: SizeAvailabilityStatus;
}

/**
 * [Phase 3] Автоматизированная оркестрация цепочки поставок.
 * Ребалансировка стока, управление квотами и приоритетами.
 */
export interface OrchestrationInput {
  sku: string;
  tenantId: string;
  grains: InventoryGrain[];
  orders: OrderAggregate[];
  safetyStock: number;
}

export interface OrchestrationAction {
  type: 'rebalance' | 'quota_adjustment' | 'priority_shift';
  sku: string;
  fromChannel?: string;
  toChannel?: string;
  quantity?: number;
  reason: string;
}

export function orchestrateSupplyChain(input: OrchestrationInput): OrchestrationAction[] {
  const { sku, tenantId, grains, orders, safetyStock } = input;
  const actions: OrchestrationAction[] = [];

  const tenantGrains = grains.filter((g) => g.tenantId === tenantId && g.sku === sku);
  const atpB2C = tenantGrains
    .filter((g) => g.channelId === 'b2c')
    .reduce((acc, g) => acc + g.quantity, 0);
  const atpB2B = tenantGrains
    .filter((g) => g.channelId === 'b2b' || !g.channelId)
    .reduce((acc, g) => acc + g.quantity, 0);

  // 1. Авто-ребалансировка при дефиците в B2C
  if (atpB2C < safetyStock && atpB2B > safetyStock) {
    actions.push({
      type: 'rebalance',
      sku,
      fromChannel: 'b2b',
      toChannel: 'b2c',
      quantity: safetyStock - atpB2C,
      reason: 'B2C stock below safety threshold, B2B has surplus',
    });
  }

  // 2. Управление приоритетами при высоком спросе
  const pendingB2BOrders = orders.filter(
    (o) => o.status === 'pending_approval' && o.mode === 'buy_now'
  ).length;
  if (pendingB2BOrders > 5 && atpB2B < safetyStock * 2) {
    actions.push({
      type: 'priority_shift',
      sku,
      reason: 'High B2B demand detected, shifting fulfillment priority',
    });
  }

  // 3. [Phase 2 Prod] Управление квотами при дефиците
  if (atpB2B < safetyStock && atpB2C < safetyStock) {
    actions.push({
      type: 'quota_adjustment',
      sku,
      reason: 'Critical stock levels in all channels, reducing preorder quotas',
    });
  }

  // 4. [Phase 3 Prod] Предиктивная оркестрация (Lead Time Risk)
  const leadTime = calculateLeadTime({ baseDays: 14, bufferDays: 3, factoryCongestionFactor: 1.2 });
  if (leadTime > 21) {
    actions.push({
      type: 'priority_shift',
      sku,
      reason: `High Lead Time (${leadTime} days) detected, prioritizing existing stock for B2C`,
    });
  }

  return actions;
}

/**
 * [Phase 2] Базовый вычислитель Availability.
 */
export function calculateAvailability(input: AvailabilityInput): AvailabilityOutput {
  const { article, orders, inventoryGrains, policy, context } = input;
  const reasons: string[] = [];
  let riskLevel: AvailabilityOutput['riskLevel'] = 'low';

  // 1. Проверка публикации и готовности артикула
  if (article.status === 'archived' || article.status === 'draft') {
    return {
      status: 'NOT_VISIBLE',
      riskLevel: 'blocked',
      reasons: ['ARTICLE_NOT_PUBLISHED'],
      quantityHints: { atp: 0 },
      publicStatus: 'out_of_stock',
    };
  }

  // 2. Расчет ATP для канала
  const atp = calculateATP({
    grains: inventoryGrains,
    channelId: policy.channelId,
    actorId: context?.actorId,
    actorType:
      context?.actorRole === 'brand' || context?.actorRole === 'shop'
        ? (context.actorRole as 'brand' | 'shop')
        : undefined,
    tenantId: context?.tenantId,
    strictIsolation: !!context?.tenantId,
    agreementId: context?.virtualPoolId, // [Phase 3] Виртуальный пул как соглашение
    safetyStock: policy.channelId === 'b2c' ? 10 : 0, // [Phase 2 Prod] Учет страхового запаса
  });

  // 3. Логика статусов
  let status: AvailabilityStatus = 'OUT_OF_STOCK';
  let publicStatus: SizeAvailabilityStatus = 'out_of_stock';

  if (atp > 0) {
    status = atp < policy.lowStockThreshold ? 'LIMITED' : 'IN_STOCK';
    publicStatus = 'in_stock';

    if (atp < policy.lowStockThreshold) {
      riskLevel = 'medium';
      reasons.push('LOW_STOCK');
    }
  } else if (policy.allowPreorder) {
    // 3.1. Проверка квот предзаказа
    const currentPreorders = orders
      .filter((o) => o.mode === 'pre_order' && o.status !== 'cancelled')
      .reduce((acc, o) => acc + o.lines.reduce((lAcc, l) => lAcc + l.quantity, 0), 0);

    if (policy.preorderQuota && currentPreorders >= policy.preorderQuota) {
      status = 'OUT_OF_STOCK';
      publicStatus = 'out_of_stock';
      reasons.push('PREORDER_QUOTA_EXCEEDED');
      riskLevel = 'high';
    } else {
      status = 'PREORDER';
      publicStatus = 'pre_order';
      reasons.push('STOCK_OUT_PREORDER_ENABLED');

      if (policy.preorderQuota && currentPreorders > policy.preorderQuota * 0.8) {
        riskLevel = 'medium';
        reasons.push('PREORDER_QUOTA_LOW');
      }
    }
  }

  // 4. Compliance Hold (КИЗ)
  const hasComplianceHold = inventoryGrains.some((g) => g.complianceConstrained);
  if (hasComplianceHold && atp === 0 && status !== 'PREORDER') {
    status = 'ON_HOLD';
    riskLevel = 'high';
    reasons.push('COMPLIANCE_HOLD');
  }

  return {
    status,
    riskLevel,
    reasons,
    quantityHints: {
      atp,
      preorderCap: policy.preorderQuota
        ? Math.max(
            0,
            policy.preorderQuota -
              orders
                .filter((o) => o.mode === 'pre_order' && o.status !== 'cancelled')
                .reduce((acc, o) => acc + o.lines.reduce((lAcc, l) => lAcc + l.quantity, 0), 0)
          )
        : undefined,
      /** [Phase 2 Prod] Расчетное время ожидания */
      leadTimeDays: context?.expectedShipDate
        ? undefined
        : calculateLeadTime({ baseDays: 14, bufferDays: 3, factoryCongestionFactor: 1.1 }),
    },
    publicStatus,
  };
}
