import { DomainEvent } from '../production/execution-linkage';
import { DomainEventTypes } from './domain-event-catalog';
import { logObservability } from '@/lib/logger';

export type { DomainEvent };

export type DomainEventBusHealthSnapshot = {
  dlqSize: number;
  eventStoreSize: number;
  circuitOpen: boolean;
  dedupeCacheSize: number;
  subscriberEventTypeCount: number;
  /**
   * Consecutive handler failures counted toward the in-bus circuit breaker.
   * Increments across failed attempts; reset to 0 only after a fully successful `publish` (all handlers OK).
   */
  recentFailureCount: number;
  /**
   * ISO time when the bus circuit breaker last **tripped** (opened). `null` until the first trip.
   * Not updated on every failed retry alone — see `DomainEventBus.publish` / `DOMAIN_EVENT_BUS_CIRCUIT_FAILURE_THRESHOLD`.
   * Cleared (back to `null`) after a fully successful `publish` while the breaker is closed (stable recovery).
   */
  lastFailureAt: string | null;
};

/** Default handler retry attempts in {@link DomainEventBus.publish} before giving up on that handler. */
export const DOMAIN_EVENT_BUS_PUBLISH_DEFAULT_MAX_RETRIES = 3 as const;

/** Consecutive handler failures that trip the in-memory bus circuit (opens + sets {@link DomainEventBusHealthSnapshot.lastFailureAt}). */
export const DOMAIN_EVENT_BUS_CIRCUIT_FAILURE_THRESHOLD = 5 as const;

/** Half-open / recovery window for `circuitOpen` in {@link DomainEventBus.publish} (ms). */
export const DOMAIN_EVENT_BUS_CIRCUIT_RESET_TIMEOUT_MS = 30_000 as const;

/**
 * [Phase 2 — Domain Events]
 * Базовая инфраструктура для событий домена.
 * Позволяет decoupled-модулям (напр. Control Layer) реагировать на изменения.
 *
 * Поля `correlationId` / `dedupeKey` на базовом `DomainEvent` (см. execution-linkage)
 * задаются в фабриках domain-event-factories при необходимости трассировки и идемпотентных подписчиков
 * (пример: **`order.b2b_platform_export_result`** из B2B-экспорта на platform — публикация через **`domain-event-outbox`**:
 * сначала запись на диск, затем dispatch в шину; см. `processPendingDomainEventOutbox` в bootstrap).
 *
 * При повторной **`publish`** с тем же **`dedupeKey`** после **успешной** доставки шина не вызывает подписчиков повторно (in-memory LRU; ключ фиксируется только после успеха, чтобы outbox retry не терялся при падении handler).
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
    /** Если true, InteractionLinkageService может авто-создать чат/задачу по сигналу. */
    autoCreateInteraction?: boolean;
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

