/**
 * Wave 39: после изменения BOM — явный prompt на re-sync supply + WMS (не silent drift).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export type Workshop2BomResyncPrompt = {
  shouldPrompt: boolean;
  titleRu: string;
  descriptionRu: string;
  supplyPaneHint: string;
};

export function evaluateWorkshop2BomResyncPrompt(
  dossier: Workshop2DossierPhase1,
  input?: { supplyBomSyncAt?: string | null }
): Workshop2BomResyncPrompt {
  const supplySyncedAt =
    input?.supplyBomSyncAt?.trim() ||
    workshop2PgMirrorStr(dossier.supplyBundleMirror, 'supplyBomSyncAt') ||
    workshop2PgMirrorStr(dossier.supplyBundleMirror, 'mirroredAt') ||
    dossier.bomMatSyncAt?.trim();
  const bomTouchedAt =
    dossier.updatedAt?.trim() ||
    workshop2PgMirrorStr(dossier.bomNodesMirror, 'mirroredAt') ||
    dossier.bomMatSyncAt?.trim();
  const hasSupplyOrWms = Boolean(
    supplySyncedAt || dossier.internalWmsMirror || dossier.stockWmsLedger?.mirroredAt
  );
  if (!hasSupplyOrWms || !bomTouchedAt) {
    return {
      shouldPrompt: false,
      titleRu: '',
      descriptionRu: '',
      supplyPaneHint: '',
    };
  }
  const supplyStale =
    supplySyncedAt && bomTouchedAt
      ? new Date(bomTouchedAt).getTime() > new Date(supplySyncedAt).getTime()
      : Boolean(dossier.internalWmsMirror || dossier.stockWmsLedger);
  if (!supplyStale) {
    return {
      shouldPrompt: false,
      titleRu: '',
      descriptionRu: '',
      supplyPaneHint: '',
    };
  }
  return {
    shouldPrompt: true,
    titleRu: 'BOM изменён',
    descriptionRu:
      'Строки BOM обновлены после последней синхронизации снабжения/WMS. На вкладке «Снабжение» выполните «Синхр. из BOM» (цепочка обновит WMS).',
    supplyPaneHint: 'w2pane=supply',
  };
}
