import type { ExecutionPartner, PartnerKPI } from './execution-partner-schemas';

/**
 * Зарезервировано для расширения KPI-пайплайна (сейчас UnifiedAggregator использует partner.kpi напрямую).
 */
export class PartnerKPIEngine {
  static summarize(partner: ExecutionPartner): PartnerKPI {
    return partner.kpi;
  }
}
