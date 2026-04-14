import { OrderAggregate, calculateOrderFinancials } from './order-aggregate';
import { publishOrderClaimResolved } from './domain-event-factories';

/**
 * [Phase 2 — Order architecture]
 * Канон: docs/domain-model/order.md.
 * Модель рекламации / спора по заказу (Order Claim / Dispute).
 * Claim — это отдельная сущность, связанная с заказом.
 */

export type ClaimType = 'shortage' | 'damage' | 'wrong_item' | 'pricing_error';
export type ClaimStatus = 'open' | 'under_review' | 'approved' | 'rejected' | 'resolved';

export interface OrderClaim {
  id: string;
  orderId: string;
  
  /** Кто инициатор (обычно ритейлер) */
  requestedBy: {
    userId: string;
    organizationId: string;
  };

  type: ClaimType;
  status: ClaimStatus;

  /** Описание проблемы */
  description: string;

  /** Ссылки на конкретные линии заказа */
  affectedLines: Array<{
    lineId: string;
    quantity: number;
    reason?: string;
  }>;

  /** Доказательства (фото, акты) */
  evidence?: Array<{
    type: 'image' | 'document';
    url: string;
  }>;

  /** Финансовое требование (напр. сумма возврата) */
  resolutionRequest?: {
    action: 'refund' | 'replacement' | 'discount';
    amount?: number;
    currency: string;
  };

  /** [Phase 2 Prod] Результат разрешения спора */
  resolution?: {
    action: 'refund' | 'replacement' | 'discount' | 'rejected';
    approvedAmount?: number;
    resolvedAt: string;
    resolvedBy: string;
    comment?: string;
  };

  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
  };
}

/**
 * [Phase 2] Policy: Можно ли открыть спор по заказу?
 * Спор можно открыть только для выполненных или отгруженных заказов.
 */
export function canOpenClaim(orderStatus: string): boolean {
  const eligible = ['shipped', 'delivered', 'Отгружен', 'Доставлен', 'partially_shipped'];
  return eligible.includes(orderStatus);
}

/**
 * Рассчитывает общую сумму претензии по линиям.
 */
export function calculateClaimAmount(claim: OrderClaim, linePrices: Record<string, number>): number {
  return claim.affectedLines.reduce((acc, line) => {
    const price = linePrices[line.lineId] || 0;
    return acc + (price * line.quantity);
  }, 0);
}

/**
 * [Phase 2 Prod] Разрешение спора с автоматическим расчетом финансовых последствий.
 */
export function resolveClaim(params: {
  claim: OrderClaim;
  order: OrderAggregate;
  action: 'refund' | 'replacement' | 'discount' | 'rejected';
  approvedAmount?: number;
  actorId: string;
  comment?: string;
}): { updatedOrder: OrderAggregate; updatedClaim: OrderClaim } {
  const { claim, order, action, approvedAmount, actorId, comment } = params;

  const updatedClaim: OrderClaim = {
    ...claim,
    status: action === 'rejected' ? 'rejected' : 'resolved',
    resolution: {
      action,
      approvedAmount,
      resolvedAt: new Date().toISOString(),
      resolvedBy: actorId,
      comment
    },
    metadata: {
      ...claim.metadata,
      updatedAt: new Date().toISOString(),
      version: claim.metadata.version + 1
    }
  };

  // Применяем эффекты к заказу
  let updatedOrder = applyClaimEffects(order, updatedClaim);

  // Если это скидка или возврат, пересчитываем финансовый след
  if (action === 'discount' || action === 'refund') {
    const currentFinancials = calculateOrderFinancials(updatedOrder);
    const adjustment = approvedAmount || 0;
    
    updatedOrder = {
      ...updatedOrder,
      projections: {
        ...updatedOrder.projections,
        financialImpact: updatedOrder.projections.financialImpact ? {
          ...updatedOrder.projections.financialImpact,
          totalAmountBase: (currentFinancials.totalAmount - adjustment) / (updatedOrder.terms.exchangeRate || 1.0),
          discountAmount: (updatedOrder.projections.financialImpact.discountAmount || 0) + (action === 'discount' ? adjustment : 0),
          refundAmount: (updatedOrder.projections.financialImpact.refundAmount || 0) + (action === 'refund' ? adjustment : 0)
        } : undefined
      }
    };
  }

  void publishOrderClaimResolved({
    aggregateId: claim.id,
    version: updatedClaim.metadata.version,
    payload: {
      orderId: order.id,
      action,
      approvedAmount,
      actorId,
      tenantId: order.participants.tenantId
    }
  });

  return { updatedOrder, updatedClaim };
}

/**
 * Применяет эффекты претензии к проекциям заказа.
 * Если претензия одобрена, она может влиять на paymentStatus (напр. требовать возврата).
 */
export function applyClaimEffects(order: OrderAggregate, claim: OrderClaim): OrderAggregate {
  if (claim.status !== 'approved' && claim.status !== 'resolved') {
    return {
      ...order,
      projections: {
        ...order.projections,
        dispute: claim.status === 'rejected' ? 'none' : 'open'
      }
    };
  }

  const newOrder = { ...order };
  newOrder.projections = {
    ...order.projections,
    dispute: claim.status === 'resolved' ? 'resolved' : 'open'
  };

  // Если одобрен возврат (refund), помечаем проекцию оплаты
  if ((claim.status === 'approved' || claim.status === 'resolved') && 
      (claim.resolutionRequest?.action === 'refund' || claim.resolution?.action === 'refund')) {
    newOrder.projections.payment = 'refunded';
  }

  return newOrder;
}

/**
 * [Phase 2 Prod] Автоматическое создание финансовой корректировки на основе спора.
 * Генерирует объект корректировки для Ledger/ERP.
 */
export function createFinancialAdjustment(params: {
  claim: OrderClaim;
  order: OrderAggregate;
}): { adjustmentId: string; amount: number; currency: string; type: 'credit_note' | 'debit_note' } {
  const { claim, order } = params;
  
  if (claim.status !== 'resolved' || !claim.resolution) {
    throw new Error('Claim must be resolved to create financial adjustment');
  }

  const amount = claim.resolution.approvedAmount || 0;
  const isRefund = claim.resolution.action === 'refund' || claim.resolution.action === 'discount';

  return {
    adjustmentId: `adj-${claim.id}-${Date.now()}`,
    amount,
    currency: order.terms.currency,
    type: isRefund ? 'credit_note' : 'debit_note'
  };
}
