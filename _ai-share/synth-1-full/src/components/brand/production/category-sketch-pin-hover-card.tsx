'use client';

import type { Workshop2Phase1CategorySketchAnnotation } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  isSketchDimensionLineAnnotation,
  sketchDimensionSummary,
} from '@/lib/production/sketch-dimension-line';
import {
  ORPHAN_LINKED_TASK_LABEL,
  PRIORITY_LABELS,
  STAGE_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from '@/components/brand/production/category-sketch-annotator-label-maps';

export function CategorySketchPinHoverCard({
  annotation: a,
  index,
  attributeOptions,
  taskSlotLabelById,
}: {
  annotation: Workshop2Phase1CategorySketchAnnotation;
  index: number;
  attributeOptions: { id: string; label: string }[];
  taskSlotLabelById?: Record<string, string>;
}) {
  const linkedLabel =
    a.linkedAttributeId && attributeOptions.find((o) => o.id === a.linkedAttributeId)?.label;
  const dimLine = isSketchDimensionLineAnnotation(a);
  const dimSummary = dimLine ? sketchDimensionSummary(a) : '';
  return (
    <div className="max-w-[260px] space-y-1.5 text-left text-sm leading-snug">
      <p className="font-semibold text-slate-900">
        Метка #{index + 1} · {TYPE_LABELS[a.annotationType ?? 'construction']} ·{' '}
        {PRIORITY_LABELS[a.priority ?? 'important']}
      </p>
      <p className="text-slate-600">
        {STATUS_LABELS[a.status ?? 'new']} · {STAGE_LABELS[a.stage ?? 'tz']}
      </p>
      {a.owner?.trim() ? <p className="text-slate-600">Ответственный: {a.owner.trim()}</p> : null}
      {a.dueDate ? (
        <p className="text-slate-600">
          Срок:{' '}
          {(() => {
            try {
              return new Date(a.dueDate).toLocaleDateString('ru-RU');
            } catch {
              return a.dueDate;
            }
          })()}
        </p>
      ) : null}
      {linkedLabel ? (
        <p className="font-medium text-indigo-800">
          Связанный атрибут: <span className="font-normal">{linkedLabel}</span>
        </p>
      ) : null}
      {a.linkedQcZoneId ? (
        <p className="text-xs text-amber-800">Зона ОТК: {a.linkedQcZoneId}</p>
      ) : null}
      {a.linkedTaskId ? (
        <p className="text-xs text-slate-600">
          Задача подкатегории:{' '}
          <span className="font-medium">
            {taskSlotLabelById?.[a.linkedTaskId] ?? ORPHAN_LINKED_TASK_LABEL}
          </span>
        </p>
      ) : null}
      {a.linkedBomLineRef?.trim() || a.linkedMaterialNote?.trim() ? (
        <p className="text-xs text-emerald-900">
          BOM: {a.linkedBomLineRef?.trim() || '—'}
          {a.linkedMaterialNote?.trim() ? ` · ${a.linkedMaterialNote.trim()}` : null}
        </p>
      ) : null}
      {a.mesDefectCode?.trim() || a.mesShiftId?.trim() ? (
        <p className="text-xs text-amber-900">
          MES: {a.mesDefectCode?.trim() || '—'}
          {a.mesShiftId?.trim() ? ` · смена ${a.mesShiftId.trim()}` : null}
        </p>
      ) : null}
      {a.proofPhotoDataUrl ? (
        <p className="text-xs text-slate-700">
          Фото: {a.proofPhotoFileName ?? 'вложение'} ·{' '}
          {a.proofStatus === 'accepted'
            ? 'принято'
            : a.proofStatus === 'rejected'
              ? 'брак'
              : 'на проверке'}
        </p>
      ) : null}
      {dimLine ? (
        <p className="rounded border border-teal-200 bg-teal-50/90 px-2 py-1 text-xs font-medium text-teal-950">
          Линейный размер
          {dimSummary ? (
            <>
              : <span className="font-semibold">{dimSummary}</span>
            </>
          ) : (
            <> — укажите подпись и значение справа.</>
          )}
        </p>
      ) : null}
      <p className="border-t border-slate-200 pt-1.5 text-slate-800">
        {dimLine
          ? a.text?.trim()
            ? a.text.trim()
            : 'Доп. комментарий к размеру не обязателен.'
          : a.text?.trim()
            ? a.text.trim()
            : 'Описание не заполнено — добавьте текст в списке справа.'}
      </p>
    </div>
  );
}
