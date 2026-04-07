/**
 * Единые правила предупреждений для раздела «Визуал / эскиз» (панель ТЗ + readiness).
 */
import { resolveAttributeIdsForLeaf } from '@/lib/production/attribute-catalog';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type {
  Workshop2DossierPhase1,
  Workshop2Phase1VisualReference,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { visualReadinessProgress } from '@/lib/production/workshop2-visual-excellence';
import { workshop2SketchTechnologistGaps } from '@/lib/production/workshop2-sketch-technologist-gaps';
import { W2_VISUALS_SKETCH_ANCHOR_ID } from '@/lib/production/workshop2-material-bom-sketch-strip';

/** Якоря подстраницы «Визуал» (совпадают с кнопками в панели ТЗ). */
export const W2_VISUAL_SUBPAGE_ANCHORS = {
  hub: 'w2-visuals-hub',
  attributes: 'w2-visuals-attributes',
  refs: 'w2-visuals-refs',
  /** Скетч отрисовывается в конструкции; якорь — хаб ТЗ. */
  sketch: W2_VISUALS_SKETCH_ANCHOR_ID,
  checklist: 'w2-visuals-checklist',
  canonVersion: 'w2-visuals-canon-version',
  handoff: 'w2-visuals-handoff',
  sketchTemplates: 'w2-visuals-sketch-templates',
  sketchExportSurfaces: 'w2-visuals-sketch-export-surfaces',
  sketchLinkFields: 'w2-visuals-sketch-link-fields',
} as const;

export type Workshop2VisualGateItem = {
  id: string;
  message: string;
  anchorId: string;
  /** Подпись кнопки «перейти» */
  jumpLabel: string;
};

function phase1AttributeIdSet(leaf: HandbookCategoryLeaf | null | undefined): Set<string> {
  const id = leaf?.leafId?.trim();
  if (!id) return new Set();
  return new Set(resolveAttributeIdsForLeaf(id, 1));
}

function hasAssignment(dossier: Workshop2DossierPhase1, attributeId: string): boolean {
  return dossier.assignments.some((a) => a.attributeId === attributeId && (a.values?.length ?? 0) > 0);
}

/** Пункты гейта с привязкой к якорям — один источник правды для предупреждений и UI. */
export function buildWorkshop2VisualGateItems(
  dossier: Workshop2DossierPhase1,
  leaf: HandbookCategoryLeaf | null | undefined
): Workshop2VisualGateItem[] {
  const items: Workshop2VisualGateItem[] = [];
  const phase1Ids = phase1AttributeIdSet(leaf);
  if (phase1Ids.has('color') && !hasAssignment(dossier, 'color')) {
    items.push({
      id: 'gate-color',
      message: 'Цвет модели не заполнен — см. «Поля каталога» в этом разделе.',
      anchorId: W2_VISUAL_SUBPAGE_ANCHORS.attributes,
      jumpLabel: 'Поля каталога',
    });
  }
  if (phase1Ids.has('sil') && !hasAssignment(dossier, 'sil')) {
    items.push({
      id: 'gate-sil',
      message: 'Силуэт не зафиксирован в каталоге — см. «Поля каталога».',
      anchorId: W2_VISUAL_SUBPAGE_ANCHORS.attributes,
      jumpLabel: 'Поля каталога',
    });
  }
  if (!dossier.categorySketchImageDataUrl && !(dossier.categorySketchAnnotations?.length ?? 0)) {
    items.push({
      id: 'gate-sketch',
      message: 'Нет master sketch или меток на силуэте.',
      anchorId: W2_VISUAL_SUBPAGE_ANCHORS.sketch,
      jumpLabel: 'Скетчи',
    });
  }
  if (!(dossier.visualReferences?.length ?? 0)) {
    items.push({
      id: 'gate-refs',
      message: 'Нет визуальных референсов.',
      anchorId: W2_VISUAL_SUBPAGE_ANCHORS.refs,
      jumpLabel: 'Референсы',
    });
  }
  const hasStructuredIntent =
    Boolean(dossier.designerIntent?.mood?.trim()) ||
    Boolean(dossier.designerIntent?.bullets?.some((b) => b.trim()));
  if (!hasStructuredIntent && !dossier.brandNotes?.trim()) {
    items.push({
      id: 'gate-intent',
      message: 'Заполните замысел (блок выше) или текст в brandNotes.',
      anchorId: W2_VISUAL_SUBPAGE_ANCHORS.hub,
      jumpLabel: 'Согласование',
    });
  }

  const tech = workshop2SketchTechnologistGaps(dossier, leaf?.leafId);
  if (tech.pinsWithoutAttrOrBom > 0) {
    items.push({
      id: 'gate-tech-pins',
      message: `${tech.pinsWithoutAttrOrBom} мет. без привязки к атрибуту каталога или BOM — усильте исполнимость для технолога.`,
      anchorId: W2_VISUAL_SUBPAGE_ANCHORS.sketch,
      jumpLabel: 'Скетчи',
    });
  }
  if (tech.criticalPinsWithoutDue > 0) {
    items.push({
      id: 'gate-tech-due',
      message: `${tech.criticalPinsWithoutDue} критичных меток без срока — задайте дату или снимите приоритет.`,
      anchorId: W2_VISUAL_SUBPAGE_ANCHORS.sketch,
      jumpLabel: 'Скетчи',
    });
  }

  const vr = visualReadinessProgress(dossier);
  if (vr.total > 0 && vr.done < vr.total) {
    items.push({
      id: 'gate-vr-checklist',
      message: `Чеклист готовности визуала (менеджер): закрыто ${vr.done} из ${vr.total} — дозаполните или снимите блокеры.`,
      anchorId: W2_VISUAL_SUBPAGE_ANCHORS.checklist,
      jumpLabel: 'Чеклист',
    });
  }

  return items;
}

/** Тексты для полосы раздела и readiness (без якорей). */
export function collectWorkshop2VisualSectionWarnings(
  dossier: Workshop2DossierPhase1,
  leaf: HandbookCategoryLeaf | null | undefined
): string[] {
  return buildWorkshop2VisualGateItems(dossier, leaf).map((x) => x.message);
}

/** Для обзора артикула: относится ли строка из общего списка warnings к гейту визуала. */
const VISUAL_GATE_WARNING_FRAGMENTS = [
  'визуального',
  'эскиз',
  'референс',
  'Цвет модели',
  'Силуэт не зафиксирован',
  'master sketch',
  'силуэте',
  'замысел',
  'brandNotes',
] as const;

export function workshop2DossierWarningLooksVisual(warning: string): boolean {
  return VISUAL_GATE_WARNING_FRAGMENTS.some((frag) => warning.includes(frag));
}

/** Рефы, у которых есть комментарии и хотя бы один не помечен resolved. */
export function countOpenVisualRefThreads(refs: Workshop2Phase1VisualReference[] | undefined): number {
  let n = 0;
  for (const r of refs ?? []) {
    const cs = r.comments ?? [];
    if (cs.length === 0) continue;
    if (cs.some((c) => !c.resolved)) n++;
  }
  return n;
}
