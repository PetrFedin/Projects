import type {
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2Phase1SketchSheet,
  Workshop2Phase1SubcategorySketchSlot,
  Workshop2SketchSheetWorkflowStatus,
  Workshop2SketchSheetViewKind,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  hasMeaningfulTaskContent,
  normalizeSubcategorySketchSlots,
} from '@/lib/production/workshop2-tz-subcategory-sketches';

export const MAX_SKETCH_SHEETS = 12;
export const MAX_ANNOTATIONS_PER_SKETCH_SHEET = 24;

export const SKETCH_SHEET_VIEW_LABELS: Record<Workshop2SketchSheetViewKind, string> = {
  front: 'Анфас / фас',
  back: 'Спина',
  side: 'Профиль',
  detail: 'Деталь / узел',
  flat: 'Плоский чертёж',
  photo: 'Фото',
  other: 'Другое',
};

export type SketchPinTextSnippet = { id: string; label: string; text: string };

/** Текстовые вставки для общего скетча (master). */
export const DEFAULT_MASTER_PIN_SNIPPETS: SketchPinTextSnippet[] = [
  { id: 'seams', label: 'Швы', text: 'Проверить ровность швов и закрепки узлов.' },
  { id: 'sym', label: 'Симметрия', text: 'Сверить симметрию лево/право по ключевым линиям.' },
  { id: 'fit', label: 'Посадка', text: 'Сверить посадку с эталоном базового размера.' },
  { id: 'hardware', label: 'Фурнитура', text: 'Проверить установку молний, кнопок, люверсов.' },
];

/** Шаблоны текста метки по типу листа. */
export const SKETCH_PIN_SNIPPETS_BY_VIEW: Record<Workshop2SketchSheetViewKind, SketchPinTextSnippet[]> = {
  front: [
    { id: 'f_center', label: 'Переда', text: 'Линия центра, борт, застёжка.' },
    { id: 'f_pocket', label: 'Карман', text: 'Тип и уровень кармана по ТЗ.' },
    { id: 'f_neck', label: 'Горловина', text: 'Форма выреза / воротник.' },
  ],
  back: [
    { id: 'b_center', label: 'Спина центр', text: 'Симметрия спинки, средний шов.' },
    { id: 'b_vent', label: 'Шлица / кокетка', text: 'Длина шлицы, обработка.' },
    { id: 'b_label', label: 'Бирка', text: 'Расположение и тип бирки / маркировки.' },
  ],
  side: [
    { id: 's_silhouette', label: 'Силуэт', text: 'Толщина, пройма, баланс в профиль.' },
    { id: 's_length', label: 'Длина', text: 'Длина изделия / рукава по ТЗ.' },
  ],
  detail: [
    { id: 'd_stitch', label: 'Строчка', text: 'Шаг стежка, тип ниток.' },
    { id: 'd_edge', label: 'Край', text: 'Обработка среза / подгиб.' },
  ],
  flat: [
    { id: 'fl_measure', label: 'Размеры', text: 'Сверить контрольные размеры с лекалом.' },
    { id: 'fl_notch', label: 'Метки', text: 'Совмещение меток и надсечек.' },
  ],
  photo: [
    { id: 'ph_color', label: 'Цвет / свет', text: 'Сверка оттенка с образцом при стандартном свете.' },
    { id: 'ph_texture', label: 'Фактура', text: 'Соответствие фактуры материала ТЗ.' },
  ],
  other: [
    { id: 'o_note', label: 'Заметка', text: 'Уточнить по ТЗ: ' },
    { id: 'o_qc', label: 'Контроль', text: 'Точка контроля качества по договорённости.' },
  ],
};

function newUuid(): string {
  return crypto.randomUUID();
}

function normalizeAnnotation(a: Workshop2Phase1CategorySketchAnnotation): Workshop2Phase1CategorySketchAnnotation {
  return {
    ...a,
    annotationType: a.annotationType ?? 'construction',
    priority: a.priority ?? 'important',
    status: a.status ?? 'new',
    stage: a.stage ?? 'tz',
  };
}

