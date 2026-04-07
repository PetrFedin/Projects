/**
 * Локальная аналитика досье ТЗ по коллекции (localStorage, без API).
 */
import { findHandbookLeafById } from './category-handbook-leaves';
import { getAttributeById } from './attribute-catalog';
import { calculateDossierReadiness } from './dossier-readiness-engine';
import {
  workshop2Phase1DossierStorageKey,
  type Workshop2Phase1DossierMap,
} from './workshop2-phase1-dossier-storage';
import type { Workshop2DossierPhase1 } from './workshop2-dossier-phase1.types';
import { workshopTzSignoffRequiredForRole } from './workshop2-tz-signatory-options';

export type CollectionDossierRollup = {
  articleCount: number;
  withDossierCount: number;
  avgTzPct: number;
  readyForSampleCount: number;
  overdueSlaCount: number;
  weakApprovalsCount: number;
  bomPinCount: number;
};

const BOM_PICK_ATTR_IDS = new Set([
  'mat',
  'composition',
  'lining',
  'trim',
  'insulation',
  'hardware',
  'filling',
]);

function countOverdueTzSla(d: Workshop2DossierPhase1, today: string): number {
  const due = d.passportProductionBrief?.tzRoleResponseDue;
  if (!due) return 0;
  let n = 0;
  const tzB = d.tzSignatoryBindings;
  if (
    due.designer &&
    due.designer < today &&
    workshopTzSignoffRequiredForRole(tzB, 'designer') &&
    !d.isVerifiedByDesigner
  ) {
    n++;
  }
  if (
    due.technologist &&
    due.technologist < today &&
    workshopTzSignoffRequiredForRole(tzB, 'technologist') &&
    !d.isVerifiedByTechnologist
  ) {
    n++;
  }
  if (
    due.manager &&
    due.manager < today &&
    workshopTzSignoffRequiredForRole(tzB, 'manager') &&
    !d.isVerifiedByManager
  ) {
    n++;
  }
  return n;
}

function countBomLinkedPins(d: Workshop2DossierPhase1): number {
  const slotPins = (d.subcategorySketchSlots ?? []).flatMap((s) => s.annotations);
  const pins = [
    ...(d.categorySketchAnnotations ?? []),
    ...slotPins,
    ...(d.sketchSheets?.flatMap((s) => s.annotations) ?? []),
  ];
  return pins.filter((p) => (p.linkedBomLineRef ?? '').trim().length > 0).length;
}

function dossierLooksPopulated(d: Workshop2DossierPhase1): boolean {
  if ((d.assignments?.length ?? 0) > 0) return true;
  if ((d.categorySketchAnnotations?.length ?? 0) > 0) return true;
  if (d.categorySketchImageDataUrl) return true;
  if ((d.sketchSheets?.length ?? 0) > 0) return true;
  if (d.updatedAt) return true;
  return false;
}

/**
 * Сводка по артикулам коллекции: готовность ТЗ, SLA, подписи, метки с BOM ref.
 */
export function summarizeCollectionDossierRollup(
  map: Workshop2Phase1DossierMap,
  collectionId: string,
  articles: { id: string; categoryLeafId?: string }[]
): CollectionDossierRollup {
  const base: CollectionDossierRollup = {
    articleCount: articles.length,
    withDossierCount: 0,
    avgTzPct: 0,
    readyForSampleCount: 0,
    overdueSlaCount: 0,
    weakApprovalsCount: 0,
    bomPinCount: 0,
  };
  if (articles.length === 0) return base;

  const today = new Date().toISOString().slice(0, 10);
  let pctSum = 0;
  let withD = 0;
  let ready = 0;
  let sla = 0;
  let weak = 0;
  let bom = 0;

  const firstLeafId = articles.find((a) => a.categoryLeafId)?.categoryLeafId;
  const fallbackLeaf = firstLeafId ? findHandbookLeafById(firstLeafId) ?? null : null;

  for (const art of articles) {
    const key = workshop2Phase1DossierStorageKey(collectionId, art.id);
    const d = map[key];
    if (!d || !dossierLooksPopulated(d)) continue;
    withD++;
    const leaf =
      findHandbookLeafById(art.categoryLeafId ?? '') ?? fallbackLeaf ?? null;
    const r = calculateDossierReadiness(d, leaf);
    pctSum += r.overall.pct;
    if (r.summary.readyForSample) ready++;
    sla += countOverdueTzSla(d, today);
    if (!r.summary.approvalsReady) weak++;
    bom += countBomLinkedPins(d);
  }

  return {
    articleCount: articles.length,
    withDossierCount: withD,
    avgTzPct: withD > 0 ? Math.round(pctSum / withD) : 0,
    readyForSampleCount: ready,
    overdueSlaCount: sla,
    weakApprovalsCount: weak,
    bomPinCount: bom,
  };
}

/**
 * Варианты для поля «BOM ref» метки: канонические материалы / состав из досье + custom_proposed.
 */
export function buildBomLinePickOptions(dossier: Workshop2DossierPhase1): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  const seen = new Set<string>();

  for (const a of dossier.assignments) {
    if (a.kind === 'custom_proposed' && a.customProposed?.label?.trim()) {
      const raw = a.customProposed.label.trim();
      const v = `custom:${a.assignmentId}`;
      if (seen.has(v)) continue;
      seen.add(v);
      out.push({ value: v, label: `Предложено: ${raw.slice(0, 120)}` });
      continue;
    }
    const aid = a.attributeId;
    if (!aid || !BOM_PICK_ATTR_IDS.has(aid)) continue;
    const attr = getAttributeById(aid);
    const attrLabel = attr?.label ?? aid;

    for (const val of a.values) {
      if (val.valueSource === 'handbook_parameter' && val.parameterId) {
        const v = `${aid}:${val.parameterId}`;
        if (seen.has(v)) continue;
        seen.add(v);
        const lbl = val.displayLabel?.trim() || val.parameterId;
        out.push({ value: v, label: `${attrLabel}: ${lbl}` });
      } else if (val.text?.trim()) {
        const t = val.text.trim().slice(0, 160);
        const v = `txt:${aid}:${t}`;
        if (seen.has(v)) continue;
        seen.add(v);
        out.push({ value: v, label: `${attrLabel}: ${t}` });
      }
    }
  }

  return out;
}
