/**
 * Wave S — gate утверждения эталона (fitGold.goldApproved) с полным checks[] как sample-order 409.
 */
import type { FitGoldSnapshot } from '@/lib/production/article-workspace/types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { evaluateWorkshop2FitSessionsHandoffGate } from '@/lib/production/workshop2-fit-sessions-dossier-persist';
import { summarizeWorkshop2FitSessionsStatus } from '@/lib/production/workshop2-fit-sessions-status';
import { summarizeWorkshop2GoldSampleStatus } from '@/lib/production/workshop2-gold-sample-status';
import { evaluateWorkshop2FitCommentsGoldGate } from '@/lib/production/workshop2-fit-comments-log';
import { evaluateWorkshop2QcAqlSampleGate } from '@/lib/production/workshop2-qc-aql-dossier-persist';
import { evaluateWorkshop2InspectorReportSampleGate } from '@/lib/production/workshop2-inspector-report-dossier-persist';

export type Workshop2FitGoldApprovalGateResult = {
  allowed: boolean;
  checks: Workshop2HandoffReadinessCheck[];
};

export function evaluateWorkshop2FitGoldApprovalGate(input: {
  dossier: Workshop2DossierPhase1 | null;
  fitGold: FitGoldSnapshot;
  hasActiveSampleOrder: boolean;
  /** true — снятие утверждения (revoke), gate не применяется. */
  revoking?: boolean;
}): Workshop2FitGoldApprovalGateResult {
  if (input.revoking || input.fitGold.goldApproved) {
    return { allowed: true, checks: [] };
  }

  const checks: Workshop2HandoffReadinessCheck[] = [];
  const sessions = input.fitGold.sessions ?? [];
  const fitStatus = summarizeWorkshop2FitSessionsStatus({ sessions });

  if (sessions.length === 0) {
    checks.push({
      id: 'fit.gold.no_sessions',
      severity: 'blocker',
      messageRu: 'Нет сессий примерки — добавьте proto/SMS/PPS перед утверждением эталона.',
    });
  }

  const approvedSessions = sessions.filter(
    (s) => s.status === 'approved' || s.status === 'approved_with_comments'
  );
  if (sessions.length > 0 && approvedSessions.length === 0) {
    checks.push({
      id: 'fit.gold.no_approved_session',
      severity: 'blocker',
      messageRu:
        'Нет approved-сессии — смените статус хотя бы одной примерки на approved или approved_with_comments.',
    });
  }

  if (!input.hasActiveSampleOrder) {
    checks.push({
      id: 'fit.gold.no_sample_order',
      severity: 'warning',
      messageRu:
        'Нет активного заказа образца — создайте sample-order для трассировки linkedSampleOrderId.',
    });
  }

  if (input.dossier) {
    const fitMirrorGate = evaluateWorkshop2FitSessionsHandoffGate(input.dossier);
    if (fitMirrorGate) checks.push(fitMirrorGate);

    const goldSummary = summarizeWorkshop2GoldSampleStatus({
      gold: input.dossier.goldSampleStatus,
      hasActiveSampleOrder: input.hasActiveSampleOrder,
    });
    if (goldSummary.state === 'rejected') {
      checks.push({
        id: 'fit.gold.dossier_rejected',
        severity: 'blocker',
        messageRu: 'Эталон в досье отклонён — повторная примерка перед утверждением.',
      });
    }
  } else {
    checks.push({
      id: 'fit.gold.dossier_missing',
      severity: 'warning',
      messageRu: 'Досье не загружено — утверждение сохранится только в bundle до PUT dossier.',
    });
  }

  if (fitStatus.state === 'partial') {
    checks.push({
      id: 'fit.gold.sessions_partial',
      severity: 'warning',
      messageRu:
        fitStatus.hintRu ??
        'Сессии без vault-фото — рекомендуется photoVaultDocumentId перед gold approval.',
    });
  }

  const fitCommentsGate = evaluateWorkshop2FitCommentsGoldGate({ dossier: input.dossier });
  if (fitCommentsGate) checks.push(fitCommentsGate);

  if (input.dossier) {
    const aqlGate = evaluateWorkshop2QcAqlSampleGate(input.dossier);
    if (aqlGate?.severity === 'blocker') checks.push(aqlGate);
    else if (aqlGate) checks.push(aqlGate);

    const inspectorGate = evaluateWorkshop2InspectorReportSampleGate(input.dossier);
    if (inspectorGate) checks.push(inspectorGate);
  }

  const blockers = checks.filter((c) => c.severity === 'blocker');
  return { allowed: blockers.length === 0, checks };
}
