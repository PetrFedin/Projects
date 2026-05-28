import { partitionHandbookAndFree } from '@/components/brand/production/workshop2-phase1-dossier-panel-assignment-helpers';
import type {
  Workshop2DossierPhase1,
  Workshop2Phase1AttributeAssignment,
  Workshop2Phase1AttributeValue,
  Workshop2Phase1DimensionRangeCell,
} from '@/lib/production/workshop2-dossier-phase1.types';

export function newUuid(): string {
  return globalThis.crypto.randomUUID();
}

export function findCanonicalIndex(dossier: Workshop2DossierPhase1, attributeId: string): number {
  return dossier.assignments.findIndex(
    (a) => a.kind === 'canonical' && a.attributeId === attributeId
  );
}

/** Разбор «свой размер» по `;` с сохранением пустого хвоста после последней `;` (например `S;` при наборе). */
export function parseSemicolonFreeTextSegments(raw: string): string[] {
  if (!raw) return [];
  const parts = raw.split(';').map((p) => p.trim());
  while (parts.length > 1 && parts[parts.length - 1] === '' && parts[parts.length - 2] === '') {
    parts.pop();
  }
  return parts;
}

export function sumSampleBasePieceQtyForPids(
  qty: Record<string, number> | undefined,
  pids: Set<string>
): number {
  if (!qty) return 0;
  let s = 0;
  for (const pid of pids) {
    const v = qty[pid];
    if (typeof v === 'number' && Number.isFinite(v) && v > 0) s += Math.floor(v);
  }
  return s;
}

/** Уменьшает количества по размерам так, чтобы сумма не превышала cap (приоритет — сохранить большие строки). */
export function clampSampleBasePieceQtyToCap(
  qty: Record<string, number> | undefined,
  cap: number
): Record<string, number> | undefined {
  if (!qty || !Object.keys(qty).length) return undefined;
  const capFloor = Math.max(0, Math.floor(cap));
  const entries = Object.entries(qty)
    .map(
      ([k, v]) =>
        [k, Math.max(0, Math.floor(typeof v === 'number' && Number.isFinite(v) ? v : 0))] as const
    )
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  let left = capFloor;
  const nq: Record<string, number> = {};
  for (const [k, val] of entries) {
    const assign = Math.min(val, left);
    if (assign > 0) nq[k] = assign;
    left -= assign;
    if (left <= 0) break;
  }
  return Object.keys(nq).length ? nq : undefined;
}

export function upsertCanonicalMultiHandbookAndFree(
  dossier: Workshop2DossierPhase1,
  attributeId: string,
  handbookParts: { parameterId: string; displayLabel: string }[],
  freeTextRaw: string,
  preserveOrderValues?: Workshop2Phase1AttributeValue[]
): Workshop2DossierPhase1 {
  const idx = findCanonicalIndex(dossier, attributeId);
  const prev = idx >= 0 ? dossier.assignments[idx]! : null;

  let values: Workshop2Phase1AttributeValue[] = [];

  if (preserveOrderValues && preserveOrderValues.length > 0) {
    values = preserveOrderValues;
  } else {
    const seen = new Set<string>();
    for (const h of handbookParts) {
      const pid = h.parameterId?.trim();
      if (!pid || seen.has(pid)) continue;
      seen.add(pid);
      values.push({
        valueId: newUuid(),
        valueSource: 'handbook_parameter',
        parameterId: pid,
        displayLabel: (h.displayLabel || pid).slice(0, 512),
      });
    }
    const ftParts = parseSemicolonFreeTextSegments(freeTextRaw);
    const hasFree = ftParts.some((p) => p.length > 0) || freeTextRaw.includes(';');
    if (hasFree) {
      for (const p of ftParts) {
        values.push({
          valueId: newUuid(),
          valueSource: 'free_text',
          text: p,
          displayLabel: p.slice(0, 512),
        });
      }
    }
  }

  if (values.length === 0) {
    if (idx < 0) return dossier;
    return {
      ...dossier,
      assignments: dossier.assignments.filter((_, i) => i !== idx),
    };
  }
  const nextAssign: Workshop2Phase1AttributeAssignment = {
    assignmentId: prev?.assignmentId ?? newUuid(),
    kind: 'canonical',
    attributeId,
    values,
  };
  const assignments = [...dossier.assignments];
  if (idx >= 0) assignments[idx] = nextAssign;
  else assignments.push(nextAssign);
  return { ...dossier, assignments };
}

