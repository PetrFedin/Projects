import {
  ControlOutput,
  EntityRef,
  ReasonPayload,
  BlockerSummary,
  ReadinessSummary,
  NextAction,
} from '@/lib/contracts';
import { ArticleReadinessEngine } from '@/lib/production/article-readiness-engine';
import {
  InventoryReconciliationService,
  MerchStockSnapshot,
} from '@/lib/logic/inventory-reconciliation';
import { InventoryGrain } from '@/lib/logic/inventory-ledger';
import { PartnerKPIEngine } from '@/lib/execution-linkage/partner-kpi-engine';
import { ExecutionPartner } from '@/lib/execution-linkage/execution-partner-schemas';
import { ProductionCommitment } from '@/lib/production/production-schemas';
import { PredictiveRiskEngine } from './predictive-risk';
import { MultiPartyControlService, multiPartyControl } from './multi-party-control';

/**
 * [Phase 2 — Unified Control Aggregator]
 * Центральный оркестратор, который собирает сигналы из всех специализированных движков
 * (Readiness, Reconciliation, KPI, Predictive, Multi-party) и формирует единый ControlOutput.
 */
export class UnifiedControlAggregator {
  /**
   * Агрегирует состояние артикула (Article).
   */
  public static aggregateArticle(params: {
    article: any;
    productionCommitment?: ProductionCommitment;
    merchSnapshot?: MerchStockSnapshot;
    ledgerGrains?: InventoryGrain[];
    partner?: ExecutionPartner;
    actorId: string;
  }): ControlOutput {
    const { article, productionCommitment, merchSnapshot, ledgerGrains, partner, actorId } = params;
    const asOf = new Date().toISOString();

    // 1. Считаем готовность (Readiness Engine)
    const readiness = ArticleReadinessEngine.calculate(article, productionCommitment?.status);

    // 2. Проверяем расхождения стока (Reconciliation Service)
    let discrepancyReport = null;
    if (merchSnapshot && ledgerGrains) {
      // Имитируем tenantId для вызова (в реальности он должен приходить в params)
      const tenantId = actorId.split('-')[0] || 'default-tenant';
      const reports = InventoryReconciliationService.reconcile(
        [merchSnapshot],
        ledgerGrains,
        actorId,
        tenantId
      );
      discrepancyReport = reports.length > 0 ? reports[0] : null;
    }

    // 3. Анализируем риски партнера (KPI Engine)
    let partnerRisk: 'low' | 'medium' | 'high' = 'low';
    if (partner) {
      if (partner.kpi.rating < 3 || partner.kpi.avgDelayDays > 7) {
        partnerRisk = 'high';
      } else if (partner.kpi.rating < 4) {
        partnerRisk = 'medium';
      }
    }

    // 4. Формируем итоговый статус и риск
    let status: ControlOutput['status'] = 'ok';
    let risk: ControlOutput['risk'] = partnerRisk;

    if (discrepancyReport?.severity === 'critical' || !readiness.isPublishable) {
      status = 'attention';
      if (discrepancyReport?.severity === 'critical') risk = 'high';
    }

    // 5. Собираем причины (Reasons)
    const reasons: ReasonPayload[] = [];
    readiness.blockers.forEach((b) =>
      reasons.push({ code: 'READINESS_GAP' as any, params: { detail: b } })
    );
    if (discrepancyReport) {
      reasons.push({
        code: 'STOCK_DISCREPANCY' as any,
        params: { diff: String(discrepancyReport.diff), severity: discrepancyReport.severity },
      });
    }

    // 6. Формируем BlockerSummary
    const blocker_summary: BlockerSummary = {
      count: readiness.blockers.length + (discrepancyReport?.severity === 'critical' ? 1 : 0),
      highest_severity: discrepancyReport?.severity === 'critical' ? 'critical' : 'warning',
      top_blocker_ids: readiness.blockers.slice(0, 3),
    };

    // 7. Формируем ReadinessSummary
    const readiness_summary: ReadinessSummary = {
      dimensions: [
        {
          key: 'content',
          state: readiness.score > 80 ? 'ready' : 'not_ready',
          gap_codes: readiness.missingFields.map((f) => ({
            code: 'MISSING_DATA' as any,
            params: { field: f },
          })),
        },
        {
          key: 'production',
          state: productionCommitment?.status === 'completed' ? 'ready' : 'not_ready',
          gap_codes: productionCommitment ? [] : [{ code: 'NO_PRODUCTION_PLAN' as any }],
        },
      ],
      rollup_score: readiness.score / 100,
    };

    // 8. Определяем приоритетный Next Action
    let next_action: NextAction | null = null;
    if (discrepancyReport?.actionRequired) {
      next_action = {
        action_id: `act-reconcile-${Date.now()}`,
        entity_ref: { entity_type: 'article', entity_id: article.id },
        action_type: 'OTHER',
        reason: [{ code: 'UNKNOWN' as any }],
        owner: { role: 'merchandiser' },
        status: 'open',
        source: { kind: 'derived', rule_id: 'rule-inventory-integrity' },
        explainability: 'Stock mismatch detected between Merch and Ledger',
      };
    } else if (!readiness.isPublishable) {
      next_action = {
        action_id: `act-ready-${Date.now()}`,
        entity_ref: { entity_type: 'article', entity_id: article.id },
        action_type: 'OTHER',
        reason: [{ code: 'READINESS_GAP' as any }],
        owner: { role: 'content_manager' },
        status: 'open',
        source: { kind: 'derived', rule_id: 'rule-article-readiness' },
        explainability: `Missing: ${readiness.missingFields.join(', ')}`,
      };
    }

    let output: ControlOutput = {
      entity_ref: {
        entity_type: 'article',
        entity_id: article.id,
        label: article.name,
      },
      status,
      risk,
      blocker_summary,
      readiness_summary,
      deadline_pressure: {
        level: productionCommitment ? 'none' : 'due_today',
        next_deadline_at: productionCommitment?.plannedEndDate,
      },
      next_action,
      reasons,
      as_of: asOf,
      version: `unified-v1:${asOf.slice(0, 10)}:${article.id}`,
    };

    // 9. Обогащаем прогностическими данными (Phase 3)
    if (productionCommitment && partner) {
      const prediction = PredictiveRiskEngine.predict(productionCommitment, partner);
      output = PredictiveRiskEngine.augmentWithPredictions(output, prediction);
    }

    // 10. Обогащаем данными Multi-party Gates (Phase 3)
    output = multiPartyControl.augmentControlWithGates(output);

    return output;
  }
}
