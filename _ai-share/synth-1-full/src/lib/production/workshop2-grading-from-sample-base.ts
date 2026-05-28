import {
  midpointNominalSuggestion,
  parseDimensionValueToRange,
} from '@/lib/production/workshop-dimension-range';
import type {
  Workshop2DossierPhase1,
  Workshop2GradingRow,
} from '@/lib/production/workshop2-dossier-phase1.types';

/** Строки табеля размеров (как в `Workshop2SampleBaseSizeBlock.handbookParts`). */
export function workshop2SampleBaseSizeRowParts(
  dossier: Workshop2DossierPhase1
): Array<{ parameterId: string; displayLabel: string }> {
  const assign = dossier.assignments?.find((a) => a.attributeId === 'sampleBaseSize');
  if (!assign?.values?.length) return [];
  const out: Array<{ parameterId: string; displayLabel: string }> = [];
  for (const v of assign.values) {
    if (v.valueSource === 'handbook_parameter' && v.parameterId) {
      const displayLabel = (v.displayLabel ?? '').trim() || v.parameterId;
      if (displayLabel) out.push({ parameterId: v.parameterId, displayLabel });
    } else if (v.valueSource === 'free_text' && v.text?.trim()) {
      const segments = v.text
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean);
      for (const seg of segments) {
        out.push({ parameterId: `__free:${seg}`, displayLabel: seg });
      }
    }
  }
  return out;
}

export function resolveSampleBasePidForDisplaySize(
  parts: ReadonlyArray<{ parameterId: string; displayLabel: string }>,
  sizeLabel: string
): string | undefined {
  const t = sizeLabel.trim();
  if (!t) return undefined;
  const norm = (s: string) => s.replace(/\s+/g, '').toLowerCase();
  const nt = norm(t);
  const exact = parts.find((p) => p.displayLabel.trim() === t);
  if (exact) return exact.parameterId;
  return parts.find((p) => norm(p.displayLabel) === nt)?.parameterId;
}

/** Скаляр см из ячейки табеля (номинал диапазона, середина мин–макс или одно число). */
export function readSampleDimensionCm(
  dossier: Workshop2DossierPhase1,
  pid: string,
  dimStorageKey: string
): number | undefined {
  const rangeCell = dossier.sampleBasePerSizeDimensionRanges?.[pid]?.[dimStorageKey];
  const flat = dossier.sampleBasePerSizeDimensions?.[pid]?.[dimStorageKey] ?? '';
  if (rangeCell) {
    const n = String(rangeCell.nominal ?? '').trim();
    if (n) {
      const v = parseFloat(n.replace(',', '.'));
      if (Number.isFinite(v)) return v;
    }
  }
  const parsed = parseDimensionValueToRange(String(flat));
  const mid = midpointNominalSuggestion(parsed.min, parsed.max);
  if (mid) {
    const v = parseFloat(mid.replace(',', '.'));
    if (Number.isFinite(v)) return v;
  }
  const a = parseFloat(parsed.min.replace(',', '.'));
  const b = parseFloat(parsed.max.replace(',', '.'));
  if (Number.isFinite(a) && Number.isFinite(b) && parsed.min.trim() === parsed.max.trim()) return a;
  if (Number.isFinite(a) && Number.isFinite(b)) return (a + b) / 2;
  if (Number.isFinite(a)) return a;
  return undefined;
}

export type GradingPointFromSample = { id: string; pointName: string; dimKey: string };

/**
 * Строит `gradingRules` из верхнего табеля: база = мерка в строке базового размера, приращения = мерка(size) − база.
 * Возвращает `null`, если нет строк размеров или не найдена строка базового размера.
 */
export function buildGradingRulesFromSampleBase(
  dossier: Workshop2DossierPhase1,
  sizing: {
    sizes: readonly string[];
    baseSizeLabel: string;
    points: readonly GradingPointFromSample[];
  }
): Workshop2GradingRow[] | null {
  const parts = workshop2SampleBaseSizeRowParts(dossier);
  if (!parts.length || !sizing.points.length) return null;
  const basePid = resolveSampleBasePidForDisplaySize(parts, sizing.baseSizeLabel);
  if (!basePid) return null;

  const rows: Workshop2GradingRow[] = [];
  for (const mp of sizing.points) {
    const baseVal = readSampleDimensionCm(dossier, basePid, mp.dimKey);
    const baseMeasurement = baseVal !== undefined && Number.isFinite(baseVal) ? baseVal : 0;
    const increments: Record<string, number> = {};
    for (const sz of sizing.sizes) {
      const pid = resolveSampleBasePidForDisplaySize(parts, sz);
      if (!pid) {
        increments[sz] = 0;
        continue;
      }
      const v = readSampleDimensionCm(dossier, pid, mp.dimKey);
      if (v === undefined || !Number.isFinite(v)) {
        increments[sz] = 0;
      } else {
        increments[sz] = Number((v - baseMeasurement).toFixed(4));
      }
    }
    rows.push({
      id: mp.id,
      pointName: mp.pointName,
      baseMeasurement,
      increments,
    });
  }
  return rows;
}

