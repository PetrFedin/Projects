import type { BrandProductionState } from './types';
import { ARTICLE_LIFECYCLE_LABELS, type ArticleLifecycleStage } from './types';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface ProductionAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  detail: string;
  href?: string;
  collectionId?: string;
  articleId?: string;
  poId?: string;
}

export function computeProductionAlerts(state: BrandProductionState): ProductionAlert[] {
  const alerts: ProductionAlert[] = [];
  const today = new Date();

  for (const art of state.articles) {
    const col = state.collections.find((c) => c.id === art.collectionId);
    if (art.lifecycleStage === 'tech_pack' && art.targetTechPackDate) {
      const d = new Date(art.targetTechPackDate);
      const days = Math.ceil((d.getTime() - today.getTime()) / 86400000);
      if (days >= 0 && days <= 14) {
        alerts.push({
          id: `tp-${art.id}`,
          severity: days <= 7 ? 'critical' : 'warning',
          title: 'Дедлайн техпака',
          detail: `${art.sku}: техпак к ${art.targetTechPackDate} (${days} дн.)`,
          collectionId: art.collectionId,
          articleId: art.id,
          href: `/brand/production/tech-pack/${art.sku}`,
        });
      }
    }
    if (!art.goldSampleApproved && art.lifecycleStage === 'samples') {
      alerts.push({
        id: `gs-${art.id}`,
        severity: 'warning',
        title: 'Нет Gold Sample',
        detail: `${art.sku}: без утверждённого сэмпла нельзя выставить PO.`,
        collectionId: art.collectionId,
        articleId: art.id,
        href: '/brand/production/gold-sample',
      });
    }
  }

  for (const po of state.purchaseOrders) {
    if (po.status === 'sent' || po.status === 'draft') {
      alerts.push({
        id: `po-conf-${po.id}`,
        severity: 'warning',
        title: 'PO без подтверждения фабрики',
        detail: `${po.code}: статус «${po.status}».`,
        poId: po.id,
        collectionId: po.collectionId,
        href: '/brand/production/gantt',
      });
    }
    if (po.atRisk && po.criticalPathEnd) {
      const end = new Date(po.criticalPathEnd);
      const days = Math.ceil((end.getTime() - today.getTime()) / 86400000);
      if (days <= 30) {
        alerts.push({
          id: `po-risk-${po.id}`,
          severity: 'critical',
          title: 'Риск срыва критического пути',
          detail: `${po.code}: финиш ${po.criticalPathEnd}, осталось ~${days} дн.`,
          poId: po.id,
          collectionId: po.collectionId,
          href: '/brand/production/gantt',
        });
      }
    }
  }

  for (const bom of state.bomLines) {
    if (
      bom.purchaseStatus !== 'received' &&
      bom.purchaseStatus !== 'reserved' &&
      bom.etaToFactory
    ) {
      const art = state.articles.find((a) => a.id === bom.articleId);
      if (art?.targetCutDate) {
        const cut = new Date(art.targetCutDate);
        const eta = new Date(bom.etaToFactory);
        if (eta.getTime() > cut.getTime() - 7 * 86400000) {
          alerts.push({
            id: `bom-${bom.id}`,
            severity: 'warning',
            title: 'Материал к раскрою',
            detail: `${bom.materialName} для ${art?.sku}: ETA ${bom.etaToFactory}, раскрой ${art.targetCutDate}`,
            articleId: bom.articleId,
            href: '/brand/materials',
          });
        }
      }
    }
  }

  const failedQc = state.qcInspections.filter(
    (i) => i.blocksShipment && (i.result === 'fail' || i.result === 'rework')
  );
  for (const i of failedQc) {
    alerts.push({
      id: `qc-${i.id}`,
      severity: 'critical',
      title: 'QC блокирует отгрузку',
      detail: `PO ${i.poId}: ${i.result}. ${i.notes ?? ''}`,
      poId: i.poId,
      href: '/brand/production/qc-app',
    });
  }

  return alerts;
}

/** KPI по коллекции: распределение по этапам, заполненность BOM */
export function collectionKpi(state: BrandProductionState, collectionId: string) {
  const arts = state.articles.filter((a) => a.collectionId === collectionId);
  const byStage: Partial<Record<ArticleLifecycleStage, number>> = {};
  for (const a of arts) {
    byStage[a.lifecycleStage] = (byStage[a.lifecycleStage] ?? 0) + 1;
  }
  const bomFilled = arts.filter((a) => state.bomLines.some((b) => b.articleId === a.id)).length;
  const bomPct = arts.length ? Math.round((bomFilled / arts.length) * 100) : 0;
  const dropDeadline = state.collections.find((c) => c.id === collectionId)?.targetFirstDropDate;
  return {
    totalArticles: arts.length,
    byStage,
    bomPct,
    dropDeadline,
    labels: ARTICLE_LIFECYCLE_LABELS,
  };
}
