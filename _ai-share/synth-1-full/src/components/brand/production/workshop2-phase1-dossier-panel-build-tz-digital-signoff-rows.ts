import type {
  Workshop2DossierPhase1,
  Workshop2DossierSignoffMeta,
  Workshop2TzPerRoleStageFlags,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2TzDigitalSignoffCapabilities } from '@/lib/production/workshop2-tz-digital-signoff';
import {
  workshopTzAssigneeOrganizationName,
  workshopTzExtraRowsRequiringTzSignoff,
  workshopTzParticipatesOnStage,
  workshopTzSignerAllowed,
} from '@/lib/production/workshop2-tz-signatory-options';

export type Workshop2TzDigitalSignoffRowModel = {
  rowKey: string;
  title: string;
  passportAssigneeName?: string;
  passportAssigneeOrgLabel?: string;
  assigneeForNotify?: string;
  canSign: boolean;
  hasRoleCapability: boolean;
  signatoryMismatchHint?: string;
  signoff?: Workshop2DossierSignoffMeta;
};

type DossierTzSignSlice = Pick<
  Workshop2DossierPhase1,
  | 'tzSignatoryBindings'
  | 'designerSignoff'
  | 'technologistSignoff'
  | 'managerSignoff'
  | 'extraTzSignoffsByRowId'
>;

/** Строки блока цифровых подписей ТЗ (базовые роли + extra из паспорта). */
export function buildWorkshop2TzDigitalSignoffRows(
  dossier: DossierTzSignSlice,
  tzSignCaps: Workshop2TzDigitalSignoffCapabilities,
  updatedByLabel: string,
  sectionSignoffOrganizationLabel: string
): Workshop2TzDigitalSignoffRowModel[] {
  const b = dossier.tzSignatoryBindings;
  const rows: Workshop2TzDigitalSignoffRowModel[] = [];
  const orgTrim = sectionSignoffOrganizationLabel.trim();

  const pushBase = (
    role: 'designer' | 'technologist' | 'manager',
    title: string,
    cap: boolean,
    designated: string | undefined,
    flags: Workshop2TzPerRoleStageFlags | undefined,
    signoff: Workshop2DossierSignoffMeta | undefined
  ) => {
    if (!workshopTzParticipatesOnStage(flags, 'tz')) return;
    const d = designated?.trim();
    const hasAssignee = Boolean(d);
    const canSign = cap && hasAssignee && workshopTzSignerAllowed(updatedByLabel, d);
    const mismatch =
      cap && !hasAssignee ? 'Назначьте исполнителя в паспорте (кнопка «Подписанты»).' : undefined;
    rows.push({
      rowKey: role,
      title,
      passportAssigneeName: d || undefined,
      passportAssigneeOrgLabel: d
        ? workshopTzAssigneeOrganizationName(d) || orgTrim || undefined
        : undefined,
      assigneeForNotify: d,
      canSign,
      hasRoleCapability: cap,
      signatoryMismatchHint: mismatch,
      signoff,
    });
  };

  pushBase(
    'designer',
    'Дизайн',
    tzSignCaps.designer,
    b?.designerDisplayLabel,
    b?.designerSignStages,
    dossier.designerSignoff
  );
  pushBase(
    'technologist',
    'Технолог',
    tzSignCaps.technologist,
    b?.technologistDisplayLabel,
    b?.technologistSignStages,
    dossier.technologistSignoff
  );
  pushBase(
    'manager',
    'Менеджер',
    tzSignCaps.manager,
    b?.managerDisplayLabel,
    b?.managerSignStages,
    dossier.managerSignoff
  );

  for (const ex of workshopTzExtraRowsRequiringTzSignoff(b)) {
    const name = ex.assigneeDisplayLabel?.trim() ?? '';
    const hasAssignee = Boolean(name);
    const canSign = hasAssignee && workshopTzSignerAllowed(updatedByLabel, name);
    const mismatch = !hasAssignee ? 'Назначьте исполнителя в паспорте (кнопка «Подписанты»).' : undefined;
    rows.push({
      rowKey: `extra:${ex.rowId}`,
      title: ex.roleTitle?.trim() || 'Роль',
      passportAssigneeName: name || undefined,
      passportAssigneeOrgLabel: name
        ? workshopTzAssigneeOrganizationName(name) || orgTrim || undefined
        : undefined,
      assigneeForNotify: name || undefined,
      canSign,
      hasRoleCapability: true,
      signatoryMismatchHint: mismatch,
      signoff: dossier.extraTzSignoffsByRowId?.[ex.rowId],
    });
  }

  return rows;
}