/** После пересчёта из табеля — сохраняем полностью зафиксированные строки градации. */
export function mergeBuiltGradingPreservingFrozen(
  prevRules: Workshop2GradingRow[] | undefined,
  built: Workshop2GradingRow[] | null
): Workshop2GradingRow[] | null {
  if (!built?.length) return built;
  if (!prevRules?.length) return built;
  return built.map((row) => {
    const frozen = prevRules.find((r) => r.id === row.id && r.gradingFrozen);
    if (frozen) return { ...frozen };
    const prevLoose = prevRules.find((r) => r.id === row.id);
    return {
      ...row,
      gradingStep: prevLoose?.gradingStep ?? row.gradingStep ?? 0,
      gradingFrozen: prevLoose?.gradingFrozen ?? false,
    };
  });
}

function formatMeasurementCell(n: number): string {
  if (!Number.isFinite(n)) return '';
  const rounded = Number(n.toFixed(4));
  if (Math.abs(rounded - Math.round(rounded)) < 1e-6) return String(Math.round(rounded));
  const s = rounded.toFixed(2).replace(/\.?0+$/, '');
  return s;
}

/**
 * Записывает значения из матрицы градации в табель `sampleBasePerSizeDimensions` (и nominal в диапазонах, если есть).
 * Строки с `gradingFrozen` пропускаются — их значения не перезаписываются из матрицы (ячейки табеля и матрицы блокируются в UI).
 */
export function pushGradingRulesToSampleDimensions(
  dossier: Workshop2DossierPhase1,
  sizing: { sizes: readonly string[]; baseLabel: string },
  rules: readonly Workshop2GradingRow[],
  points: readonly GradingPointFromSample[]
): Pick<
  Workshop2DossierPhase1,
  'sampleBasePerSizeDimensions' | 'sampleBasePerSizeDimensionRanges'
> {
  const parts = workshop2SampleBaseSizeRowParts(dossier);
  const nextDims: Record<string, Record<string, string>> = {
    ...(dossier.sampleBasePerSizeDimensions ?? {}),
  };
  let nextRanges: Workshop2DossierPhase1['sampleBasePerSizeDimensionRanges'] | undefined =
    dossier.sampleBasePerSizeDimensionRanges;
  let rangesCloned = false;

  const ensureRangeClone = () => {
    if (rangesCloned || !dossier.sampleBasePerSizeDimensionRanges) return;
    nextRanges = {};
    for (const [pid, row] of Object.entries(dossier.sampleBasePerSizeDimensionRanges)) {
      nextRanges[pid] = {};
      for (const [k, cell] of Object.entries(row)) {
        nextRanges[pid][k] = { ...cell };
      }
    }
    rangesCloned = true;
  };

  const baseLbl = String(sizing.baseLabel).trim();

  for (const rule of rules) {
    if (rule.gradingFrozen) continue;
    const pt = points.find((p) => p.id === rule.id);
    if (!pt) continue;
    const dimKey = pt.dimKey;

    for (const sz of sizing.sizes) {
      const szStr = String(sz).trim();
      const pid = resolveSampleBasePidForDisplaySize(parts, szStr);
      if (!pid) continue;
      const isBase = szStr === baseLbl;
      const inc = rule.increments[szStr] ?? 0;
      // Без приращения не затираем строки табеля базовым значением — иначе у всех размеров
      // окажется одна «длина стопы» после правки другой мерки в матрице.
      if (!isBase && inc === 0) continue;
      const abs = isBase ? rule.baseMeasurement : rule.baseMeasurement + inc;
      if (!Number.isFinite(abs)) continue;
      const cell = formatMeasurementCell(abs);
      nextDims[pid] = { ...(nextDims[pid] ?? {}), [dimKey]: cell };

      const rc = dossier.sampleBasePerSizeDimensionRanges?.[pid]?.[dimKey];
      if (rc) {
        ensureRangeClone();
        if (nextRanges?.[pid]?.[dimKey]) {
          nextRanges[pid]![dimKey] = { ...nextRanges[pid]![dimKey]!, nominal: cell };
        }
      }
    }
  }

  const out: Pick<
    Workshop2DossierPhase1,
    'sampleBasePerSizeDimensions' | 'sampleBasePerSizeDimensionRanges'
  > = {
    sampleBasePerSizeDimensions: Object.keys(nextDims).length ? nextDims : undefined,
  };
  if (nextRanges && Object.keys(nextRanges).length > 0) {
    out.sampleBasePerSizeDimensionRanges = nextRanges;
  }
  return out;
}
