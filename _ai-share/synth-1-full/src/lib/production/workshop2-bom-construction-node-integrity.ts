/**
 * Production-grade: конструкция — связка «метка(узел) → строка BOM (lineRef) → обработка (текст)».
 * Без «похоже на mat»: lineRef сравнивается с явным реестром ref-ов в досье.
 */

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { normalizeSketchSheets } from '@/lib/production/workshop2-sketch-sheets';
import { sketchPinBelongsToLeaf } from '@/lib/production/workshop2-sketch-pin-templates';
import type { Workshop2Phase1CategorySketchAnnotation } from '@/lib/production/workshop2-dossier-phase1.types';

/** Токен LREF, генерируемый UI costing/BOM (см. DossierSupplyChainDraftsPanel). */
const LREF_TOKEN_RE = /LREF-[A-Za-z0-9._-]+/g;

export const W2_CNODE_BOM = {
  /** Нет ссылки на строку BOM у метки с привязкой к конструкции. */
  MISSING_BOM_REF: 'W2_CNODE_001',
  /** lineRef на метке не совпадает ни с одной зарегистрированной строкой BOM. */
  UNKNOWN_BOM_REF: 'W2_CNODE_002',
  /** Нет текста обработки (ни текст метки, ни «Материал для цеха»). */
  MISSING_PROCESSING: 'W2_CNODE_003',
  /** В досье нет зарегистрированных lineRef (costing / дельта / LREF-… в mat) при наличии конструкционных меток. */
  NO_BOM_REF_REGISTRY: 'W2_CNODE_004',
} as const;

/** Симметрия к узлам: lineRef в реестре досье, но ни одна конструктивная метка на скетче не ссылается на него. */
export const W2_MATERIAL_WITHOUT_NODE = 'W2_MATERIAL_WITHOUT_NODE' as const;

export type W2CnodeBomIssueCode = (typeof W2_CNODE_BOM)[keyof typeof W2_CNODE_BOM];

export type W2BomCnodeIssue = {
  code: W2CnodeBomIssueCode;
  messageRu: string;
  annotationId?: string;
  linkedBomLineRef?: string;
};

export type W2MaterialWithoutNodeIssue = {
  code: typeof W2_MATERIAL_WITHOUT_NODE;
  messageRu: string;
  lineRef: string;
};

function tag(code: string, message: string): string {
  return `[${code}] ${message}`;
}

function extractLrefTokens(s: string): string[] {
  const m = s.match(LREF_TOKEN_RE);
  return m ?? [];
}

function collectMatStringsForLrefExtraction(dossier: Workshop2DossierPhase1): string[] {
  const mat = dossier.assignments.find((a) => a.kind === 'canonical' && a.attributeId === 'mat');
  const out: string[] = [];
  for (const v of mat?.values ?? []) {
    out.push(v.displayLabel ?? '', v.text ?? '');
  }
  return out;
}

/**
 * Все lineRef, явно зарегистрированные в досье: costing, дельта BOM, LREF-… в строках mat.
 */
export function collectKnownBomLineRefsFromDossier(dossier: Workshop2DossierPhase1): Set<string> {
  const s = new Set<string>();
  for (const h of dossier.bomLineCostingHints ?? []) {
    const t = h.lineRef?.trim();
    if (t) s.add(t);
  }
  for (const d of dossier.bomLineDeltaDrafts ?? []) {
    const t = d.lineRef?.trim();
    if (t) s.add(t);
  }
  for (const line of collectMatStringsForLrefExtraction(dossier)) {
    for (const tok of extractLrefTokens(line)) {
      s.add(tok);
    }
  }
  return s;
}

function isConstructionNodePin(a: Workshop2Phase1CategorySketchAnnotation): boolean {
  return (a.linkedAttributeId?.trim() ?? '').length > 0;
}

function processingText(a: Workshop2Phase1CategorySketchAnnotation): string {
  const t = a.text?.trim() ?? '';
  const m = a.linkedMaterialNote?.trim() ?? '';
  if (m.length) return m;
  return t;
}

/**
 * Собрать метки (мастер + листы) с учётом категорийного листа, если задан.
 */
