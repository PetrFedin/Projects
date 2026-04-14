import type { B2BOrder, B2BOrderPaymentStatus } from '@/lib/types';
import type { B2BOrderLineItem, B2BOrderMode, B2BOrderPayload } from './b2b-order-payload';
import { OrderAggregateSchema, type OrderAggregateOutput } from './order-schemas';
import {
  publishOrderConfirmed,
  publishOrderPartialCancelled,
  publishOrderShipped,
} from './domain-event-factories';
import { validateOrder } from './order-validation';
import { InventoryGrain } from '../logic/inventory-ledger';

/**
 * [Phase 2 — Order architecture]
 * Полная модель агрегата Order (Commercial Aggregate).
 */
export type OrderAggregate = OrderAggregateOutput;

export type OrderCommercialStatus = OrderAggregate['status'];
export type OrderPaymentStatus = OrderAggregate['projections']['payment'];
export type OrderFulfillmentStatus = OrderAggregate['projections']['fulfillment'];

/**
 * Проекция агрегата для списка (List DTO).
 * Соответствует OperationalOrderListRowDto.
 */
export interface OrderListProjection {
  wholesaleOrderId: string;
  status: string;
  shop: string;
  brand: string;
  amount: string;
  date: string;
  deliveryDate: string;
  paymentStatus?: B2BOrderPaymentStatus;
  paidAmount?: number;
}

/**
 * Маппинг из legacy B2BOrder в новый Aggregate (для demo-совместимости).
 */
export function mapLegacyToAggregate(o: B2BOrder, items: B2BOrderLineItem[]): OrderAggregate {
  return {
    id: o.order,
    participants: {
      brandId: o.brand,
      buyerAccountId: o.shop,
    },
    status: mapLegacyStatus(o.status),
    mode: o.orderMode || 'buy_now',
    terms: {
      currency: 'RUB',
      priceTier: o.priceTier,
    },
    lines: items,
    context: {
      eventId: o.eventId,
      passportSlotId: o.passportSlotId,
    },
    projections: {
      payment: (o.paymentStatus as any) || 'pending',
      fulfillment: o.status === 'Отгружен' ? 'shipped' : 'not_started',
    },
    metadata: {
      createdAt: o.date,
      updatedAt: o.date,
      version: 1,
      source: 'web_ui',
      /** [Phase 2 Prod] Снапшот аудита для версии 1 */
      auditLog: [{
        version: 1,
        timestamp: o.date,
        actorId: 'system',
        action: 'IMPORT',
        changes: { status: 'imported' }
      }]
    },
    notes: {},
  };
}

/**
 * [Phase 2] Фабричные методы для создания агрегата с защитой инвариантов.
 */
