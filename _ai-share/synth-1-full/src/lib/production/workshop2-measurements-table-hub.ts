/**
 * Хаб «Табель мер»: контрольные пункты (≈10) и тексты ролей для ТЗ без нового API.
 */

import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import { collectWorkshop2VisualSectionWarnings } from '@/lib/production/workshop2-visual-section-warnings';
import type { Workshop2DossierPhase1, Workshop2Phase1AttributeAssignment } from '@/lib/production/workshop2-dossier-phase1.types';
import { defaultSizeScaleIdForLeaf } from '@/lib/production/attribute-catalog';
import { getWorkshopDimensionLabels } from '@/lib/production/workshop-size-handbook';

function partitionHandbookAndFree(a: Workshop2Phase1AttributeAssignment | undefined) {
  const hbs =
    a?.values.filter(
      (v): v is (typeof v & { parameterId: string }) =>
        v.valueSource === 'handbook_parameter' && Boolean(v.parameterId)
    ) ?? [];
  const ft = a?.values.find((v) => v.valueSource === 'free_text');
  return { hbs, ft };
}

export type Workshop2MeasurementsHubCheck = {
  id: string;
  label: string;
  done: boolean;
  /** Короткое пояснение при done === false */
  hint?: string;
};

/** Роли, которые опираются на табель мер в ТЗ. */
export const WORKSHOP2_MEASUREMENTS_TABLE_ROLE_BLOCKS: readonly {
  title: string;
  titleClass: string;
  body: string;
}[] = [
  {
    title: 'Бренд-дизайнер',
    titleClass: 'text-violet-900',
    body: 'Посадка на модели и силуэт на витрине должны совпадать с цифрами таблицы; при смене эскиза обновите мерки и подписи колонок.',
  },
  {
    title: 'Технолог / конструктор',
    titleClass: 'text-teal-900',
    body: 'Шкала, базовый размер и полнота мерок — основа лекал и допусков; диапазоны мин–макс фиксируйте там, где на производстве ждут коридор, а не одно число.',
  },
  {
    title: 'Менеджер / продакт',
    titleClass: 'text-amber-900',
    body: 'Линия размеров и количества по строкам связаны с лимитом образца в паспорте и со сроками fit; согласуйте изменения до подписи ТЗ.',
  },
  {
    title: 'Снабжение / PD',
    titleClass: 'text-orange-950',
    body: 'Усадка ткани и толщина слоёв влияют на фактические мерки серии — держите связь с mat/BOM и заметками на метках скетча.',
  },
  {
    title: 'Производство / цех',
    titleClass: 'text-slate-800',
    body: 'В раскрой и пакеты уходят те же значения, что в таблице; вопросы к пустым ячейкам закрываются до запуска, иначе растут переделки.',
  },
  {
    title: 'ОТК / качество',
    titleClass: 'text-rose-900',
    body: 'Контрольные точки на скетче (qc) и колонки таблицы задают приёмку; расхождения с визуалом фиксируйте как риск до отгрузки.',
  },
  {
    title: 'Комплаенс / таможня',
    titleClass: 'text-indigo-900',
    body: 'Длина изделия и обхваты могут попадать в декларации и этикетку размеров — согласуйте с паспортом и блоком маркировки в материалах.',
  },
  {
    title: 'Мерч / e-com',
    titleClass: 'text-fuchsia-900',
    body: 'Размерная сетка на сайте и подписи «как мерить» должны ссылаться на эту таблицу как на единственный источник правды по SKU.',
  },
];

