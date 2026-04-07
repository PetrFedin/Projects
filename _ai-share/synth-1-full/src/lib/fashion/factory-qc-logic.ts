import type { Product } from '@/lib/types';
import type { FactoryInspectionV1, QcCheckItemV1 } from './types';

export function getInitialQcChecklist(): QcCheckItemV1[] {
  return [
    { id: '1', label: 'Швы и строчки (Seam quality)', status: 'pending' },
    { id: '2', label: 'Соответствие лекалам (Measurement spec)', status: 'pending' },
    { id: '3', label: 'Фурнитура и молнии (Trims/Zippers)', status: 'pending' },
    { id: '4', label: 'Чистота и упаковка (Final packing)', status: 'pending' },
    { id: '5', label: 'Маркировка и бирки (Labeling)', status: 'pending' },
  ];
}

/** Демо-загрузка отчетов ОТК (QC). */
export function getProductQcStatus(sku: string): FactoryInspectionV1 | null {
  // Demo mock: only some SKUs have inspection reports
  if (sku.length % 2 === 0) return null;

  return {
    sku,
    inspector: 'John Chen (Factory QC)',
    date: '2026-03-25',
    checks: [
      { id: '1', label: 'Seam quality', status: 'pass' },
      { id: '2', label: 'Measurement spec', status: 'pass' },
      { id: '3', label: 'Trims/Zippers', status: 'fail', comment: 'Button loose on 5% of batch' },
      { id: '4', label: 'Final packing', status: 'pass' },
      { id: '5', label: 'Labeling', status: 'pass' },
    ],
    overallResult: 'rework',
  };
}
