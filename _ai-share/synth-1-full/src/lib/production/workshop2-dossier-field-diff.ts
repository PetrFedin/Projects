/**
 * Сравнение двух снимков досье — для модалки «Обновить с сервера?» (multi-tab / SSE).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

const SCALAR_KEYS = [
  'sampleSizeScaleId',
  'selectedAudienceId',
  'brandNotes',
  'lifecycleState',
  'isUnisex',
] as const;

function assignmentFingerprint(d: Workshop2DossierPhase1): Record<string, string> {
  const out: Record<string, string> = {};
  for (const a of d.assignments ?? []) {
    if (a.kind !== 'canonical') continue;
    const aid = a.attributeId?.trim();
    if (!aid) continue;
    out[`attr:${aid}`] = JSON.stringify(
      (a.values ?? []).map((v) => ({
        s: v.valueSource,
        t: v.text ?? '',
        p: v.parameterId ?? '',
        l: v.displayLabel ?? '',
      }))
    );
  }
  return out;
}

function scalarFingerprint(d: Workshop2DossierPhase1): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of SCALAR_KEYS) {
    const v = d[key as keyof Workshop2DossierPhase1];
    out[key] = v == null ? '' : String(v);
  }
  return out;
}

function dossierFieldFingerprint(d: Workshop2DossierPhase1): Record<string, string> {
  return { ...assignmentFingerprint(d), ...scalarFingerprint(d) };
}

export type Workshop2DossierFieldDiffSummary = {
  changedFieldsCount: number;
  changedFieldIds: string[];
  summaryRu: string;
};

/** Количество изменившихся полей между локальным и серверным досье. */
export function summarizeWorkshop2DossierFieldDiff(
  local: Workshop2DossierPhase1 | null | undefined,
  remote: Workshop2DossierPhase1
): Workshop2DossierFieldDiffSummary {
  const a = dossierFieldFingerprint(local ?? { schemaVersion: 1, assignments: [] });
  const b = dossierFieldFingerprint(remote);
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const changedFieldIds: string[] = [];
  for (const k of keys) {
    if (a[k] !== b[k]) changedFieldIds.push(k);
  }
  changedFieldIds.sort();
  const n = changedFieldIds.length;
  const summaryRu =
    n === 0
      ? 'Изменений в полях досье не обнаружено.'
      : n === 1
        ? 'Изменено 1 поле на сервере.'
        : `Изменено полей на сервере: ${n}.`;
  return { changedFieldsCount: n, changedFieldIds, summaryRu };
}