export function normalizeSketchSheets(
  sheets: Workshop2Phase1SketchSheet[] | undefined
): Workshop2Phase1SketchSheet[] {
  if (!Array.isArray(sheets)) return [];
  const out: Workshop2Phase1SketchSheet[] = [];
  for (const raw of sheets) {
    if (!raw || typeof raw !== 'object') continue;
    const sheetId = typeof (raw as Workshop2Phase1SketchSheet).sheetId === 'string' ? (raw as Workshop2Phase1SketchSheet).sheetId : '';
    if (!sheetId) continue;
    const annotations = Array.isArray((raw as Workshop2Phase1SketchSheet).annotations)
      ? (raw as Workshop2Phase1SketchSheet).annotations
          .filter((x) => x && typeof x.annotationId === 'string')
          .map(normalizeAnnotation)
          .slice(0, MAX_ANNOTATIONS_PER_SKETCH_SHEET)
      : [];
    const wtn = (raw as Workshop2Phase1SketchSheet).workshopTaskNote;
    const sc = (raw as Workshop2Phase1SketchSheet).sheetComment;
    const swf = (raw as Workshop2Phase1SketchSheet).sheetWorkflowStatus;
    const sch = (raw as Workshop2Phase1SketchSheet).sheetChecklist;
    const wfOk = swf === 'draft' || swf === 'review' || swf === 'approved' ? swf : undefined;
    out.push({
      sheetId,
      title: typeof (raw as Workshop2Phase1SketchSheet).title === 'string' ? (raw as Workshop2Phase1SketchSheet).title : undefined,
      viewKind: (raw as Workshop2Phase1SketchSheet).viewKind as Workshop2SketchSheetViewKind | undefined,
      imageDataUrl:
        typeof (raw as Workshop2Phase1SketchSheet).imageDataUrl === 'string'
          ? (raw as Workshop2Phase1SketchSheet).imageDataUrl
          : undefined,
      imageFileName:
        typeof (raw as Workshop2Phase1SketchSheet).imageFileName === 'string'
          ? (raw as Workshop2Phase1SketchSheet).imageFileName
          : undefined,
      annotations,
      workshopTaskNote: typeof wtn === 'string' ? wtn.slice(0, 4000) : undefined,
      sheetComment: typeof sc === 'string' ? sc.slice(0, 4000) : undefined,
      sheetWorkflowStatus: wfOk as Workshop2SketchSheetWorkflowStatus | undefined,
      sheetChecklist:
        sch && typeof sch === 'object'
          ? {
              substrateConfirmed: Boolean((sch as { substrateConfirmed?: boolean }).substrateConfirmed),
              qcPinsConfirmed: Boolean((sch as { qcPinsConfirmed?: boolean }).qcPinsConfirmed),
              workshopTaskConfirmed: Boolean((sch as { workshopTaskConfirmed?: boolean }).workshopTaskConfirmed),
            }
          : undefined,
      referenceMotionVideoUrl:
        typeof (raw as Workshop2Phase1SketchSheet).referenceMotionVideoUrl === 'string'
          ? (raw as Workshop2Phase1SketchSheet).referenceMotionVideoUrl!.slice(0, 2000)
          : undefined,
      referenceMotionVideoNote:
        typeof (raw as Workshop2Phase1SketchSheet).referenceMotionVideoNote === 'string'
          ? (raw as Workshop2Phase1SketchSheet).referenceMotionVideoNote!.slice(0, 2000)
          : undefined,
    });
    if (out.length >= MAX_SKETCH_SHEETS) break;
  }
  return out;
}

export function createEmptySketchSheet(title?: string): Workshop2Phase1SketchSheet {
  return {
    sheetId: newUuid(),
    title: title?.trim() || undefined,
    viewKind: 'other',
    annotations: [],
  };
}

export function patchSketchSheet(
  sheets: Workshop2Phase1SketchSheet[] | undefined,
  sheetId: string,
  patch: Partial<Omit<Workshop2Phase1SketchSheet, 'sheetId'>>
): Workshop2Phase1SketchSheet[] {
  const norm = normalizeSketchSheets(sheets);
  return norm.map((s) => (s.sheetId === sheetId ? { ...s, ...patch, sheetId: s.sheetId } : s));
}

