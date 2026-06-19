/**
 * AQL калькулятор: qty источник, sample size, fail пороги.
 */
import type { AqlPlan } from '@/lib/production/aql-standards';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  evaluateWorkshop2QcAqlHandoffGate,
  evaluateWorkshop2QcAqlSampleGate,
} from '@/lib/production/workshop2-qc-aql-dossier-persist';
import { collectWorkshop2PanelExportGateChecks } from '@/lib/production/workshop2-panel-gate-ui';
import type { Workshop2ApiGateCheck } from '@/lib/production/workshop2-api-gate-messages';
import {
  workshop2PgMirrorNum,
  workshop2PgMirrorStr,
} from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export type Workshop2AqlQtySource = 'batch' | 'sample_order' | 'fallback';

export type Workshop2AqlInspectionStatus = {
  batchCount: number;
  orderQty: number;
  qtySource: Workshop2AqlQtySource;
  sampleSize: number;
  isFail: boolean;
  state: 'empty' | 'partial' | 'ready' | 'fail';
  hintRu?: string;
};

export function summarizeWorkshop2AqlInspectionStatus(input: {
  batchCount: number;
  orderQty: number;
  qtySource: Workshop2AqlQtySource;
  majorPlan: AqlPlan;
  criticalFound: number;
  majorFound: number;
  minorFound: number;
  minorRejectLimit: number;
}): Workshop2AqlInspectionStatus {
  const sampleSize = input.majorPlan.sampleSize;
  const isFail =
    input.criticalFound > 0 ||
    input.majorFound >= input.majorPlan.rejectLimit ||
    input.minorFound >= input.minorRejectLimit;

  let state: Workshop2AqlInspectionStatus['state'] = 'empty';
  if (input.batchCount > 0 || input.orderQty > 0) {
    state = isFail ? 'fail' : input.qtySource === 'fallback' ? 'partial' : 'ready';
  }

  let hintRu: string | undefined;
  if (input.batchCount === 0 && input.orderQty <= 0) {
    hintRu = 'Нет партии и qty — задайте batch или sample-order для AQL.';
  } else if (input.qtySource === 'fallback') {
    hintRu = 'Qty взята из ручного fallback — привяжите к sample-order или batchSize.';
  } else if (isFail) {
    hintRu = 'AQL fail — критические/major/minor превышают reject limit.';
  } else if (input.batchCount === 0) {
    hintRu = 'Партия QC не выбрана — расчёт по qty заказа образца.';
  }

  return {
    batchCount: input.batchCount,
    orderQty: input.orderQty,
    qtySource: input.qtySource,
    sampleSize,
    isFail,
    state,
    hintRu,
  };
}

/** Wave U — статус из dossier mirror (приоритет над локальным расчётом). */
export function summarizeWorkshop2AqlPanelDisplayFromMirror(input: {
  dossier?: Workshop2DossierPhase1 | null;
  live: Workshop2AqlInspectionStatus;
}): Workshop2AqlInspectionStatus {
  const mirror = input.dossier?.qcAqlMirror;
  if (!mirror?.recordedAt) return input.live;

  const sampleSize = workshop2PgMirrorNum(mirror, 'sampleSize');
  const state: Workshop2AqlInspectionStatus['state'] = mirror.isFail
    ? 'fail'
    : sampleSize > 0
      ? 'ready'
      : 'partial';

  return {
    ...input.live,
    orderQty: workshop2PgMirrorNum(mirror, 'orderQty') || input.live.orderQty,
    sampleSize: sampleSize || input.live.sampleSize,
    isFail: Boolean(mirror.isFail),
    state,
    hintRu: workshop2PgMirrorStr(mirror, 'hintRu') || input.live.hintRu,
  };
}

/** Gate checks перед sign-off / persist AQL mirror. */
export function collectWorkshop2AqlSignoffGateChecks(input: {
  dossier?: Workshop2DossierPhase1 | null;
  isFail: boolean;
}): Workshop2ApiGateCheck[] {
  const checks = collectWorkshop2PanelExportGateChecks({
    checks: input.dossier
      ? [
          evaluateWorkshop2QcAqlSampleGate(input.dossier),
          evaluateWorkshop2QcAqlHandoffGate(input.dossier),
        ]
      : [],
  });
  if (input.isFail) {
    checks.unshift({
      id: 'qc.aql.live_fail',
      severity: 'blocker',
      messageRu: 'Текущий расчёт AQL — брак. Скорректируйте дефекты перед сохранением mirror.',
    });
  }
  if (!input.dossier) {
    checks.push({
      id: 'qc.aql.no_dossier',
      severity: 'blocker',
      messageRu: 'Нет досье — откройте артикул из коллекции для persist AQL mirror.',
    });
  }
  return checks;
}
