/**
 * Сохранение расчёта AQL в досье (qcAqlInspectionLog).
 */
import type {
  Workshop2DossierPhase1,
  Workshop2QcAqlInspectionRecord,
} from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2QcAqlPersistInput = {
  orderQty: number;
  qtySource: Workshop2QcAqlInspectionRecord['qtySource'];
  aqlLevel: string;
  sampleSize: number;
  criticalFound: number;
  majorFound: number;
  minorFound: number;
  majorRejectLimit: number;
  minorRejectLimit: number;
  isFail: boolean;
  batchId?: string;
  recordedBy?: string;
};

export function appendWorkshop2QcAqlInspectionToDossier(
  dossier: Workshop2DossierPhase1,
  input: Workshop2QcAqlPersistInput
): { dossier: Workshop2DossierPhase1; record: Workshop2QcAqlInspectionRecord } {
  const record: Workshop2QcAqlInspectionRecord = {
    id: `aql-${Date.now().toString(36)}`,
    recordedAt: new Date().toISOString(),
    recordedBy: input.recordedBy?.trim().slice(0, 120),
    orderQty: input.orderQty,
    qtySource: input.qtySource,
    aqlLevel: input.aqlLevel,
    sampleSize: input.sampleSize,
    criticalFound: input.criticalFound,
    majorFound: input.majorFound,
    minorFound: input.minorFound,
    majorRejectLimit: input.majorRejectLimit,
    minorRejectLimit: input.minorRejectLimit,
    isFail: input.isFail,
    ...(input.batchId?.trim() ? { batchId: input.batchId.trim() } : {}),
  };

  const prev = dossier.qcAqlInspectionLog ?? [];
  return {
    dossier: {
      ...dossier,
      qcAqlInspectionLog: [record, ...prev].slice(0, 30),
    },
    record,
  };
}
