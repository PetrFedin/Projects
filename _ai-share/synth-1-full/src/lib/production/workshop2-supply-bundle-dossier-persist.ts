/**
 * Wave 26 #46: зеркало supply bundle + gate sample-order.
 */
import type { SupplySnapshot } from '@/lib/production/article-workspace/types';
import { summarizeWorkshop2SupplyBundleStatus } from '@/lib/production/workshop2-supply-bundle-status';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export function buildWorkshop2SupplyBundleMirror(input: {
  dossier: Workshop2DossierPhase1;
  supply?: SupplySnapshot | null;
  plannedPoQty?: number;
  supplyBomSyncAt?: string | null;
}): NonNullable<Workshop2DossierPhase1['supplyBundleMirror']> {
  const status = summarizeWorkshop2SupplyBundleStatus({
    supply: input.supply,
    dossier: input.dossier,
    plannedPoQty: input.plannedPoQty,
  });
  const blockerSampleOrder =
    status.state === 'empty' ||
    status.unlinkedLineCount > 0 ||
    (status.lineCount > 0 && status.linesWithQty < status.lineCount);

  const supplyBomSyncAt =
    input.supplyBomSyncAt?.trim() ||
    workshop2PgMirrorStr(input.dossier.supplyBundleMirror, 'supplyBomSyncAt') ||
    undefined;

  return {
    mirroredAt: new Date().toISOString(),
    ...(supplyBomSyncAt ? { supplyBomSyncAt } : {}),
    lineCount: status.lineCount,
    linesWithQty: status.linesWithQty,
    unlinkedLineCount: status.unlinkedLineCount,
    plannedPoQty: status.plannedPoQty,
    bomMaterialLineCount: status.bomMaterialLineCount,
    state: status.state,
    blockerSampleOrder,
    hintRu: status.hintRu,
  };
}

export function persistWorkshop2SupplyBundleMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  input: {
    supply?: SupplySnapshot | null;
    plannedPoQty?: number;
    supplyBomSyncAt?: string | null;
  }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    supplyBundleMirror: buildWorkshop2SupplyBundleMirror({ dossier, ...input }),
  };
}

export function evaluateWorkshop2SupplyBundleSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.supplyBundleMirror;
  if (!mirror) {
    return {
      id: 'supply.bundle.mirror_missing',
      severity: 'warning',
      messageRu: 'Снабжение не в PG — «Supply → PG» на вкладке Снабжение.',
    };
  }
  if (mirror.blockerSampleOrder) {
    if (mirror.state === 'empty') {
      return {
        id: 'supply.bundle.empty',
        severity: 'blocker',
        messageRu:
          mirror.hintRu ?? 'Нет строк снабжения — синхронизируйте BOM перед заказом образца.',
      };
    }
    if (mirror.unlinkedLineCount > 0) {
      return {
        id: 'supply.bundle.unlinked',
        severity: 'blocker',
        messageRu:
          mirror.hintRu ??
          `${mirror.unlinkedLineCount} строк не сопоставлены с BOM — исправьте перед образцом.`,
      };
    }
    return {
      id: 'supply.bundle.partial_qty',
      severity: 'blocker',
      messageRu:
        mirror.hintRu ?? 'Не все строки снабжения имеют qty — заполните перед заказом образца.',
    };
  }
  if (mirror.plannedPoQty <= 0 && mirror.lineCount > 0) {
    return {
      id: 'supply.bundle.no_po_qty',
      severity: 'warning',
      messageRu:
        mirror.hintRu ?? 'Снабжение готово — задайте объём PO на плане заказа для закупки.',
    };
  }
  return null;
}
