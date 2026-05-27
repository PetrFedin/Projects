/**
 * Wave 21 #60: gate sample-order по supplyRiskSnapshot в PG.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  computeWorkshop2RiskFromDossier,
  type Workshop2SupplyRiskSnapshot,
} from '@/lib/production/workshop2-risk-from-dossier';

export function buildWorkshop2SupplyRiskMirror(
  dossier: Workshop2DossierPhase1
): NonNullable<Workshop2DossierPhase1['supplyRiskMirror']> {
  const snap = dossier.supplyRiskSnapshot ?? computeWorkshop2RiskFromDossier(dossier);
  const hasBom = Boolean(dossier.productionModel?.materialLines?.length);
  const blockerHandoff = hasBom && !dossier.supplyRiskSnapshot;

  return {
    mirroredAt: new Date().toISOString(),
    engineKind: 'heuristic_bom',
    riskLevel: snap.riskLevel,
    predictedDays: snap.predictedDays,
    blockerHandoff,
    hintRu: blockerHandoff
      ? 'Прогноз рисков не в PG — «Риск → PG» перед handoff.'
      : `Эвристика BOM · ${snap.riskLevel} · ~${snap.predictedDays} дн.`,
  };
}

export function persistWorkshop2SupplyRiskSnapshotToDossier(
  dossier: Workshop2DossierPhase1,
  snapshot?: Workshop2SupplyRiskSnapshot
): Workshop2DossierPhase1 {
  const next = snapshot ?? computeWorkshop2RiskFromDossier(dossier);
  const withSnap = {
    ...dossier,
    supplyRiskSnapshot: {
      predictedDays: next.predictedDays,
      riskLevel: next.riskLevel,
      rationale: next.rationale,
      risks: next.risks,
      computedAt: next.computedAt,
      source: next.source as 'dossier_bom',
    },
  };
  return {
    ...withSnap,
    supplyRiskMirror: buildWorkshop2SupplyRiskMirror(withSnap),
  };
}

export function evaluateWorkshop2SupplyRiskSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const snap = dossier.supplyRiskSnapshot;
  const hasBom = Boolean(dossier.productionModel?.materialLines?.length);

  if (hasBom && !snap) {
    return {
      id: 'supply.risk.snapshot_missing',
      severity: 'blocker',
      messageRu: 'Прогноз рисков не сохранён в PG — рассчитайте и нажмите «Риск → PG».',
    };
  }

  if (snap?.riskLevel === 'High') {
    return {
      id: 'supply.risk.high',
      severity: 'warning',
      messageRu: `Высокий риск снабжения (${snap.predictedDays} дн.) — ${snap.rationale}`,
    };
  }

  return null;
}

export function evaluateWorkshop2SupplyRiskHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const snap = dossier.supplyRiskSnapshot;
  const hasBom = Boolean(dossier.productionModel?.materialLines?.length);

  if (hasBom && !snap) {
    return {
      id: 'supply.risk.snapshot_missing_handoff',
      severity: 'blocker',
      messageRu:
        'Прогноз рисков не в PG — «Риск → PG» обязателен перед handoff при заполненном BOM.',
    };
  }
  if (snap?.riskLevel === 'High') {
    return {
      id: 'supply.risk.high_handoff',
      severity: 'warning',
      messageRu: `Высокий риск снабжения (${snap.predictedDays} дн.) — подтвердите план перед передачей в цех.`,
    };
  }
  return null;
}
