import { ControlDashboardService, DashboardMetrics } from './aggregator/dashboard-service';
import { ImmutableAuditTrail } from '../core/immutable-audit-trail';
import { WebhookDispatcher } from '../integration/webhook-dispatcher';

export interface ExecutiveSummary {
  timestamp: string;
  overallHealthScore: number; // 0-100
  financialExposure: {
    totalValueAtRisk: number; // Стоимость товаров под угрозой (задержки, брак)
    currencyRiskExposure: number; // Объем нехеджированных валютных контрактов
    potentialPenalties: number; // Ожидаемые штрафы по SLA
  };
  sustainabilityMetrics: {
    totalCarbonFootprintKg: number;
    recycledMaterialUsagePercent: number;
    socialComplianceScore: number; // 0-100
  };
  operationalMetrics: DashboardMetrics;
  recentCriticalEvents: Array<{ eventType: string; description: string; time: string }>;
}

/**
 * [Phase 15 — Supply Chain Control Tower (Executive Dashboard)]
 * Единый командный центр (Control Tower) для C-Level руководителей (COO, CFO).
 * Агрегирует данные со всех подсистем (Финансы, ESG, Логистика, Производство)
 * в единую высокоуровневую сводку (Executive Summary).
 */
export class ControlTowerEngine {
  /**
   * Генерирует сводку для дашборда руководителя.
   */
  public static generateExecutiveSummary(): ExecutiveSummary {
    // 1. Сбор операционных метрик (из Dashboard Projection / Service)
    const opsMetrics = ControlDashboardService.getGlobalMetrics();

    // 2. Расчет Health Score (взвешенная оценка)
    // Чем больше критических блокеров и рисков, тем ниже скор
    const riskPenalty = (opsMetrics.byRisk.severe * 5) + (opsMetrics.byRisk.high * 2);
    const blockerPenalty = opsMetrics.criticalBlockers * 10;
    const healthScore = Math.max(0, 100 - (riskPenalty + blockerPenalty) / 10);

    // 3. Сбор финансовых рисков (Мок-агрегация из FX Hedging, Contract Management, DOM)
    // В реальной системе это были бы SQL-запросы к Read Models (CQRS)
    const financialExposure = {
      totalValueAtRisk: opsMetrics.byRisk.severe * 15000 + opsMetrics.byRisk.high * 5000, // Примерная стоимость
      currencyRiskExposure: 1250000, // $1.25M в нехеджированных контрактах (CNY/TRY)
      potentialPenalties: 45000 // Ожидаемые штрафы от фабрик за просрочку (SLA)
    };

    // 4. Сбор метрик устойчивого развития (ESG / DPP / Social)
    const sustainabilityMetrics = {
      totalCarbonFootprintKg: 450000, // 450 тонн CO2 за текущий квартал
      recycledMaterialUsagePercent: 32.5, // 32.5% материалов — вторсырье (цель: 50%)
      socialComplianceScore: 94 // Средний балл по аудитам фабрик (Sedex/BSCI)
    };

    // 5. Последние критические события (из Blockchain Audit Trail)
    const auditLog = ImmutableAuditTrail.getChain();
    const recentEvents = auditLog
      .filter(record => record.eventType.includes('critical') || record.eventType.includes('alert'))
      .slice(-5) // Последние 5
      .map(record => ({
        eventType: record.eventType,
        description: `Hash: ${record.hash.substring(0, 8)}...`,
        time: record.timestamp
      }));

    return {
      timestamp: new Date().toISOString(),
      overallHealthScore: Math.round(healthScore * 10) / 10,
      financialExposure,
      sustainabilityMetrics,
      operationalMetrics: opsMetrics,
      recentCriticalEvents: recentEvents.length > 0 ? recentEvents : [
        { eventType: 'system.info', description: 'No critical events in the last 24 hours.', time: new Date().toISOString() }
      ]
    };
  }
}
