import { OrderAggregate, OrderAggregateFactory } from './order-aggregate';
import { SmartBillingEngine } from '../finance/smart-billing';
import { publishControlRiskAlert } from './domain-event-factories';

export interface B2BSubscription {
  id: string;
  clientId: string;
  sku: string;
  quantity: number;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  nextRunDate: string; // ISO Date
  status: 'active' | 'paused' | 'cancelled';
  pricePerUnit: number;
}

/**
 * [Phase 11 — B2B Subscription & Recurring Replenishment]
 * Движок авто-пополнения для оптовых клиентов (Подписки).
 * Генерирует заказы по расписанию, проверяя кредитные лимиты и наличие стока.
 */
export class SubscriptionEngine {
  // Мок-база подписок
  private static subscriptions: B2BSubscription[] = [
    {
      id: 'sub-01',
      clientId: 'client-a',
      sku: 'SKU-BASIC-TEE',
      quantity: 1000,
      frequency: 'monthly',
      nextRunDate: new Date().toISOString().split('T')[0], // Сегодня
      status: 'active',
      pricePerUnit: 15.0
    }
  ];

  /**
   * Запускается по Cron (каждый день) и обрабатывает подписки,
   * у которых nextRunDate <= today.
   */
  public static async processSubscriptions(currentDateStr: string): Promise<OrderAggregate[]> {
    const generatedOrders: OrderAggregate[] = [];
    const activeSubs = this.subscriptions.filter(s => s.status === 'active' && s.nextRunDate <= currentDateStr);

    console.log(`[SubscriptionEngine] Processing ${activeSubs.length} subscriptions for ${currentDateStr}...`);

    for (const sub of activeSubs) {
      // 1. Проверка кредитного лимита (Интеграция со Smart Billing)
      const orderAmount = sub.quantity * sub.pricePerUnit;
      const billingCheck = SmartBillingEngine.checkCreditLimit(sub.clientId, orderAmount);

      if (!billingCheck.allowed) {
        console.warn(`[SubscriptionEngine] Subscription ${sub.id} skipped: ${billingCheck.reason}`);
        
        // Отправляем алерт в Control Layer
        void publishControlRiskAlert({
          aggregateId: sub.clientId,
          aggregateType: 'control',
          version: 1,
          eventIdPrefix: 'sub-fail',
          payload: {
            riskLevel: 'high',
            factors: [`Subscription ${sub.id} failed: ${billingCheck.reason}`],
            autoCreateInteraction: true
          }
        });
        
        continue;
      }

      // 2. Генерация заказа (Черновик)
      const orderId = `ord-sub-${Date.now()}`;
      const newOrder = OrderAggregateFactory.create({
        id: orderId,
        status: 'draft',
        participants: {
          brandId: 'brand-1',
          buyerAccountId: sub.clientId
        },
        lines: [{
          productId: sub.sku.split(':')[0],
          size: sub.sku.split(':')[1] || 'OS',
          quantity: sub.quantity,
          price: sub.pricePerUnit
        }],
        projections: {
          payment: 'pending',
          fulfillment: 'not_started'
        },
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
          source: 'api'
        }
      });

      generatedOrders.push(newOrder);

      // 3. Обновление даты следующего запуска
      const nextDate = new Date(sub.nextRunDate);
      if (sub.frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
      else if (sub.frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
      else if (sub.frequency === 'quarterly') nextDate.setMonth(nextDate.getMonth() + 3);
      
      sub.nextRunDate = nextDate.toISOString().split('T')[0];
      
      console.log(`[SubscriptionEngine] Generated order ${orderId} for subscription ${sub.id}. Next run: ${sub.nextRunDate}`);
    }

    return generatedOrders;
  }
}
