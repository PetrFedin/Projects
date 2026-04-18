/**
 * [Phase 17 — Demand forecasting (demo)]
 * Простой прогноз спроса по истории продаж.
 */
export class DemandForecastingEngine {
  static async predictNextMonthDemand(
    _sku: string,
    historicalSales: number[],
    _currentMonth: number
  ): Promise<{ predictedDemand: number }> {
    const n = historicalSales.length;
    const avgDaily = n > 0 ? historicalSales.reduce((a, b) => a + b, 0) / n : 10;
    const predictedDemand = Math.max(30, Math.ceil(avgDaily * 30));
    return { predictedDemand };
  }
}
