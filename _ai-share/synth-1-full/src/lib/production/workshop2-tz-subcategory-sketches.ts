import { getAttributeById } from '@/lib/production/attribute-catalog';
import type {
  Workshop2DossierPhase1,
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2Phase1ProductionTaskDetail,
  Workshop2Phase1SubcategorySketchSlot,
} from '@/lib/production/workshop2-dossier-phase1.types';

/**
 * Три слота совпадают с узлами пути L1→L2→L3 в справочнике.
 * В интерфейсе не показываем «шаг 1/2/3» — только смысл узла (один SKU, разная «ширина» формулировок).
 */
export const BRANCH_CATALOG_SLOT_ROLE: Record<1 | 2 | 3, { label: string; hint: string }> = {
  1: {
    label: 'Линия',
    hint: 'Весь раздел каталога (например, всё «Одежда»): общие требования на линию.',
  },
  2: {
    label: 'Группа',
    hint: 'Подтип внутри раздела (например, «Верхняя одежда»): конкретнее, чем линия.',
  },
  3: {
    label: 'Модель',
    hint: 'Карточка этого артикула в справочнике (например, «Пальто»): совпадает с вашим SKU.',
  },
};

const EMPTY_TASKS: Workshop2Phase1ProductionTaskDetail = {
  whatToDo: '',
  improve: '',
  change: '',
  watchAttention: '',
  priority: 'normal',
  status: 'new',
  linkedStage: 'tz',
};

export function normalizeSketchAnnotation(
  annotation: Workshop2Phase1CategorySketchAnnotation
): Workshop2Phase1CategorySketchAnnotation {
  return {
    ...annotation,
    annotationType: annotation.annotationType ?? 'construction',
    priority: annotation.priority ?? 'important',
    status: annotation.status ?? 'new',
    stage: annotation.stage ?? 'tz',
  };
}

export function createAnnotationTaskLine(
  annotation: Workshop2Phase1CategorySketchAnnotation
): string {
  const pieces = [
    annotation.annotationType ? `[${annotation.annotationType}]` : '',
    annotation.priority ? `[${annotation.priority}]` : '',
    (annotation.text ?? '').trim(),
  ].filter(Boolean);
  return pieces.join(' ');
}

export function hasMeaningfulTaskContent(task: Workshop2Phase1ProductionTaskDetail): boolean {
  return Boolean(
    task.whatToDo.trim() ||
    task.improve.trim() ||
    task.change.trim() ||
    task.watchAttention.trim() ||
    task.acceptanceCriteria?.trim()
  );
}

export function getInheritedTaskSourceLevel(
  slots: Workshop2Phase1SubcategorySketchSlot[],
  level: 1 | 2 | 3
): 1 | 2 | null {
  const sourceLevels = level === 3 ? ([2, 1] as const) : level === 2 ? ([1] as const) : [];
  for (const source of sourceLevels) {
    const slot = slots.find((item) => item.level === source);
    if (slot && hasMeaningfulTaskContent(slot.productionTasks)) return source;
  }
  return null;
}

function defaultSlot(level: 1 | 2 | 3): Workshop2Phase1SubcategorySketchSlot {
  return {
    slotId: `sub-sk-${level}`,
    level,
    annotations: [],
    productionTasks: { ...EMPTY_TASKS },
  };
}

/** Всегда ровно три слота (узлы L1 / L2 / L3 пути); недостающие дополняются, лишние по level мержатся. */
export function normalizeSubcategorySketchSlots(
  existing: Workshop2Phase1SubcategorySketchSlot[] | undefined
): Workshop2Phase1SubcategorySketchSlot[] {
  const byLevel = new Map<number, Workshop2Phase1SubcategorySketchSlot>();
  for (const s of existing ?? []) {
    if (s.level === 1 || s.level === 2 || s.level === 3) {
      byLevel.set(s.level, {
        ...defaultSlot(s.level),
        ...s,
        slotId: s.slotId || `sub-sk-${s.level}`,
        annotations: (s.annotations ?? []).map(normalizeSketchAnnotation),
        productionTasks: { ...EMPTY_TASKS, ...s.productionTasks },
      });
    }
  }
  return ([1, 2, 3] as const).map((lv) => byLevel.get(lv) ?? defaultSlot(lv));
}

export function patchSubcategorySketchSlot(
  slots: Workshop2Phase1SubcategorySketchSlot[],
  level: 1 | 2 | 3,
  patch: Partial<Workshop2Phase1SubcategorySketchSlot>
): Workshop2Phase1SubcategorySketchSlot[] {
  const base = normalizeSubcategorySketchSlots(slots);
  return base.map((s) =>
    s.level === level
      ? {
          ...s,
          ...patch,
          productionTasks: patch.productionTasks
            ? { ...s.productionTasks, ...patch.productionTasks }
            : s.productionTasks,
          annotations:
            patch.annotations !== undefined
              ? patch.annotations.map(normalizeSketchAnnotation)
              : s.annotations,
        }
      : s
  );
}

