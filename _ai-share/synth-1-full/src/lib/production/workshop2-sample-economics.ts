import type { Workshop2SampleEconomicsDraft } from '@/lib/production/workshop2-sample-economics.types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  computeWorkshop2BomCostingRollup,
  type Workshop2BomCostingRollup,
} from '@/lib/production/workshop2-bom-costing';

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

export function computeSampleEconomicsLaborHoursTotal(
  draft: Workshop2SampleEconomicsDraft
): number {
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

/** Строки экономики образца из rollup BOM (материалы / фурнитура / операции). */
export function buildSampleEconomicsLinesFromBomRollup(
  rollup: Workshop2BomCostingRollup
): Workshop2SampleEconomicsDraft['lines'] {
  return rollup.lineCosts.map((lc, i) => ({
    id: `bom-${lc.lineId}-${i}`,
    label: lc.label,
    category:
      lc.kind === 'operation'
        ? ('labor' as const)
        : lc.kind === 'trim'
          ? ('material' as const)
          : ('material' as const),
    qty: lc.yieldQty || 1,
    unitLabel: lc.kind === 'operation' ? 'ед' : 'расход',
    unitCost: lc.lineCost > 0 && lc.yieldQty > 0 ? lc.lineCost / lc.yieldQty : lc.unitPrice,
    sourceHint: 'tz_bom_reference' as const,
  }));
}

/** Обновляет черновик экономики образца rollup-ом BOM + target FOB. */
export function rollupSampleEconomicsFromBomCosting(
  dossier: Workshop2DossierPhase1,
  prev?: Workshop2SampleEconomicsDraft | null
): Workshop2SampleEconomicsDraft {
  const base = prev ?? emptyWorkshop2SampleEconomicsDraft();
  const rollup = computeWorkshop2BomCostingRollup(dossier);
  const bomLines = buildSampleEconomicsLinesFromBomRollup(rollup);
  const manualLines = base.lines.filter((l) => l.sourceHint !== 'tz_bom_reference');
  return {
    ...base,
    currencyCode: rollup.currency || base.currencyCode || 'RUB',
    lines: [...bomLines, ...manualLines],
    bomRollup: {
      syncedAt: new Date().toISOString(),
      estimatedFob: rollup.estimatedFob,
      targetFob: rollup.targetFob,
      targetMarginPct: rollup.targetMarginPct,
      deltaBand: rollup.deltaBand,
      deltaPct: rollup.deltaPct,
      currency: rollup.currency,
    },
  };
}

export function calculateActualCogs(
  dossier: Workshop2DossierPhase1,
  laborRatePerMinute: number = 15
): PredictiveCogsBreakdown & { logisticsCost: number; actualCogs: number } {
  const prelim = calculatePreliminaryCogs(dossier, laborRatePerMinute);
  const logisticsCost = dossier.productionModel?.logisticsCost || 0;
  return {
    ...prelim,
    logisticsCost,
    actualCogs: dossier.productionModel?.actualCogs ?? prelim.totalCogs + logisticsCost,
  };
}
