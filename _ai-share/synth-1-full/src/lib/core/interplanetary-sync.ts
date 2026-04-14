export interface InterplanetaryNode {
  nodeId: string;
  location: 'earth' | 'moon' | 'mars' | 'orbital_station';
  distanceFromEarthLightSeconds: number; // От 1.3 сек (Луна) до ~1200 сек (Марс)
}

export interface SyncPayload {
  transactionId: string;
  aggregateType: 'inventory' | 'order' | 'financial';
  timestamp: number; // Локальное время узла (Unix ms)
  vectorClock: Record<string, number>; // CRDT Векторные часы для разрешения конфликтов
  data: any;
}

export interface SyncResult {
  transactionId: string;
  status: 'synced' | 'conflict_resolved' | 'pending_light_delay';
  latencySeconds: number;
  resolutionStrategy?: 'last_write_wins' | 'crdt_merge' | 'manual_review';
  reasoning: string;
}

/**
 * [Phase 44 — Interplanetary Database Synchronization]
 * Движок синхронизации баз данных для межпланетной торговли.
 * Учитывает задержки скорости света (Speed-of-Light Delay).
 * Например, пинг до Марса составляет от 3 до 22 минут. Классические транзакции (ACID)
 * не работают. Система использует CRDT (Conflict-free Replicated Data Types)
 * и векторные часы (Vector Clocks) для асинхронного слияния состояний инвентаря и заказов.
 */
export class InterplanetarySyncEngine {
  /**
   * Пытается синхронизировать пакет данных между Землей и удаленной колонией.
   */
  public static processSync(
    sourceNode: InterplanetaryNode,
    targetNode: InterplanetaryNode,
    payload: SyncPayload,
    targetVectorClock: Record<string, number>
  ): SyncResult {
    // 1. Расчет задержки скорости света (Light-Speed Latency)
    // Дистанция = |Дистанция источника от Земли - Дистанция цели от Земли| (упрощенная модель)
    const distanceLightSeconds = Math.abs(sourceNode.distanceFromEarthLightSeconds - targetNode.distanceFromEarthLightSeconds);
    const latencySeconds = distanceLightSeconds; // Время в одну сторону

    let status: SyncResult['status'] = 'synced';
    let resolutionStrategy: SyncResult['resolutionStrategy'] = undefined;
    let reasoning = `Payload transmitted across ${distanceLightSeconds.toFixed(1)} light-seconds. `;

    // Если задержка больше 5 секунд, мы не можем ждать подтверждения (No synchronous locks)
    if (latencySeconds > 5) {
      status = 'pending_light_delay';
      reasoning += `High latency detected. Asynchronous CRDT merge scheduled upon arrival in ${Math.ceil(latencySeconds / 60)} minutes. `;
    }

    // 2. Разрешение конфликтов (CRDT Vector Clock Comparison)
    // Проверяем, есть ли конфликт (concurrent writes)
    let isConflict = false;
    let sourceAhead = false;
    let targetAhead = false;

    for (const node of Object.keys(payload.vectorClock)) {
      const sourceTime = payload.vectorClock[node] || 0;
      const targetTime = targetVectorClock[node] || 0;

      if (sourceTime > targetTime) sourceAhead = true;
      if (sourceTime < targetTime) targetAhead = true;
    }

    if (sourceAhead && targetAhead) {
      isConflict = true;
    }

    // 3. Применение стратегии слияния
    if (isConflict) {
      status = 'conflict_resolved';
      if (payload.aggregateType === 'inventory') {
        // Для инвентаря используем CRDT (сложение/вычитание дельт, а не абсолютных значений)
        resolutionStrategy = 'crdt_merge';
        reasoning += `Concurrent modification detected. Applied CRDT commutative merge for ${payload.aggregateType}. `;
      } else if (payload.aggregateType === 'financial') {
        // Финансовые транзакции требуют строгой проверки, если конфликт — отправляем на ручное ревью
        resolutionStrategy = 'manual_review';
        reasoning += `CRITICAL: Concurrent financial transaction detected. Diverted to interplanetary audit queue. `;
      } else {
        // Для прочих данных (например, статус заказа) — Last Write Wins по локальному Timestamp
        resolutionStrategy = 'last_write_wins';
        reasoning += `Concurrent modification detected. Resolved using Last-Write-Wins (LWW) based on origin timestamp. `;
      }
    } else if (status !== 'pending_light_delay') {
      reasoning += 'Vector clocks aligned. State merged cleanly.';
    }

    return {
      transactionId: payload.transactionId,
      status,
      latencySeconds,
      resolutionStrategy,
      reasoning
    };
  }
}
