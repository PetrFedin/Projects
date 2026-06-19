import { workshopTzAssigneeOrganizationName } from '@/lib/production/workshop2-tz-signatory-options';
import type { Workshop2TzSignatoryBindings } from '@/lib/production/workshop2-dossier-phase1.types';

export type SectionSignoffPassportPreviews = {
  brandPassportName: string;
  brandPassportOrg: string;
  brandPassportMissing: boolean;
  techPassportName: string;
  techPassportOrg: string;
  techPassportMissing: boolean;
};

/** ФИО и компания из паспорта для строк «Подтверждение секции». */
export function buildSectionSignoffPassportPreviews(
  tzSignatoryBindings: Workshop2TzSignatoryBindings | undefined,
  sectionSignoffOrganizationLabel: string
): SectionSignoffPassportPreviews {
  const b = tzSignatoryBindings;
  const brandName = b?.designerDisplayLabel?.trim() ?? '';
  const techName = b?.technologistDisplayLabel?.trim() ?? '';
  const cabinetOrg = sectionSignoffOrganizationLabel.trim();
  const orgFor = (name: string) =>
    (workshopTzAssigneeOrganizationName(name) ?? '').trim() || cabinetOrg;
  return {
    brandPassportName: brandName,
    brandPassportOrg: brandName ? orgFor(brandName) : '',
    brandPassportMissing: !brandName,
    techPassportName: techName,
    techPassportOrg: techName ? orgFor(techName) : '',
    techPassportMissing: !techName,
  };
}
