import { ControlOutput, ControlRiskLevel, ControlStatus } from '@/lib/contracts';
import { controlStorage } from './control-storage';

export interface DashboardMetrics {
  totalEntities: number;
  byStatus: Record<ControlStatus, number>;
  byRisk: Record<ControlRiskLevel, number>;
  criticalBlockers: number;
  avgReadiness: number;
  pendingActions: number;

  // [Phase 5] AI Automation & Financial Metrics
  aiResolvedBlockers: number;
  moneySavedByAi: number; // В валюте (USD)
  smartSwapProfit: number; // Прибыль от умных перебросок (USD)
}

/**
 * [Phase 3 — Real-time Control Dashboard Logic]
 * [Phase 5 — Hyper-Connected Ecosystem Metrics]
 * Агрегация метрик здоровья системы для дашборда бренда и партнера,
 * включая финансовую эффективность AI.
 */
export class ControlDashboardService {
  /**
   * Считает общие метрики по всем сущностям в хранилище.
   */
  public static getGlobalMetrics(): DashboardMetrics {
    const allLatest = Array.from(controlStorage.getHistory('all')); // В реальной БД был бы запрос

    // Имитация данных из хранилища для примера
    const metrics: DashboardMetrics = {
      totalEntities: 1250,
      byStatus: { ok: 950, attention: 200, blocked: 80, critical: 20 },
      byRisk: { low: 1000, medium: 150, high: 80, severe: 20 },
      criticalBlockers: 15,
      avgReadiness: 92.5,
      pendingActions: 45,

      // [Phase 5] Имитация накопленных метрик от AutoResolutionService и SmartSwap
      aiResolvedBlockers: 342, // Количество блокеров, решенных без участия человека
      moneySavedByAi: 12500, // Сэкономлено на ручном труде (например, $35 за инцидент)
      smartSwapProfit: 45800, // Дополнительная прибыль от вовремя переброшенного стока
    };

    // В реальном приложении здесь был бы перебор по всем entityId
    // Для демо возвращаем структуру и логику агрегации
    return metrics;
  }

  /**
   * Генерирует "Health Score" для конкретного партнера.
   */
  public static getPartnerHealth(partnerId: string): number {
    // Логика: средний риск по всем заказам партнера
    return 85; // Имитация: 85/100
  }
}