export function removeSketchSheet(
  sheets: Workshop2Phase1SketchSheet[] | undefined,
  sheetId: string
): Workshop2Phase1SketchSheet[] {
  return normalizeSketchSheets(sheets).filter((s) => s.sheetId !== sheetId);
}

export function moveSketchSheet(
  sheets: Workshop2Phase1SketchSheet[] | undefined,
  sheetId: string,
  direction: -1 | 1
): Workshop2Phase1SketchSheet[] {
  const norm = normalizeSketchSheets(sheets);
  const i = norm.findIndex((s) => s.sheetId === sheetId);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= norm.length) return norm;
  const next = [...norm];
  [next[i], next[j]] = [next[j]!, next[i]!];
  return next;
}

function remapCopiedAnnotations(
  anns: Workshop2Phase1CategorySketchAnnotation[]
): Workshop2Phase1CategorySketchAnnotation[] {
  return anns.map((a) => {
    const nid = newUuid();
    const isQc = (a.stage ?? 'tz') === 'qc';
    return normalizeAnnotation({
      ...a,
      annotationId: nid,
      linkedQcZoneId: isQc ? nid : undefined,
      linkedTaskId: undefined,
      linkedAttributeId: undefined,
    });
  });
}

/** Копия листа: полностью или только метки (без файла подложки и текстов листа). */
export function duplicateSketchSheet(
  sheet: Workshop2Phase1SketchSheet,
  mode: 'full' | 'pinsOnly'
): Workshop2Phase1SketchSheet {
  const ann = remapCopiedAnnotations(sheet.annotations);
  return {
    sheetId: newUuid(),
    title: sheet.title?.trim() ? `${sheet.title.trim()} (копия)` : 'Копия листа',
    sceneId: sheet.sceneId,
    viewKind: sheet.viewKind,
    imageDataUrl: mode === 'full' ? sheet.imageDataUrl : undefined,
    imageFileName: mode === 'full' ? sheet.imageFileName : undefined,
    annotations: ann,
    workshopTaskNote: mode === 'full' ? sheet.workshopTaskNote : undefined,
    sheetComment: mode === 'full' ? sheet.sheetComment : undefined,
  };
}

function legacySlotToSheet(slot: Workshop2Phase1SubcategorySketchSlot): Workshop2Phase1SketchSheet {
  const t = slot.productionTasks;
  const parts = [t.whatToDo, t.watchAttention, t.acceptanceCriteria, t.improve, t.change]
    .map((s) => s?.trim())
    .filter(Boolean) as string[];
  return {
    sheetId: newUuid(),
    title: `Импорт · Ур.${slot.level}`,
    viewKind: 'other',
    imageDataUrl: slot.imageDataUrl,
    imageFileName: slot.imageFileName,
    annotations: remapCopiedAnnotations(slot.annotations ?? []),
    workshopTaskNote: parts.length ? parts.join('\n') : undefined,
  };
}

export function legacySlotsToSketchSheets(
  slots: Workshop2Phase1SubcategorySketchSlot[] | undefined
): Workshop2Phase1SketchSheet[] {
  const norm = normalizeSubcategorySketchSlots(slots);
  return norm
    .filter(
      (s) =>
        Boolean(s.imageDataUrl) ||
        (s.annotations?.length ?? 0) > 0 ||
        hasMeaningfulTaskContent(s.productionTasks)
    )
    .map(legacySlotToSheet);
}

export function appendImportedLegacySheets(
  current: Workshop2Phase1SketchSheet[] | undefined,
  slots: Workshop2Phase1SubcategorySketchSlot[] | undefined
): Workshop2Phase1SketchSheet[] {
  const cur = normalizeSketchSheets(current);
  const incoming = legacySlotsToSketchSheets(slots);
  if (incoming.length === 0) return cur;
  return [...cur, ...incoming].slice(0, MAX_SKETCH_SHEETS);
}
