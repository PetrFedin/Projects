import type {
  ControlOutput,
  ControlOwnerRef,
  DeadlinePressureState,
  NextAction,
  ReadinessSummary,
  ReasonPayload,
} from '@/lib/contracts';
import { validateControlOutput, validateNextAction } from '@/lib/contracts';
import { DiscrepancyReport } from '../logic/inventory-reconciliation';

/**
 * [Phase 2 — Inventory Control Adapter]
 * Адаптер для превращения отчетов о расхождениях стока в сигналы Control Layer.
 */

export const INVENTORY_CONTROL_ADAPTER_VERSION = 'inventory-control-output.v1.0';

export interface InventoryControlInput {
  sku: string;
  report: DiscrepancyReport;
  as_of: string;
  owner?: ControlOwnerRef;
}

export function buildInventoryControlOutput(input: InventoryControlInput): ControlOutput {
  const { report, sku, as_of, owner } = input;

  // 1. Определяем статус и риск на основе серьезности расхождения
  let status: ControlOutput['status'] = 'ok';
  let risk: ControlOutput['risk'] = 'low';

  if (report.severity === 'critical') {
    status = 'blocked';
    risk = 'high';
  } else if (report.severity === 'high') {
    status = 'attention';
    risk = 'medium';
  } else if (report.severity === 'medium') {
    status = 'attention';
    risk = 'low';
  }

  // 2. Формируем причины (Reasons)
  const reasons: ReasonPayload[] = [
    {
      code: 'INVENTORY_SHORT',
      params: {
        sku,
        diff: String(report.diff),
        severity: report.severity,
        channel: report.channelId || 'all',
      },
    },
  ];

  // 3. Формируем следующий шаг (Next Action)
  const next_action: NextAction = {
    action_id: `reconcile-${sku}-${Date.now()}`,
    action_type: 'OTHER',
    entity_ref: {
      entity_type: 'sku_balance',
      entity_id: sku,
      label: `Reconcile stock for ${sku}`,
    },
    reason: reasons,
    owner: owner || { role: 'merchandiser' },
    due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // +24h
    source: { kind: 'derived', rule_id: 'inventory_reconciliation' },
    status: 'open',
    explainability: {
      rule_id: 'inventory_reconciliation',
      inputs_hash: `merch:${report.merchQuantity}:ledger:${report.ledgerQuantity}`,
    },
  };

  const output: ControlOutput = {
    entity_ref: {
      entity_type: 'sku_balance',
      entity_id: sku,
      label: `Inventory: ${sku}`,
    },
    status,
    risk,
    blocker_summary: {
      count: report.severity === 'critical' ? 1 : 0,
      highest_severity: report.severity === 'critical' ? 'critical' : 'info',
      top_blocker_ids: report.severity === 'critical' ? ['CRITICAL_STOCK_MISMATCH'] : [],
    },
    readiness_summary: {
      dimensions: [
        {
          key: 'stock_integrity',
          state: report.diff === 0 ? 'ready' : 'not_ready',
          gap_codes: report.diff !== 0 ? reasons : [],
        },
      ],
    },
    deadline_pressure: { level: 'none' },
    next_action,
    reasons,
    as_of,
    version: `${INVENTORY_CONTROL_ADAPTER_VERSION}:${as_of.slice(0, 10)}:${sku}`,
  };

  const v = validateControlOutput(output);
  if (!v.ok) throw new Error(`Inventory ControlOutput validation failed: ${v.errors.join('; ')}`);

  return output;
}
