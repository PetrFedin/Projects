import { ControlInvalidationEventTypes } from '@/lib/contracts';
import {
  ControlOutput,
  aggregateOrderControl,
  aggregateArticleControl,
} from './control-aggregator';
import {
  saveControlRecord,
  getControlRecordByEntity,
  generateInputsHash,
  ControlRecord,
} from './control-storage';
import { OrderAggregate } from '../order/order-aggregate';
import { ArticleAggregate } from '../article/article-aggregate';
import { InventoryGrain } from '../logic/inventory-ledger';

/**
 * [Phase 2 — Control Triggers & Invalidation]
 * Канон: docs/domain-model/control-contracts.md.
 * Подписка на события доменных сущностей для пересчета сигналов.
 */

export type DomainEvent =
  | { type: typeof ControlInvalidationEventTypes.orderStateChanged; order: OrderAggregate }
  | { type: typeof ControlInvalidationEventTypes.articleChanged; article: ArticleAggregate }
  | {
      type: typeof ControlInvalidationEventTypes.inventoryBalanceChanged;
      grains: InventoryGrain[];
      articleId: string;
    }
  | {
      type: typeof ControlInvalidationEventTypes.commitmentUpdated;
      commitmentId: string;
      articleId: string;
    };

/**
 * [Phase 2] Обработчик доменных событий для инвалидации и пересчета Control.
 */
export async function handleDomainEvent(event: DomainEvent): Promise<void> {
  const timestamp = new Date().toISOString();

  switch (event.type) {
    case ControlInvalidationEventTypes.orderStateChanged: {
      const { order } = event;
      const hash = generateInputsHash(order);
      const existing = getControlRecordByEntity(order.id);

      if (existing && existing.metadata.inputsHash === hash) return; // Нет изменений

      const output = aggregateOrderControl(order);
      saveControlRecord({
        id: `CTRL-ORD-${order.id}-${Date.now()}`,
        entityId: order.id,
        entityType: 'order',
        output,
        status: 'active',
        metadata: { createdAt: timestamp, updatedAt: timestamp, inputsHash: hash },
      });
      break;
    }

    case ControlInvalidationEventTypes.articleChanged: {
      const { article } = event;
      const hash = generateInputsHash(article);
      const existing = getControlRecordByEntity(article.id);

      if (existing && existing.metadata.inputsHash === hash) return;

      const output = aggregateArticleControl(article, []); // В демо без сэмплов
      saveControlRecord({
        id: `CTRL-ART-${article.id}-${Date.now()}`,
        entityId: article.id,
        entityType: 'article',
        output,
        status: 'active',
        metadata: { createdAt: timestamp, updatedAt: timestamp, inputsHash: hash },
      });
      break;
    }

    case ControlInvalidationEventTypes.inventoryBalanceChanged: {
      // При изменении стока пересчитываем связанные артикулы
      const { articleId, grains } = event;
      // В реальной системе здесь был бы вызов aggregateArticleControl с актуальным стоком
      console.log(
        `[Control] Invalidation triggered for article ${articleId} due to inventory change`
      );
      break;
    }
  }
}
