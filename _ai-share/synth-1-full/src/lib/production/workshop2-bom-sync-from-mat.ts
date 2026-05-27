/**
 * Синхронизация строк BOM (productionModel.materialLines) из атрибута mat в паспорте.
 */
import type {
  Workshop2DossierPhase1,
  Workshop2ProductionMaterialLine,
  Workshop2ProductionMaterialRole,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function matLabelsFromDossier(dossier: Workshop2DossierPhase1): { label: string; pct?: number }[] {
  const a = dossier.assignments.find((x) => x.kind === 'canonical' && x.attributeId === 'mat');
  const out: { label: string; pct?: number }[] = [];
  for (const v of a?.values ?? []) {
    const raw = (v.displayLabel || v.text || '').trim();
    if (!raw) continue;
    const m = raw.match(/\s(\d{1,3})%$/);
    const pct = m ? parseInt(m[1]!, 10) : undefined;
    const label = m ? raw.replace(/\s\d{1,3}%$/, '').trim() : raw;
    if (label) out.push({ label, pct });
  }
  return out;
}

function resolveNodeIdForMatIndex(
  model: ReturnType<typeof ensureWorkshop2ProductionModel>,
  index: number
): string {
  const body = model.nodes.find((n) => n.id === 'body');
  if (body) return body.id;
  const lining = model.nodes.find((n) => n.id === 'lining');
  if (index > 0 && lining) return lining.id;
  return model.nodes[0]?.id ?? 'body';
}

function roleForIndex(index: number): Workshop2ProductionMaterialRole {
  if (index === 0) return 'main';
  if (index === 1) return 'lining';
  return 'contrast';
}

export type Workshop2BomSyncFromMatResult = {
  dossier: Workshop2DossierPhase1;
  addedCount: number;
  updatedCount: number;
};

/** Добавляет/обновляет materialLines по строкам mat; не удаляет существующие вручную. */
export function syncWorkshop2BomMaterialLinesFromMatAssignments(
  dossier: Workshop2DossierPhase1
): Workshop2BomSyncFromMatResult {
  const labels = matLabelsFromDossier(dossier);
  if (!labels.length) {
    return { dossier, addedCount: 0, updatedCount: 0 };
  }

  const model = ensureWorkshop2ProductionModel(dossier);
  const lines = [...(model.materialLines ?? [])];
  let addedCount = 0;
  let updatedCount = 0;

  labels.forEach((row, index) => {
    const nodeId = resolveNodeIdForMatIndex(model, index);
    const key = row.label.toLowerCase();
    const existingIdx = lines.findIndex(
      (l) =>
        l.sourceAssignmentId === 'mat' &&
        l.materialName.trim().toLowerCase() === key &&
        l.nodeId === nodeId
    );
    if (existingIdx >= 0) {
      const prev = lines[existingIdx]!;
      const nextPct = row.pct ?? prev.percentage;
      if (nextPct !== prev.percentage || prev.isPrimary !== (index === 0)) {
        lines[existingIdx] = {
          ...prev,
          percentage: nextPct,
          isPrimary: index === 0,
        };
        updatedCount += 1;
      }
      return;
    }

    const line: Workshop2ProductionMaterialLine = {
      id: uid('w2-bom-mat'),
      nodeId,
      role: roleForIndex(index),
      materialName: row.label,
      percentage: row.pct,
      isPrimary: index === 0,
      sourceAssignmentId: 'mat',
      yieldPerUnit: 1,
      unit: 'm',
    };
    lines.push(line);
    addedCount += 1;
  });

  if (addedCount === 0 && updatedCount === 0) {
    return { dossier, addedCount: 0, updatedCount: 0 };
  }

  return {
    dossier: {
      ...dossier,
      productionModel: {
        ...model,
        materialLines: lines,
      },
      bomMatSyncAt: new Date().toISOString(),
    },
    addedCount,
    updatedCount,
  };
}
