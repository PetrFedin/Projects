/**
 * Статус цепочки handoff bundles (techPackFactoryHandoffs).
 */
import type {
  Workshop2DossierPhase1,
  Workshop2TechPackFactoryHandoff,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { resolveWorkshop2TechPackHandoffChecklistRow } from '@/lib/production/workshop2-tech-pack-handoff-resolve';

export type Workshop2FactoryHandoffBundleStatus = {
  totalHandoffs: number;
  completedHandoffs: number;
  pendingAckCount: number;
  lastRow?: Workshop2TechPackFactoryHandoff;
  checklistRow?: Workshop2TechPackFactoryHandoff;
  state: 'none' | 'draft' | 'dispatched' | 'acknowledged';
  hintRu?: string;
};

function isHandoffComplete(h: Workshop2TechPackFactoryHandoff): boolean {
  return Boolean(h.brandDispatchedAt?.trim() && h.factoryReceivedAt?.trim());
}

export function summarizeWorkshop2FactoryHandoffBundleStatus(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2FactoryHandoffBundleStatus | null {
  if (!dossier) return null;
  const list = dossier.techPackFactoryHandoffs ?? [];
  const completedHandoffs = list.filter(isHandoffComplete).length;
  const pendingAckCount = list.filter(
    (h) => Boolean(h.brandDispatchedAt) && !h.factoryReceivedAt
  ).length;
  const lastRow = list.length > 0 ? list[list.length - 1] : undefined;
  const checklistRow = resolveWorkshop2TechPackHandoffChecklistRow(list);

  let state: Workshop2FactoryHandoffBundleStatus['state'] = 'none';
  if (list.length === 0) state = 'none';
  else if (checklistRow && isHandoffComplete(checklistRow)) state = 'acknowledged';
  else if (lastRow?.brandDispatchedAt) state = 'dispatched';
  else state = 'draft';

  let hintRu: string | undefined;
  if (state === 'none') {
    hintRu = 'Нет записей передачи — сформируйте tech pack и отправьте пакет в цех.';
  } else if (state === 'draft') {
    hintRu = 'Черновик handoff — завершите ворота ТЗ и нажмите «передать брендом».';
  } else if (state === 'dispatched') {
    hintRu = `Ожидается ACK цеха (${pendingAckCount} без подтверждения).`;
  }

  return {
    totalHandoffs: list.length,
    completedHandoffs,
    pendingAckCount,
    lastRow,
    checklistRow,
    state,
    hintRu,
  };
}
