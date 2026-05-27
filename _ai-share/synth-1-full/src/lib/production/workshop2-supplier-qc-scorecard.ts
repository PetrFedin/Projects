/**
 * Scorecard поставщика из реальных PO Workshop2 (не фиксированный mock).
 */

import type { Workshop2PurchaseOrderRecord } from '@/lib/server/workshop2-purchase-order-repository';

export type Workshop2SupplierQcScorecard = {
  supplierId: string;
  totalBatches: number;
  passed: number;
  failed: number;
  rework: number;
  passRate: number;
  defectTypes: { name: string; value: number }[];
  /** Откуда взяты цифры — для честного UI. */
  source: 'purchase_orders' | 'empty';
  hintRu?: string;
};

function defectLabelFromPo(po: Workshop2PurchaseOrderRecord): string {
  const payload = po.payload ?? {};
  const fromPayload =
    (typeof payload.defectType === 'string' && payload.defectType.trim()) ||
    (typeof payload.materialLabel === 'string' && payload.materialLabel.trim()) ||
    (typeof payload.lineRef === 'string' && payload.lineRef.trim());
  if (fromPayload) return fromPayload;
  return po.status === 'error' ? 'Ошибка ERP / PO' : 'Закупка (PO)';
}

/** Агрегирует PO по supplierId: synced=принято, error=брак, draft/pending=rework. */
export function buildWorkshop2SupplierQcScorecardFromPurchaseOrders(
  supplierId: string,
  orders: Workshop2PurchaseOrderRecord[]
): Workshop2SupplierQcScorecard {
  const sid = supplierId.trim();
  const rows = orders.filter((o) => (o.supplierId ?? '').trim() === sid);

  if (rows.length === 0) {
    return {
      supplierId: sid,
      totalBatches: 0,
      passed: 0,
      failed: 0,
      rework: 0,
      passRate: 0,
      defectTypes: [],
      source: 'empty',
      hintRu: 'Нет заказов на закупку (PO) с этим supplierId — создайте PO на вкладке «План».',
    };
  }

  let passed = 0;
  let failed = 0;
  let rework = 0;
  const defectMap = new Map<string, number>();

  for (const po of rows) {
    if (po.status === 'synced') passed += 1;
    else if (po.status === 'error') failed += 1;
    else rework += 1;

    if (po.status === 'error') {
      const label = defectLabelFromPo(po);
      defectMap.set(label, (defectMap.get(label) ?? 0) + 1);
    }
  }

  const totalBatches = rows.length;
  const passRate = totalBatches > 0 ? (passed / totalBatches) * 100 : 0;
  const defectTypes = [...defectMap.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return {
    supplierId: sid,
    totalBatches,
    passed,
    failed,
    rework,
    passRate,
    defectTypes,
    source: 'purchase_orders',
    hintRu:
      defectTypes.length === 0
        ? 'Диаграмма дефектов строится по PO со статусом error; успешные PO учтены в pass rate.'
        : undefined,
  };
}
