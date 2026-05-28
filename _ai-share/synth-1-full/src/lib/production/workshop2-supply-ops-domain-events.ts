/**
 * Wave 4 P0: domain events при создании cut ticket / fabric roll / garment dye.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2DomainEventType } from '@/lib/production/workshop2-domain-event-types';

export type Workshop2SupplyOpsCreatedEvent = {
  type: Workshop2DomainEventType;
  payload: Record<string, unknown>;
};

function idsOf<T extends { id: string }>(items: T[] | undefined): Set<string> {
  return new Set((items ?? []).map((x) => x.id));
}

/** Diff prev→next dossier: новые supply-ops сущности → события для outbox + chat mirror. */
export function collectWorkshop2SupplyOpsCreatedEvents(input: {
  collectionId: string;
  articleId: string;
  previous: Workshop2DossierPhase1 | null | undefined;
  next: Workshop2DossierPhase1;
}): Workshop2SupplyOpsCreatedEvent[] {
  const prevCut = idsOf(input.previous?.cutTickets);
  const prevRoll = idsOf(input.previous?.fabricRolls);
  const prevDye = idsOf(input.previous?.garmentDyeOps);
  const out: Workshop2SupplyOpsCreatedEvent[] = [];

  for (const ticket of input.next.cutTickets ?? []) {
    if (prevCut.has(ticket.id)) continue;
    out.push({
      type: 'supply.cut_ticket.created',
      payload: {
        ticketId: ticket.id,
        ticketNo: ticket.ticketNo,
        qty: ticket.qty,
        status: ticket.status,
        messageRu: `Cut ticket ${ticket.ticketNo} создан (qty ${ticket.qty}).`,
      },
    });
  }

  for (const roll of input.next.fabricRolls ?? []) {
    if (prevRoll.has(roll.id)) continue;
    out.push({
      type: 'supply.fabric_roll.created',
      payload: {
        rollId: roll.id,
        rollLot: roll.rollLot,
        lengthM: roll.lengthM,
        status: roll.status,
        messageRu: `Fabric roll ${roll.rollLot ?? roll.id} добавлен в досье.`,
      },
    });
  }

  for (const op of input.next.garmentDyeOps ?? []) {
    if (prevDye.has(op.id)) continue;
    out.push({
      type: 'supply.garment_dye.created',
      payload: {
        opId: op.id,
        colorwayLabel: op.colorwayLabel,
        status: op.status,
        messageRu: `Garment dye ${op.colorwayLabel ?? op.id} зарегистрирован.`,
      },
    });
  }

  return out;
}
