/**
 * Wave 3 P1: cut tickets / fabric rolls / garment dye (AIMS360 patterns).
 */
import type {
  Workshop2CutTicket,
  Workshop2DossierPhase1,
  Workshop2FabricRoll,
  Workshop2GarmentDyeOp,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  getNextWorkshop2CutTicketStatus,
  validateWorkshop2CutTicketTransition,
} from '@/lib/production/workshop2-cut-ticket-status-machine';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export function isWorkshop2CutTicketGateEnabled(env?: Record<string, string | undefined>): boolean {
  return (
    String(env?.WORKSHOP2_CUT_TICKET_REQUIRED ?? process.env.WORKSHOP2_CUT_TICKET_REQUIRED ?? '')
      .trim()
      .toLowerCase() === 'true'
  );
}

export function buildWorkshop2SupplyOpsMirror(
  dossier: Workshop2DossierPhase1,
  env?: Record<string, string | undefined>
): NonNullable<Workshop2DossierPhase1['supplyOpsMirror']> {
  const cutTickets = dossier.cutTickets ?? [];
  const fabricRolls = dossier.fabricRolls ?? [];
  const garmentDyeOps = dossier.garmentDyeOps ?? [];
  const gateRequired = isWorkshop2CutTicketGateEnabled(env);
  const blockerBulkPo = gateRequired && cutTickets.length === 0;
  return {
    mirroredAt: new Date().toISOString(),
    cutTicketCount: cutTickets.length,
    fabricRollCount: fabricRolls.length,
    garmentDyeCount: garmentDyeOps.length,
    cutTicketGateRequired: gateRequired,
    blockerBulkPo,
    hintRu: blockerBulkPo
      ? 'Cut ticket обязателен (WORKSHOP2_CUT_TICKET_REQUIRED) — создайте перед bulk PO.'
      : cutTickets.length
        ? `${cutTickets.length} cut ticket(s), ${fabricRolls.length} roll(s), ${garmentDyeOps.length} dye op(s).`
        : undefined,
  };
}

export function persistWorkshop2SupplyOpsMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  env?: Record<string, string | undefined>
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    supplyOpsMirror: buildWorkshop2SupplyOpsMirror(dossier, env),
  };
}

/** Переводит cut ticket в следующий статус по state machine (draft→issued→cut). */
export function advanceWorkshop2CutTicketStatus(
  dossier: Workshop2DossierPhase1,
  ticketId: string
): { dossier: Workshop2DossierPhase1; ok: boolean; messageRu?: string } {
  const tickets = dossier.cutTickets ?? [];
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx < 0) {
    return { dossier, ok: false, messageRu: 'Cut ticket не найден.' };
  }
  const current = tickets[idx]!;
  const nextStatus = getNextWorkshop2CutTicketStatus(current.status);
  if (!nextStatus) {
    return { dossier, ok: false, messageRu: 'Финальный статус — переход недоступен.' };
  }
  const gate = validateWorkshop2CutTicketTransition(current.status, nextStatus);
  if (!gate.allowed) {
    return { dossier, ok: false, messageRu: gate.messageRu };
  }
  const nextTickets = tickets.map((t, i) => (i === idx ? { ...t, status: nextStatus } : t));
  return {
    ok: true,
    dossier: persistWorkshop2SupplyOpsMirrorToDossier({ ...dossier, cutTickets: nextTickets }),
  };
}

export function appendWorkshop2CutTicket(
  dossier: Workshop2DossierPhase1,
  ticket: Omit<Workshop2CutTicket, 'id' | 'createdAt'>
): Workshop2DossierPhase1 {
  const id = `ct-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const next: Workshop2CutTicket = {
    ...ticket,
    id,
    createdAt: new Date().toISOString(),
  };
  const cutTickets = [...(dossier.cutTickets ?? []), next];
  return persistWorkshop2SupplyOpsMirrorToDossier({ ...dossier, cutTickets });
}

export function appendWorkshop2FabricRoll(
  dossier: Workshop2DossierPhase1,
  roll: Omit<Workshop2FabricRoll, 'id' | 'createdAt'>
): Workshop2DossierPhase1 {
  const id = `fr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const next: Workshop2FabricRoll = {
    ...roll,
    id,
    createdAt: new Date().toISOString(),
  };
  const fabricRolls = [...(dossier.fabricRolls ?? []), next];
  return persistWorkshop2SupplyOpsMirrorToDossier({ ...dossier, fabricRolls });
}

export function appendWorkshop2GarmentDyeOp(
  dossier: Workshop2DossierPhase1,
  op: Omit<Workshop2GarmentDyeOp, 'id' | 'createdAt'>
): Workshop2DossierPhase1 {
  const id = `gd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const next: Workshop2GarmentDyeOp = {
    ...op,
    id,
    createdAt: new Date().toISOString(),
  };
  const garmentDyeOps = [...(dossier.garmentDyeOps ?? []), next];
  return persistWorkshop2SupplyOpsMirrorToDossier({ ...dossier, garmentDyeOps });
}

export function evaluateWorkshop2CutTicketBulkPoGate(
  dossier: Workshop2DossierPhase1,
  env?: Record<string, string | undefined>
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.supplyOpsMirror ?? buildWorkshop2SupplyOpsMirror(dossier, env);
  if (!mirror.cutTicketGateRequired || !mirror.blockerBulkPo) return null;
  return {
    id: 'supply.cut_ticket.required',
    severity: 'blocker',
    messageRu:
      workshop2PgMirrorStr(mirror, 'hintRu') ||
      'Cut ticket обязателен перед bulk PO — добавьте на вкладке «Выпуск».',
  };
}
