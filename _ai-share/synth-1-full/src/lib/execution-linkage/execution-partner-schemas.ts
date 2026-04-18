/**
 * Лёгкие схемы партнёра исполнения (фабрика / поставщик) для KPI и прогноза рисков.
 */

export interface PartnerKPI {
  onTimeRate: number;
  qualityRate: number;
  avgDelayDays: number;
  completedCommitments: number;
  rating: number;
}

export interface ExecutionPartner {
  id: string;
  name?: string;
  kpi: PartnerKPI;
}
