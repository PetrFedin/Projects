import type { Workshop2SampleEconomicsDraft } from '@/lib/production/workshop2-sample-economics.types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export function emptyWorkshop2SampleEconomicsDraft(): Workshop2SampleEconomicsDraft {
  return {
    schemaVersion: 1,
    currencyCode: 'RUB',
    lines: [],
  };
}

/** Сумма qty × unitCost по строкам (пустые и NaN = 0). */
export function computeSampleEconomicsDraftTotal(draft: Workshop2SampleEconomicsDraft): number {
  const linesTotal = draft.lines.reduce((sum, line) => {
    const qty = Number.isFinite(line.qty) ? line.qty : 0;
    const unit = Number.isFinite(line.unitCost) ? (line.unitCost as number) : 0;
    return sum + qty * unit;
  }, 0);
  
  const logistics = Number.isFinite(draft.logisticsCost) ? draft.logisticsCost! : 0;
  const customs = Number.isFinite(draft.customsCost) ? draft.customsCost! : 0;
  const rework = Number.isFinite(draft.reworkCost) ? draft.reworkCost! : 0;
  
  return linesTotal + logistics + customs + rework;
}

export function computeSampleEconomicsLaborHoursTotal(draft: Workshop2SampleEconomicsDraft): number {
  return draft.lines.reduce((sum, line) => {
    const h = Number.isFinite(line.laborHours) ? (line.laborHours as number) : 0;
    return sum + h;
  }, 0);
}

export type PredictiveCogsBreakdown = {
  materialCost: number;
  laborCost: number;
  totalCogs: number;
};

export function calculatePreliminaryCogs(
  dossier: Workshop2DossierPhase1,
  laborRatePerMinute: number = 15
): PredictiveCogsBreakdown {
  let materialCost = 0;
  if (dossier.productionModel?.materialLines) {
    materialCost = dossier.productionModel.materialLines.reduce((sum, line) => {
      const yieldQty = Number.isFinite(line.yieldPerUnit) ? line.yieldPerUnit! : 0;
      const cost = Number.isFinite(line.unitCostNet) ? line.unitCostNet! : 0;
      return sum + yieldQty * cost;
    }, 0);
  }

  let totalSash = 0;
  if (dossier.smartRoutingSequence && dossier.smartRoutingSequence.length > 0) {
    totalSash = dossier.smartRoutingSequence.reduce((sum, op) => {
      const sash = Number.isFinite(op.sash) ? op.sash : 0;
      return sum + sash;
    }, 0);
  } else if (dossier.productionModel?.operations) {
    totalSash = dossier.productionModel.operations.reduce((sum, op) => {
      const sash = Number.isFinite(op.sash) ? op.sash! : 0;
      return sum + sash;
    }, 0);
  }
  
  const laborCost = totalSash * laborRatePerMinute;

  return {
    materialCost,
    laborCost,
    totalCogs: materialCost + laborCost,
  };
}
