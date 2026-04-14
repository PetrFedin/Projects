import { DomainEvent } from '../production/execution-linkage';
import { DomainEventTypes } from './domain-event-catalog';

export type { DomainEvent };

/**
 * [Phase 2 — Domain Events]
 * Базовая инфраструктура для событий домена.
 * Позволяет decoupled-модулям (напр. Control Layer) реагировать на изменения.
 */

export type QCUpdatedEvent = DomainEvent & {
  aggregateType: 'production';
  type: typeof DomainEventTypes.production.qcUpdated;
  payload: {
    gateId: string;
    status: string;
    defectsFound: number;
  };
};

export type RiskAlertEvent = DomainEvent & {
  aggregateType: 'control';
  type: typeof DomainEventTypes.control.riskAlert;
  payload: {
    riskLevel: string;
    factors: string[];
  };
};

export type WasteGeneratedEvent = DomainEvent & {
  aggregateType: 'production';
  type: typeof DomainEventTypes.production.wasteGenerated;
  payload: {
    wasteId: string;
    locationId: string;
    materialType: 'cotton_scraps' | 'polyester_blend' | 'cardboard_offcuts' | 'defective_garments' | 'chemical_dye';
    weightKg: number;
    purityPercentage: number;
  };
};

export type SentimentSpikeEvent = DomainEvent & {
  aggregateType: 'marketing';
  type: typeof DomainEventTypes.marketing.sentimentSpike;
  payload: {
    region: string;
    topic: string;
    valence: number;
    arousal: number;
    volume: number;
  };
};

export type OrderConfirmedEvent = DomainEvent & {
  aggregateType: 'order';
  type: typeof DomainEventTypes.order.confirmed;
  payload: {
    confirmedBy: string;
    totalAmount: number;
    totalAmountBase?: number;
    currency: string;
    exchangeRate?: number;
    tenantId?: string;
  };
};

export type ArticleReadyEvent = DomainEvent & {
  aggregateType: 'article';
  type: typeof DomainEventTypes.article.readyForProduction;
  payload: {
    collectionId: string;
    readinessScore: number;
  };
};

export type CycleCountCompletedEvent = DomainEvent & {
  aggregateType: 'inventory';
  type: typeof DomainEventTypes.inventory.cycleCountCompleted;
  payload: {
    locationId: string;
    newQuantity: number;
    actorId: string;
    reason: string;
    tenantId?: string;
  };
};

export type ReconciliationCompletedEvent = DomainEvent & {
  aggregateType: 'inventory';
  type: typeof DomainEventTypes.inventory.reconciliationCompleted;
  payload: {
    locationId: string;
    discrepancy: number;
    actionTaken: 'adjusted' | 'locked' | 'flagged';
    actorId: string;
    tenantId: string;
  };
};

export type GrainUnlockedEvent = DomainEvent & {
  aggregateType: 'inventory';
  type: typeof DomainEventTypes.inventory.grainUnlocked;
  payload: {
    grainId: string;
    actorId: string;
    reason: string;
    tenantId?: string;
  };
};

export type CustomerReturnProcessedEvent = DomainEvent & {
  aggregateType: 'inventory';
  type: typeof DomainEventTypes.inventory.customerReturnProcessed;
  payload: {
    locationId: string;
    quantity: number;
    condition: 'resellable' | 'damaged';
    actorId: string;
    tenantId: string;
  };
};

export type OrderClaimResolvedEvent = DomainEvent & {
  aggregateType: 'order';
  type: typeof DomainEventTypes.order.claimResolved;
  payload: {
    orderId: string;
    action: string;
    approvedAmount?: number;
    actorId: string;
    tenantId?: string;
  };
};

export type ChannelTransferCompletedEvent = DomainEvent & {
  aggregateType: 'inventory';
  type: typeof DomainEventTypes.inventory.channelTransferCompleted;
  payload: {
    locationId: string;
    quantity: number;
    fromChannel: string;
    toChannel: string;
    financialImpact: number;
    actorId: string;
    tenantId: string;
    agreementId?: string;
  };
};