export const OrderAggregateFactory = {
  /**
   * Создает новый агрегат заказа из Quote/Payload с валидацией стока и условий.
   */
  createFromPayload(params: {
    payload: B2BOrderPayload;
    brandId: string;
    buyerAccountId: string;
    inventoryGrains: InventoryGrain[];
    priceListId?: string;
    shipWindowId?: string;
    agreementId?: string; // [Phase 2 Prod]
    tenantId?: string; // [Phase 2 Prod]
  }): { order?: OrderAggregate; errors?: any[] } {
    const { payload, brandId, buyerAccountId, inventoryGrains, priceListId, shipWindowId, agreementId, tenantId } = params;

    const order: OrderAggregate = {
      id: `order-${Date.now()}`,
      participants: { brandId, buyerAccountId, tenantId },
      status: 'pending_approval',
      mode: payload.orderMode,
      terms: {
        currency: payload.currency || 'RUB',
        priceListId,
      },
      lines: payload.items,
      context: {
        agreementId,
        shipWindowId,
      },
      projections: {
        payment: 'pending',
        fulfillment: 'not_started',
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        source: 'web_ui',
        /** [Phase 3] Инициализация контрольных ворот */
        gates: [
          { id: `gate-brand-${Date.now()}`, role: 'brand', status: 'pending' as const, required: true, label: 'Brand Approval' },
          { id: `gate-shop-${Date.now()}`, role: 'shop', status: 'pending' as const, required: true, label: 'Partner Confirmation' },
          { id: `gate-factory-${Date.now()}`, role: 'factory', status: 'pending' as const, required: false, label: 'Production Readiness' },
          { id: `gate-logistics-${Date.now()}`, role: 'logistics', status: 'pending' as const, required: false, label: 'Logistics Capacity' }
        ]
      },
      notes: {
        orderNotes: payload.orderNotes,
      },
    };

    // Защита инвариантов: валидация стока и правил
    const validation = validateOrder({
      order,
      inventoryGrains,
    });

    if (!validation.isValid) {
      return { errors: validation.errors };
    }

    return { order };
  },

  /**
   * Создает новый заказ из черновика или корзины.
   * Проверяет наличие обязательных участников и линий.
   */
  create(params: Partial<OrderAggregate>): OrderAggregate {
    if (!params.participants?.brandId || !params.participants?.buyerAccountId) {
      throw new Error('Order must have both brand and buyer participants');
    }
    if (!params.lines || params.lines.length === 0) {
      throw new Error('Order must have at least one line item');
    }

    return {
      id: params.id || `ord-${Date.now()}`,
      participants: params.participants as any,
      status: params.status || 'draft',
      projections: params.projections || {
        payment: 'pending',
        fulfillment: 'not_started',
      },
      mode: params.mode || 'buy_now',
      terms: params.terms || { currency: 'RUB' },
      lines: params.lines,
      context: params.context || {},
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        source: params.metadata?.source || 'web_ui',
      },
      notes: params.notes || {},
    };
  },

  /**
   * Переводит заказ в статус "confirmed" только если оплата не просрочена
   * и все инварианты (сток, MOQ) соблюдены.
   */
  confirm(params: {
    order: OrderAggregate;
    actorId: string;
    inventoryGrains: InventoryGrain[];
    moqRules?: Record<string, number>;
    packRules?: Record<string, number>;
    strictIsolation?: boolean;
  }): { order?: OrderAggregate; errors?: any[] } {
    const { order, actorId, inventoryGrains, moqRules, packRules, strictIsolation = true } = params;

    if (order.projections.payment === 'overdue') {
      return { errors: [{ code: 'PAYMENT_OVERDUE', message: 'Cannot confirm order with overdue payment' }] };
    }

    // [Phase 3] Автоматическое закрытие ворот при подтверждении (если актор имеет права)
    // В реальной системе это происходит через отдельные методы approveGate()
    const updatedGates = order.metadata.gates?.map(g => {
      if (g.status === 'pending' && (
        (g.role === 'brand' && actorId.includes('brand')) || 
        (g.role === 'shop' && actorId.includes('shop')) ||
        (g.role === 'factory' && actorId.includes('factory')) ||
        (g.role === 'logistics' && actorId.includes('logistics'))
      )) {
        return { ...g, status: 'approved' as const, actorId, timestamp: new Date().toISOString() };
      }
      return g;
    });

    const orderWithUpdatedGates = {
      ...order,
      metadata: { ...order.metadata, gates: updatedGates }
    };

    // Защита инвариантов перед подтверждением
    const validation = validateOrder({
      order: orderWithUpdatedGates,
      inventoryGrains,
      moqRules,
      packRules,
      strictIsolation,
    });

    if (!validation.isValid) {
      return { errors: validation.errors };
    }

    const financials = calculateOrderFinancials(orderWithUpdatedGates);

    const confirmedOrder: OrderAggregate = {
      ...orderWithUpdatedGates,
      status: 'confirmed' as const,
      projections: {
        ...orderWithUpdatedGates.projections,
        financialImpact: {
          totalAmountBase: financials.totalAmountBase,
          exchangeRate: financials.exchangeRate,
          currency: order.terms.currency,
          taxAmount: financials.taxAmount,
          discountAmount: financials.discount,
        }
      },
      metadata: {
        ...orderWithUpdatedGates.metadata,
        updatedAt: new Date().toISOString(),
        version: order.metadata.version + 1,
        /** [Phase 2 Prod] Добавление записи в аудит-лог */
        auditLog: [
          ...(order.metadata.auditLog || []),
          {
            version: order.metadata.version + 1,
            timestamp: new Date().toISOString(),
            actorId,
            action: 'CONFIRM',
            changes: { status: 'confirmed', gates: updatedGates, financialImpact: true }
          }
        ]
      },
    };

    // Публикуем событие домена ([Phase 62] через фабрику + Zod)
    void publishOrderConfirmed({
      aggregateId: order.id,
      version: confirmedOrder.metadata.version,
      payload: {
        confirmedBy: actorId,
        totalAmount: financials.totalAmount,
        totalAmountBase: financials.totalAmountBase,
        currency: order.terms.currency,
        exchangeRate: financials.exchangeRate,
        tenantId: order.participants.tenantId
      },
    });

    return { order: confirmedOrder };
  },

  /**
   * [Phase 2 Prod] Частичная отгрузка заказа.
   * Переводит часть линий в статус 'shipped' в Ledger и обновляет проекцию отгрузки.
   */
  partialShip(params: {
    order: OrderAggregate;
    shipLines: Array<{ productId: string; size: string; quantity: number }>;
    actorId: string;
  }): { order: OrderAggregate } {
    const { order, shipLines, actorId } = params;

    const updatedOrder: OrderAggregate = {
      ...order,
      projections: {
        ...order.projections,
        fulfillment: 'partially_shipped' as const
      },
      metadata: {
        ...order.metadata,
        version: order.metadata.version + 1,
        updatedAt: new Date().toISOString(),
        auditLog: [
          ...(order.metadata.auditLog || []),
          {
            version: order.metadata.version + 1,
            timestamp: new Date().toISOString(),
            actorId,
            action: 'PARTIAL_SHIP',
            changes: { shipLines }
          }
        ]
      }
    };

    // Генерируем событие для Ledger (списание из резерва в shipped)
    void publishOrderShipped({
      aggregateId: order.id,
      version: updatedOrder.metadata.version,
      payload: {
        orderId: order.id,
        shipLines,
        actorId,
        tenantId: order.participants.tenantId
      }
    });

    return { order: updatedOrder };
  },

  /**
   * [Phase 2 Prod] Частичная отмена заказа.
   * Уменьшает количество в линиях и автоматически освобождает резерв в Ledger.
   */
  partialCancel(params: {
    order: OrderAggregate;
    cancelLines: Array<{ productId: string; size: string; quantity: number }>;
    actorId: string;
    reason: string;
  }): { order: OrderAggregate; releasedGrains: Array<{ productId: string; size: string; quantity: number }> } {
    const { order, cancelLines, actorId, reason } = params;
    
    const updatedLines = order.lines.map(line => {
      const cancelRequest = cancelLines.find(cl => cl.productId === line.productId && cl.size === line.size);
      if (cancelRequest) {
        const newQuantity = Math.max(0, line.quantity - cancelRequest.quantity);
        return { ...line, quantity: newQuantity };
      }
      return line;
    });

    const updatedOrder: OrderAggregate = {
      ...order,
      lines: updatedLines,
      metadata: {
        ...order.metadata,
        version: order.metadata.version + 1,
        updatedAt: new Date().toISOString(),
        auditLog: [
          ...(order.metadata.auditLog || []),
          {
            version: order.metadata.version + 1,
            timestamp: new Date().toISOString(),
            actorId,
            action: 'PARTIAL_CANCEL',
            changes: { cancelLines, reason }
          }
        ]
      }
    };

    // Генерируем событие для Ledger (restocking)
    void publishOrderPartialCancelled({
      aggregateId: order.id,
      version: updatedOrder.metadata.version,
      payload: {
        orderId: order.id,
        cancelLines,
        actorId,
        tenantId: order.participants.tenantId
      }
    });

    return { 
      order: updatedOrder, 
      releasedGrains: cancelLines
    };
  }
};

