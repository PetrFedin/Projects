export interface SLA {
  metric: 'delivery_time' | 'defect_rate' | 'esg_compliance' | 'payment_time';
  targetValue: number;
  operator: '<=' | '>=' | '==';
  penaltyPercentage: number; // % of contract value
}

export interface B2BContract {
  contractId: string;
  partyAId: string; // Brand
  partyBId: string; // Supplier/Factory
  totalValueUSD: number;
  slas: SLA[];
  status: 'draft' | 'active' | 'breached' | 'resolved' | 'terminated';
}

export interface BreachClaim {
  claimId: string;
  contractId: string;
  metric: string;
  actualValue: number;
  calculatedPenaltyUSD: number;
  aiResolution: 'auto_deduct' | 'warning_issued' | 'escalate_to_human';
  reasoning: string;
}

/**
 * [Phase 58 — Autonomous Legal Counsel (CLM)]
 * ИИ-юрисконсульт для управления жизненным циклом B2B контрактов.
 * Автоматически отслеживает нарушения SLA (сроки, брак, ESG),
 * рассчитывает штрафы (penalties) и принимает решения о санкциях
 * без участия человека (smart contract enforcement).
 */
export class AutonomousLegalCounsel {
  // Mock DB for active contracts
  private static contracts = new Map<string, B2BContract>();

  public static registerContract(contract: B2BContract) {
    this.contracts.set(contract.contractId, contract);
    console.log(`[LegalCounsel] Contract ${contract.contractId} registered between ${contract.partyAId} and ${contract.partyBId}.`);
  }

  /**
   * Оценивает событие на предмет нарушения SLA.
   */
  public static evaluateSLA(contractId: string, metric: SLA['metric'], actualValue: number): BreachClaim | null {
    const contract = this.contracts.get(contractId);
    if (!contract || contract.status !== 'active') return null;

    const sla = contract.slas.find(s => s.metric === metric);
    if (!sla) return null;

    let isBreached = false;
    switch (sla.operator) {
      case '<=': isBreached = actualValue > sla.targetValue; break;
      case '>=': isBreached = actualValue < sla.targetValue; break;
      case '==': isBreached = actualValue !== sla.targetValue; break;
    }

    if (!isBreached) return null;

    // Расчет штрафа
    // [Phase 58] Math Hardening: защита от NaN и отрицательных штрафов
    const safeValue = Math.max(0, isNaN(contract.totalValueUSD) ? 0 : contract.totalValueUSD);
    const safePenaltyPct = Math.max(0, Math.min(100, isNaN(sla.penaltyPercentage) ? 0 : sla.penaltyPercentage));
    
    const penaltyUSD = (safeValue * safePenaltyPct) / 100;

    // AI принятие решения
    let resolution: BreachClaim['aiResolution'] = 'warning_issued';
    if (penaltyUSD > 50000) {
      resolution = 'escalate_to_human'; // Слишком большой штраф, нужен человек
    } else if (penaltyUSD > 0) {
      resolution = 'auto_deduct'; // Автоматическое удержание из следующего платежа
      contract.status = 'breached';
    }

    return {
      claimId: `claim-${Date.now()}`,
      contractId,
      metric,
      actualValue,
      calculatedPenaltyUSD: penaltyUSD,
      aiResolution: resolution,
      reasoning: `SLA breached for ${metric}. Target: ${sla.operator} ${sla.targetValue}, Actual: ${actualValue}. Penalty: $${penaltyUSD.toLocaleString()}. Action: ${resolution}.`
    };
  }
}
