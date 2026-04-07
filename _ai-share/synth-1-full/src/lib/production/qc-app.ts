/**
 * Mobile QC App — приложение инспектора (AQL 2.5/4.0) с фотофиксацией брака.
 * РФ: связь с претензиями, Gold Sample, ЭДО. Инфра под API.
 */

export type AqlLevel = '2.5' | '4.0' | '6.5';

export type DefectSeverity = 'critical' | 'major' | 'minor';

export type QcInspectionStatus = 'draft' | 'in_progress' | 'passed' | 'rejected' | 'rework';

/** Дефект с фото */
export interface QcDefect {
  id: string;
  type: string;           // например "порез", "пятно", "несовпадение шва"
  severity: DefectSeverity;
  description?: string;
  /** URL фото (при API — загрузка в Storage) */
  photoUrl?: string;
  position?: string;      // зона на изделии
}

/** Инспекция партии */
export interface QcInspection {
  id: string;
  orderId?: string;       // PO или заказ
  batchId?: string;
  sku?: string;
  aqlLevel: AqlLevel;
  status: QcInspectionStatus;
  inspectedCount: number;
  defectCount: number;
  defects: QcDefect[];
  inspectedAt: string;     // ISO
  inspectorId?: string;
}

export const QC_APP_API = {
  listInspections: '/api/v1/production/qc/inspections',
  getInspection: '/api/v1/production/qc/inspections/:id',
  createInspection: '/api/v1/production/qc/inspections',
  addDefectPhoto: '/api/v1/production/qc/inspections/:id/defects',
  submitInspection: '/api/v1/production/qc/inspections/:id/submit',
} as const;
