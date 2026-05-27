/**
 * Wave 41 #53: BOM carbon rollup (heuristic, labeled) + threshold warnings.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { buildWorkshop2DppExportBlock } from '@/lib/production/workshop2-dpp-export';
import { buildWorkshop2SustainabilityLcaSnapshot } from '@/lib/production/workshop2-sustainability-lca-persist';

export type Workshop2SustainabilityCarbonRollup = {
  computedAt: string;
  engine: 'heuristic_bom_v1';
  carbonFootprintKg: number;
  recycledContentPct: number;
  ecoScore: number;
  materialLineCount: number;
  thresholdWarnings: string[];
  warnings: string[];
  hintRu: string;
};

const CARBON_WARN_KG = 12;
const RECYCLED_MIN_PCT = 10;

export function evaluateWorkshop2SustainabilityCarbonRollup(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
}): Workshop2SustainabilityCarbonRollup {
  const block = buildWorkshop2DppExportBlock(input);
  const carbon = Number.parseFloat(block.metrics.carbonFootprint) || 0;
  const recycled = block.metrics.recycledContentPct ?? 0;
  const eco = block.metrics.ecoScore ?? 0;
  const lines = input.dossier.productionModel?.materialLines?.length ?? 0;
  const thresholdWarnings: string[] = [];
  const warnings: string[] = [];

  if (lines === 0) {
    warnings.push('BOM пуст — rollup эвристика без материалов.');
  }
  if (carbon > CARBON_WARN_KG) {
    thresholdWarnings.push(
      `Углеродный след ${carbon.toFixed(2)} кг CO₂e выше порога ${CARBON_WARN_KG} кг (heuristic).`
    );
  }
  if (recycled < RECYCLED_MIN_PCT && lines > 0) {
    thresholdWarnings.push(
      `Доля переработки ${recycled}% ниже порога ${RECYCLED_MIN_PCT}% (heuristic).`
    );
  }

  return {
    computedAt: new Date().toISOString(),
    engine: 'heuristic_bom_v1',
    carbonFootprintKg: carbon,
    recycledContentPct: recycled,
    ecoScore: eco,
    materialLineCount: lines,
    thresholdWarnings,
    warnings,
    hintRu:
      thresholdWarnings.length === 0
        ? `Heuristic BOM rollup: ${carbon.toFixed(2)} кг CO₂e, eco ${eco}/100 — зафиксируйте в PG.`
        : `Heuristic rollup: ${thresholdWarnings.length} threshold warning(s) — проверьте BOM.`,
  };
}

export function persistWorkshop2SustainabilityCarbonRollupToDossier(
  dossier: Workshop2DossierPhase1,
  input: { collectionId: string; articleId: string }
): Workshop2DossierPhase1 {
  const rollup = evaluateWorkshop2SustainabilityCarbonRollup({
    dossier,
    ...input,
  });
  const withLca = buildWorkshop2SustainabilityLcaSnapshot({
    dossier,
    ...input,
  });
  return {
    ...dossier,
    sustainabilityLcaSnapshot: {
      ...withLca,
      carbonRollupEngine: rollup.engine,
      carbonRollupAt: rollup.computedAt,
      carbonThresholdWarnings: rollup.thresholdWarnings,
    },
    sustainabilityCarbonRollupMirror: rollup,
  };
}

export function evaluateWorkshop2SustainabilityCarbonRollupExportGate(input: {
  dossier: Workshop2DossierPhase1;
}): Workshop2HandoffReadinessCheck | null {
  const mirror = input.dossier.sustainabilityCarbonRollupMirror;
  if (!mirror) return null;
  if (mirror.thresholdWarnings.length > 0) {
    return {
      id: 'sustainability.carbon.threshold',
      severity: 'warning',
      messageRu: mirror.thresholdWarnings[0] ?? mirror.hintRu,
    };
  }
  return null;
}
