/**
 * Единая подсказка по листу: профиль производства + оси подборки + чеклист вложений.
 */
import { getInfoPickAttributeGroupsForLeaf } from '@/lib/project-info/info-pick-attribute-keys';
import type { HandbookCategoryLeaf } from './category-handbook-snapshot-builder';
import {
  formatComplianceSummary,
  formatStockUnitRu,
  getResolvedLeafProductionProfile,
} from './category-leaf-production';
import { resolveHandbookLeafId } from './category-handbook-leaves';
import type { ProductionDocumentKind } from './category-leaf-production-types';

export function productionDocumentKindLabelRu(kind: ProductionDocumentKind): string {
  const m: Record<ProductionDocumentKind, string> = {
    tech_pack_pdf: 'Техпак (PDF, лекала/спецификация)',
    specification_materials: 'Спецификация материалов / фурнитуры',
    grading_sheet: 'Градация размеров',
    marker_nesting: 'Раскладка / маркер',
    lab_test_report: 'Протоколы испытаний (лаборатория)',
    conformity_declaration_copy: 'Копия декларации / сертификата соответствия',
    raw_material_acceptance_act: 'Акт приёмки сырья',
  };
  return m[kind] ?? kind;
}

export type LeafHandbookAttachmentItem = {
  id: ProductionDocumentKind;
  label: string;
};

export type LeafHandbookGuidance = {
  /** Канонический leafId для сохранения в строке коллекции. */
  canonicalLeafId: string;
  profile: ReturnType<typeof getResolvedLeafProductionProfile>;
  requiredAxisLabels: string[];
  commonAxisLabels: string[];
  attachmentChecklist: LeafHandbookAttachmentItem[];
};

export function getLeafHandbookGuidance(leaf: HandbookCategoryLeaf): LeafHandbookGuidance {
  const profile = getResolvedLeafProductionProfile(leaf);
  const { requiredLabels, commonLabels } = getInfoPickAttributeGroupsForLeaf(leaf);
  const attachmentChecklist = profile.requiredDocuments.map((id) => ({
    id,
    label: productionDocumentKindLabelRu(id),
  }));
  return {
    canonicalLeafId: resolveHandbookLeafId(leaf.leafId),
    profile,
    requiredAxisLabels: requiredLabels,
    commonAxisLabels: commonLabels,
    attachmentChecklist,
  };
}

export function formatMarketplaceHintLine(
  ref: import('./category-leaf-production-types').MarketplaceCategoryRef
): string {
  const parts = [ref.channelId];
  if (ref.subjectId) parts.push(`subject ${ref.subjectId}`);
  if (ref.categoryPathHint) parts.push(ref.categoryPathHint);
  if (ref.subjectId && ref.subjectIdVerified !== true) {
    parts.push('(subject уточнить в ЛК)');
  }
  return parts.join(' · ');
}

export function formatTnvedHints(profile: LeafHandbookGuidance['profile']): string {
  const e = profile.externalClassifiers;
  const bits: string[] = [];
  if (e.tnvedEaEuChapterHint) bits.push(`глава ${e.tnvedEaEuChapterHint}`);
  if (e.tnvedEaEuCodeHints?.length) bits.push(`коды: ${e.tnvedEaEuCodeHints.join(', ')}`);
  if (e.okpd2Hints?.length) bits.push(`ОКПД2: ${e.okpd2Hints.join(', ')}`);
  return bits.length ? bits.join(' · ') : '—';
}
