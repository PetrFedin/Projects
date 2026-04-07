import type {
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2SketchAnnotationAuditEntry,
} from '@/lib/production/workshop2-dossier-phase1.types';

const MAX_LOG = 120;

function newId(): string {
  return crypto.randomUUID();
}

export function mergeSketchMasterAuditLog(
  existing: Workshop2SketchAnnotationAuditEntry[] | undefined,
  newEntries: Workshop2SketchAnnotationAuditEntry[]
): Workshop2SketchAnnotationAuditEntry[] {
  if (newEntries.length === 0) return existing ?? [];
  return [...(existing ?? []), ...newEntries].slice(-MAX_LOG);
}

export function buildAnnotationDiffAudit(
  before: Workshop2Phase1CategorySketchAnnotation[],
  after: Workshop2Phase1CategorySketchAnnotation[],
  leafId: string,
  by: string
): Workshop2SketchAnnotationAuditEntry[] {
  const bOwn = before.filter((a) => a.categoryLeafId === leafId);
  const aOwn = after.filter((a) => a.categoryLeafId === leafId);
  const beforeMap = new Map(bOwn.map((a) => [a.annotationId, a]));
  const afterMap = new Map(aOwn.map((a) => [a.annotationId, a]));
  const at = new Date().toISOString();
  const out: Workshop2SketchAnnotationAuditEntry[] = [];

  for (const [id, a] of afterMap) {
    if (!beforeMap.has(id)) {
      out.push({
        entryId: newId(),
        at,
        by,
        annotationId: id,
        action: 'create',
        summary: 'Создана метка',
      });
    }
  }
  for (const [id] of beforeMap) {
    if (!afterMap.has(id)) {
      out.push({
        entryId: newId(),
        at,
        by,
        annotationId: id,
        action: 'delete',
        summary: 'Метка удалена',
      });
    }
  }
  for (const [id, oldA] of beforeMap) {
    const neu = afterMap.get(id);
    if (!neu) continue;
    const moved =
      Math.abs(oldA.xPct - neu.xPct) > 0.45 || Math.abs(oldA.yPct - neu.yPct) > 0.45;
    const textCh = (oldA.text ?? '').trim() !== (neu.text ?? '').trim();
    const bomCh =
      (oldA.linkedBomLineRef ?? '').trim() !== (neu.linkedBomLineRef ?? '').trim() ||
      (oldA.linkedMaterialNote ?? '').trim() !== (neu.linkedMaterialNote ?? '').trim();
    const metaChNoBom =
      oldA.priority !== neu.priority ||
      oldA.stage !== neu.stage ||
      oldA.annotationType !== neu.annotationType ||
      oldA.linkedTaskId !== neu.linkedTaskId ||
      oldA.linkedAttributeId !== neu.linkedAttributeId;
    if (bomCh) {
      out.push({
        entryId: newId(),
        at,
        by,
        annotationId: id,
        action: 'bom_link',
        summary: 'Изменена связь BOM / материала',
      });
    }
    if (moved && !textCh && !metaChNoBom && !bomCh) {
      out.push({
        entryId: newId(),
        at,
        by,
        annotationId: id,
        action: 'move',
        summary: `Сдвиг: ${neu.xPct.toFixed(0)}% / ${neu.yPct.toFixed(0)}%`,
      });
    } else if (textCh || metaChNoBom || (moved && (textCh || metaChNoBom))) {
      out.push({
        entryId: newId(),
        at,
        by,
        annotationId: id,
        action: 'update',
        summary: moved ? 'Изменение полей и позиции' : 'Изменение полей метки',
      });
    } else if (moved && bomCh && !textCh && !metaChNoBom) {
      out.push({
        entryId: newId(),
        at,
        by,
        annotationId: id,
        action: 'move',
        summary: `Сдвиг: ${neu.xPct.toFixed(0)}% / ${neu.yPct.toFixed(0)}%`,
      });
    }
  }
  return out;
}
