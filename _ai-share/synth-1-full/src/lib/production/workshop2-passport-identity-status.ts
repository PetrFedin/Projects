/**
 * Паспорт: identity, категория, brief — без dev-only merge.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2PassportIdentityStatus = {
  hasCategoryBinding: boolean;
  skuFilled: boolean;
  nameFilled: boolean;
  audienceFilled: boolean;
  missingBriefFieldCount: number;
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

function assignmentHasValue(dossier: Workshop2DossierPhase1, attributeId: string): boolean {
  return (dossier.assignments ?? []).some(
    (a) => a.attributeId === attributeId && (a.values?.length ?? 0) > 0
  );
}

export function summarizeWorkshop2PassportIdentityStatus(input: {
  dossier: Workshop2DossierPhase1;
  articleSkuDraft?: string;
  articleNameDraft?: string;
}): Workshop2PassportIdentityStatus {
  const { dossier } = input;
  const hasCategoryBinding = (dossier.categoryBindings?.length ?? 0) > 0;
  const skuFilled =
    assignmentHasValue(dossier, 'sku') || (input.articleSkuDraft?.trim().length ?? 0) > 0;
  const nameFilled =
    assignmentHasValue(dossier, 'name') || (input.articleNameDraft?.trim().length ?? 0) > 0;
  const audienceFilled =
    Boolean(dossier.selectedAudienceId?.trim()) ||
    assignmentHasValue(dossier, 'audience') ||
    dossier.isUnisex === true;

  const briefChecks = [
    Boolean(dossier.designerIntent?.bullets?.length),
    Boolean(dossier.passportSewingPlanNote?.trim()),
    assignmentHasValue(dossier, 'customsTnvedCodePrimary') ||
      assignmentHasValue(dossier, 'customsTnvedPreliminaryCode'),
  ];
  const missingBriefFieldCount = briefChecks.filter((ok) => !ok).length;

  let state: Workshop2PassportIdentityStatus['state'] = 'empty';
  if (hasCategoryBinding && skuFilled && nameFilled && audienceFilled) {
    state = missingBriefFieldCount === 0 ? 'ready' : 'partial';
  } else if (hasCategoryBinding || skuFilled || nameFilled) {
    state = 'partial';
  }

  let hintRu: string | undefined;
  if (!hasCategoryBinding) {
    hintRu = 'Привязка категории L1–L3 не зафиксирована в досье — выберите лист в паспорте.';
  } else if (!skuFilled || !nameFilled) {
    hintRu = 'Заполните SKU и название в паспорте (или в шапке артикула).';
  } else if (!audienceFilled) {
    hintRu = 'Укажите аудиторию или унисекс в паспорте.';
  } else if (missingBriefFieldCount > 0) {
    hintRu = `Дозаполните brief: замысел, план пошива или ТН ВЭД (${missingBriefFieldCount} из 3).`;
  }

  return {
    hasCategoryBinding,
    skuFilled,
    nameFilled,
    audienceFilled,
    missingBriefFieldCount,
    state,
    hintRu,
  };
}
