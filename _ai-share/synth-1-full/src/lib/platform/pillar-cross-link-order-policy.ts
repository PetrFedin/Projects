import type { EntityLink } from '@/lib/data/entity-links';
import type { PillarCapabilityContext } from '@/lib/platform/pillar-capability-registry';

/** Capabilities, где cross-link без ?order= ведёт на demo / теряет spine. */
export const PILLAR_CAPABILITIES_REQUIRING_ORDER = new Set([
  'comms-order-context',
  'co-collaborative-order',
  'co-working-order',
  'op-handoff-queue',
  'co-agent-rep',
]);

export function pillarCrossLinkRequiresOrder(
  capabilityId: string,
  ctx: PillarCapabilityContext
): boolean {
  if (!PILLAR_CAPABILITIES_REQUIRING_ORDER.has(capabilityId)) return false;
  return !ctx.orderId?.trim();
}

export function annotatePillarCrossLink(
  link: EntityLink,
  capabilityId: string,
  ctx: PillarCapabilityContext
): EntityLink {
  if (!pillarCrossLinkRequiresOrder(capabilityId, ctx)) return link;
  return {
    ...link,
    disabled: true,
    disabledReasonRu: 'Нужен контекст заказа (?order=)',
  };
}
