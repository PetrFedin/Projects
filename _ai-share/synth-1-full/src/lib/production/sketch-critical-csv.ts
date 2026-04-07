import type { Workshop2Phase1CategorySketchAnnotation } from '@/lib/production/workshop2-dossier-phase1.types';
import { sketchPinBelongsToLeaf } from '@/lib/production/workshop2-sketch-pin-templates';

function csvEscape(s: string): string {
  const t = s.replace(/"/g, '""');
  return `"${t}"`;
}

/** Экспорт критичных меток и связей для MES / Excel. */
export function downloadCriticalPinsCsv(args: {
  pathLabel: string;
  sku?: string;
  annotations: Workshop2Phase1CategorySketchAnnotation[];
  leafId: string;
  fileNameStem?: string;
}): void {
  const { pathLabel, sku = '', annotations, leafId, fileNameStem = 'sketch-critical' } = args;
  const rows = annotations.filter((a) => sketchPinBelongsToLeaf(a, leafId) && a.priority === 'critical');
  const header = [
    'sku',
    'path',
    'pin_index',
    'annotation_id',
    'shift_id',
    'defect_code',
    'bom_line_ref',
    'x_pct',
    'y_pct',
    'type',
    'stage',
    'text',
    'linked_task_id',
    'linked_attribute_id',
    'owner',
    'due_date',
  ];
  const lines = [header.join(';')];
  rows.forEach((a, idx) => {
    lines.push(
      [
        csvEscape(sku),
        csvEscape(pathLabel),
        String(idx + 1),
        csvEscape(a.annotationId),
        csvEscape(a.mesShiftId ?? ''),
        csvEscape(a.mesDefectCode ?? ''),
        csvEscape(a.linkedBomLineRef ?? ''),
        String(Math.round(a.xPct * 10) / 10),
        String(Math.round(a.yPct * 10) / 10),
        csvEscape(a.annotationType ?? ''),
        csvEscape(a.stage ?? ''),
        csvEscape((a.text ?? '').trim()),
        csvEscape(a.linkedTaskId ?? ''),
        csvEscape(a.linkedAttributeId ?? ''),
        csvEscape(a.owner ?? ''),
        csvEscape(a.dueDate ?? ''),
      ].join(';')
    );
  });
  const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileNameStem.replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]+/g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
