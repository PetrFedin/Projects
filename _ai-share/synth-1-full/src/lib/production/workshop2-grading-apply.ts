import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type {
  Workshop2DossierPhase1,
  Workshop2GradingRow,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildGradingRulesFromSampleBase,
  mergeBuiltGradingPreservingFrozen,
  pushGradingRulesToSampleDimensions,
  type GradingPointFromSample,
} from '@/lib/production/workshop2-grading-from-sample-base';
import {
  mapLinearGradingPresetsToRows,
  W2_LINEAR_GRADING_PRESETS,
} from '@/lib/production/workshop2-grading-linear';
import { getWorkshopParametersForSampleScale } from '@/lib/production/workshop-size-handbook';

export type Workshop2GradingApplyInput = {
  dossier: Workshop2DossierPhase1;
  /** Лист каталога — для выбора пресета apparel/shoes/bags. */
  categoryLeaf?: HandbookCategoryLeaf | null;
  /** Размеры из шкалы (sampleSizeScaleId). */
  sizes: readonly string[];
  /** Подпись базового размера. */
  baseSizeLabel: string;
  /** Точки измерения для синхронизации с табелем. */
  measurementPoints: readonly GradingPointFromSample[];
  newId?: () => string;
};

export type Workshop2GradingApplyResult = {
  gradingSizes: string[];
  gradingRules: Workshop2GradingRow[];
  sampleBasePerSizeDimensions?: Workshop2DossierPhase1['sampleBasePerSizeDimensions'];
  sampleBasePerSizeDimensionRanges?: Workshop2DossierPhase1['sampleBasePerSizeDimensionRanges'];
  appliedFrom: 'sample_base' | 'linear_preset';
};

function resolveCategoryKind(leaf?: HandbookCategoryLeaf | null): 'shoes' | 'bags' | 'apparel' {
  const path = `${leaf?.l1Name ?? ''} ${leaf?.l2Name ?? ''} ${leaf?.l3Name ?? ''}`.toLowerCase();
  if (path.includes('обув') || leaf?.leafId?.includes('shoes')) return 'shoes';
  if (path.includes('сумк') || path.includes('bag')) return 'bags';
  return 'apparel';
}

/** Применяет умную градацию: сначала из табеля образца, иначе линейный пресет по категории. */
export function applyWorkshop2SmartGrading(
  input: Workshop2GradingApplyInput
): Workshop2GradingApplyResult | null {
  const { dossier, sizes, baseSizeLabel, measurementPoints } = input;
  if (!sizes.length || !measurementPoints.length) return null;

  const fromSample = buildGradingRulesFromSampleBase(dossier, {
    sizes,
    baseSizeLabel,
    points: measurementPoints,
  });
  const merged = mergeBuiltGradingPreservingFrozen(dossier.gradingRules, fromSample);

  if (merged?.length) {
    const withRules = { ...dossier, gradingRules: merged, gradingSizes: [...sizes] };
    const dimPatch = pushGradingRulesToSampleDimensions(
      withRules,
      { sizes, baseLabel: baseSizeLabel },
      merged,
      measurementPoints
    );
    return {
      gradingSizes: [...sizes],
      gradingRules: merged,
      ...dimPatch,
      appliedFrom: 'sample_base',
    };
  }

  const kind = resolveCategoryKind(input.categoryLeaf);
  const centerIdx = Math.max(0, sizes.indexOf(baseSizeLabel));
  const defs =
    kind === 'shoes'
      ? W2_LINEAR_GRADING_PRESETS.shoes_auto
      : kind === 'bags'
        ? W2_LINEAR_GRADING_PRESETS.bags_auto
        : W2_LINEAR_GRADING_PRESETS.apparel_auto;
  const newId = input.newId ?? (() => `gr-${Math.random().toString(36).slice(2, 9)}`);
  const presetRows = mapLinearGradingPresetsToRows(sizes, centerIdx, defs, newId);

  const syncedRules = measurementPoints.map((mp, i) => {
    const prevRule = dossier.gradingRules?.find((r) => r.id === mp.id);
    if (prevRule?.gradingFrozen) return prevRule;
    const preset = presetRows[Math.min(i, presetRows.length - 1)]!;
    return {
      id: mp.id,
      pointName: mp.pointName,
      baseMeasurement: preset.baseMeasurement,
      increments: { ...preset.increments },
      gradingStep: prevRule?.gradingStep ?? 0,
      gradingFrozen: false,
    };
  });

  const withRules = { ...dossier, gradingRules: syncedRules, gradingSizes: [...sizes] };
  const dimPatch = pushGradingRulesToSampleDimensions(
    withRules,
    { sizes, baseLabel: baseSizeLabel },
    syncedRules,
    measurementPoints
  );

  return {
    gradingSizes: [...sizes],
    gradingRules: syncedRules,
    ...dimPatch,
    appliedFrom: 'linear_preset',
  };
}

/** Размеры из sampleSizeScaleId + category leaf (fallback XS–XL). */
export function resolveWorkshop2GradingSizesFromDossier(
  dossier: Workshop2DossierPhase1,
  categoryLeaf?: HandbookCategoryLeaf | null
): string[] {
  if (dossier.gradingSizes?.length) return [...dossier.gradingSizes];
  const scaleId = dossier.sampleSizeScaleId?.trim();
  if (scaleId && categoryLeaf) {
    const params = getWorkshopParametersForSampleScale(categoryLeaf, scaleId, dossier.isUnisex);
    if (params?.length) return params.map((p) => p.label);
  }
  const l1 = categoryLeaf?.l1Name?.toLowerCase() ?? '';
  if (l1.includes('обув') || categoryLeaf?.leafId?.startsWith('catalog-shoes')) {
    return ['39', '40', '41', '42', '43', '44'];
  }
  return ['XS', 'S', 'M', 'L', 'XL'];
}

/** Экспорт таблицы градации для ZIP ТЗ. */
export function buildWorkshop2GradingTableExport(
  dossier: Workshop2DossierPhase1
): Record<string, unknown> {
  const sizes = dossier.gradingSizes ?? [];
  const rules = dossier.gradingRules ?? [];
  return {
    exportedAt: new Date().toISOString(),
    scaleId: dossier.sampleSizeScaleId ?? null,
    sizes,
    baseSizeLabel: dossier.sampleBaseSizeLabel ?? null,
    rows: rules.map((r) => ({
      id: r.id,
      pointName: r.pointName,
      baseMeasurement: r.baseMeasurement,
      increments: r.increments,
      gradingStep: r.gradingStep ?? 0,
      frozen: Boolean(r.gradingFrozen),
      valuesBySize: Object.fromEntries(
        sizes.map((s) => {
          const inc = r.increments?.[s] ?? 0;
          const val = (r.baseMeasurement ?? 0) + inc;
          return [s, Number(val.toFixed(2))];
        })
      ),
    })),
  };
}
