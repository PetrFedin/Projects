import { getAttributeById } from '@/lib/production/attribute-catalog';
import {
  buildCompositionLabelConstructorFiberLines,
  compositionLabelCardMetadataLines,
  compositionLabelConstructorFiberHasRows,
  compositionLabelConstructorFiberPercentSum,
  compositionLabelFiberRowsSumIsHundred,
  compositionLabelOriginDisplayLines,
} from '@/lib/production/workshop2-composition-label-constructor';
import { W2_COMPOSITION_LABEL_CARE_SYMBOL_CATALOG } from '@/lib/production/workshop2-composition-label-spec-constants';
import type {
  Workshop2CompositionLabelSpec,
  Workshop2DossierPhase1,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { parseMatRowsFromDossier } from '@/lib/production/workshop2-material-mat-rows';

const CARE_ATTRIBUTE_IDS = ['careWashingClassOptions', 'temperatureOptions'] as const;
const MANUFACTURER_HINT_ATTRIBUTE_IDS = ['labeling', 'packaging', 'barcode'] as const;

export type Workshop2CompositionLabelTzSnapshot = {
  fiberLines: string[];
  careLines: string[];
  manufacturerLines: string[];
  hasMatData: boolean;
  hasCareData: boolean;
  hasManufacturerHints: boolean;
};

export type Workshop2CompositionLabelSectionNeed =
  | 'dimensions'
  | 'physical'
  | 'fiber_tz_gap'
  | 'fiber_constructor_sum'
  | 'care_tz_gap'
  | 'manufacturer_tz_gap'
  | 'layout_sheets'
  | 'reverse_copy';

function matParameterLabelMap(): Map<string, string> {
  const mat = getAttributeById('mat');
  const m = new Map<string, string>();
  for (const p of mat?.parameters ?? []) m.set(p.parameterId, p.label);
  return m;
}

function uniqueNonEmpty(lines: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of lines) {
    const s = raw.trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

function assignmentLinesForIds(
  dossier: Workshop2DossierPhase1,
  attributeIds: readonly string[]
): string[] {
  const acc: string[] = [];
  for (const id of attributeIds) {
    const a = dossier.assignments.find((x) => x.attributeId === id);
    for (const v of a?.values ?? []) {
      if (v.displayLabel?.trim()) acc.push(v.displayLabel.trim());
      if (v.text?.trim()) acc.push(v.text.trim());
    }
  }
  return uniqueNonEmpty(acc);
}

/** Снимок данных ТЗ, из которых собирается текст бирки (mat/composition, уход, маркировка). */
export function buildCompositionLabelTzSnapshot(
  dossier: Workshop2DossierPhase1
): Workshop2CompositionLabelTzSnapshot {
  const rows = parseMatRowsFromDossier(dossier, matParameterLabelMap());
  const fiberLines = rows.map((r) => `${r.label} — ${r.pct}%`);
  const careLines = assignmentLinesForIds(dossier, CARE_ATTRIBUTE_IDS);
  const manufacturerLines = assignmentLinesForIds(dossier, MANUFACTURER_HINT_ATTRIBUTE_IDS);
  if (dossier.brandNotes?.trim()) {
    manufacturerLines.push(`Заметки бренда: ${dossier.brandNotes.trim()}`);
  }
  const origin = dossier.sampleIntakeRelease?.countryOfOriginActual?.trim();
  if (origin) manufacturerLines.push(`Страна происхождения (факт): ${origin}`);
  return {
    fiberLines,
    careLines,
    manufacturerLines: uniqueNonEmpty(manufacturerLines),
    hasMatData: fiberLines.length > 0,
    hasCareData: careLines.length > 0,
    hasManufacturerHints: manufacturerLines.length > 0,
  };
}

export function compositionLabelSpecMissingSections(
  dossier: Workshop2DossierPhase1 | null | undefined,
  spec: Workshop2CompositionLabelSpec | undefined
): Workshop2CompositionLabelSectionNeed[] {
  const s = spec ?? {};
  const needs: Workshop2CompositionLabelSectionNeed[] = [];
  if (!(s.labelWidthMm ?? '').trim() || !(s.labelHeightMm ?? '').trim()) needs.push('dimensions');
  const mat = (s.physicalMaterial ?? '').trim();
  const matNote = (s.physicalMaterialNote ?? '').trim();
  if (!mat && !matNote) needs.push('physical');
  if (mat === 'other' && !matNote) needs.push('physical');

  const snap = dossier ? buildCompositionLabelTzSnapshot(dossier) : null;
  if (s.includeFiberCompositionFromTz) {
    if (!snap?.hasMatData && !compositionLabelConstructorFiberHasRows(s))
      needs.push('fiber_tz_gap');
  }
  if (compositionLabelConstructorFiberHasRows(s) && !compositionLabelFiberRowsSumIsHundred(s)) {
    needs.push('fiber_constructor_sum');
  }
  if (s.includeCareSymbolsFromTz) {
    const hasManualCare =
      Boolean((s.careInstructionsSupplement ?? '').trim()) ||
      Boolean(s.careSymbolIds && s.careSymbolIds.length > 0);
    if (!snap?.hasCareData && !hasManualCare) {
      needs.push('care_tz_gap');
    }
  }
  if (s.includeManufacturerFromTz) {
    if (!snap?.hasManufacturerHints && !(s.brandFaceLines ?? '').trim()) {
      needs.push('manufacturer_tz_gap');
    }
  }

  const layout = s.sheetLayout ?? '';
  if (
    (layout === 'two_sheets' || layout === 'three_sheets') &&
    !(s.layoutPlacementNotes ?? '').trim()
  ) {
    needs.push('layout_sheets');
  }
  if (s.printOnReverse && !(s.reverseFaceLines ?? '').trim()) {
    needs.push('reverse_copy');
  }
  return needs;
}

export type Workshop2CompositionLabelWorkflowProgress = {
  stepDone: [boolean, boolean, boolean, boolean];
  doneCount: number;
  total: 4;
  pct: number;
};

/**
 * Прогресс мастера составника по 4 шагам (та же логика, что у красных точек в UI).
 * Используется в гейтах/готовности секций, чтобы «Материалы» не считались закрытыми,
 * если бирка ещё в незавершённом состоянии.
 */
export function compositionLabelWorkflowProgress(
  dossier: Workshop2DossierPhase1 | null | undefined,
  spec: Workshop2CompositionLabelSpec | undefined
): Workshop2CompositionLabelWorkflowProgress {
  const needs = compositionLabelSpecMissingSections(dossier, spec);
  const need = new Set(needs);
  const sourcesTzAlert =
    need.has('fiber_tz_gap') || need.has('care_tz_gap') || need.has('manufacturer_tz_gap');
  const fiberSumAlert = need.has('fiber_constructor_sum');

  const step1Done = !(
    need.has('dimensions') ||
    need.has('physical') ||
    need.has('fiber_tz_gap') ||
    need.has('care_tz_gap') ||
    need.has('manufacturer_tz_gap')
  );
  const step2Done = !(need.has('fiber_constructor_sum') || need.has('care_tz_gap'));
  const step3Done = !(
    need.has('layout_sheets') ||
    need.has('reverse_copy') ||
    need.has('manufacturer_tz_gap')
  );
  const step4Done = !(sourcesTzAlert || fiberSumAlert);

  const stepDone: [boolean, boolean, boolean, boolean] = [
    step1Done,
    step2Done,
    step3Done,
    step4Done,
  ];
  const doneCount = stepDone.filter(Boolean).length;
  return {
    stepDone,
    doneCount,
    total: 4,
    pct: Math.round((doneCount / 4) * 100),
  };
}

export function compositionLabelDraftPreviewLines(
  dossier: Workshop2DossierPhase1 | null | undefined,
  spec: Workshop2CompositionLabelSpec | undefined
): string[] {
  const s = spec ?? {};
  const snap = dossier ? buildCompositionLabelTzSnapshot(dossier) : null;
  const lines: string[] = [];

  const constructorFiberLines = buildCompositionLabelConstructorFiberLines(s);
  const useConstructor = constructorFiberLines.length > 0;
  const langNote =
    s.constructorDisplayLanguage === 'bilingual'
      ? '(RU+EN)'
      : s.constructorDisplayLanguage === 'en'
        ? '(EN)'
        : '';

  if (useConstructor) {
    lines.push(`— Состав (конструктор) ${langNote}`.trim());
    lines.push(...constructorFiberLines);
    const pctSum = compositionLabelConstructorFiberPercentSum(s);
    if (Math.abs(pctSum - 100) >= 0.05) {
      lines.push(
        `(контроль суммы долей: ${Math.round(pctSum * 100) / 100}% — для бирки ожидается 100%)`
      );
    }
  } else if (s.includeFiberCompositionFromTz) {
    if (snap?.fiberLines.length) {
      lines.push('— Состав (из ТЗ) —');
      lines.push(...snap.fiberLines);
    } else {
      lines.push(
        '— Состав: в ТЗ нет mat/composition с долями — заполните блок конструктора (волокна + %) или материалы ТЗ.'
      );
    }
  }

  if (
    s.includeCareSymbolsFromTz ||
    (s.careInstructionsSupplement ?? '').trim() ||
    (s.careSymbolIds?.length ?? 0) > 0
  ) {
    lines.push('— Уход —');
    if (s.includeCareSymbolsFromTz && snap?.careLines.length) {
      lines.push(...snap.careLines.map((x) => `ТЗ: ${x}`));
    } else if (s.includeCareSymbolsFromTz) {
      lines.push(
        'ТЗ: поля ухода пусты — укажите класс стирки / температуру или знаки в конструкторе.'
      );
    }
    const symPick = (s.careSymbolIds ?? [])
      .map((id) => W2_COMPOSITION_LABEL_CARE_SYMBOL_CATALOG.find((c) => c.id === id)?.label)
      .filter(Boolean) as string[];
    if (symPick.length) {
      lines.push(`Знаки (конструктор, порядок групп ISO): ${symPick.join(' · ')}`);
    }
    if ((s.careInstructionsSupplement ?? '').trim()) {
      lines.push(`Пояснения: ${(s.careInstructionsSupplement ?? '').trim()}`);
    }
  }

  const originLines = compositionLabelOriginDisplayLines(s);
  const brandTrim = (s.brandFaceLines ?? '').trim();
  const showProducer =
    originLines.length > 0 ||
    Boolean(brandTrim) ||
    Boolean(s.includeManufacturerFromTz) ||
    Boolean(snap?.manufacturerLines.length);

  if (showProducer) {
    lines.push('— Производитель / адрес / маркировка —');
    lines.push(...originLines);
    if (s.includeManufacturerFromTz && snap?.manufacturerLines.length) {
      lines.push(...snap.manufacturerLines.map((x) => `ТЗ/досье: ${x}`));
    } else if (
      s.includeManufacturerFromTz &&
      !snap?.manufacturerLines.length &&
      !brandTrim &&
      originLines.length === 0
    ) {
      lines.push(
        'ТЗ: маркировка/упаковка/штрихкод не дали строк — заполните «Текст бренда на лице» или пресет страны.'
      );
    }
    if (brandTrim) {
      lines.push(...brandTrim.split('\n').filter(Boolean));
    }
  }

  const meta = compositionLabelCardMetadataLines(s);
  if (meta.length) {
    lines.push('— Низ бирки (артикул / код / QR) —');
    lines.push(...meta);
  }

  if ((s.extraLegalLines ?? '').trim()) {
    lines.push('— Доп. обязательные строки —');
    lines.push(...(s.extraLegalLines ?? '').trim().split('\n').filter(Boolean));
  }

  if (s.printOnReverse && (s.reverseFaceLines ?? '').trim()) {
    lines.push('— Оборот —');
    lines.push(...(s.reverseFaceLines ?? '').trim().split('\n').filter(Boolean));
  }

  if ((s.technologistNotes ?? '').trim()) {
    lines.push('— Примечания технолога —');
    lines.push((s.technologistNotes ?? '').trim());
  }

  if (lines.length === 0) {
    lines.push(
      'Заполните конструктор (состав, знаки, метаданные) и/или отметьте источники из ТЗ — здесь появится черновик в порядке блоков для бирки (сверху вниз: состав → уход → производитель → низ).'
    );
  }
  return lines;
}

/** Строки для макета и списка: при непустом `draftTextManual` — он, иначе авто-черновик из ТЗ. */
export function compositionLabelDraftDisplayLines(
  spec: Workshop2CompositionLabelSpec | undefined,
  autoPreviewLines: string[]
): string[] {
  const raw = spec?.draftTextManual ?? '';
  if (raw.trim()) return raw.split(/\r?\n/);
  return autoPreviewLines;
}
