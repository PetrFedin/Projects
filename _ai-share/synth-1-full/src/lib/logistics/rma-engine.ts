export type ReturnReason = 'defective' | 'wrong_size' | 'changed_mind' | 'not_as_described';

export interface ReturnItem {
  sku: string;
  quantity: number;
  reason: ReturnReason;
  condition: 'new' | 'used' | 'damaged';
}

export interface RMAResult {
  rmaId: string;
  orderId: string;
  status: 'approved' | 'rejected' | 'manual_review';
  refundAmount: number;
  restockQuantity: number;
  reworkQuantity: number;
  scrapQuantity: number;
  instructions: string;
}

/**
 * [Phase 8 — Returns Management (RMA) & Reverse Logistics]
 * Управление возвратами от B2C и B2B клиентов.
 * Автоматически принимает решение о судьбе товара (возврат на склад, уценка, утилизация).
 */
export class RMAEngine {
  /**
   * Оформляет заявку на возврат (RMA - Return Merchandise Authorization).
   */
  public static processReturn(
    orderId: string,
    items: ReturnItem[],
    originalOrderTotal: number,
    daysSinceDelivery: number
  ): RMAResult {
    // 1. Проверка сроков возврата (например, 30 дней)
    if (daysSinceDelivery > 30) {
      return {
        rmaId: `rma-${Date.now()}`,
        orderId,
        status: 'rejected',
        refundAmount: 0,
        restockQuantity: 0,
        reworkQuantity: 0,
        scrapQuantity: 0,
        instructions: 'Return window expired (30 days).'
      };
    }

    let refundAmount = 0;
    let restockQuantity = 0;
    let reworkQuantity = 0;
    let scrapQuantity = 0;

    // В реальной системе цена бралась бы из позиций заказа (OrderLineItem)
    // Для демо делим общую сумму на кол-во возвращаемых товаров
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const avgPricePerItem = originalOrderTotal / (totalItems || 1);

    for (const item of items) {
      if (item.condition === 'new') {
        // Товар новый — возвращаем деньги 100% и отправляем на склад (Restock)
        refundAmount += item.quantity * avgPricePerItem;
        restockQuantity += item.quantity;
      } else if (item.condition === 'used' && item.reason === 'defective') {
        // Товар с браком — возвращаем деньги, отправляем на доработку (Rework)
        refundAmount += item.quantity * avgPricePerItem;
        reworkQuantity += item.quantity;
      } else {
        // Товар испорчен покупателем — частичный возврат или отказ, товар в утиль (Scrap)
        refundAmount += item.quantity * (avgPricePerItem * 0.5); // Удержание 50%
        scrapQuantity += item.quantity;
      }
    }

    return {
      rmaId: `rma-${Date.now()}`,
      orderId,
      status: 'approved',
      refundAmount: Math.round(refundAmount * 100) / 100,
      restockQuantity,
      reworkQuantity,
      scrapQuantity,
      instructions: `Please pack the items securely. Restock: ${restockQuantity}, Rework: ${reworkQuantity}, Scrap: ${scrapQuantity}.`
    };
  }
}
