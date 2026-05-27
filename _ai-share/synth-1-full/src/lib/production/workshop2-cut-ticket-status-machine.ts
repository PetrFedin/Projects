/**
 * Phase 2.4: статусная машина cut ticket (read-only stub для UI / gate).
 */
import type { Workshop2CutTicket } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2CutTicketStatus = Workshop2CutTicket['status'];

const ORDER: Workshop2CutTicketStatus[] = ['draft', 'issued', 'cut', 'cancelled'];

const LABELS_RU: Record<Workshop2CutTicketStatus, string> = {
  draft: 'Черновик',
  issued: 'Выдан',
  cut: 'Раскрой выполнен',
  cancelled: 'Отменён',
};

const ALLOWED: Record<Workshop2CutTicketStatus, readonly Workshop2CutTicketStatus[]> = {
  draft: ['issued', 'cancelled'],
  issued: ['cut', 'cancelled'],
  cut: [],
  cancelled: ['draft'],
};

export function labelWorkshop2CutTicketStatusRu(status: Workshop2CutTicketStatus | string): string {
  const s = status as Workshop2CutTicketStatus;
  return LABELS_RU[s] ?? status;
}

export function listWorkshop2CutTicketStatusOrder(): Workshop2CutTicketStatus[] {
  return [...ORDER];
}

export function getNextWorkshop2CutTicketStatus(
  current: Workshop2CutTicketStatus | string
): Workshop2CutTicketStatus | null {
  const happy: Partial<Record<Workshop2CutTicketStatus, Workshop2CutTicketStatus>> = {
    draft: 'issued',
    issued: 'cut',
  };
  return happy[current as Workshop2CutTicketStatus] ?? null;
}

export function validateWorkshop2CutTicketTransition(
  from: Workshop2CutTicketStatus | string,
  to: Workshop2CutTicketStatus | string
): { allowed: boolean; messageRu?: string } {
  const fromState = from as Workshop2CutTicketStatus;
  const toState = to as Workshop2CutTicketStatus;
  if (fromState === toState) return { allowed: true };
  const allowed = ALLOWED[fromState]?.includes(toState) ?? false;
  return {
    allowed,
    messageRu: allowed
      ? undefined
      : `Переход cut ticket «${labelWorkshop2CutTicketStatusRu(fromState)}» → «${labelWorkshop2CutTicketStatusRu(toState)}» недоступен.`,
  };
}
