import type {
  Workshop2DossierPhase1,
  Workshop2SampleIntakeRelease,
  Workshop2SampleProductionChainMode,
} from '@/lib/production/workshop2-dossier-phase1.types';

export type SampleIntakeValidation = {
  ok: boolean;
  missing: string[];
};

/** Режим цепочки производства → подсказки обязательности (без второго каталога атрибутов). */
export const SAMPLE_PRODUCTION_CHAIN_LABELS: Record<Workshop2SampleProductionChainMode, string> = {
  rf_sewn: 'Пошив в РФ (готовое изделие в России)',
  rf_import_materials: 'Пошив в РФ, сырьё/фурнитура с импортом',
  import_finished: 'Готовое изделие — импорт',
  eaeu_mixed: 'Цепочка ЕАЭС (смешанная)',
  non_eaeu: 'Вне ЕАЭС / иной маршрут',
};

export function validateSampleIntakeForCollection(
  dossier: Workshop2DossierPhase1 | null
): SampleIntakeValidation {
  const missing: string[] = [];
  if (!dossier) {
    return { ok: false, missing: ['Досье не загружено'] };
  }
  const mode = dossier.sampleProductionChainMode;
  if (!mode) {
    missing.push('Выберите режим цепочки производства');
  }
  const r: Workshop2SampleIntakeRelease = dossier.sampleIntakeRelease ?? {};

  if (mode === 'rf_sewn' || mode === 'rf_import_materials') {
    if (!r.sewnInRussiaConfirmed) {
      missing.push('Отметьте: пошив / изготовление в РФ подтверждены');
    }
  }

  const need = (cond: boolean, label: string) => {
    if (cond) missing.push(label);
  };

  need(!r.countryOfOriginActual?.trim(), 'Страна происхождения товара (факт после образца)');
  need(!r.finalTnvedCode?.trim(), 'ТН ВЭД утверждённый под отгрузку');
  need(!r.eanOrBatchCode?.trim(), 'EAN / GTIN или код партии');
  need(!r.markingTraceabilityNote?.trim(), 'Маркировка и прослеживаемость (итог)');
  need(!r.technicalRegulationRef?.trim(), 'ТР ТС / ЕАЭС — реквизит или ссылка');
  need(!r.okpd2Note?.trim(), 'ОКПД2 / отраслевой код (примечание)');

  if (mode === 'import_finished' || mode === 'non_eaeu' || mode === 'eaeu_mixed') {
    need(!r.declarationOrCertificateRef?.trim(), 'Реквизиты декларации соответствия / сертификата');
  }

  return { ok: missing.length === 0, missing };
}