/**
 * [Phase 2 Prod] Расчет финансовых показателей заказа.
 */
export function calculateOrderFinancials(order: OrderAggregate) {
  const subtotal = order.lines.reduce((acc, l) => acc + l.price * l.quantity, 0);
  const discount = order.terms.discountPercent ? subtotal * (order.terms.discountPercent / 100) : 0;
  const taxRate = order.terms.taxRate || 0;
  const taxAmount = (subtotal - discount) * taxRate;
  const totalAmount = subtotal - discount + taxAmount;

  // [Phase 2 Prod] Конвертация в базовую валюту (напр. USD для аналитики)
  const exchangeRate = order.terms.exchangeRate || 1.0;
  const totalAmountBase = totalAmount / exchangeRate;

  // [Phase 2 Prod] Расчет налогов по юрисдикции
  const jurisdictionTax = order.terms.taxJurisdiction === 'EU' ? 0.21 : (order.terms.taxJurisdiction === 'US' ? 0.08 : taxRate);
  const adjustedTaxAmount = (subtotal - discount) * jurisdictionTax;
  const adjustedTotalAmount = subtotal - discount + adjustedTaxAmount;

  return {
    subtotal,
    discount,
    taxAmount: adjustedTaxAmount,
    totalAmount: adjustedTotalAmount,
    totalAmountBase: adjustedTotalAmount / exchangeRate,
    currency: order.terms.currency,
    exchangeRate,
    taxJurisdiction: order.terms.taxJurisdiction
  };
}

/**
 * [Phase 2 Prod] Определение налоговой юрисдикции и ставки.
 */
export function getTaxRateForJurisdiction(params: {
  brandCountry: string;
  buyerCountry: string;
  isExport: boolean;
}): number {
  const { brandCountry, buyerCountry, isExport } = params;
  
  if (isExport) return 0; // 0% VAT for export
  
  // Упрощенная логика для Phase 2
  if (brandCountry === 'RU' && buyerCountry === 'RU') return 0.20; // 20% VAT
  if (brandCountry === 'US') return 0.08; // 8% Sales Tax (avg)
  
  return 0;
}

function mapLegacyStatus(status: string): OrderCommercialStatus {
  switch (status) {
    case 'Черновик': return 'draft';
    case 'На проверке': return 'pending_approval';
    case 'Согласован': return 'confirmed';
    case 'Подтверждён': return 'confirmed';
    case 'Отменён': return 'cancelled';
    default: return 'confirmed';
  }
}
