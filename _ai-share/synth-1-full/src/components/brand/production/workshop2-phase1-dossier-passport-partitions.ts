import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import {
  partitionGeneralPassportExtras,
  partitionGeneralPassportRows,
  PASSPORT_MOVED_TO_SEWING_PLAN_ATTR_IDS,
} from '@/lib/production/workshop2-passport-check';
import { getWorkshopTzSectionForAttribute } from '@/lib/production/workshop2-tz-section-readiness';
import { PASSPORT_COLOR_BUNDLE_IDS } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';

export type Workshop2Phase1DossierPassportExtraRow = {
  attribute: AttributeCatalogAttribute;
  groupLabel: string;
};

export type BuildWorkshop2Phase1DossierPassportPartitionsInput = {
  phaseRowsCurrent: readonly ResolvedPhase1AttributeRow[];
  extraRows: readonly Workshop2Phase1DossierPassportExtraRow[];
  isPhase1: boolean;
};

export type Workshop2Phase1DossierPassportPartitions = {
  generalRowsForPassport: ResolvedPhase1AttributeRow[];
  generalPassportExtraRows: Workshop2Phase1DossierPassportExtraRow[];
  generalPassportStartRows: ResolvedPhase1AttributeRow[];
  generalPassportPreSampleRows: ResolvedPhase1AttributeRow[];
  generalPassportStartExtras: Workshop2Phase1DossierPassportExtraRow[];
  generalPassportPreSampleExtras: Workshop2Phase1DossierPassportExtraRow[];
  passportArticleCardStartRows: ResolvedPhase1AttributeRow[];
  passportSewingPlanStartRows: ResolvedPhase1AttributeRow[];
  passportArticleCardStartExtras: Workshop2Phase1DossierPassportExtraRow[];
  passportSewingPlanStartExtras: Workshop2Phase1DossierPassportExtraRow[];
  showPhase1PassportArticleCard: boolean;
};

function isGeneralPassportRow(attributeId: string, groupId?: string): boolean {
  return (
    getWorkshopTzSectionForAttribute(attributeId, groupId) === 'general' &&
    !PASSPORT_COLOR_BUNDLE_IDS.has(attributeId)
  );
}

/** Passport row partitions for general section (sectionBodies). */
export function buildWorkshop2Phase1DossierPassportPartitions({
  phaseRowsCurrent,
  extraRows,
  isPhase1,
}: BuildWorkshop2Phase1DossierPassportPartitionsInput): Workshop2Phase1DossierPassportPartitions {
  const generalRowsForPassport = phaseRowsCurrent.filter((row) =>
    isGeneralPassportRow(row.attribute.attributeId, row.group?.groupId)
  );
  const generalPassportExtraRows = isPhase1
    ? extraRows.filter(({ attribute }) =>
        isGeneralPassportRow(attribute.attributeId, attribute.groupId)
      )
    : [];
  const { startRows: generalPassportStartRows, preSampleRows: generalPassportPreSampleRows } =
    partitionGeneralPassportRows(generalRowsForPassport);
  const {
    startExtras: generalPassportStartExtras,
    preSampleExtras: generalPassportPreSampleExtras,
  } = partitionGeneralPassportExtras(generalPassportExtraRows);
  const passportArticleCardStartRows = generalPassportStartRows.filter(
    (r) => !PASSPORT_MOVED_TO_SEWING_PLAN_ATTR_IDS.has(r.attribute.attributeId)
  );
  const passportSewingPlanStartRows = generalPassportStartRows.filter((r) =>
    PASSPORT_MOVED_TO_SEWING_PLAN_ATTR_IDS.has(r.attribute.attributeId)
  );
  const passportArticleCardStartExtras = generalPassportStartExtras.filter(
    (e) => !PASSPORT_MOVED_TO_SEWING_PLAN_ATTR_IDS.has(e.attribute.attributeId)
  );
  const passportSewingPlanStartExtras = generalPassportStartExtras.filter((e) =>
    PASSPORT_MOVED_TO_SEWING_PLAN_ATTR_IDS.has(e.attribute.attributeId)
  );
  const showPhase1PassportArticleCard =
    passportArticleCardStartRows.length +
      passportArticleCardStartExtras.length +
      generalPassportPreSampleRows.length +
      generalPassportPreSampleExtras.length >
    0;
  return {
    generalRowsForPassport,
    generalPassportExtraRows,
    generalPassportStartRows,
    generalPassportPreSampleRows,
    generalPassportStartExtras,
    generalPassportPreSampleExtras,
    passportArticleCardStartRows,
    passportSewingPlanStartRows,
    passportArticleCardStartExtras,
    passportSewingPlanStartExtras,
    showPhase1PassportArticleCard,
  };
}