export type OrderB2bPlatformExportResultEvent = DomainEvent & {
  aggregateType: 'order';
  type: typeof DomainEventTypes.order.b2bPlatformExportResult;
  payload: {
    orderId: string;
    exportJobId: string;
    provider: 'platform';
    success: boolean;
    status: 'accepted' | 'rejected';
    error?: string;
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

export type InventoryShopStockFileIngestedEvent = DomainEvent & {
  aggregateType: 'inventory';
  type: typeof DomainEventTypes.inventory.shopStockFileIngested;
  payload: {
    fileName: string;
    clientKey: string;
    acceptedAt: string;
    channel: 'b2c_shop_stock_upload_demo';
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
  private readonly FAILURE_THRESHOLD = DOMAIN_EVENT_BUS_CIRCUIT_FAILURE_THRESHOLD;
  private readonly RESET_TIMEOUT_MS = DOMAIN_EVENT_BUS_CIRCUIT_RESET_TIMEOUT_MS;

  // [Phase 51] Пакетная обработка событий (Event Batching)
  private batchQueue: DomainEvent[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private readonly BATCH_DELAY_MS = 50; // Задержка для накопления событий
  private readonly MAX_BATCH_SIZE = 100; // Максимальный размер пакета

  // [Phase 57] Глобальные перехватчики (для Anomaly Engine)
  private globalInterceptors: ((event: DomainEvent) => void)[] = [];

  /** In-memory: повтор того же dedupeKey не доходит до подписчиков (at-least-once / redelivery). */
  private dedupeLRU: string[] = [];
  private dedupeSeen = new Set<string>();
  private readonly MAX_DEDUPE_KEYS = 1500;

  private constructor() {}

  private logBusMetric(event: string, fields: Record<string, unknown> = {}): void {
    logObservability(event, {
      ...fields,
      dlqSize: this.dlq.length,
      eventStoreSize: this.eventStore.length,
      circuitOpen: this.circuitOpen,
    });
  }

  private isDebugLoggingEnabled(): boolean {
    return process.env.NODE_ENV !== 'test' || process.env.DOMAIN_EVENT_BUS_DEBUG === '1';
  }

  private debugLog(level: 'log' | 'warn' | 'error', ...args: unknown[]): void {
    if (!this.isDebugLoggingEnabled()) return;
    console[level](...args);
  }

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
      this.debugLog('error', `[DomainEventBus] CRITICAL: Invalid event structure rejected in batch:`, event);
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

    this.debugLog('log', `[DomainEventBus] Flushing batch of ${batch.length} events...`);
    
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

  private normalizeDedupeKey(event: DomainEvent): string | null {
    const raw = event.dedupeKey;
    if (typeof raw !== 'string') return null;
    const k = raw.trim();
    return k ? k : null;
  }

  /** Уже успешно обработано ранее — повторный вызов (redelivery) можно пропустить. */
  private wasDedupeKeySuccessfullyProcessed(key: string): boolean {
    return this.dedupeSeen.has(key);
  }

  /** Вызывать только после полного успеха всех подписчиков для этого события. */
  private rememberDedupeKeySuccess(key: string): void {
    if (this.dedupeSeen.has(key)) return;
    this.dedupeSeen.add(key);
    this.dedupeLRU.push(key);
    while (this.dedupeLRU.length > this.MAX_DEDUPE_KEYS) {
      const old = this.dedupeLRU.shift();
      if (old) this.dedupeSeen.delete(old);
    }
  }

  /** @internal тесты — сброс кэша dedupe между кейсами. */
  public resetDedupeCacheForTests(): void {
    this.dedupeLRU = [];
    this.dedupeSeen.clear();
  }

  /** @internal тесты — сброс circuit breaker (изолированные сценарии с падающими handlers). */
  public resetCircuitStateForTests(): void {
    this.circuitOpen = false;
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }

  /** Запись в store и глобальные перехватчики — общий префикс для publish / publishUrgent. */
  private persistAndRunInterceptors(event: DomainEvent): void {
    this.persistEvent(event);
    this.globalInterceptors.forEach((interceptor) => {
      try {
        interceptor(event);
      } catch (e) {
        this.debugLog('error', 'Interceptor error:', e);
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
      this.debugLog('error', `[DomainEventBus] CRITICAL: Invalid urgent event structure rejected:`, event);
      this.addToDLQ(event, 'Validation Failed: Invalid Event Structure');
      return;
    }

    const dkUrgent = this.normalizeDedupeKey(event);
    if (dkUrgent && this.wasDedupeKeySuccessfullyProcessed(dkUrgent)) {
      this.debugLog('log', `[DomainEventBus] Dedupe skip (urgent): ${dkUrgent} ${this.resolveEventType(event)}`);
      return;
    }

    this.persistAndRunInterceptors(event);
    const eventType = this.resolveEventType(event);
    const allHandlers = this.collectHandlers(eventType, event.aggregateType);

    this.debugLog('warn', `[DomainEventBus] URGENT PUBLISH: ${eventType}`, event);

    // Выполняем немедленно, игнорируя Circuit Breaker и Retry Policy (чтобы не блокировать поток)
    const settled = await Promise.allSettled(allHandlers.map((handler) => handler(event)));
    const rejected = settled.filter((r) => r.status === 'rejected');
    const allOk = rejected.length === 0;
    if (!allOk) {
      const first = rejected[0];
      const reason =
        first && first.status === 'rejected'
          ? first.reason instanceof Error
            ? first.reason.message
            : String(first.reason)
          : 'Urgent handler failed';
      this.addToDLQ(event, `Urgent publish failed: ${reason}`);
      this.logBusMetric('domain_event_bus.urgent_failed', {
        type: eventType,
        dedupeKey: dkUrgent,
      });
    }
    if (allOk && dkUrgent) {
      this.rememberDedupeKeySuccess(dkUrgent);
    }
    if (allOk) {
      this.logBusMetric('domain_event_bus.urgent_published', {
        type: eventType,
        dedupeKey: dkUrgent,
      });
    }
  }

  /**
   * Публикует событие с механизмом повторных попыток (RetryPolicy) и Circuit Breaker.
   */
  public async publish(
    event: DomainEvent,
    maxRetries: number = DOMAIN_EVENT_BUS_PUBLISH_DEFAULT_MAX_RETRIES
  ): Promise<void> {
    // [Phase 45] Валидация события перед публикацией
    if (!this.validateEvent(event)) {
      this.debugLog('error', `[DomainEventBus] CRITICAL: Invalid event structure rejected:`, event);
      this.addToDLQ(event, 'Validation Failed: Invalid Event Structure');
      return;
    }

    const dk = this.normalizeDedupeKey(event);
    if (dk && this.wasDedupeKeySuccessfullyProcessed(dk)) {
      this.debugLog('log', `[DomainEventBus] Dedupe skip: ${dk} ${this.resolveEventType(event)}`);
      return;
    }

    this.persistAndRunInterceptors(event);
    const eventType = this.resolveEventType(event);

    // [Phase 17] Circuit Breaker Check
    if (this.circuitOpen) {
      if (Date.now() - this.lastFailureTime > this.RESET_TIMEOUT_MS) {
        this.debugLog('log', `[DomainEventBus] Circuit half-open. Attempting recovery for ${eventType}...`);
        this.circuitOpen = false; // Half-open
      } else {
        this.debugLog('warn', `[DomainEventBus] Circuit is OPEN. Fast-failing event ${eventType} to DLQ.`);
        this.addToDLQ(event, 'Circuit Breaker Open');
        return;
      }
    }

    const allHandlers = this.collectHandlers(eventType, event.aggregateType);

    this.debugLog('log', `[DomainEventBus] Publishing: ${eventType}`, event);

    let anyHandlerFailed = false;

    for (const handler of allHandlers) {
      let attempts = 0;
      let success = false;

      while (attempts < maxRetries && !success) {
        try {
          await handler(event);
          success = true;
        } catch (error) {
          attempts++;
          this.failureCount++;
          this.debugLog('warn', `[DomainEventBus] Handler failed for ${eventType}, attempt ${attempts}/${maxRetries}`, error);
          
          // Trip the breaker if too many consecutive failures
          if (this.failureCount >= this.FAILURE_THRESHOLD) {
            this.debugLog('error', `[DomainEventBus] Circuit Breaker TRIPPED after ${this.failureCount} failures.`);
            this.circuitOpen = true;
            this.lastFailureTime = Date.now();
          }

          if (attempts >= maxRetries || this.circuitOpen) {
            this.debugLog('error', `[DomainEventBus] Event moved to DLQ: ${eventType}`);
            this.addToDLQ(event, error instanceof Error ? error.message : String(error));
            anyHandlerFailed = true;
            break; // Stop retrying this handler
          } else {
            // Exponential backoff: 100ms, 200ms, 400ms...
            await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempts - 1)));
          }
        }
      }

      if (!success) {
        anyHandlerFailed = true;
      }
    }

    if (!anyHandlerFailed && dk) {
      this.rememberDedupeKeySuccess(dk);
    }
    if (!anyHandlerFailed) {
      this.failureCount = 0;
      if (!this.circuitOpen) {
        this.lastFailureTime = 0;
      }
    }
    this.logBusMetric(anyHandlerFailed ? 'domain_event_bus.publish_failed' : 'domain_event_bus.published', {
      type: eventType,
      dedupeKey: dk,
    });
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
    this.logBusMetric('domain_event_bus.dlq_added', {
      type: this.resolveEventType(event),
      dedupeKey: event.dedupeKey,
      error,
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
    this.debugLog('log', `[DomainEventBus] Retrying ${eventsToRetry.length} events from DLQ...`);
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

  public getHealthSnapshot(): DomainEventBusHealthSnapshot {
    return {
      dlqSize: this.dlq.length,
      eventStoreSize: this.eventStore.length,
      circuitOpen: this.circuitOpen,
      dedupeCacheSize: this.dedupeSeen.size,
      subscriberEventTypeCount: this.subscribers.size,
      recentFailureCount: this.failureCount,
      lastFailureAt: this.lastFailureTime > 0 ? new Date(this.lastFailureTime).toISOString() : null,
    };
  }
}

export const eventBus = DomainEventBus.getInstance();

/** Сброс кэша dedupe у шины (только Jest / изолированные прогоны). */
export function __resetDomainEventBusDedupeForTests(): void {
  DomainEventBus.getInstance().resetDedupeCacheForTests();
}

/** Сброс circuit breaker шины (только Jest). */
export function __resetDomainEventBusCircuitForTests(): void {
  DomainEventBus.getInstance().resetCircuitStateForTests();
}

export function getDomainEventBusHealthSnapshot(): DomainEventBusHealthSnapshot {
  return DomainEventBus.getInstance().getHealthSnapshot();
}

/** [Phase 62] Каталог типов и фабрики публикации (Zod) — единая точка импорта. */
export { DomainEventTypes };
export * from './domain-event-factories';
