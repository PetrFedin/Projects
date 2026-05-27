/**
 * Golden-path unit checks (без живого dev-сервера).
 * Полный smoke: npm run smoke:workshop2 при запущенном `npm run dev`.
 */

import { validateWorkshop2SizeScaleCsv } from '@/lib/server/workshop2-size-scales-import';
import { mapWorkshop2DossierSavedToPlm } from '@/lib/production/workshop2-plm-bridge';
import { isWorkshop2DemoModeEnabled } from '@/lib/production/workshop2-ai-panel-utils';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import {
  getNextWorkshop2SampleMovementStatus,
  transitionWorkshop2SampleGoodsMovement,
} from '@/lib/production/workshop2-sample-goods-movement';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

describe('workshop2 golden path (unit)', () => {
  it('size scale csv validates women-apparel EU scale', () => {
    const report = validateWorkshop2SizeScaleCsv('women-apparel,EU');
    expect(report.totalLines).toBeGreaterThan(0);
    expect(report.valid + report.invalid).toBe(report.totalLines);
  });

  it('plm bridge envelope is JSON-safe', () => {
    const env = mapWorkshop2DossierSavedToPlm({
      collectionId: 'demo',
      articleId: 'demo-ss27-01',
      dossier: { updatedAt: new Date().toISOString() } as Workshop2DossierPhase1,
      version: 1,
    });
    expect(JSON.parse(JSON.stringify(env)).type).toBe('plm.dossier.saved');
  });

  it('demo mode is off in test NODE_ENV', () => {
    expect(isWorkshop2DemoModeEnabled()).toBe(false);
  });

  it('sample order gate blocks without vault handoff', () => {
    const dossier: Workshop2DossierPhase1 = {
      schemaVersion: 1,
      assignments: [],
      categoryBindings: [{ categoryLeafId: 'catalog-apparel-g0-l0' }],
    };
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: 'catalog-apparel-g0-l0',
      vaultFileCount: 0,
      minVaultFiles: 1,
    });
    expect(gate.allowed).toBe(false);
  });

  it('sample movement advances created → in_transit → received', () => {
    expect(getNextWorkshop2SampleMovementStatus('created')).toBe('in_transit');
    const toTransit = transitionWorkshop2SampleGoodsMovement({
      current: 'created',
      target: 'in_transit',
    });
    expect(toTransit.ok).toBe(true);
    const toReceived = transitionWorkshop2SampleGoodsMovement({
      current: 'in_transit',
      target: 'received',
      strictIntakeOnReceived: false,
    });
    expect(toReceived.ok).toBe(true);
  });
});
