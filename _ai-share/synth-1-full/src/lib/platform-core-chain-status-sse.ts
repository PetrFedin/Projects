import type { Workshop2B2bChainStatus } from '@/lib/server/workshop2-b2b-production-handoff';

export type PlatformCoreChainStatusSseEvent =
  | { type: 'ping'; ts: string }
  | { type: 'chain_update'; ts: string; orderIds: string[]; fingerprint: string };

export function formatPlatformCoreChainStatusSseData(
  event: PlatformCoreChainStatusSseEvent
): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export function fingerprintWorkshop2B2bChains(
  chains: Record<string, Workshop2B2bChainStatus | null | undefined>
): string {
  const parts = Object.keys(chains)
    .sort()
    .map((orderId) => {
      const c = chains[orderId];
      if (!c) return `${orderId}:null`;
      return [
        orderId,
        c.status,
        c.handedOff ? 1 : 0,
        c.inventoryReserved ? 1 : 0,
        c.poStatus ?? '',
        c.materialsSupplied ? 1 : 0,
        c.steps.map((s) => `${s.id}:${s.done ? 1 : 0}`).join('|'),
      ].join(':');
    });
  return parts.join(';');
}
