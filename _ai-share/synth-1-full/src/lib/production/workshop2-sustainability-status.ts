/**
 * Эко-показатели из BOM досье (тот же блок, что DPP export) — без EU registry.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2DppExportBlock,
  extractWorkshop2DppMaterialsFromDossier,
} from '@/lib/production/workshop2-dpp-export';

export type Workshop2SustainabilityStatus = {
  materialLineCount: number;
  ecoScore: number;
  recycledContentPct: number;
  registryStub: boolean;
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2SustainabilityStatus(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
}): Workshop2SustainabilityStatus {
  const materials = extractWorkshop2DppMaterialsFromDossier(input.dossier);
  const block = buildWorkshop2DppExportBlock({
    dossier: input.dossier,
    collectionId: input.collectionId,
    articleId: input.articleId,
  });

  const registryStub = !block.registryStub?.registryId;

  let state: Workshop2SustainabilityStatus['state'] = 'empty';
  if (materials.length > 0) {
    state = registryStub ? 'partial' : 'ready';
  }

  let hintRu: string | undefined;
  if (state === 'empty') {
    hintRu = 'Нет материалов в BOM — эко-метрики из досье недоступны.';
  } else if (registryStub) {
    hintRu = `Эко из BOM (${materials.length} линий); JSON-LD stub — EU registry не подключён (потолок DPP 8.0).`;
  } else {
    hintRu = `Эко score ${block.metrics.ecoScore}/100 · CO₂ ${block.metrics.carbonFootprint} kg · из BOM досье.`;
  }

  return {
    materialLineCount: materials.length,
    ecoScore: Number(block.metrics.ecoScore) || 0,
    recycledContentPct: Number(block.metrics.recycledContentPct) || 0,
    registryStub,
    state,
    hintRu,
  };
}
