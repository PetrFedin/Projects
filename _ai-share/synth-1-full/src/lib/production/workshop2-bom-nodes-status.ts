/**
 * BOM по узлам: productionModel nodes, materialLines, costing rollup.
 */
import {
  computeWorkshop2BomCostingRollup,
  type Workshop2BomCostingRollup,
} from '@/lib/production/workshop2-bom-costing';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { evaluateWorkshop2BomNodesSampleGate } from '@/lib/production/workshop2-bom-nodes-dossier-persist';
import { collectWorkshop2PanelExportGateChecks } from '@/lib/production/workshop2-panel-gate-ui';
import type { Workshop2ApiGateCheck } from '@/lib/production/workshop2-api-gate-messages';

export type Workshop2BomNodesStatus = {
  nodeCount: number;
  materialLineCount: number;
  trimLineCount: number;
  orphanMaterialLineCount: number;
  linesMissingYield: number;
  estimatedFob: number;
  deltaBand: Workshop2BomCostingRollup['deltaBand'];
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2BomNodesStatus(
  dossier: Workshop2DossierPhase1
): Workshop2BomNodesStatus {
  const model = ensureWorkshop2ProductionModel(dossier);
  const nodeIds = new Set((model.nodes ?? []).map((n) => n.id));
  const materialLineCount = model.materialLines?.length ?? 0;
  const trimLineCount = model.trimLines?.length ?? 0;
  let orphanMaterialLineCount = 0;
  let linesMissingYield = 0;
  for (const m of model.materialLines ?? []) {
    if (m.nodeId && !nodeIds.has(m.nodeId)) orphanMaterialLineCount += 1;
    if (!(Number(m.yieldPerUnit) > 0 || Number(m.consumption) > 0)) linesMissingYield += 1;
  }

  const rollup = computeWorkshop2BomCostingRollup(dossier, model);
  const nodeCount = model.nodes?.length ?? 0;

  let state: Workshop2BomNodesStatus['state'] = 'empty';
  if (materialLineCount > 0 || trimLineCount > 0) {
    state =
      materialLineCount >= 1 &&
      orphanMaterialLineCount === 0 &&
      linesMissingYield === 0 &&
      rollup.estimatedFob > 0
        ? 'ready'
        : 'partial';
  }

  let hintRu: string | undefined;
  if (materialLineCount === 0 && trimLineCount === 0) {
    hintRu = 'BOM пуст — добавьте материалы по узлам или синхронизируйте из mat в паспорте.';
  } else if (orphanMaterialLineCount > 0) {
    hintRu = `${orphanMaterialLineCount} строк материала без узла конструкции — привяжите nodeId.`;
  } else if (linesMissingYield > 0) {
    hintRu = `${linesMissingYield} строк без расхода (yield/consumption) — укажите для costing.`;
  } else if (rollup.deltaBand === 'over') {
    hintRu = `FOB выше target на ${rollup.deltaPct ?? 0}% — проверьте цены строк BOM.`;
  } else if (rollup.deltaBand === 'no_target') {
    hintRu = 'Target FOB в паспорте не задан — delta rollup недоступен.';
  } else if (nodeCount < 3) {
    hintRu = `Узлов конструкции: ${nodeCount} — для release рекомендуется ≥3.`;
  }

  return {
    nodeCount,
    materialLineCount,
    trimLineCount,
    orphanMaterialLineCount,
    linesMissingYield,
    estimatedFob: rollup.estimatedFob,
    deltaBand: rollup.deltaBand,
    state,
    hintRu,
  };
}

/** §4.15: счётчики строк BOM — в tooltip, chip остаётся коротким. */
export function formatWorkshop2BomNodesReadinessChip(status: Workshop2BomNodesStatus): {
  readiness: string;
  readinessTitle?: string;
} {
  const detailRu = `Узлов: ${status.nodeCount} · мат.: ${status.materialLineCount} · фурн.: ${status.trimLineCount} · без узла: ${status.orphanMaterialLineCount} · без расхода: ${status.linesMissingYield} · FOB: ${status.estimatedFob.toFixed(2)}`;
  if (status.state === 'ready') {
    return { readiness: 'BOM готов к sample-order gate', readinessTitle: detailRu };
  }
  if (status.state === 'empty') {
    return { readiness: 'BOM пуст', readinessTitle: detailRu };
  }
  return { readiness: 'BOM частично', readinessTitle: detailRu };
}

/** Wave U — readiness из bomNodesMirror (реальные counts досье). */
export function summarizeWorkshop2BomPanelDisplayFromMirror(input: {
  dossier: Workshop2DossierPhase1;
  live: Workshop2BomNodesStatus;
}): Workshop2BomNodesStatus {
  const mirror = input.dossier.bomNodesMirror;
  if (!mirror?.mirroredAt) return input.live;

  return {
    nodeCount: mirror.nodeCount ?? input.live.nodeCount,
    materialLineCount: mirror.materialLineCount ?? input.live.materialLineCount,
    trimLineCount: input.live.trimLineCount,
    orphanMaterialLineCount: input.live.orphanMaterialLineCount,
    linesMissingYield: input.live.linesMissingYield,
    estimatedFob: mirror.estimatedFob ?? input.live.estimatedFob,
    deltaBand: input.live.deltaBand,
    state: mirror.state ?? input.live.state,
    hintRu: mirror.hintRu ?? input.live.hintRu,
  };
}

/** Export / sample-order gate checks для BOM panel UI. */
export function collectWorkshop2BomExportGateChecks(
  dossier: Workshop2DossierPhase1
): Workshop2ApiGateCheck[] {
  return collectWorkshop2PanelExportGateChecks({
    checks: [evaluateWorkshop2BomNodesSampleGate(dossier)],
  });
}
