/**
 * Wave 17 — functional depth: gates, persist, sync (не banner-only).
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { evaluateWorkshop2PassportIdentityGate } from '@/lib/production/workshop2-passport-identity-gate';
import {
  syncColorLabDipStatusesFromColorways,
  resolveColorLabDipKeyForColorway,
} from '@/lib/production/workshop2-colorway-lab-dip-sync';
import { evaluateWorkshop2MaterialCompositionGate } from '@/lib/production/workshop2-material-composition-gate';
import { evaluateWorkshop2SampleEconomicsGate } from '@/lib/production/workshop2-sample-economics-gate';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { copyTaMilestonesToDossier } from '@/lib/production/workshop2-ta-milestones-dossier-persist';
import { persistWorkshop2RoutingStepsFromDossier } from '@/lib/production/workshop2-routing-steps-persist';
import { buildColorwayRowsFromDossier } from '@/lib/production/workshop2-colorway-palette';

describe('workshop2 wave17 — #29 passport identity gate', () => {
  it('blocks sample-order when SKU/name missing', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const check = evaluateWorkshop2PassportIdentityGate({ dossier });
    expect(check?.severity).toBe('blocker');
    const gate = evaluateWorkshop2SampleOrderGate({ dossier, vaultFileCount: 5 });
    expect(gate.readiness.checks.some((c) => c.id === 'passport.identity.incomplete')).toBe(true);
  });
});

describe('workshop2 wave17 — #32 colorway lab dip sync', () => {
  it('adds pending keys by paletteCode', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      assignments: [
        {
          kind: 'canonical' as const,
          attributeId: 'color',
          values: [{ text: 'Black', displayLabel: 'Black' }],
        },
      ],
    };
    const { dossier: next, addedKeys } = syncColorLabDipStatusesFromColorways(dossier);
    expect(addedKeys.length).toBeGreaterThan(0);
    const rows = buildColorwayRowsFromDossier(next);
    const key = resolveColorLabDipKeyForColorway(rows[0]!);
    expect(next.colorLabDipStatuses?.[key]).toBe('pending');
  });
});

describe('workshop2 wave17 — #35 material composition gate', () => {
  it('blocks when mat present but composition invalid', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      assignments: [
        {
          kind: 'canonical' as const,
          attributeId: 'mat',
          values: [{ text: 'A', displayLabel: 'Ткань A' }],
        },
      ],
      compositionLabelSpec: {
        fiberRows: [{ fiber: 'Хлопок', pct: 60 }],
      },
    };
    const check = evaluateWorkshop2MaterialCompositionGate(dossier);
    expect(check?.id).toBe('material.composition.incomplete');
  });
});

describe('workshop2 wave17 — #49 sample economics gate', () => {
  it('requires bom rollup sync when BOM has cost', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      productionModel: {
        version: 1,
        materialLines: [
          {
            id: 'm1',
            materialName: 'Shell',
            yieldPerUnit: 1.2,
            unitCostNet: 10,
          },
        ],
        operations: [],
        trimLines: [],
      },
    };
    const check = evaluateWorkshop2SampleEconomicsGate(dossier);
    expect(check?.id).toBe('sample.economics.bom_rollup_required');
  });
});

describe('workshop2 wave17 — #51/#61 T&A dossier persist', () => {
  it('copies bundle milestones into taMilestones', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const next = copyTaMilestonesToDossier({
      dossier,
      milestones: [
        {
          id: 'm1',
          title: 'Заказ ткани',
          targetDate: '2026-06-01',
          status: 'pending',
        },
      ],
    });
    expect(next.taMilestones).toHaveLength(1);
    expect(next.taMilestonesPersistedAt).toBeTruthy();
  });
});

describe('workshop2 wave17 — #64 routing persist', () => {
  it('derives routingSteps from smartRoutingSequence', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      smartRoutingSequence: [{ name: 'Раскрой', sash: 12, costPerUnit: 5 }],
    };
    const { steps, source } = persistWorkshop2RoutingStepsFromDossier(dossier);
    expect(steps.length).toBe(1);
    expect(source).toBe('derived');
  });
});