export type OwnershipTransferredEvent = DomainEvent & {
  aggregateType: 'inventory';
  type: typeof DomainEventTypes.inventory.ownershipTransferred;
  payload: {
    locationId: string;
    quantity: number;
    fromOwnerId: string;
    toOwnerId: string;
    settlementAmount: number;
    actorId: string;
    tenantId: string;
    agreementId?: string;
  };
};

export type ReservationExpiredEvent = DomainEvent & {
  aggregateType: 'inventory';
  type: typeof DomainEventTypes.inventory.reservationExpired;
  payload: {
    grainId: string;
    sku: string;
    quantity: number;
    ownerId: string;
    tenantId?: string;
  };
};

export type B2B2CAllocationCompletedEvent = DomainEvent & {
  aggregateType: 'inventory';
  type: typeof DomainEventTypes.inventory.b2b2cAllocationCompleted;
  payload: {
    parentGrainId: string;
    targetChannelId: string;
    quantity: number;
    actorId: string;
    tenantId: string;
  };
};

export type OrderPartialCancelledEvent = DomainEvent & {
  aggregateType: 'order';
  type: typeof DomainEventTypes.order.partialCancelled;
  payload: {
    orderId: string;
    cancelLines: Array<{ productId: string; size: string; quantity: number }>;
    actorId: string;
    tenantId?: string;
  };
};

export type OrderShippedEvent = DomainEvent & {
  aggregateType: 'order';
  type: typeof DomainEventTypes.order.shipped;
  payload: {
    orderId: string;
    shipLines: Array<{ productId: string; size: string; quantity: number }>;
    actorId: string;
    tenantId?: string;
  };
};

export type StockReservedEvent = DomainEvent & {
  aggregateType: 'inventory';
  type: typeof DomainEventTypes.inventory.stockReserved;
  payload: {
    sku: string;
    quantity: number;
    locationId: string;
    ttlSeconds: number;
  };
};

export type StockLowEvent = DomainEvent & {
  aggregateType: 'inventory';
  type: typeof DomainEventTypes.inventory.stockLow;
  payload: {
    sku: string;
    currentAtp: number;
    threshold: number;
    suggestedReplenishment: number;
  };
};

export type GlobalAnomalyDetectedEvent = DomainEvent & {
  aggregateType: 'system';
  type: typeof DomainEventTypes.system.globalAnomalyDetected;
  payload: {
    targetEventId: string;
    targetEventType: string;
    targetAggregate: string;
    anomalyScore: number;
    confidence: number;
    detectedPatterns: string[];
    recommendedAction: 'ignore' | 'investigate' | 'quarantine';
  };
};

export type InventorySnapshotCreatedEvent = DomainEvent & {
  aggregateType: 'inventory';
  type: typeof DomainEventTypes.inventory.snapshotCreated;
  payload: {
    snapshotId: string;
    grainCount: number;
    actorId: string;
    reason: string;
  };
};

/**
 * Простая шина событий для использования внутри приложения (in-memory).
 * [Phase 3] Добавлена поддержка RetryPolicy и Dead Letter Queue (DLQ).
 * [Phase 17] Добавлен Circuit Breaker и защита от утечек памяти (WeakRef mock).
 */
class DomainEventBus {
  private static instance: DomainEventBus;
  private subscribers: Map<string, ((event: any) => Promise<void> | void)[]> = new Map();
  private dlq: Array<{ event: DomainEvent; error: any; failedAt: string }> = [];
  private eventStore: Array<DomainEvent> = []; // [Phase 2 Prod] Simulated Persistent Store
  private readonly MAX_DLQ_SIZE = 1000; // Защита от OOM
  private readonly MAX_STORE_SIZE = 5000; // Защита от OOM

  // Circuit Breaker State
  private circuitOpen = false;
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly FAILURE_THRESHOLD = 5;
  private readonly RESET_TIMEOUT_MS = 30000; // 30 seconds

