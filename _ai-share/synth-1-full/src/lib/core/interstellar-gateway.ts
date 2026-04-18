export interface InterstellarRequest {
  requestId: string;
  sourceSystem: 'sol' | 'alpha_centauri' | 'sirius' | 'trappist_1';
  targetSystem: 'sol' | 'alpha_centauri' | 'sirius' | 'trappist_1';
  payloadSizeMb: number;
  priority: 'background' | 'standard' | 'tachyon_burst';
  availableEnergyKWh: number;
}

export interface SubspaceRoutingResult {
  requestId: string;
  status: 'transmitted' | 'subspace_interference' | 'insufficient_energy';
  effectiveLatencyMs: number; // Задержка в миллисекундах (в обход скорости света)
  tachyonEnergyConsumedKWh: number;
  reasoning: string;
}

/**
 * [Phase 52 — Interstellar API Gateway (Subspace Routing)]
 * Межзвездный API-шлюз для передачи данных между звездными системами.
 * В отличие от Interplanetary Sync (Phase 44), который учитывает задержку скорости света в пределах Солнечной системы,
 * этот движок использует тахионные реле (Tachyon Relays) для мгновенной связи сквозь подпространство.
 * Потребляет колоссальные объемы энергии и подвержен космической погоде (солнечные вспышки, туманности).
 */
export class InterstellarGatewayEngine {
  private static readonly TACHYON_ENERGY_PER_MB_KWH = 1500;

  /**
   * Маршрутизирует запрос через подпространственные реле.
   */
  public static routeSubspaceRequest(
    request: InterstellarRequest,
    subspaceInterferenceLevel: number // 0.0 (чистый космос) - 1.0 (сильная магнитная буря)
  ): SubspaceRoutingResult {
    let status: SubspaceRoutingResult['status'] = 'transmitted';
    let effectiveLatencyMs = 0;
    let tachyonEnergyConsumedKWh = 0;
    let reasoning = `Subspace link established between ${request.sourceSystem} and ${request.targetSystem}. `;

    // 1. Проверка на интерференцию подпространства (Космическая погода)
    if (subspaceInterferenceLevel > 0.8 && request.priority !== 'tachyon_burst') {
      status = 'subspace_interference';
      reasoning = `CRITICAL: Severe subspace interference detected (${(subspaceInterferenceLevel * 100).toFixed(1)}%). Standard transmission blocked to prevent data corruption. Awaiting clear channel or priority upgrade.`;
      return {
        requestId: request.requestId,
        status,
        effectiveLatencyMs: Infinity,
        tachyonEnergyConsumedKWh: 0,
        reasoning,
      };
    }

    // 2. Расчет потребления тахионной энергии
    // Чем выше интерференция и приоритет, тем больше энергии нужно для "пробивания" помех
    const interferenceMultiplier = 1.0 + subspaceInterferenceLevel * 2.0;
    const priorityMultiplier =
      request.priority === 'tachyon_burst' ? 5.0 : request.priority === 'background' ? 0.5 : 1.0;

    tachyonEnergyConsumedKWh =
      request.payloadSizeMb *
      this.TACHYON_ENERGY_PER_MB_KWH *
      interferenceMultiplier *
      priorityMultiplier;

    // 3. Проверка доступной энергии
    if (request.availableEnergyKWh < tachyonEnergyConsumedKWh) {
      status = 'insufficient_energy';
      reasoning = `CRITICAL: Insufficient energy for tachyon modulation. Required: ${tachyonEnergyConsumedKWh.toLocaleString()} kWh. Available: ${request.availableEnergyKWh.toLocaleString()} kWh. Transmission aborted.`;
      return {
        requestId: request.requestId,
        status,
        effectiveLatencyMs: Infinity,
        tachyonEnergyConsumedKWh: 0,
        reasoning,
      };
    }

    // 4. Расчет эффективной задержки (Latency)
    // Тахионы движутся быстрее света, но модуляция/демодуляция сигнала занимает время
    if (request.priority === 'tachyon_burst') {
      effectiveLatencyMs = 15; // 15 миллисекунд между звездами
      reasoning += `Tachyon burst engaged. Bypassing interference. Data transmitted with ultra-low latency (${effectiveLatencyMs}ms). Energy consumption spiked to ${tachyonEnergyConsumedKWh.toLocaleString()} kWh. `;
    } else if (request.priority === 'background') {
      effectiveLatencyMs = 5000 + subspaceInterferenceLevel * 10000; // До 15 секунд задержки
      reasoning += `Background transmission. Signal buffered and sent during optimal micro-windows. Latency: ${effectiveLatencyMs}ms. `;
    } else {
      effectiveLatencyMs = 150 + subspaceInterferenceLevel * 500;
      reasoning += `Standard transmission successful. Latency: ${effectiveLatencyMs.toFixed(0)}ms. `;
    }

    return {
      requestId: request.requestId,
      status,
      effectiveLatencyMs: Math.round(effectiveLatencyMs),
      tachyonEnergyConsumedKWh: Math.round(tachyonEnergyConsumedKWh),
      reasoning,
    };
  }
}
