import { exportToCSV } from '@/lib/production-export-utils';
import type { Workshop2SmartRoutingOperation } from '@/lib/production/workshop2-dossier-phase1.types';

function sanitizeCsvBasename(raw: string): string {
  const t = raw.trim() || 'workshop2-routing';
  return t
    .replace(/[^\w.\-]+/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 120);
}

/** Экспорт техпоследовательности в UTF-8 CSV (BOM для Excel). */
export function downloadWorkshop2SmartRoutingCsv(
  operations: Workshop2SmartRoutingOperation[],
  baseFileName: string
): void {
  let cum = 0;
  const data = operations.map((op, i) => {
    cum += op.sash;
    return {
      step_no: i + 1,
      category: op.category,
      operation_name: op.name,
      equipment: op.equipment,
      sash_minutes: op.sash,
      cumulative_sash_minutes: Number(cum.toFixed(2)),
    };
  });
  exportToCSV(
    data,
    [
      { key: 'step_no', label: 'Шаг' },
      { key: 'category', label: 'Группа' },
      { key: 'operation_name', label: 'Операция' },
      { key: 'equipment', label: 'Оборудование' },
      { key: 'sash_minutes', label: 'SASH_мин' },
      { key: 'cumulative_sash_minutes', label: 'SASH_накопительно_мин' },
    ],
    sanitizeCsvBasename(baseFileName)
  );
}
