/**
 * Wave 20 #53: LCA snapshot в досье + gate export-tz-bundle.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { summarizeWorkshop2SustainabilityStatus } from '@/lib/production/workshop2-sustainability-status';
import { buildWorkshop2DppExportBlock } from '@/lib/production/workshop2-dpp-export';

export function buildWorkshop2SustainabilityLcaSnapshot(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
}): NonNullable<Workshop2DossierPhase1['sustainabilityLcaSnapshot']> {
  const status = summarizeWorkshop2SustainabilityStatus(input);
  const block = buildWorkshop2DppExportBlock(input);
  return {
    snapshotAt: new Date().toISOString(),
    ecoScore: status.ecoScore,
    recycledContentPct: status.recycledContentPct,
    carbonFootprintKg: Number.parseFloat(block.metrics.carbonFootprint) || undefined,
    materialLineCount: status.materialLineCount,
    registryStub: status.registryStub,
    source: 'dossier_bom',
  };
}

export function persistWorkshop2SustainabilityLcaToDossier(
  dossier: Workshop2DossierPhase1,
  input: { collectionId: string; articleId: string }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    sustainabilityLcaSnapshot: buildWorkshop2SustainabilityLcaSnapshot({
      dossier,
      ...input,
    }),
  };
}

/** Warning в ZIP ТЗ если BOM есть, но LCA snapshot не зафиксирован или устарел. */
export function evaluateWorkshop2SustainabilityExportGate(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
}): Workshop2HandoffReadinessCheck | null {
  const status = summarizeWorkshop2SustainabilityStatus(input);
  if (status.state === 'empty') return null;

  const snap = input.dossier.sustainabilityLcaSnapshot;
  if (!snap) {
    return {
      id: 'sustainability.lca.snapshot_missing',
      severity: 'warning',
      messageRu:
        'Эко/LCA не зафикированы в досье — сохраните LCA snapshot на вкладке «Снабжение» перед export ZIP.',
    };
  }
  const ageMs = Date.now() - new Date(snap.snapshotAt).getTime();
  if (ageMs > 14 * 24 * 60 * 60 * 1000) {
    return {
      id: 'sustainability.lca.snapshot_stale',
      severity: 'warning',
      messageRu: 'LCA snapshot в досье устарел (>14 дн.) — обновите перед export ZIP.',
    };
  }
  if (status.registryStub && snap.materialLineCount > 0) {
    return {
      id: 'sustainability.registry.stub',
      severity: 'warning',
      messageRu:
        'EU registry stub — LCA из BOM локальные; внешний реестр не подключён (потолок DPP).',
    };
  }
  return null;
}
