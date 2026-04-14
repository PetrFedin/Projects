import { ControlOutput, ControlRiskLevel } from '@/lib/contracts';
import { ExecutionPartner } from '@/lib/execution-linkage/execution-partner-schemas';
import { ProductionCommitment } from '@/lib/production/production-schemas';
import { publishControlRiskAlert } from '@/lib/order/domain-event-factories';

export interface RiskPrediction {
  entity_id: string;
  predicted_risk: ControlRiskLevel;
  confidence: number;
  factors: string[];
  suggested_buffer_days: number;
}

/**
 * [Phase 3 — Predictive Risk Analysis]
 * Прогностический движок, использующий исторические данные KPI и текущий статус производства
 * для предсказания будущих задержек и рисков качества.
 */
export class PredictiveRiskEngine {
  /**
   * Анализирует вероятность задержки или брака для конкретного обязательства.
   */
  public static predict(commitment: ProductionCommitment, partner: ExecutionPartner): RiskPrediction {
    const factors: string[] = [];
    let riskScore = 0; // 0-100
    let suggestedBuffer = 0;

    // 1. Анализ исторической надежности партнера
    if (partner.kpi.onTimeRate < 0.8) {
      riskScore += 30;
      factors.push('PARTNER_HISTORICAL_DELAY');
      suggestedBuffer += 5;
    }

    if (partner.kpi.qualityRate < 0.9) {
      riskScore += 20;
      factors.push('PARTNER_QUALITY_RISK');
    }

    // 2. Анализ текущего прогресса
    const now = new Date();
    const deadline = new Date(commitment.plannedEndDate);
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (commitment.status !== 'completed' && daysLeft < 3) {
      riskScore += 40;
      factors.push('CRITICAL_DEADLINE_APPROACHING');
      suggestedBuffer += 3;
    }

    // 3. Определение итогового уровня риска
    let predicted_risk: ControlRiskLevel = 'low';
    if (riskScore > 70) predicted_risk = 'high';
    else if (riskScore > 40) predicted_risk = 'medium';

    const prediction = {
      entity_id: commitment.id,
      predicted_risk,
      confidence: 0.85, // Имитация уверенности модели
      factors,
      suggested_buffer_days: suggestedBuffer
    };

    // [Phase 3] Control-to-Interaction Loop: Авто-создание чата при высоком риске
    if (predicted_risk === 'high') {
      void publishControlRiskAlert({
        aggregateId: commitment.id,
        aggregateType: 'control',
        version: 1,
        eventIdPrefix: 'risk',
        payload: {
          riskLevel: predicted_risk,
          factors,
          autoCreateInteraction: true
        }
      });
    }

    return prediction;
  }

  /**
   * Обогащает ControlOutput прогностическими данными.
   */
  public static augmentWithPredictions(output: ControlOutput, prediction: RiskPrediction): ControlOutput {
    if (prediction.predicted_risk === 'high' && output.status !== 'at_risk') {
      output.status = 'at_risk';
      output.risks?.push({ 
        code: 'PREDICTIVE_RISK_ALERT' as any, 
        message: `Predictive risk alert: ${prediction.factors.join(', ')}`,
        severity: 'high'
      });
    }
    return output;
  }
}
