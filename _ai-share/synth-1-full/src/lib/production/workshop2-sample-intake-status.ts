/**
 * Sample Intake: compliance + gold gate (досье → склад).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  validateSampleIntakeForCollection,
  SAMPLE_PRODUCTION_CHAIN_LABELS,
  type SampleIntakeValidation,
} from '@/lib/production/workshop2-sample-intake-gate';

export type Workshop2SampleIntakeStatus = {
  validation: SampleIntakeValidation;
  missingCount: number;
  goldApproved: boolean;
  chainModeLabel?: string;
  /** EAN / код партии заполнен (wave 39 intake chain). */
  barcodeFilled: boolean;
  state: 'blocked' | 'partial' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2SampleIntakeStatus(
  dossier: Workshop2DossierPhase1 | null
): Workshop2SampleIntakeStatus {
  const validation = validateSampleIntakeForCollection(dossier);
  const missingCount = validation.missing.length;
  const goldApproved = dossier?.goldSampleStatus?.status === 'approved';
  const mode = dossier?.sampleProductionChainMode;
  const chainModeLabel = mode ? SAMPLE_PRODUCTION_CHAIN_LABELS[mode] : undefined;
  const barcodeFilled = Boolean(dossier?.sampleIntakeRelease?.eanOrBatchCode?.trim());

  let state: Workshop2SampleIntakeStatus['state'] = 'ready';
  if (!validation.ok && missingCount > 3) {
    state = 'blocked';
  } else if (!validation.ok) {
    state = 'partial';
  }

  let hintRu: string | undefined;
  if (state === 'ready') {
    hintRu = `Intake готов: цепочка «${chainModeLabel ?? '—'}», эталон утверждён, комплаенс закрыт.`;
  } else if (!goldApproved) {
    hintRu = 'Блокер: утвердите gold sample на вкладке «Примерка» до приёмки на склад.';
  } else if (!mode) {
    hintRu = 'Выберите режим цепочки производства (RF / импорт / ЕАЭС).';
  } else {
    hintRu = `Не хватает ${missingCount} полей intake: ${validation.missing.slice(0, 2).join('; ')}${missingCount > 2 ? '…' : ''}`;
  }

  return {
    validation,
    missingCount,
    goldApproved,
    chainModeLabel,
    barcodeFilled,
    state,
    hintRu,
  };
}
