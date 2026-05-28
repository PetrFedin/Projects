export interface TimelineDataPayload {
  timelineId: string;
  dataSizeTb: number;
  entropyLevel: number; // 0.0 - 1.0 (насколько сильно реальность отклонилась от основной)
}

export interface QuantumNode {
  nodeId: string;
  capacityTb: number;
  usedTb: number;
  maxEntropyThreshold: number; // Максимальное отклонение, которое узел может выдержать до коллапса
}

export interface ShardAllocationResult {
  timelineId: string;
  assignedNodeId: string | null;
  status: 'allocated' | 'entropy_overflow' | 'node_full';
  reasoning: string;
}

/**
 * [Phase 52 — Multiverse DB Sharding (Timeline Partitioning)]
 * Стратегия шардирования базы данных для мультивселенных (Phase 46).
 * Поскольку Multiverse SCM создает параллельные ветки реальности, объем данных
 * растет экспоненциально. Классическое шардирование (по регионам или tenantId) не работает,
 * так как данные разных реальностей могут конфликтовать.
 * Этот движок распределяет данные (Timeline Shards) по квантовым узлам (Quantum Nodes),
 * учитывая уровень энтропии (отклонения от базовой реальности).
 */
export class MultiverseShardingEngine {
  /**
   * Распределяет данные параллельной реальности на подходящий квантовый узел.
   */
  public static allocateShard(
    payload: TimelineDataPayload,
    availableNodes: QuantumNode[]
  ): ShardAllocationResult {
    let status: ShardAllocationResult['status'] = 'node_full';
    let assignedNodeId: string | null = null;
    let reasoning = 'No suitable quantum node found. ';

    // 1. Фильтрация узлов по уровню энтропии (Dimensional Stability)
    // Если реальность слишком сильно отклонилась (высокая энтропия),
    // ее нельзя хранить на узле с низким порогом стабильности, иначе данные коллапсируют.
    const entropySafeNodes = availableNodes.filter(
      (n) => n.maxEntropyThreshold >= payload.entropyLevel
    );

    if (entropySafeNodes.length === 0) {
      status = 'entropy_overflow';
      reasoning = `CRITICAL: Timeline entropy (${(payload.entropyLevel * 100).toFixed(1)}%) exceeds stability threshold of all available quantum nodes. Risk of dimensional data collapse. Allocation aborted. `;
      return { timelineId: payload.timelineId, assignedNodeId, status, reasoning };
    }

    // 2. Поиск узла с достаточной емкостью (Capacity Check)
    // Сортируем узлы по доступному месту (жадный алгоритм)
    const sortedNodes = entropySafeNodes.sort(
      (a, b) => b.capacityTb - b.usedTb - (a.capacityTb - a.usedTb)
    );

    for (const node of sortedNodes) {
      const availableSpaceTb = node.capacityTb - node.usedTb;

      if (availableSpaceTb >= payload.dataSizeTb) {
        status = 'allocated';
        assignedNodeId = node.nodeId;

        // В реальности здесь было бы обновление состояния узла в БД
        node.usedTb += payload.dataSizeTb;

        reasoning = `Timeline shard allocated to quantum node ${node.nodeId}. Space utilized: ${node.usedTb.toFixed(1)}/${node.capacityTb.toFixed(1)} TB. Entropy level (${(payload.entropyLevel * 100).toFixed(1)}%) safely contained. `;
        break;
      }
    }

    if (status === 'node_full') {
      reasoning = `CRITICAL: Insufficient storage capacity across all entropy-safe quantum nodes for ${payload.dataSizeTb} TB payload. Please provision new multiverse shards. `;
    }

    return {
      timelineId: payload.timelineId,
      assignedNodeId,
      status,
      reasoning,
    };
  }
}
