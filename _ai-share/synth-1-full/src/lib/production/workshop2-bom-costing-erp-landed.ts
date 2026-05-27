/**
 * Wave 2 #7: optional landed-cost lines from ERP-synced PO payload (honest — только с erpExternalId).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { isWorkshop2LiveErpConfigured } from '@/lib/production/workshop2-live-integration-probes-env';

export type Workshop2ErpLandedCostLine = {
  poId: string;
  lineRef?: string;
  category: 'fabric' | 'trim' | 'cmt' | 'logistics' | 'other';
  amount: number;
  currency: string;
  erpExternalId: string;
};

export type Workshop2ErpLandedCostImport = {
  configured: boolean;
  applied: boolean;
  lines: Workshop2ErpLandedCostLine[];
  fabricTotal: number;
  trimTotal: number;
  cmtTotal: number;
  logisticsStubTotal: number;
  currency: string;
  hintRu: string;
};

type PoLike = {
  id: string;
  lineRef?: string;
  erpExternalId?: string | null;
  payload?: Record<string, unknown>;
};

function readPayloadNumber(payload: Record<string, unknown>, keys: string[]): number | undefined {
  for (const k of keys) {
    const v = payload[k];
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string' && v.trim()) {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return undefined;
}

function inferCategory(
  payload: Record<string, unknown>,
  lineRef?: string
): Workshop2ErpLandedCostLine['category'] {
  const raw = String(payload.category ?? payload.costCategory ?? lineRef ?? '').toLowerCase();
  if (raw.includes('fabric') || raw.includes('ткан')) return 'fabric';
  if (raw.includes('trim') || raw.includes('фурн')) return 'trim';
  if (raw.includes('cmt') || raw.includes('шв')) return 'cmt';
  if (raw.includes('logist') || raw.includes('freight') || raw.includes('логист'))
    return 'logistics';
  return 'other';
}

/** Импорт landed cost только из PO с реальным erpExternalId — без fake ACK. */
export function importWorkshop2ErpLandedCostLines(input: {
  dossier: Workshop2DossierPhase1;
  purchaseOrders?: PoLike[];
  env?: Record<string, string | undefined>;
}): Workshop2ErpLandedCostImport {
  const env = input.env ?? process.env;
  const configured = isWorkshop2LiveErpConfigured(env);
  const mirror = input.dossier.purchaseOrderErpMirror;
  const currency = 'RUB';

  if (!configured) {
    return {
      configured: false,
      applied: false,
      lines: [],
      fabricTotal: 0,
      trimTotal: 0,
      cmtTotal: 0,
      logisticsStubTotal: 0,
      currency,
      hintRu:
        'Landed cost ERP: задайте WORKSHOP2_FACTORY_ERP_BASE_URL — без env цифры не подставляются.',
    };
  }

  if (mirror?.fakeSyncedCount && mirror.fakeSyncedCount > 0) {
    return {
      configured: true,
      applied: false,
      lines: [],
      fabricTotal: 0,
      trimTotal: 0,
      cmtTotal: 0,
      logisticsStubTotal: 0,
      currency,
      hintRu: mirror.hintRu ?? 'PO synced без erpOrderId — landed cost из ERP заблокирован.',
    };
  }

  const pos = input.purchaseOrders ?? [];
  const lines: Workshop2ErpLandedCostLine[] = [];

  for (const po of pos) {
    const erpId = po.erpExternalId?.trim();
    if (!erpId) continue;
    const payload = po.payload ?? {};
    const amount =
      readPayloadNumber(payload, ['landedCostRub', 'landedCost', 'unitCostTotal', 'amount']) ?? 0;
    if (amount <= 0) continue;
    lines.push({
      poId: po.id,
      lineRef: po.lineRef,
      category: inferCategory(payload, po.lineRef),
      amount,
      currency: String(payload.currency ?? currency),
      erpExternalId: erpId,
    });
  }

  let fabricTotal = 0;
  let trimTotal = 0;
  let cmtTotal = 0;
  let logisticsStubTotal = 0;
  for (const line of lines) {
    switch (line.category) {
      case 'fabric':
        fabricTotal += line.amount;
        break;
      case 'trim':
        trimTotal += line.amount;
        break;
      case 'cmt':
        cmtTotal += line.amount;
        break;
      case 'logistics':
        logisticsStubTotal += line.amount;
        break;
      default:
        fabricTotal += line.amount * 0.5;
        trimTotal += line.amount * 0.5;
        break;
    }
  }

  const applied = lines.length > 0;
  return {
    configured: true,
    applied,
    lines,
    fabricTotal,
    trimTotal,
    cmtTotal,
    logisticsStubTotal,
    currency,
    hintRu: applied
      ? `ERP landed cost: ${lines.length} строк(и) с erpOrderId — fabric/trim/CMT/logistics rollup.`
      : 'ERP настроен, но нет PO с erpOrderId и landedCost в payload — синхронизируйте PO → ERP.',
  };
}
