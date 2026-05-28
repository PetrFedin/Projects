/**
 * Подстановка строк POM из шаблона справочника, если табель пуст.
 */
import type {
  Workshop2DossierPhase1,
  Workshop2ProductionMeasurement,
  Workshop2ProductionModel,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2PomTemplateRow } from '@/lib/production/workshop2-reference-seeds';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function measurementsEmpty(model: Workshop2ProductionModel): boolean {
  return !model.measurements?.length;
}

/** Создаёт строки мерок по dimensionLabels шаблона (базовый размер M). */
export function buildPomMeasurementsFromTemplate(
  tpl: Workshop2PomTemplateRow,
  baseSize = 'M'
): Workshop2ProductionMeasurement[] {
  return tpl.dimensionLabels.map((label, i) => ({
    id: uid('pom'),
    code: `POM-${String(i + 1).padStart(2, '0')}`,
    label: label.trim(),
    size: baseSize,
  }));
}

/** Если productionModel.measurements пуст — заполняет первым шаблоном для leaf. */
export function applyWorkshop2PomTemplateIfMeasurementsEmpty(
  dossier: Workshop2DossierPhase1,
  templates: Workshop2PomTemplateRow[]
): Workshop2DossierPhase1 | null {
  if (!templates.length) return null;
  const model = ensureWorkshop2ProductionModel(dossier);
  if (!measurementsEmpty(model)) return null;
  const tpl = templates[0]!;
  return mergeWorkshop2PomTemplateIntoDossier(dossier, tpl, 'replace');
}

function normalizeMeasurementLabel(label: string): string {
  return label.trim().toLowerCase();
}

/**
 * Подставляет строки POM из шаблона.
 * - replace: полностью заменяет табель (если был пуст — то же, что fill_empty)
 * - merge: добавляет мерки, которых ещё нет по label (без учёта регистра)
 */
export function mergeWorkshop2PomTemplateIntoDossier(
  dossier: Workshop2DossierPhase1,
  tpl: Workshop2PomTemplateRow,
  mode: 'replace' | 'merge' = 'merge'
): Workshop2DossierPhase1 | null {
  if (!tpl.dimensionLabels.length) return null;
  const model = ensureWorkshop2ProductionModel(dossier);
  const incoming = buildPomMeasurementsFromTemplate(tpl);
  if (mode === 'replace' || measurementsEmpty(model)) {
    return {
      ...dossier,
      productionModel: { ...model, measurements: incoming },
    };
  }
  const existingLabels = new Set(
    (model.measurements ?? []).map((m) => normalizeMeasurementLabel(m.label))
  );
  const toAdd = incoming.filter((m) => !existingLabels.has(normalizeMeasurementLabel(m.label)));
  if (!toAdd.length) return null;
  return {
    ...dossier,
    productionModel: {
      ...model,
      measurements: [...(model.measurements ?? []), ...toAdd],
    },
  };
}
