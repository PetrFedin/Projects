/**
 * Nesting: параметры раскладки обязательны для factory JSON в ZIP ТЗ (wave 18 #63).
 */
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import type {
  Workshop2DossierPhase1,
  Workshop2NestingRequest,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { normalizeWorkshop2NestingRequest } from '@/lib/production/workshop2-nesting-request';

export function evaluateWorkshop2NestingExportGate(input: {
  /** Есть активный заказ образца — nesting ожидается в handoff. */
  hasActiveSampleOrder: boolean;
  nesting?: Workshop2NestingRequest | null;
}): Workshop2HandoffReadinessCheck | null {
  if (!input.hasActiveSampleOrder) return null;
  const nesting = normalizeWorkshop2NestingRequest(input.nesting);
  const width = nesting.fabricWidthCm;
  if (width == null || !Number.isFinite(width) || width <= 0) {
    return {
      id: 'export.nesting.fabric_width',
      severity: 'blocker',
      messageRu:
        'ZIP ТЗ: укажите ширину полотна (см) на вкладке «План → Раскладка» и сохраните на заказе образца.',
    };
  }
  return null;
}

export function copyWorkshop2NestingSnapshotToDossier(
  dossier: Workshop2DossierPhase1,
  nesting: Workshop2NestingRequest
): Workshop2DossierPhase1 {
  const normalized = normalizeWorkshop2NestingRequest(nesting);
  return {
    ...dossier,
    nestingRequestSnapshot: normalized,
    nestingSnapshotPersistedAt: new Date().toISOString(),
  };
}
