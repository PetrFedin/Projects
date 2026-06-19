import { fingerprintWorkshop2B2bChains } from '@/lib/platform-core-chain-status-sse';
import type { Workshop2B2bChainStatus } from '@/lib/server/workshop2-b2b-production-handoff';

function stubChain(partial: Partial<Workshop2B2bChainStatus>): Workshop2B2bChainStatus {
  return {
    orderId: 'ORD-1',
    status: 'confirmed',
    collectionId: 'SS27',
    articleId: 'demo-ss27-01',
    handedOff: true,
    inventoryReserved: false,
    materialsSupplied: false,
    dossierHref: '/factory/production/dossier/demo-ss27-01',
    steps: [
      { id: 'shop_sent', labelRu: 'a', done: true },
      { id: 'production_po', labelRu: 'b', done: true },
    ],
    ...partial,
  };
}

describe('platform-core-chain-status-sse', () => {
  it('меняет fingerprint при смене materialsSupplied', () => {
    const before = fingerprintWorkshop2B2bChains({
      'ORD-1': stubChain({ materialsSupplied: false }),
    });
    const after = fingerprintWorkshop2B2bChains({
      'ORD-1': stubChain({ materialsSupplied: true }),
    });
    expect(before).not.toBe(after);
  });
});