export function listConstructionRelevantAnnotations(
  dossier: Workshop2DossierPhase1,
  activeCategoryLeafId: string | undefined
): Workshop2Phase1CategorySketchAnnotation[] {
  const sheets = normalizeSketchSheets(dossier.sketchSheets);
  const fromMaster = dossier.categorySketchAnnotations ?? [];
  const fromSheets = sheets.flatMap((sh) => sh.annotations ?? []);
  const merged = [...fromMaster, ...fromSheets];
  if (activeCategoryLeafId == null || !activeCategoryLeafId.trim()) {
    return merged;
  }
  const leaf = activeCategoryLeafId.trim();
  return merged.filter((a) => sketchPinBelongsToLeaf(a, leaf));
}

/**
 * Список нарушений (по одному событию на код+метка где уместно).
 */
export function validateBomConstructionNodeIntegrity(
  dossier: Workshop2DossierPhase1,
  activeCategoryLeafId: string | undefined
): W2BomCnodeIssue[] {
  const known = collectKnownBomLineRefsFromDossier(dossier);
  const pins = listConstructionRelevantAnnotations(dossier, activeCategoryLeafId).filter(
    isConstructionNodePin
  );
  if (pins.length === 0) return [];

  const issues: W2BomCnodeIssue[] = [];

  if (known.size === 0) {
    issues.push({
      code: W2_CNODE_BOM.NO_BOM_REF_REGISTRY,
      messageRu: tag(
        W2_CNODE_BOM.NO_BOM_REF_REGISTRY,
        'В досье нет lineRef: добавьте строки в costing, дельту BOM или вставьте LREF-… в материал (mat), затем укажите тот же ref на метке.'
      ),
    });
  }

  for (const a of pins) {
    const idShort = a.annotationId.slice(0, 8);
    const ref = (a.linkedBomLineRef ?? '').trim();
    if (!ref) {
      issues.push({
        code: W2_CNODE_BOM.MISSING_BOM_REF,
        messageRu: tag(
          W2_CNODE_BOM.MISSING_BOM_REF,
          `Метка конструкции (…${idShort}): нет ссылки на строку BOM (lineRef).`
        ),
        annotationId: a.annotationId,
      });
      continue;
    }
    if (known.size > 0 && !known.has(ref)) {
      issues.push({
        code: W2_CNODE_BOM.UNKNOWN_BOM_REF,
        messageRu: tag(
          W2_CNODE_BOM.UNKNOWN_BOM_REF,
          `Метка …${idShort}: lineRef «${ref}» не совпадает с зарегистрированными в досье.`
        ),
        annotationId: a.annotationId,
        linkedBomLineRef: ref,
      });
    }
    if (!processingText(a)) {
      issues.push({
        code: W2_CNODE_BOM.MISSING_PROCESSING,
        messageRu: tag(
          W2_CNODE_BOM.MISSING_PROCESSING,
          `Метка …${idShort}: нет обработки — заполните текст метки или «Материал для цеха».`
        ),
        annotationId: a.annotationId,
      });
    }
  }
  return issues;
}

export function cnodeBomIssueMessagesForSectionGate(issues: W2BomCnodeIssue[]): string[] {
  return issues.map((i) => i.messageRu);
}

/**
 * Каждый lineRef из реестра досье должен быть «покрыт» хотя бы одной конструктивной меткой
 * (`linkedAttributeId` + тот же `linkedBomLineRef`) на скетче (master + листы), с учётом листа каталога.
 */
export function validateRegisteredBomRefsHaveConstructionPin(
  dossier: Workshop2DossierPhase1,
  activeCategoryLeafId: string | undefined
): W2MaterialWithoutNodeIssue[] {
  const known = collectKnownBomLineRefsFromDossier(dossier);
  if (known.size === 0) return [];

  const covered = new Set<string>();
  for (const a of listConstructionRelevantAnnotations(dossier, activeCategoryLeafId)) {
    if (!isConstructionNodePin(a)) continue;
    const r = (a.linkedBomLineRef ?? '').trim();
    if (r) covered.add(r);
  }

  const issues: W2MaterialWithoutNodeIssue[] = [];
  for (const ref of [...known].sort((a, b) => a.localeCompare(b, 'ru', { sensitivity: 'base' }))) {
    if (!covered.has(ref)) {
      issues.push({
        code: W2_MATERIAL_WITHOUT_NODE,
        messageRu: tag(
          W2_MATERIAL_WITHOUT_NODE,
          `lineRef «${ref}» зафиксирован в досье (BOM/mat/costing), но нет конструктивной метки на скетче с этой ссылкой.`
        ),
        lineRef: ref,
      });
    }
  }
  return issues;
}

export function materialWithoutNodeMessagesForGate(issues: W2MaterialWithoutNodeIssue[]): string[] {
  return issues.map((i) => i.messageRu);
}
