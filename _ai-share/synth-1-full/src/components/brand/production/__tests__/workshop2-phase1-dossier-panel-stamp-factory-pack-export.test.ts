import { stampDossierAfterFactoryPackExport } from '@/components/brand/production/workshop2-phase1-dossier-panel-stamp-factory-pack-export';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

describe('stampDossierAfterFactoryPackExport', () => {
  it('writes factoryPackLastExport and action log entry', () => {
    const base: Workshop2DossierPhase1 = { schemaVersion: 1, assignments: [] };
    const next = stampDossierAfterFactoryPackExport({
      dossier: base,
      format: 'server_snapshot',
      updatedByLabel: 'Tester',
      skuDraft: 'SKU-1',
      snapshotId: 'snap-abc',
      releaseGate: {
        sheetsReady: 4,
        sheetsTotal: 6,
        qtyBridged: true,
        ready: false,
      },
    });
    expect(next.factoryPackLastExport?.snapshotId).toBe('snap-abc');
    expect(next.factoryPackLastExport?.sheetsReady).toBe(4);
    expect(next.tzActionLog?.[0]?.action.type).toBe('factory_pack_export');
  });
});
