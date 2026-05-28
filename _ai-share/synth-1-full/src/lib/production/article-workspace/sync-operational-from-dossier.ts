import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2OperationalPipelineTab } from '@/lib/production/workshop2-article-operational-tz-bridge';
import type {
  ArticleWorkspaceBundle,
  ProductionOperation,
  SupplySnapshot,
} from '@/lib/production/article-workspace/types';

function normLabel(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function mapDossierProductionModelToSupplyLines(
  dossier: Workshop2DossierPhase1
): SupplySnapshot['lines'] {
  const pm = dossier.productionModel;
  if (!pm) return [];

  const mats = (pm.materialLines ?? []).map((m) => ({
    id: `tz-m-${m.id}`,
    label: m.materialName || 'Материал без названия',
    qty: m.yieldPerUnit ?? m.consumption,
    unit: m.yieldUnit || m.unit || 'ед.',
    status: 'draft' as const,
    sourceNote: `${m.supplier || ''} ${m.article || ''}`.trim() || 'из ТЗ',
    costPerUnit: m.unitCostNet ?? m.landedCost,
    supplyType: m.supplyType,
    substitutes: m.substitutes,
  }));

  const trims = (pm.trimLines ?? []).map((t) => ({
    id: `tz-t-${t.id}`,
    label: t.name || 'Фурнитура без названия',
    qty: t.quantity,
    unit: 'шт' as const,
    status: 'draft' as const,
    sourceNote: `${t.supplier || ''} ${t.article || ''}`.trim() || 'из ТЗ',
    costPerUnit: t.unitCostNet,
    supplyType: t.supplyType,
    substitutes: t.substitutes,
  }));

  return [...mats, ...trims];
}

export function mapDossierProductionModelToReleaseOperations(
  dossier: Workshop2DossierPhase1
): ProductionOperation[] {
  const ops = dossier.productionModel?.operations ?? [];
  return ops.map((o) => ({
    id: `tz-op-${o.id}`,
    name: o.name || o.operationType || 'Операция',
    sash: o.sash ?? 0,
    costPerUnit: o.costPerUnit ?? 0,
    status: 'pending' as const,
  }));
}

export type OperationalDossierSyncResult = {
  patch: Partial<ArticleWorkspaceBundle>;
  changes: string[];
};

/** Слияние операционного bundle с актуальным ТЗ (без затирания ручных правок). */
export function buildOperationalSyncFromDossier(
  tab: Workshop2OperationalPipelineTab,
  dossier: Workshop2DossierPhase1,
  bundle: ArticleWorkspaceBundle
): OperationalDossierSyncResult {
  const changes: string[] = [];
  const patch: Partial<ArticleWorkspaceBundle> = {
    lastSyncedDossierVersion: dossier.dossierVersion ?? 1,
  };

  const pm = dossier.productionModel;

  if (tab === 'supply' && pm) {
    const incoming = mapDossierProductionModelToSupplyLines(dossier);
    const existing = bundle.supply?.lines ?? [];
    const existingLabels = new Set(existing.map((l) => normLabel(l.label)));
    const toAdd = incoming.filter((l) => !existingLabels.has(normLabel(l.label)));
    if (toAdd.length > 0) {
      patch.supply = {
        ...(bundle.supply ?? { lines: [] }),
        lines: [...existing, ...toAdd],
      };
      changes.push(`Добавлено ${toAdd.length} поз. BOM из ТЗ (без удаления текущих).`);
    } else if (incoming.length === 0) {
      changes.push('В ТЗ нет строк production model — заполните материалы в разделе «Материалы».');
    } else {
      changes.push('Все позиции из ТЗ уже есть в снабжении.');
    }
  }

  if (tab === 'release' && pm?.operations?.length) {
    const incoming = mapDossierProductionModelToReleaseOperations(dossier);
    const existing = bundle.release?.operations ?? [];
    const existingNames = new Set(existing.map((o) => normLabel(o.name)));
    const toAdd = incoming.filter((o) => !existingNames.has(normLabel(o.name)));
    if (toAdd.length > 0) {
      patch.release = {
        ...(bundle.release ?? {}),
        operations: [...existing, ...toAdd],
      };
      changes.push(`Добавлено ${toAdd.length} операций техпроцесса из ТЗ.`);
    } else {
      changes.push('Операции из ТЗ уже отражены в выпуске.');
    }
  }

  if (tab === 'plan' && dossier.taMilestones?.length) {
    const existing = bundle.timeAndAction?.milestones ?? [];
    if (existing.length === 0) {
      patch.timeAndAction = { milestones: [...dossier.taMilestones] };
      changes.push(`Импортировано ${dossier.taMilestones.length} вех T&A из ТЗ.`);
    } else {
      changes.push('Вехи T&A уже заданы на вкладке — проверьте даты вручную.');
    }
  }

  if (tab === 'fit' && pm?.measurements?.length) {
    changes.push(
      `В ТЗ ${pm.measurements.length} замеров — сверьте дельты примерки с табелем в разделе «Конструкция».`
    );
  }

  if (changes.length === 0) {
    changes.push('Версия ТЗ отмечена актуальной для этой вкладки.');
  }

  return { patch, changes };
}
