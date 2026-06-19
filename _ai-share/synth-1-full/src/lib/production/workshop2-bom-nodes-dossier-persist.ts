/**
 * Wave 23 #36: зеркало BOM по узлам + gate sample-order.
 */
import { summarizeWorkshop2BomNodesStatus } from '@/lib/production/workshop2-bom-nodes-status';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export function buildWorkshop2BomNodesMirror(
  dossier: Workshop2DossierPhase1
): NonNullable<Workshop2DossierPhase1['bomNodesMirror']> {
  const status = summarizeWorkshop2BomNodesStatus(dossier);
  const blockerSampleOrder = status.state === 'empty' || status.state === 'partial';

  return {
    mirroredAt: new Date().toISOString(),
    nodeCount: status.nodeCount,
    materialLineCount: status.materialLineCount,
    bomMatSyncAt: dossier.bomMatSyncAt,
    state: status.state,
    estimatedFob: status.estimatedFob,
    blockerSampleOrder,
    hintRu: status.hintRu,
  };
}

export function persistWorkshop2BomNodesMirrorToDossier(
  dossier: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    bomNodesMirror: buildWorkshop2BomNodesMirror(dossier),
  };
}

export function evaluateWorkshop2BomNodesSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.bomNodesMirror;
  if (!mirror) {
    return {
      id: 'bom.nodes.mirror_missing',
      severity: 'warning',
      messageRu: 'BOM snapshot не в досье — «BOM → PG» на материалах.',
    };
  }
  if (mirror.blockerSampleOrder === true) {
    return {
      id: 'bom.nodes.incomplete',
      severity: 'blocker',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        'BOM не готов (пустой или частичный) — заказ образца заблокирован до синхронизации из mat.',
    };
  }
  return null;
}