export function buildWorkshop2MeasurementsHubChecks(
  dossier: Workshop2DossierPhase1,
  leaf: HandbookCategoryLeaf,
  handbookWarnings: readonly string[]
): Workshop2MeasurementsHubCheck[] {
  const expectedScaleId = defaultSizeScaleIdForLeaf(leaf);
  const dimensionLabels = getWorkshopDimensionLabels(leaf);
  const assign = dossier.assignments.find((x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize');
  const { hbs, ft } = partitionHandbookAndFree(assign);
  const freeStr = ft?.text?.trim() ?? '';
  const hasSizeLine = hbs.length > 0 || Boolean(freeStr);

  const measurementsReady = Boolean(
    dossier.sampleSizeScaleId &&
      dossier.sampleBasePerSizeDimensions &&
      Object.keys(dossier.sampleBasePerSizeDimensions).length > 0
  );

  const scaleMismatch =
    Boolean(dossier.sampleSizeScaleId && expectedScaleId && dossier.sampleSizeScaleId !== expectedScaleId) ||
    handbookWarnings.some((w) => w.includes('Размерная шкала') || w.includes('шкала'));

  let handbookColsComplete = true;
  if (dimensionLabels.length > 0 && dossier.sampleBasePerSizeDimensions && hbs.length > 0) {
    outer: for (const part of hbs) {
      const pid = part.parameterId;
      if (!pid) continue;
      const row = dossier.sampleBasePerSizeDimensions[pid];
      if (!row) {
        handbookColsComplete = false;
        break;
      }
      for (const label of dimensionLabels) {
        if (dossier.sampleBaseHiddenDimensionKeys?.includes(label)) continue;
        if (!row[label]?.trim()) {
          handbookColsComplete = false;
          break outer;
        }
      }
    }
  } else if (dimensionLabels.length > 0 && measurementsReady && hbs.length > 0) {
    handbookColsComplete = false;
  }

  const moqCap = dossier.passportProductionBrief?.moqTargetMaxPieces;
  const capActive = moqCap != null && Number.isFinite(moqCap) && moqCap >= 0;
  const pieceQty = dossier.sampleBasePerSizePieceQty ?? {};
  let tablePieceSum = 0;
  for (const part of hbs) {
    const pid = part.parameterId;
    if (!pid) continue;
    const v = pieceQty[pid];
    if (typeof v === 'number' && Number.isFinite(v) && v > 0) tablePieceSum += Math.floor(v);
  }
  const moqOk = !capActive || tablePieceSum <= (moqCap as number);

  const extras = dossier.sampleBaseExtraDimensions ?? [];
  const extrasLabeled = extras.every((ex) => ex.label.trim().length > 0);

  const rangeMode = Boolean(dossier.sampleBaseDimensionRangeMode);
  const rangeKeys = new Set(dossier.sampleBaseDimensionRangeKeys ?? []);
  let rangeCellsOk = true;
  if (rangeMode && dossier.sampleBasePerSizeDimensions && hbs.length > 0) {
    const visible = dimensionLabels.filter((d) => !dossier.sampleBaseHiddenDimensionKeys?.includes(d));
    outerR: for (const part of hbs) {
      const pid = part.parameterId;
      if (!pid) continue;
      const row = dossier.sampleBasePerSizeDimensions[pid] ?? {};
      for (const canon of visible) {
        if (!rangeKeys.has(canon)) continue;
        const raw = row[canon]?.trim() ?? '';
        if (!raw) {
          rangeCellsOk = false;
          break outerR;
        }
      }
      for (const ex of extras) {
        const ek = `__extra:${ex.id}`;
        if (!rangeKeys.has(ek)) continue;
        const raw = row[ek]?.trim() ?? '';
        if (!raw) {
          rangeCellsOk = false;
          break outerR;
        }
      }
    }
  }

  const materialReady = dossier.assignments.some((a) => a.attributeId === 'mat' && a.values.length > 0);
  const visualGateCount = collectWorkshop2VisualSectionWarnings(dossier, leaf).length;

  const handbookMeasureWarnings = handbookWarnings.filter(
    (w) => w.includes('мерки') || w.includes('Табель мер') || w.includes('лимит') || w.includes('размерам')
  );

  return [
    {
      id: 'scale',
      label: 'Шкала размеров выбрана для артикула',
      done: Boolean(dossier.sampleSizeScaleId),
      hint: 'Укажите шкалу над таблицей.',
    },
    {
      id: 'scale-expected',
      label: 'Шкала согласована с веткой каталога (или осознанно отличается)',
      done: Boolean(dossier.sampleSizeScaleId) && !scaleMismatch,
      hint: 'Проверьте предупреждения справочника по шкале.',
    },
    {
      id: 'size-line',
      label: 'Линия размеров: справочник и/или свой текст',
      done: hasSizeLine,
      hint: 'Выберите размеры из справочника или введите через запятую.',
    },
    {
      id: 'table-started',
      label: 'Таблица мерок заполнена (есть значения по размерам)',
      done: measurementsReady,
      hint: 'Заполните ячейки таблицы для выбранных размеров.',
    },
    {
      id: 'handbook-cols',
      label: 'Обязательные колонки справочника закрыты по всем размерам',
      done: !measurementsReady || dimensionLabels.length === 0 || handbookColsComplete,
      hint: 'Заполните пустые ячейки по меркам из справочника ветки.',
    },
    {
      id: 'moq-cap',
      label: 'Количества по размерам не превышают лимит образца в паспорте',
      done: moqOk,
      hint: 'Уменьшите «Кол-во, шт» или увеличьте лимит в паспорте.',
    },
    {
      id: 'range-mode',
      label: 'Режим мин–макс: для отмеченных колонок заданы значения',
      done: !rangeMode || rangeKeys.size === 0 || rangeCellsOk,
      hint: 'Заполните диапазоны или снимите флажок мин–макс с колонки.',
    },
    {
      id: 'extras-labels',
      label: 'Дополнительные мерки имеют подпись',
      done: extras.length === 0 || extrasLabeled,
      hint: 'Укажите название для каждой добавленной колонки.',
    },
    {
      id: 'material-context',
      label: 'Основной материал в BOM зафиксирован (контекст усадки и допусков)',
      done: materialReady,
      hint: 'Подтвердите mat во вкладке материалов.',
    },
    {
      id: 'visual-handoff',
      label: 'Визуал и эскиз согласованы с цифрами (нет открытых гейтов визуала)',
      done: visualGateCount === 0,
      hint: 'Закройте предупреждения вкладки «Визуал / эскиз».',
    },
  ];
}

export function workshop2MeasurementsHubScore(checks: readonly Workshop2MeasurementsHubCheck[]): {
  done: number;
  total: number;
  pct: number;
} {
  const total = checks.length;
  const done = checks.filter((c) => c.done).length;
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}
