/**
 * Wave 24 #45: зеркало handoff bundles + gate handoff-commit.
 */
import { summarizeWorkshop2FactoryHandoffBundleStatus } from '@/lib/production/workshop2-factory-handoff-bundle-status';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function buildWorkshop2FactoryHandoffBundleMirror(
  dossier: Workshop2DossierPhase1
): NonNullable<Workshop2DossierPhase1['factoryHandoffBundleMirror']> {
  const status = summarizeWorkshop2FactoryHandoffBundleStatus(dossier);
  const state = status?.state ?? 'none';
  const blockerHandoffCommit = state === 'none' || state === 'draft';

  return {
    mirroredAt: new Date().toISOString(),
    totalHandoffs: status?.totalHandoffs ?? 0,
    completedHandoffs: status?.completedHandoffs ?? 0,
    pendingAckCount: status?.pendingAckCount ?? 0,
    bundleState: state,
    blockerHandoffCommit,
    hintRu: status?.hintRu,
  };
}

export function persistWorkshop2FactoryHandoffBundleMirrorToDossier(
  dossier: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    factoryHandoffBundleMirror: buildWorkshop2FactoryHandoffBundleMirror(dossier),
  };
}

export function evaluateWorkshop2FactoryHandoffBundleCommitGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.factoryHandoffBundleMirror;
  if (!mirror) {
    const live = summarizeWorkshop2FactoryHandoffBundleStatus(dossier);
    if (live && (live.state === 'none' || live.state === 'draft')) {
      return {
        id: 'handoff.bundle.not_dispatched',
        severity: 'blocker',
        messageRu: live.hintRu ?? 'Пакет в цех не отправлен — завершите handoff checklist.',
      };
    }
    return {
      id: 'handoff.bundle.mirror_missing',
      severity: 'warning',
      messageRu: 'Handoff bundle snapshot не в PG — «Handoff → PG» на задании.',
    };
  }
  if (mirror.blockerHandoffCommit) {
    return {
      id: 'handoff.bundle.not_dispatched',
      severity: 'blocker',
      messageRu: mirror.hintRu ?? 'Пакет handoff не подтверждён цехом — commit заблокирован.',
    };
  }
  if (mirror.pendingAckCount > 0) {
    return {
      id: 'handoff.bundle.pending_ack',
      severity: 'warning',
      messageRu:
        mirror.hintRu ?? `${mirror.pendingAckCount} передач без ACK фабрики — проверьте статус.`,
    };
  }
  return null;
}
