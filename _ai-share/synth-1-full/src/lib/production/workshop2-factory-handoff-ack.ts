/**
 * Stub подтверждения приёмки пакета фабрикой (export handoff → factory ACK).
 */
import type {
  Workshop2DossierPhase1,
  Workshop2TechPackFactoryHandoff,
} from '@/lib/production/workshop2-dossier-phase1.types';

export function applyWorkshop2FactoryHandoffAck(input: {
  dossier: Workshop2DossierPhase1;
  handoffId: string;
  receivedAt: string;
  receivedBy: string;
}): { dossier: Workshop2DossierPhase1; handoff?: Workshop2TechPackFactoryHandoff } | null {
  const handoffs = input.dossier.techPackFactoryHandoffs ?? [];
  const idx = handoffs.findIndex((h) => h.handoffId === input.handoffId);
  if (idx === -1) return null;
  const prev = handoffs[idx]!;
  const updated: Workshop2TechPackFactoryHandoff = {
    ...prev,
    factoryReceivedAt: input.receivedAt,
    factoryReceivedBy: input.receivedBy.slice(0, 240),
    status: prev.status === 'draft' ? 'sent' : prev.status,
  };
  const nextHandoffs = handoffs.map((h, i) => (i === idx ? updated : h));
  return {
    dossier: { ...input.dossier, techPackFactoryHandoffs: nextHandoffs },
    handoff: updated,
  };
}