  // [Phase 51] Пакетная обработка событий (Event Batching)
  private batchQueue: DomainEvent[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private readonly BATCH_DELAY_MS = 50; // Задержка для накопления событий
  private readonly MAX_BATCH_SIZE = 100; // Максимальный размер пакета

  // [Phase 57] Глобальные перехватчики (для Anomaly Engine)
  private globalInterceptors: ((event: DomainEvent) => void)[] = [];

  private constructor() {}

  public static getInstance(): DomainEventBus {
    if (!DomainEventBus.instance) {
      DomainEventBus.instance = new DomainEventBus();
    }
    return DomainEventBus.instance;
  }

  /**
   * [Phase 51] Публикует событие через пакетную очередь (Debouncing/Batching).
   * Полезно для высокочастотных событий (например, от нейроморфных сенсоров).
   */
  public publishBatched(event: DomainEvent): void {
    if (!this.validateEvent(event)) {
      console.error(`[DomainEventBus] CRITICAL: Invalid event structure rejected in batch:`, event);
      this.addToDLQ(event, 'Validation Failed: Invalid Event Structure');
      return;
    }

    this.batchQueue.push(event);

    if (this.batchQueue.length >= this.MAX_BATCH_SIZE) {
      this.flushBatch();
    } else if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => this.flushBatch(), this.BATCH_DELAY_MS);
    }
  }

  /**
   * [Phase 51] Мгновенно публикует все накопленные в пакете события.
   */
  private async flushBatch(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    if (this.batchQueue.length === 0) return;

    const batch = [...this.batchQueue];
    this.batchQueue = [];

    console.log(`[DomainEventBus] Flushing batch of ${batch.length} events...`);
    
    // Публикуем события параллельно для скорости, но с учетом Circuit Breaker
    await Promise.allSettled(batch.map(event => this.publish(event)));
  }

  /**
   * [Phase 45] Строгая валидация структуры события (Runtime Type Checking).
   * Предотвращает "отравление" шины некорректными данными.
   */
  private validateEvent(event: any): boolean {
    if (!event) return false;
    if (typeof event.eventId !== 'string' || !event.eventId.trim()) return false;
    if (typeof event.occurredAt !== 'string' || isNaN(Date.parse(event.occurredAt))) return false;
    if (typeof event.aggregateId !== 'string' || !event.aggregateId.trim()) return false;
    if (typeof event.aggregateType !== 'string' || !event.aggregateType.trim()) return false;
    if (typeof event.payload !== 'object' || event.payload === null) return false;
    return true;
  }

  /** Запись в store и глобальные перехватчики — общий префикс для publish / publishUrgent. */
  private persistAndRunInterceptors(event: DomainEvent): void {
    this.persistEvent(event);
    this.globalInterceptors.forEach((interceptor) => {
      try {
        interceptor(event);
      } catch (e) {
        console.error('Interceptor error:', e);
      }
    });
  }

  private resolveEventType(event: DomainEvent): string {
    return (event as any).type || event.aggregateType;
  }

  private collectHandlers(
    eventType: string,
    aggregateType: string
  ): Array<(event: any) => Promise<void> | void> {
    const handlers = this.subscribers.get(eventType) || [];
    const aggregateHandlers = this.subscribers.get(aggregateType) || [];
    return [...handlers, ...aggregateHandlers];
  }

  /**
   * [Phase 56] Экстренная публикация события (Priority Queue).
   * Обходит пакетную обработку (Batching) и Circuit Breaker.
   * Используется только для критических системных алертов (распад вакуума, коллапс тессеракта).
   */
  public async publishUrgent(event: DomainEvent): Promise<void> {
    if (!this.validateEvent(event)) {
      console.error(`[DomainEventBus] CRITICAL: Invalid urgent event structure rejected:`, event);
      this.addToDLQ(event, 'Validation Failed: Invalid Event Structure');
      return;
    }

    this.persistAndRunInterceptors(event);
    const eventType = this.resolveEventType(event);
    const allHandlers = this.collectHandlers(eventType, event.aggregateType);

    console.warn(`[DomainEventBus] URGENT PUBLISH: ${eventType}`, event);

    // Выполняем немедленно, игнорируя Circuit Breaker и Retry Policy (чтобы не блокировать поток)
    await Promise.allSettled(allHandlers.map(handler => handler(event)));
  }

  /**
   * Публикует событие с механизмом повторных попыток (RetryPolicy) и Circuit Breaker.
   */
  public async publish(event: DomainEvent, maxRetries: number = 3): Promise<void> {
    // [Phase 45] Валидация события перед публикацией
    if (!this.validateEvent(event)) {
      console.error(`[DomainEventBus] CRITICAL: Invalid event structure rejected:`, event);
      this.addToDLQ(event, 'Validation Failed: Invalid Event Structure');
      return;
    }

    this.persistAndRunInterceptors(event);
    const eventType = this.resolveEventType(event);

    // [Phase 17] Circuit Breaker Check
    if (this.circuitOpen) {
      if (Date.now() - this.lastFailureTime > this.RESET_TIMEOUT_MS) {
        console.log(`[DomainEventBus] Circuit half-open. Attempting recovery for ${eventType}...`);
        this.circuitOpen = false; // Half-open
      } else {
        console.warn(`[DomainEventBus] Circuit is OPEN. Fast-failing event ${eventType} to DLQ.`);
        this.addToDLQ(event, 'Circuit Breaker Open');
        return;
      }
    }

    const allHandlers = this.collectHandlers(eventType, event.aggregateType);

    console.log(`[DomainEventBus] Publishing: ${eventType}`, event);

    for (const handler of allHandlers) {
      let attempts = 0;
      let success = false;

      while (attempts < maxRetries && !success) {
        try {
          await handler(event);
          success = true;
          this.failureCount = 0; // Reset on success
        } catch (error) {
          attempts++;
          this.failureCount++;
          console.warn(`[DomainEventBus] Handler failed for ${eventType}, attempt ${attempts}/${maxRetries}`, error);
          
          // Trip the breaker if too many consecutive failures
          if (this.failureCount >= this.FAILURE_THRESHOLD) {
            console.error(`[DomainEventBus] Circuit Breaker TRIPPED after ${this.failureCount} failures.`);
            this.circuitOpen = true;
            this.lastFailureTime = Date.now();
          }

          if (attempts >= maxRetries || this.circuitOpen) {
            console.error(`[DomainEventBus] Event moved to DLQ: ${eventType}`);
            this.addToDLQ(event, error instanceof Error ? error.message : String(error));
            break; // Stop retrying this handler
          } else {
            // Exponential backoff: 100ms, 200ms, 400ms...
            await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempts - 1)));
          }
        }
      }
    }
  }

  private addToDLQ(event: DomainEvent, error: string) {
    if (this.dlq.length >= this.MAX_DLQ_SIZE) {
      this.dlq.shift(); // Remove oldest to prevent memory leak
    }
    this.dlq.push({
      event,
      error,
      failedAt: new Date().toISOString()
    });
  }

  private persistEvent(event: DomainEvent) {
    if (this.eventStore.length >= this.MAX_STORE_SIZE) {
      this.eventStore.shift();
    }
    this.eventStore.push(event);
  }

  /**
   * [Phase 2 Prod] Повторная попытка обработки событий из DLQ.
   */
  public async retryDLQ(): Promise<void> {
    const eventsToRetry = [...this.dlq];
    this.dlq = [];
    console.log(`[DomainEventBus] Retrying ${eventsToRetry.length} events from DLQ...`);
    for (const item of eventsToRetry) {
      await this.publish(item.event);
    }
  }

  /**
   * [Phase 2 Prod] Очистка DLQ.
   */
  public clearDLQ(): void {
    this.dlq = [];
  }

  /**
   * [Phase 2 Prod] Получение истории событий (Event Store).
   */
  public getEventStore(): DomainEvent[] {
    return this.eventStore;
  }

  public subscribe(eventType: string, handler: (event: any) => Promise<void> | void): () => void {
    const handlers = this.subscribers.get(eventType) || [];
    this.subscribers.set(eventType, [...handlers, handler]);
    
    return () => {
      const currentHandlers = this.subscribers.get(eventType) || [];
      this.subscribers.set(eventType, currentHandlers.filter(h => h !== handler));
    };
  }

  /**
   * [Phase 57] Добавляет глобальный перехватчик (например, для Anomaly Engine).
   */
  public addGlobalInterceptor(interceptor: (event: DomainEvent) => void): void {
    this.globalInterceptors.push(interceptor);
  }

  /**
   * Возвращает события, которые не удалось обработать.
   */
  public getDeadLetterQueue() {
    return this.dlq;
  }
}

export const eventBus = DomainEventBus.getInstance();

/** [Phase 62] Каталог типов и фабрики публикации (Zod) — единая точка импорта. */
export { DomainEventTypes };
export * from './domain-event-factories';