/** Патч слота по `slotId` (как в `linkedTaskId` у метки). */
export function patchSubcategorySketchSlotBySlotId(
  slots: Workshop2Phase1SubcategorySketchSlot[],
  slotId: string,
  patch: Partial<Workshop2Phase1SubcategorySketchSlot>
): Workshop2Phase1SubcategorySketchSlot[] {
  const base = normalizeSubcategorySketchSlots(slots);
  const slot = base.find((s) => s.slotId === slotId);
  if (!slot) return base;
  return patchSubcategorySketchSlot(base, slot.level, patch);
}

/** Добавляет строку в «Что сделать» слота (из текста метки). */
export function appendMasterPinLineToSlotWhatToDo(
  slots: Workshop2Phase1SubcategorySketchSlot[],
  slotId: string,
  line: string
): Workshop2Phase1SubcategorySketchSlot[] {
  const base = normalizeSubcategorySketchSlots(slots);
  const slot = base.find((s) => s.slotId === slotId);
  if (!slot) return base;
  const t = line.trim();
  if (!t) return base;
  const cur = slot.productionTasks.whatToDo?.trim() ?? '';
  const bullet = `[Метка скетча] ${t}`;
  const next = cur ? `${cur}\n• ${bullet}` : `• ${bullet}`;
  return patchSubcategorySketchSlot(base, slot.level, {
    productionTasks: { ...slot.productionTasks, whatToDo: next },
  });
}

/** Добавляет id метки в `linkedAnnotationIds` задачи слота (без дублей). */
export function addAnnotationIdToSlotLinkedIds(
  slots: Workshop2Phase1SubcategorySketchSlot[],
  slotId: string,
  annotationId: string
): Workshop2Phase1SubcategorySketchSlot[] {
  const base = normalizeSubcategorySketchSlots(slots);
  const slot = base.find((s) => s.slotId === slotId);
  if (!slot) return base;
  const prev = slot.productionTasks.linkedAnnotationIds ?? [];
  if (prev.includes(annotationId)) return base;
  return patchSubcategorySketchSlot(base, slot.level, {
    productionTasks: {
      ...slot.productionTasks,
      linkedAnnotationIds: [...prev, annotationId],
    },
  });
}

/**
 * Текстовая сводка для вставки в слот скетча: артикул, категория, выбранные атрибуты, мерки.
 */
export function buildTzAttributesDimensionsSnapshotText(
  dossier: Workshop2DossierPhase1,
  opts: { articleSku: string; articleName: string; pathLabel: string }
): string {
  const lines: string[] = [];
  lines.push(`Артикул: ${opts.articleSku}`);
  lines.push(`Наименование: ${opts.articleName}`);
  lines.push(`Ветка каталога: ${opts.pathLabel}`);
  lines.push('');
  lines.push('— Атрибуты карточки / ТЗ (выбранные значения) —');

  if (!dossier.assignments.length) {
    lines.push('(пока нет назначений — заполните блоки атрибутов выше по форме)');
  } else {
    for (const a of dossier.assignments) {
      const attr = a.attributeId ? getAttributeById(a.attributeId) : undefined;
      const label = attr?.name ?? a.customProposed?.label ?? a.attributeId ?? '—';
      const vals = a.values
        .map((v) => v.displayLabel)
        .filter(Boolean)
        .join('; ');
      lines.push(`• ${label}: ${vals || '—'}`);
    }
  }

  lines.push('');
  lines.push('— Габариты и мерки (базовый размер / таблица) —');
  const dims = dossier.sampleBasePerSizeDimensions;
  if (dims && Object.keys(dims).length > 0) {
    for (const [paramKey, row] of Object.entries(dims)) {
      lines.push(`[${paramKey}]`);
      for (const [label, value] of Object.entries(row)) {
        lines.push(`  · ${label}: ${value}`);
      }
    }
  } else {
    lines.push(
      '(таблица мерок пуста — задайте базовый размер и мерки в соответствующем блоке досье)'
    );
  }

  const ranges = dossier.sampleBasePerSizeDimensionRanges;
  if (ranges && Object.keys(ranges).length > 0) {
    lines.push('');
    lines.push('— Допуски мин–макс (если заданы) —');
    for (const [paramKey, row] of Object.entries(ranges)) {
      for (const [label, cell] of Object.entries(row)) {
        const nom = cell.nominal ? ` номинал ${cell.nominal}` : '';
        lines.push(`  · ${paramKey} / ${label}: ${cell.min} – ${cell.max}${nom}`);
      }
    }
  }

  return lines.join('\n');
}
