/**
 * R&D state machine для артикула workshop2.
 * Статусы от CARD_CREATED до HANDED_OFF — единый слой для бейджей UI.
 */

import type { ArticleWorkspaceBundle } from './article-workspace/types';
import type { Workshop2DossierPhase1 } from './workshop2-dossier-phase1.types';
import type { Workshop2DossierLifecycleState } from './workshop2-dossier-phase1.types';
import { calculateDossierReadiness } from './dossier-readiness-engine';

/** Внешние milestone (factory ERP) — опционально, не подменяют dossier lifecycle. */
export type Workshop2RndExternalHints = {
  factoryErpSyncStatus?: 'not_configured' | 'configured' | 'synced' | 'error';
  factoryErpOrderId?: string | null;
};

export type RndArticleStatus =
  | 'CARD_CREATED'
  | 'TECH_PACK_IN_PROGRESS'
  | 'TZ_HANDOFF_READY'
  | 'SAMPLE_REQUESTED'
  | 'SAMPLE_IN_REVIEW'
  | 'GOLD_APPROVED'
  | 'PRODUCTION_READY'
  | 'HANDED_OFF';

export type RndStatusBadge = {
  status: RndArticleStatus;
  labelRu: string;
  tone: 'muted' | 'info' | 'warn' | 'success' | 'primary';
  title?: string;
};

const STATUS_LABELS: Record<RndArticleStatus, string> = {
  CARD_CREATED: 'Карточка создана',
  TECH_PACK_IN_PROGRESS: 'ТЗ в работе',
  TZ_HANDOFF_READY: 'ТЗ готово к передаче',
  SAMPLE_REQUESTED: 'Запрос образца',
  SAMPLE_IN_REVIEW: 'Образец на проверке',
  GOLD_APPROVED: 'Gold · сэмпл принят',
  PRODUCTION_READY: 'Готов к производству',
  HANDED_OFF: 'Передан в цех',
};

/**
 * Вычисляет текущий R&D-статус по досье и операционному бандлу.
 */
export function resolveRndArticleStatus(
  dossier: Workshop2DossierPhase1 | null | undefined,
  bundle: ArticleWorkspaceBundle | null | undefined,
  hints?: Workshop2RndExternalHints,
  opts?: { canSendToFactory?: boolean; lifecycle?: Workshop2DossierLifecycleState }
): RndArticleStatus {
  if (!dossier) return 'CARD_CREATED';

  const readiness = calculateDossierReadiness(dossier, null);
  const lifecycle: Workshop2DossierLifecycleState =
    opts?.lifecycle ?? dossier.lifecycleState ?? 'draft';
  const gold = Boolean(bundle?.fitGold?.goldApproved);
  const hasPo = Boolean(
    bundle?.planPo?.purchaseOrders?.some(
      (po) => po.status === 'confirmed' || po.status === 'closed'
    )
  );
  const hasReleaseOps = Boolean((bundle?.release?.operations?.length ?? 0) > 0);
  const erpSynced =
    hints?.factoryErpSyncStatus === 'synced' && Boolean(hints.factoryErpOrderId?.trim());

  if (lifecycle === 'rework_requested') return 'TECH_PACK_IN_PROGRESS';
  if (lifecycle === 'accepted') return 'HANDED_OFF';
  if (lifecycle === 'sent_to_production') {
    return opts?.canSendToFactory === false ? 'TZ_HANDOFF_READY' : 'HANDED_OFF';
  }
  if (lifecycle === 'handoff_ready') return 'TZ_HANDOFF_READY';

  if (hasReleaseOps) return 'HANDED_OFF';
  if ((hasPo && readiness.summary.approvalsReady) || (erpSynced && gold)) return 'PRODUCTION_READY';
  if (gold) return 'GOLD_APPROVED';
  if (bundle?.fitGold?.fitComments?.length) return 'SAMPLE_IN_REVIEW';
  if (readiness.summary.readyForSample) return 'TZ_HANDOFF_READY';
  if (readiness.summary.exists) return 'TECH_PACK_IN_PROGRESS';
  return 'CARD_CREATED';
}

export function buildRndStatusTitleExtras(hints?: Workshop2RndExternalHints): string | undefined {
  if (hints?.factoryErpSyncStatus === 'synced' && hints.factoryErpOrderId?.trim()) {
    return `ERP: ${hints.factoryErpOrderId.trim()}`;
  }
  if (hints?.factoryErpSyncStatus === 'error') {
    return 'ERP: ошибка синхронизации';
  }
  if (hints?.factoryErpSyncStatus === 'configured') {
    return 'ERP: настроен, ожидает выгрузки';
  }
  return undefined;
}

export function rndStatusBadge(
  status: RndArticleStatus,
  opts?: { compact?: boolean; erpHint?: string }
): RndStatusBadge {
  const labelRu = STATUS_LABELS[status];
  const tone: RndStatusBadge['tone'] =
    status === 'HANDED_OFF' || status === 'PRODUCTION_READY' || status === 'GOLD_APPROVED'
      ? 'success'
      : status === 'TZ_HANDOFF_READY'
        ? 'primary'
        : status === 'SAMPLE_IN_REVIEW' || status === 'SAMPLE_REQUESTED'
          ? 'warn'
          : status === 'TECH_PACK_IN_PROGRESS'
            ? 'info'
            : 'muted';

  const titleParts = [`Статус жизненного цикла: ${labelRu}`];
  if (opts?.erpHint) titleParts.push(opts.erpHint);

  return {
    status,
    labelRu: opts?.compact ? labelRu.replace(' · ', ' ') : labelRu,
    tone,
    title: titleParts.join(' · '),
  };
}
