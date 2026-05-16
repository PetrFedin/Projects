import type { Workshop2GradingRow } from '@/lib/production/workshop2-dossier-phase1.types';

export type GradingMatrixSizeCol = { label: string; diff: number; isCustom?: boolean };

export type GradingMatrixVisualRow = {
  id: string;
  name: string;
  baseM: number;
  step: number;
  aiTolerance?: number;
  aiReason?: string;
  customM?: Record<string, string>;
  extraDimensionId?: string;
};

/** Импорт табеля градаций из досье → строки матрицы (абсолют по размерам в customM). */
export function gradingRulesToMatrixVisualRows(
  rules: Workshop2GradingRow[],
  sizeLabels: string[]
): GradingMatrixVisualRow[] {
  return rules.map((r) => {
    const customM: Record<string, string> = {};
    for (const s of sizeLabels) {
      const abs = r.baseMeasurement + (r.increments[s] ?? 0);
      customM[s] = Number.isFinite(abs) ? String(Number(abs.toFixed(2))) : '';
    }
    return {
      id: r.id,
      name: r.pointName,
      baseM: r.baseMeasurement,
      step: 0,
      customM,
    };
  });
}

/** Экспорт матрицы в табель градаций досье (приращения относительно базы по каждому размеру). */
export function matrixVisualRowsToGradingRules(
  rows: GradingMatrixVisualRow[],
  defaultSizes: GradingMatrixSizeCol[],
  tolerancesApplied: boolean
): Workshop2GradingRow[] {
  return rows.map((row) => {
    const increments: Record<string, number> = {};
    for (const sz of defaultSizes) {
      let abs: number;
      const raw = row.customM?.[sz.label];
      if (raw !== undefined && String(raw).trim() !== '') {
        const n = parseFloat(String(raw).replace(',', '.'));
        abs = Number.isFinite(n) ? n : row.baseM;
      } else if (sz.isCustom) {
        abs = row.baseM;
      } else {
        const stepAdj = tolerancesApplied && row.aiTolerance ? row.aiTolerance : 0;
        abs = row.baseM + row.step * sz.diff + stepAdj;
      }
      increments[sz.label] = Number((abs - row.baseM).toFixed(3));
    }
    return {
      id: row.id,
      pointName: row.name,
      baseMeasurement: row.baseM,
      increments,
    };
  });
}

export function gradingSizeColumnsMatch(
  dossierSizes: string[] | undefined,
  uiLabels: string[]
): boolean {
  if (!dossierSizes?.length || dossierSizes.length !== uiLabels.length) return false;
  return dossierSizes.every((s, i) => s === uiLabels[i]);
}

/** Реэкспорт: детерминированный JSON-снимок градации для сравнения «менялось / не менялось». */
export { serializeWorkshopGradingSnapshot } from './workshop2-grading-linear';
