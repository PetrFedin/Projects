import type {
  Workshop2MesDefectCodeRow,
  Workshop2Phase1CategorySketchAnnotation,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { sketchPinBelongsToLeaf } from '@/lib/production/workshop2-sketch-pin-templates';
import { defectLabelByCode, mergedMesDefectCatalog } from '@/lib/production/sketch-mes-catalog';

function csvEscape(s: string): string {
  const t = s.replace(/"/g, '""');
  return `"${t}"`;
}

/** Экспорт меток с полями MES: код дефекта, смена, BOM (для Excel / MES). */
export function downloadSketchMesQualityCsv(args: {
  pathLabel: string;
  sku?: string;
  annotations: Workshop2Phase1CategorySketchAnnotation[];
  leafId: string;
  defectCatalog?: Workshop2MesDefectCodeRow[];
  fileNameStem?: string;
  /** Если задано — только метки с этим этапом или приоритетом критично */
  onlyQcOrCritical?: boolean;
}): void {
  const {
    pathLabel,
    sku = '',
    annotations,
    leafId,
    defectCatalog,
    fileNameStem = 'sketch-mes-quality',
    onlyQcOrCritical = false,
  } = args;
  const cat = mergedMesDefectCatalog(defectCatalog);
  let rows = annotations.filter((a) => sketchPinBelongsToLeaf(a, leafId));
  if (onlyQcOrCritical) {
    rows = rows.filter((a) => a.priority === 'critical' || a.stage === 'qc');
  }
  const header = [
    'sku',
    'path',
    'pin_index',
    'annotation_id',
    'shift_id',
    'defect_code',
    'defect_label',
    'defect_parent',
    'bom_line_ref',
    'material_note',
    'priority',
    'stage',
    'x_pct',
    'y_pct',
    'text',
    'linked_task_id',
    'linked_attribute_id',
    'owner',
    'due_date',
  ];
  const lines = [header.join(';')];
  rows.forEach((a, idx) => {
    const code = a.mesDefectCode?.trim() ?? '';
    const label = defectLabelByCode(cat, code) ?? '';
    const parent = code ? cat.find((c) => c.code === code)?.parentCode ?? '' : '';
    lines.push(
      [
        csvEscape(sku),
        csvEscape(pathLabel),
        String(idx + 1),
        csvEscape(a.annotationId),
        csvEscape(a.mesShiftId ?? ''),
        csvEscape(code),
        csvEscape(label),
        csvEscape(parent),
        csvEscape(a.linkedBomLineRef ?? ''),
        csvEscape(a.linkedMaterialNote ?? ''),
        csvEscape(a.priority ?? ''),
        csvEscape(a.stage ?? ''),
        String(Math.round(a.xPct * 10) / 10),
        String(Math.round(a.yPct * 10) / 10),
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
  const el = document.createElement('a');
  el.href = url;
  el.download = `${fileNameStem.replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]+/g, '-')}.csv`;
  el.click();
  URL.revokeObjectURL(url);
}
