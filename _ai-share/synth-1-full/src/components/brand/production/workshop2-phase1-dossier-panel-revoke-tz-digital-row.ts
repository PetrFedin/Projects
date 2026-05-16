import type { Dispatch, SetStateAction } from 'react';
import {
  canRevokeTzSignoff,
  pushTzActionLog,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-action-log';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { W2_TZ_HINT_PRODUCTION_EDIT_SIGN_REVOKE } from '@/lib/production/workshop2-tz-rbac-hints';

type ToastFn = (opts: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => void;

export type RevokeTzDigitalRowDeps = {
  tzWriteDisabled: boolean;
  toast: ToastFn;
  updatedByLabel: string;
  tzRevokersEffective: readonly string[];
  onTzRevokeDenied: () => void;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
};

/** Снятие глобальной цифровой подписи ТЗ (designer / technologist / manager / extra). */
export function revokeTzDigitalRowAction(
  deps: RevokeTzDigitalRowDeps,
  rowKey: string,
  extraRoleTitle?: string
): void {
  const { tzWriteDisabled, toast, updatedByLabel, tzRevokersEffective, onTzRevokeDenied, setDossier } = deps;

  if (tzWriteDisabled) {
    toast({
      title: 'Снятие подписи недоступно',
      description: W2_TZ_HINT_PRODUCTION_EDIT_SIGN_REVOKE,
      variant: 'destructive',
    });
    return;
  }
  if (!canRevokeTzSignoff(updatedByLabel, tzRevokersEffective)) {
    onTzRevokeDenied();
    return;
  }
  if (rowKey === 'designer') {
    setDossier((prev: Workshop2DossierPhase1) =>
      pushTzActionLog(
        { ...prev, isVerifiedByDesigner: false, designerSignoff: undefined },
        updatedByLabel,
        { type: 'tz_global_signoff', role: 'designer', set: false }
      )
    );
    return;
  }
  if (rowKey === 'technologist') {
    setDossier((prev: Workshop2DossierPhase1) =>
      pushTzActionLog(
        { ...prev, isVerifiedByTechnologist: false, technologistSignoff: undefined },
        updatedByLabel,
        { type: 'tz_global_signoff', role: 'technologist', set: false }
      )
    );
    return;
  }
  if (rowKey === 'manager') {
    setDossier((prev: Workshop2DossierPhase1) =>
      pushTzActionLog(
        { ...prev, isVerifiedByManager: false, managerSignoff: undefined },
        updatedByLabel,
        { type: 'tz_global_signoff', role: 'manager', set: false }
      )
    );
    return;
  }
  if (rowKey.startsWith('extra:')) {
    const rowId = rowKey.slice('extra:'.length);
    const rt = extraRoleTitle?.trim() || 'Роль';
    setDossier((prev: Workshop2DossierPhase1) => {
      const cur = { ...(prev.extraTzSignoffsByRowId ?? {}) };
      delete cur[rowId];
      const next = Object.keys(cur).length ? cur : undefined;
      return pushTzActionLog({ ...prev, extraTzSignoffsByRowId: next }, updatedByLabel, {
        type: 'tz_extra_signoff',
        rowId,
        roleTitle: rt,
        set: false,
      });
    });
  }
}
