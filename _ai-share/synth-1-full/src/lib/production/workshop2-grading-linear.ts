import type { Workshop2GradingRow } from '@/lib/production/workshop2-dossier-phase1.types';

/** Описание одной строки линейной градации: база в точке базового размера + равномерный шаг на колонку. */
export type Workshop2LinearGradingPresetRow = {
  pointName: string;
  baseMeasurement: number;
  step: number;
};

/**
 * Строит строку `Workshop2GradingRow`: приращения линейны относительно `centerIndex`
 * (`increment[size] = (idx - centerIndex) * stepPerColumn`).
 */
export function buildLinearGradingRow(
  sizes: readonly string[],
  centerIndex: number,
  pointName: string,
  baseMeasurement: number,
  stepPerColumn: number,
  newId: () => string
): Workshop2GradingRow {
  const increments: Record<string, number> = {};
  for (let idx = 0; idx < sizes.length; idx++) {
    const s = sizes[idx]!;
    increments[s] = Number(((idx - centerIndex) * stepPerColumn).toFixed(4));
  }
  return { id: newId(), pointName, baseMeasurement, increments };
}

export function mapLinearGradingPresetsToRows(
  sizes: readonly string[],
  centerIndex: number,
  defs: readonly Workshop2LinearGradingPresetRow[],
  newId: () => string
): Workshop2GradingRow[] {
  return defs.map((d) =>
    buildLinearGradingRow(sizes, centerIndex, d.pointName, d.baseMeasurement, d.step, newId)
  );
}

/** Детерминированный снимок для сравнения «менялось ли содержимое градации» (порядок размеров и строк нормализован). */
export function serializeWorkshopGradingSnapshot(
  gradingSizes: string[] | undefined,
  gradingRules: Workshop2GradingRow[] | undefined
): string {
  const sizeKey = [...(gradingSizes ?? [])].join('\u001f');
  const rules = [...(gradingRules ?? [])].map((r) => ({
    id: r.id,
    pointName: r.pointName,
    baseMeasurement: r.baseMeasurement,
    fr: Boolean(r.gradingFrozen),
    step: r.gradingStep ?? 0,
    incKey: Object.keys(r.increments ?? {})
      .sort()
      .map((k) => `${k}=${r.increments[k]}`)
      .join('\u001e'),
  }));
  rules.sort((a, b) => {
    const byName = a.pointName.localeCompare(b.pointName, 'ru');
    if (byName !== 0) return byName;
    return a.baseMeasurement - b.baseMeasurement || a.id.localeCompare(b.id);
  });
  return JSON.stringify({ sizeKey, rules });
}

/** Пресеты для «Авто-градация» и «Авто по 3D-скану» (демо-числа; общая формула — `buildLinearGradingRow`). */
export const W2_LINEAR_GRADING_PRESETS = {
  apparel_auto: [
    { pointName: 'Длина изделия по спинке', baseMeasurement: 70, step: 2 },
    { pointName: 'Ширина на уровне груди', baseMeasurement: 52, step: 2 },
    { pointName: 'Длина рукава', baseMeasurement: 64, step: 1 },
  ] satisfies Workshop2LinearGradingPresetRow[],
  apparel_3d: [
    { pointName: 'Длина изделия по спинке (3D-оптимизация)', baseMeasurement: 71.5, step: 2.5 },
    { pointName: 'Ширина на уровне груди (3D-оптимизация)', baseMeasurement: 53.2, step: 2.2 },
    { pointName: 'Длина рукава (3D-оптимизация)', baseMeasurement: 65, step: 1.2 },
  ] satisfies Workshop2LinearGradingPresetRow[],
  shoes_auto: [
    { pointName: 'Длина стопы', baseMeasurement: 27, step: 0.5 },
    { pointName: 'Обхват подъёма', baseMeasurement: 25, step: 0.5 },
    { pointName: 'Ширина', baseMeasurement: 9.5, step: 0.2 },
    { pointName: 'Высота каблука', baseMeasurement: 3, step: 0 },
  ] satisfies Workshop2LinearGradingPresetRow[],
  shoes_3d: [
    { pointName: 'Длина стопы (3D-Колодка)', baseMeasurement: 27.2, step: 0.6 },
    { pointName: 'Обхват подъёма (3D-оптимизация)', baseMeasurement: 25.4, step: 0.6 },
  ] satisfies Workshop2LinearGradingPresetRow[],
  bags_auto: [
    { pointName: 'Ширина изделия', baseMeasurement: 35, step: 1 },
    { pointName: 'Высота изделия', baseMeasurement: 28, step: 1 },
    { pointName: 'Глубина / толщина', baseMeasurement: 12, step: 0.5 },
  ] satisfies Workshop2LinearGradingPresetRow[],
  bags_3d: [
    { pointName: 'Ширина (3D-оптимизация)', baseMeasurement: 35.5, step: 1.1 },
    { pointName: 'Высота (3D-оптимизация)', baseMeasurement: 28.2, step: 1.0 },
  ] satisfies Workshop2LinearGradingPresetRow[],
} as const;
