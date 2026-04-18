export interface NetworkNode {
  id: string;
  type: 'factory' | 'central_dc' | 'regional_dc' | 'store';
  leadTimeDaysFromUpstream: number; // Время пополнения от вышестоящего узла
  demandForecastPerDay: number; // Прогноз спроса
  demandStdDev: number; // Стандартное отклонение спроса (волатильность)
  serviceLevelTarget: number; // Целевой уровень сервиса (например, 0.95 = 95% наличия)
}

export interface MEIOResult {
  nodeId: string;
  recommendedSafetyStock: number;
  reorderPoint: number;
  reasoning: string;
}

/**
 * [Phase 11 — Multi-Echelon Inventory Optimization (MEIO)]
 * Движок многоуровневой оптимизации запасов.
 * В отличие от простого Safety Stock (для одного склада), MEIO рассчитывает
 * оптимальные запасы для всей сети (Фабрика -> ЦС -> РЦ -> Магазин) одновременно,
 * минимизируя общий объем запасов при сохранении целевого Service Level.
 */
export class MEIOEngine {
  // Z-scores для нормального распределения (Service Level)
  private static zScores: Record<string, number> = {
    '0.90': 1.28,
    '0.95': 1.64,
    '0.98': 2.05,
    '0.99': 2.33,
  };

  /**
   * Рассчитывает оптимальный Safety Stock и Reorder Point для каждого узла сети.
   */
  public static optimizeNetwork(nodes: NetworkNode[]): MEIOResult[] {
    const results: MEIOResult[] = [];

    // Алгоритм (упрощенная модель Уилсона / Safety Stock Formula):
    // Safety Stock = Z * StdDev * sqrt(LeadTime)
    // Reorder Point = (Demand * LeadTime) + Safety Stock

    for (const node of nodes) {
      // 1. Находим Z-score для целевого Service Level
      const zScore = this.zScores[node.serviceLevelTarget.toFixed(2)] || 1.64; // Default 95%

      // 2. Расчет Safety Stock (Страховой запас)
      // Учитывает волатильность спроса (StdDev) и время пополнения (Lead Time)
      // Защита от отрицательного Lead Time (ошибка данных)
      const safeLeadTime = Math.max(0, node.leadTimeDaysFromUpstream);
      const safetyStock = zScore * Math.max(0, node.demandStdDev) * Math.sqrt(safeLeadTime);

      // 3. Расчет Reorder Point (Точка заказа)
      // Спрос за время доставки + Страховой запас
      const leadTimeDemand = Math.max(0, node.demandForecastPerDay) * safeLeadTime;
      const reorderPoint = leadTimeDemand + safetyStock;

      results.push({
        nodeId: node.id,
        recommendedSafetyStock: Math.ceil(safetyStock),
        reorderPoint: Math.ceil(reorderPoint),
        reasoning:
          `Target SL: ${node.serviceLevelTarget * 100}%. Lead Time: ${node.leadTimeDaysFromUpstream} days. ` +
          `Safety Stock covers demand volatility (${node.demandStdDev}/day). Reorder when stock hits ${Math.ceil(reorderPoint)}.`,
      });
    }

    return results;
  }
}