/** Синхронизация выбранных размеров и обрезка табеля/кол-ва по строкам, которых больше нет в справочнике. */
export function syncSampleBaseSizePartsAndPruneDims(
  prev: Workshop2DossierPhase1,
  parts: { parameterId: string; displayLabel: string }[],
  ftRaw: string
): Workshop2DossierPhase1 {
  const allow = new Set(parts.map((p) => p.parameterId));

  const a = prev.assignments.find(
    (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
  );
  let preserveOrderValues: Workshop2Phase1AttributeValue[] | undefined = undefined;

  if (a) {
    const newValues: Workshop2Phase1AttributeValue[] = [];
    const usedParts = new Set<string>();

    for (const v of a.values) {
      if (v.valueSource === 'handbook_parameter' && allow.has(v.parameterId!)) {
        newValues.push(v);
        usedParts.add(v.parameterId!);
      } else if (v.valueSource === 'free_text') {
        newValues.push(v);
      }
    }

    for (const p of parts) {
      if (!usedParts.has(p.parameterId)) {
        newValues.push({
          valueId: newUuid(),
          valueSource: 'handbook_parameter',
          parameterId: p.parameterId,
          displayLabel: p.displayLabel,
        });
      }
    }
    preserveOrderValues = newValues;
  }

  const merged = upsertCanonicalMultiHandbookAndFree(
    prev,
    'sampleBaseSize',
    parts,
    ftRaw,
    preserveOrderValues
  );

  const mergedAssign = merged.assignments.find((x) => x.attributeId === 'sampleBaseSize');
  if (mergedAssign) {
    mergedAssign.values.forEach((v) => {
      if (v.valueSource === 'free_text') {
        allow.add(`__free:${v.text ?? ''}`);
      }
    });
  }

  const cur = merged.sampleBasePerSizeDimensions;
  const curRanges = merged.sampleBasePerSizeDimensionRanges;
  const curQty = merged.sampleBasePerSizePieceQty;
  const nextPer: Record<string, Record<string, string>> = {};
  if (cur) {
    for (const k of Object.keys(cur)) {
      if (allow.has(k)) nextPer[k] = cur[k]!;
    }
  }
  const nextRanges: Record<string, Record<string, Workshop2Phase1DimensionRangeCell>> = {};
  if (curRanges) {
    for (const k of Object.keys(curRanges)) {
      if (allow.has(k)) nextRanges[k] = curRanges[k]!;
    }
  }
  const nextQty: Record<string, number> = {};
  if (curQty) {
    for (const k of Object.keys(curQty)) {
      if (allow.has(k)) nextQty[k] = curQty[k]!;
    }
  }
  return {
    ...merged,
    sampleBasePerSizeDimensions: Object.keys(nextPer).length ? nextPer : undefined,
    sampleBasePerSizeDimensionRanges: Object.keys(nextRanges).length ? nextRanges : undefined,
    sampleBasePerSizePieceQty: Object.keys(nextQty).length ? nextQty : undefined,
  };
}

export function upsertCanonicalDual(
  dossier: Workshop2DossierPhase1,
  attributeId: string,
  handbook: { parameterId: string; displayLabel: string } | null,
  freeTextRaw: string
): Workshop2DossierPhase1 {
  const parts = handbook?.parameterId ? [handbook] : [];
  return upsertCanonicalMultiHandbookAndFree(dossier, attributeId, parts, freeTextRaw);
}

export function upsertCanonicalHandbookValues(
  dossier: Workshop2DossierPhase1,
  attributeId: string,
  handbookParts: { parameterId: string; displayLabel: string }[]
): Workshop2DossierPhase1 {
  const idx = findCanonicalIndex(dossier, attributeId);
  const prev = idx >= 0 ? dossier.assignments[idx]! : null;
  if (handbookParts.length === 0) {
    if (idx < 0) return dossier;
    return { ...dossier, assignments: dossier.assignments.filter((_, i) => i !== idx) };
  }
  const values: Workshop2Phase1AttributeValue[] = handbookParts.map((h) => ({
    valueId: newUuid(),
    valueSource: 'handbook_parameter',
    parameterId: h.parameterId,
    displayLabel: h.displayLabel,
  }));
  const nextAssign: Workshop2Phase1AttributeAssignment = {
    assignmentId: prev?.assignmentId ?? newUuid(),
    kind: 'canonical',
    attributeId,
    values,
  };
  const assignments = [...dossier.assignments];
  if (idx >= 0) assignments[idx] = nextAssign;
  else assignments.push(nextAssign);
  return { ...dossier, assignments };
}

/** Заменить справочные части canonical-атрибута, сохранив существующий free_text. */
export function upsertCanonicalMultiHandbookPreservingFreeSide(
  prev: Workshop2DossierPhase1,
  attributeId: string,
  handbookParts: { parameterId: string; displayLabel: string }[]
): Workshop2DossierPhase1 {
  const a = prev.assignments.find((x) => x.kind === 'canonical' && x.attributeId === attributeId);
  const ftText =
    a?.values
      .filter((v) => v.valueSource === 'free_text')
      .map((v) => v.text ?? '')
      .join(';') ?? '';

  let preserveOrderValues: Workshop2Phase1AttributeValue[] | undefined = undefined;
  if (a) {
    preserveOrderValues = [];
    const usedParts = new Set<string>();

    // Keep existing handbook parameters if they are in the new list, keep free text
    for (const v of a.values) {
      if (
        v.valueSource === 'handbook_parameter' &&
        handbookParts.some((p) => p.parameterId === v.parameterId)
      ) {
        preserveOrderValues.push(v);
        usedParts.add(v.parameterId!);
      } else if (v.valueSource === 'free_text') {
        preserveOrderValues.push(v);
      }
    }

    // Add new handbook parameters to the end
    for (const p of handbookParts) {
      if (!usedParts.has(p.parameterId)) {
        preserveOrderValues.push({
          valueId: newUuid(),
          valueSource: 'handbook_parameter',
          parameterId: p.parameterId,
          displayLabel: p.displayLabel,
        });
      }
    }
  }

  return upsertCanonicalMultiHandbookAndFree(
    prev,
    attributeId,
    handbookParts,
    ftText,
    preserveOrderValues
  );
}

/** Обновить free_text у canonical-атрибута, сохранив текущие handbook_parameter. */
export function upsertCanonicalMultiHandbookPreservingHandbookSide(
  prev: Workshop2DossierPhase1,
  attributeId: string,
  freeText: string
): Workshop2DossierPhase1 {
  const a = prev.assignments.find((x) => x.kind === 'canonical' && x.attributeId === attributeId);
  if (!a) {
    return upsertCanonicalMultiHandbookAndFree(prev, attributeId, [], freeText);
  }

  const segments = parseSemicolonFreeTextSegments(freeText);
  const newValues: Workshop2Phase1AttributeValue[] = [];
  const segQueue = [...segments];

  for (const v of a.values) {
    if (v.valueSource === 'handbook_parameter') {
      newValues.push(v);
    } else if (v.valueSource === 'free_text') {
      const seg = segQueue.shift();
      if (seg === undefined) {
        continue;
      }
      newValues.push({
        ...v,
        text: seg,
        displayLabel: seg.slice(0, 512),
      });
    }
  }
  while (segQueue.length > 0) {
    const seg = segQueue.shift()!;
    newValues.push({
      valueId: newUuid(),
      valueSource: 'free_text',
      text: seg,
      displayLabel: seg.slice(0, 512),
    });
  }

  const idx = findCanonicalIndex(prev, attributeId);
  const assignments = [...prev.assignments];
  assignments[idx] = { ...a, values: newValues };

  return { ...prev, assignments };
}

export function removeAssignmentById(
  prev: Workshop2DossierPhase1,
  assignmentId: string
): Workshop2DossierPhase1 {
  return {
    ...prev,
    assignments: prev.assignments.filter((a) => a.assignmentId !== assignmentId),
  };
}
