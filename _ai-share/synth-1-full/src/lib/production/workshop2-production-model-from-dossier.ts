import type {
  Workshop2DossierPhase1,
  Workshop2ProductionModel,
} from './workshop2-dossier-phase1.types';
import { buildDefaultProductionModelForL3 } from './workshop2-production-node-presets';

function assignmentLabels(dossier: Workshop2DossierPhase1, attributeId: string): string[] {
  return (
    dossier.assignments
      ?.find((a) => a.attributeId === attributeId)
      ?.values?.map((v) => v.displayLabel || v.text || String(v.number ?? ''))
      .filter(Boolean) ?? []
  );
}

function firstAssignmentLabel(dossier: Workshop2DossierPhase1, ids: string[]): string | undefined {
  for (const id of ids) {
    const v = assignmentLabels(dossier, id)[0];
    if (v) return v;
  }
  return undefined;
}

export function ensureWorkshop2ProductionModel(
  dossier: Workshop2DossierPhase1
): Workshop2ProductionModel {
  if (dossier.productionModel?.version === 1) return dossier.productionModel;

  const l3 = firstAssignmentLabel(dossier, ['l3', 'categoryL3', 'modelCard']) ?? 'unknown';
  const model = buildDefaultProductionModelForL3(l3);

  const mainMaterial = firstAssignmentLabel(dossier, ['mat', 'material', 'mainMaterial']);
  const composition = firstAssignmentLabel(dossier, [
    'composition',
    'fabricCompositionPresetOptions',
  ]);
  if (mainMaterial) {
    model.materialLines.push({
      id: 'mat-body-main',
      nodeId: 'body',
      role: 'main',
      materialName: mainMaterial,
      compositionText: composition,
      isPrimary: true,
      sourceAssignmentId: 'mat',
    });
  }

  const lining = firstAssignmentLabel(dossier, ['liningOptionsByCategory']);
  if (lining) {
    model.materialLines.push({
      id: 'mat-lining-main',
      nodeId: 'lining',
      role: 'lining',
      materialName: lining,
      isPrimary: true,
      sourceAssignmentId: 'liningOptionsByCategory',
    });
  }

  const closure = firstAssignmentLabel(dossier, [
    'closure',
    'closureOptionsByCategory',
    'fastenerOptionsByCategory',
  ]);
  if (closure) {
    const n = model.nodes.find((x) => x.id === 'closure');
    if (n) {
      n.description = closure;
      n.status = 'draft';
    }
  }

  const pocket = firstAssignmentLabel(dossier, ['pocket', 'pocketOptions']);
  if (pocket) {
    const n = model.nodes.find((x) => x.id === 'pocket');
    if (n) {
      n.description = pocket;
      n.status = 'draft';
    }
  }

  const collar = firstAssignmentLabel(dossier, ['collarOptionsByCategory', 'neck']);
  if (collar) {
    const n = model.nodes.find((x) => x.id === 'collar');
    if (n) {
      n.description = collar;
      n.status = 'draft';
    }
  }

  return model;
}
