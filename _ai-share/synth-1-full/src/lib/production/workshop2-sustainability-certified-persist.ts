/**
 * Wave 37 #53: certified fields persist + export warning only (не live registry).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  buildWorkshop2SustainabilityLcaSnapshot,
  evaluateWorkshop2SustainabilityExportGate,
} from '@/lib/production/workshop2-sustainability-lca-persist';

export type Workshop2SustainabilityCertifiedFields = {
  certifiedSource?: 'none' | 'dossier_bom' | 'external_pending';
  certificationBody?: string;
  certificationRef?: string;
  certifiedAt?: string;
};

export function extractWorkshop2SustainabilityCertifiedFromDossier(
  dossier: Workshop2DossierPhase1
): Workshop2SustainabilityCertifiedFields {
  const eco = dossier.productionModel?.ecoAttributes as Record<string, unknown> | undefined;
  const body =
    typeof eco?.certificationBody === 'string' ? eco.certificationBody.trim() : undefined;
  const ref = typeof eco?.certificationRef === 'string' ? eco.certificationRef.trim() : undefined;
  const at = typeof eco?.certifiedAt === 'string' ? eco.certifiedAt : undefined;
  const hasCert = Boolean(body || ref);
  return {
    certifiedSource: hasCert ? 'dossier_bom' : 'none',
    certificationBody: body,
    certificationRef: ref,
    certifiedAt: at ?? (hasCert ? new Date().toISOString() : undefined),
  };
}

export function persistWorkshop2SustainabilityCertifiedToDossier(
  dossier: Workshop2DossierPhase1,
  input: { collectionId: string; articleId: string }
): Workshop2DossierPhase1 {
  const certified = extractWorkshop2SustainabilityCertifiedFromDossier(dossier);
  const base = buildWorkshop2SustainabilityLcaSnapshot({ dossier, ...input });
  return {
    ...dossier,
    sustainabilityLcaSnapshot: {
      ...base,
      certifiedSource: certified.certifiedSource,
      certificationBody: certified.certificationBody,
      certificationRef: certified.certificationRef,
      certifiedAt: certified.certifiedAt,
    },
  };
}

export function evaluateWorkshop2SustainabilityCertifiedExportGate(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
}): Workshop2HandoffReadinessCheck | null {
  const lca = evaluateWorkshop2SustainabilityExportGate(input);
  if (lca) return lca;
  const snap = input.dossier.sustainabilityLcaSnapshot;
  const certified = extractWorkshop2SustainabilityCertifiedFromDossier(input.dossier);
  if (snap && certified.certifiedSource === 'none' && (snap.materialLineCount ?? 0) > 0) {
    return {
      id: 'sustainability.certified.missing',
      severity: 'warning',
      messageRu:
        'LCA из BOM без certified fields — укажите certificationBody/ref в eco или сохраните LCA snapshot (export warning only).',
    };
  }
  if (snap?.registryStub) {
    return {
      id: 'sustainability.certified.registry_stub',
      severity: 'warning',
      messageRu:
        'EU sustainability registry не подключён — certified поля только в досье (потолок 8.8).',
    };
  }
  return null;
}
