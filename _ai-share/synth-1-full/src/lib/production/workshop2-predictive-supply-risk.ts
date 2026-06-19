/**
 * Wave 6 P1 #60: Predictive supply risk — эвристика 0–100 из досье (без ML).
 * Учитывает: late T&A milestones, lab dip pending, ERP journal_only PO.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { summarizeWorkshop2LabDipStatus } from '@/lib/production/workshop2-lab-dip-status';
import { computeWorkshop2RiskFromDossier } from '@/lib/production/workshop2-risk-from-dossier';

export type Workshop2PredictiveSupplyRiskBlocker = {
  id: string;
  severity: 'blocker' | 'warning';
  messageRu: string;
};

export type Workshop2PredictiveSupplyRiskPanelModel = {
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  blockers: Workshop2PredictiveSupplyRiskBlocker[];
  rationale: string;
  computedAt: string;
  source: 'dossier_heuristic';
  inputsUsed: string[];
};

function clampScore(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function evaluateWorkshop2PredictiveSupplyRiskFromDossier(
  dossier: Workshop2DossierPhase1
): Workshop2PredictiveSupplyRiskPanelModel {
  const blockers: Workshop2PredictiveSupplyRiskBlocker[] = [];
  const inputsUsed: string[] = [];
  let score = 72;

  const ta = dossier.taMilestones ?? [];
  const now = Date.now();
  let lateTa = 0;
  for (const m of ta) {
    if (m.status === 'completed' || m.actualDate) continue;
    const target = m.targetDate ? Date.parse(m.targetDate) : NaN;
    if (Number.isFinite(target) && target < now) {
      lateTa += 1;
      blockers.push({
        id: `ta.late.${m.id ?? lateTa}`,
        severity: 'warning',
        messageRu: `Просрочен T&A: ${m.title ?? m.id ?? 'milestone'}`,
      });
    }
  }
  if (lateTa > 0) {
    score -= Math.min(25, lateTa * 8);
    inputsUsed.push(`late T&A: ${lateTa}`);
  } else {
    inputsUsed.push('late T&A: 0');
  }

  const labDip = summarizeWorkshop2LabDipStatus(dossier);
  if (labDip?.state === 'blocked' || (labDip?.pendingCount ?? 0) > 0) {
    const pending = labDip?.pendingCount ?? 0;
    score -= pending > 0 ? 12 : 18;
    inputsUsed.push(`lab dip pending: ${pending}`);
    if (labDip?.state === 'blocked') {
      blockers.push({
        id: 'supply.lab_dip.blocked',
        severity: 'blocker',
        messageRu: labDip.hintRu ?? 'Lab dip не согласован — блокер снабжения.',
      });
    } else if (pending > 0) {
      blockers.push({
        id: 'supply.lab_dip.pending',
        severity: 'warning',
        messageRu: `${pending} colorway ожидают lab dip.`,
      });
    }
  } else {
    inputsUsed.push('lab dip: ok');
  }

  const erpJournal = dossier.purchaseOrderErpMirror?.erpSyncMode === 'journal_only';
  const erpFailed = dossier.purchaseOrderErpMirror?.lastCreateErpAttempt?.outcome === 'failed';
  if (erpJournal) {
    score -= 10;
    inputsUsed.push('ERP PO: journal_only');
    blockers.push({
      id: 'supply.erp.journal_only',
      severity: 'warning',
      messageRu:
        'ERP PO в режиме journal_only — нет live erpOrderId ACK (WORKSHOP2_FACTORY_ERP_BASE_URL).',
    });
  } else if (erpFailed) {
    score -= 15;
    inputsUsed.push('ERP PO: failed attempt');
    blockers.push({
      id: 'supply.erp.failed',
      severity: 'blocker',
      messageRu: 'Последняя попытка ERP PO завершилась ошибкой — проверьте интеграцию.',
    });
  } else {
    inputsUsed.push('ERP PO: n/a or live');
  }

  const bomRisk = computeWorkshop2RiskFromDossier(dossier);
  if (bomRisk.riskLevel === 'High') score -= 15;
  else if (bomRisk.riskLevel === 'Medium') score -= 8;
  inputsUsed.push(`BOM heuristic: ${bomRisk.riskLevel}`);

  score = clampScore(score);
  let riskLevel: Workshop2PredictiveSupplyRiskPanelModel['riskLevel'] = 'Low';
  if (score < 45 || blockers.some((b) => b.severity === 'blocker')) riskLevel = 'High';
  else if (score < 70 || blockers.length > 0) riskLevel = 'Medium';

  const rationale =
    score >= 70
      ? `Эвристика снабжения ${score}/100 — критичных блокеров нет.`
      : score >= 45
        ? `Эвристика снабжения ${score}/100 — есть предупреждения (T&A / lab dip / ERP).`
        : `Эвристика снабжения ${score}/100 — высокий риск, проверьте blockers.`;

  return {
    score,
    riskLevel,
    blockers: blockers.slice(0, 8),
    rationale,
    computedAt: new Date().toISOString(),
    source: 'dossier_heuristic',
    inputsUsed,
  };
}
