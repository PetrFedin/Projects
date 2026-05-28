/**
 * Handoff bridge: извлекает пакеты из досье и формирует
 * начальные данные для вкладок supply, fit, plan, release, qc, stock.
 *
 * Каждый пакет — это контракт между секцией ТЗ и целевым этапом.
 * Потребители могут вызвать applyHandoffToBundle() для автоматической
 * инициализации вкладки на основе данных ТЗ.
 */

import type { Workshop2DossierPhase1 } from './workshop2-dossier-phase1.types';
import type { HandbookCategoryLeaf } from './category-handbook-snapshot-builder';
import type {
  ArticleWorkspaceBundle,
  SupplySnapshot,
  FitGoldSnapshot,
} from './article-workspace/types';
import { extractHandoffPackets, type HandoffPacket } from './dossier-readiness-engine';

export type HandoffApplyResult = {
  appliedPackets: HandoffPacket[];
  bundlePatch: Partial<ArticleWorkspaceBundle>;
};

/**
 * Из пакетов dosser → supply: создаём BOM-строки из material brief.
 */
function buildSupplyFromHandoff(packets: HandoffPacket[]): SupplySnapshot | undefined {
  const supplyPackets = packets.filter((p) => p.targetTab === 'supply');
  if (supplyPackets.length === 0) return undefined;

  const lines: SupplySnapshot['lines'] = [];
  for (const pkt of supplyPackets) {
    const materials = (pkt.data.materials ?? []) as { parameterId: string; label: string }[];
    for (const mat of materials) {
      if (!lines.some((l) => l.id === mat.parameterId)) {
        lines.push({
          id: mat.parameterId,
          label: mat.label,
          status: 'draft',
          sourceNote: 'Из ТЗ · досье (material brief)',
        });
      }
    }
  }
  return lines.length > 0 ? { lines } : undefined;
}

/**
 * Из пакетов dossier → fit: подготавливаем fit reference.
 */
function buildFitReferenceFromHandoff(
  packets: HandoffPacket[]
): Partial<FitGoldSnapshot> | undefined {
  const fitPackets = packets.filter((p) => p.targetTab === 'fit');
  if (fitPackets.length === 0) return undefined;

  const comments: FitGoldSnapshot['fitComments'] = [];
  for (const pkt of fitPackets) {
    if (pkt.data.brandNotes) {
      comments.push({
        id: `handoff-${Date.now()}`,
        text: `[Из ТЗ] ${pkt.data.brandNotes}`,
        at: pkt.generatedAt,
        by: 'ТЗ · досье',
        role: 'designer',
      });
    }
  }
  return comments.length > 0 ? { goldApproved: false, fitComments: comments } : undefined;
}

/**
 * Применяет handoff-пакеты досье к bundle артикула.
 * Не перезаписывает уже заполненные данные — только инициализирует пустые.
 */
export function applyHandoffToBundle(
  dossier: Workshop2DossierPhase1,
  leaf: HandbookCategoryLeaf | undefined | null,
  currentBundle: ArticleWorkspaceBundle | null
): HandoffApplyResult {
  const packets = extractHandoffPackets(dossier, leaf);
  const patch: Partial<ArticleWorkspaceBundle> = {};

  const existingSupplyLines = currentBundle?.supply?.lines ?? [];
  if (existingSupplyLines.length === 0) {
    const supplySnapshot = buildSupplyFromHandoff(packets);
    if (supplySnapshot) patch.supply = supplySnapshot;
  }

  const existingFitComments = currentBundle?.fitGold?.fitComments ?? [];
  if (existingFitComments.length === 0) {
    const fitData = buildFitReferenceFromHandoff(packets);
    if (fitData) patch.fitGold = fitData as FitGoldSnapshot;
  }

  return { appliedPackets: packets, bundlePatch: patch };
}

/**
 * Описание handoff-контрактов для UI: что из какой секции куда передаётся.
 */
export const HANDOFF_CONTRACT_DESCRIPTIONS: {
  from: string;
  to: string;
  contract: string;
}[] = [
  {
    from: 'Материалы (BOM)',
    to: 'Снабжение',
    contract: 'Список материалов и состав → драфт BOM-строк для закупки',
  },
  {
    from: 'Табель мер',
    to: 'Эталон · посадка',
    contract: 'Размерная шкала + мерки → карточка замеров для сверки образца',
  },
  {
    from: 'Табель мер',
    to: 'ОТК',
    contract: 'Допуски (мин/макс) → таблица допусков для инспекции партий',
  },
  {
    from: 'Визуал / Эскиз',
    to: 'Эталон · посадка',
    contract: 'Скетч + метки + замысел → визуальный эталон для образца',
  },
  {
    from: 'Визуал / Эскиз',
    to: 'ОТК',
    contract: 'QC-аннотации → контрольные зоны инспекции',
  },
  {
    from: 'Конструкция',
    to: 'План · PO',
    contract: 'Тех. пакет + конструктивные атрибуты → шаблон операций',
  },
  {
    from: 'Конструкция',
    to: 'Выпуск',
    contract: 'Конструктив → производственная карта для цеха',
  },
  {
    from: 'Упаковка / Марк.',
    to: 'Выпуск',
    contract: 'Упаковка + маркировка → спецификация выпуска',
  },
  {
    from: 'Упаковка / Марк.',
    to: 'Склад',
    contract: 'Штрих-код + габариты упаковки → карточка приёмки',
  },
];
