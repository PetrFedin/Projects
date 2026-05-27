/**
 * Wave 17 RU: одна строка статуса вкладки «Приёмка» — internal WMS + подсказка МойСклад (reuse dossier mirrors).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/** Сводка подключения склада без новых API — только mirrors / PG balances count. */
export function summarizeWorkshop2StockPaneConnectedStatusRu(input: {
  dossier?: Workshop2DossierPhase1 | null;
  wmsBalanceCount?: number;
  wmsFailClosed?: boolean;
}): string {
  const parts: string[] = [];
  const internal = input.dossier?.internalWmsMirror;
  const ledger = input.dossier?.stockWmsLedger;

  if (input.wmsFailClosed) {
    parts.push('Internal WMS: fail-closed (PG недоступен)');
  } else if (internal?.mirroredAt) {
    parts.push(
      `Internal WMS: ${internal.itemCount} поз. · резерв ${internal.reservedQty ?? 0} · on-hand ${internal.onHandQty ?? '—'}`
    );
  } else if ((input.wmsBalanceCount ?? 0) > 0) {
    parts.push(`Internal WMS: ${input.wmsBalanceCount} поз. (PG balances)`);
  } else if (ledger?.ledgerAt) {
    parts.push(
      `Internal WMS: ledger · ${ledger.movementCount} движ. · остаток ${ledger.qtyOnHand}`
    );
  } else {
    parts.push('Internal WMS: не подключён — резерв на «Снабжение»');
  }

  const moyJournal = [...(internal?.memoryJournal ?? [])]
    .reverse()
    .find((j) => j.messageRu?.includes('МойСклад') || j.kind === 'sync');
  if (moyJournal?.messageRu?.trim()) {
    parts.push(`МойСклад: ${moyJournal.messageRu.trim()}`);
  } else if (ledger?.hintRu?.includes('МойСклад')) {
    parts.push(`МойСклад: ${ledger.hintRu.trim()}`);
  } else {
    parts.push('МойСклад: импорт остатков — кнопка на «Снабжение»');
  }

  return parts.join(' · ');
}
