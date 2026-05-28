/**
 * Wave 2 horizontal integration tests.
 */
import { buildWorkshop2BrandCalendarEventsFromDossier } from '@/lib/production/workshop2-brand-calendar-sync';
import { buildWorkshop2BrandCalendarIcalFeed } from '@/lib/production/workshop2-brand-calendar-ical';
import { buildWorkshop2CollectionTnaBoard } from '@/lib/production/workshop2-collection-tna-board';
import { importWorkshop2ErpLandedCostLines } from '@/lib/production/workshop2-bom-costing-erp-landed';
import { computeWorkshop2BomCostingRollup } from '@/lib/production/workshop2-bom-costing';
import {
  parseWorkshop2ContextualMentions,
  splitWorkshop2ContextualMessageForDisplay,
} from '@/lib/production/workshop2-contextual-chat-utils';
import { evaluateWorkshop2LabDipSampleGate } from '@/lib/production/workshop2-lab-dip-sample-gate';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { buildWorkshop2Wave2HorizontalProbes } from '@/lib/production/workshop2-live-integration-probes';
import {
  enqueueWorkshop2InspectorOfflinePut,
  listWorkshop2InspectorOfflineQueue,
  resetWorkshop2InspectorOfflineQueueForTests,
} from '@/lib/production/workshop2-inspector-offline-queue';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

function dossierWithColorways(st: Record<string, 'pending' | 'approved'>): Workshop2DossierPhase1 {
  return {
    schemaVersion: 1,
    assignments: [
      {
        kind: 'canonical',
        attributeId: 'color',
        values: [{ text: 'Navy' }, { text: 'Sand' }],
      },
    ],
    colorLabDipStatuses: st,
    gradingSizes: ['S', 'M'],
  };
}

describe('workshop2 wave2 — lab dip sample gate', () => {
  it('blocks sample order when lab dip pending', () => {
    const dossier = dossierWithColorways({ navy: 'pending', sand: 'approved' });
    const gate = evaluateWorkshop2LabDipSampleGate(dossier);
    expect(gate?.severity).toBe('blocker');
    expect(gate?.id).toBe('supply.lab_dip.not_approved');

    const orderGate = evaluateWorkshop2SampleOrderGate({ dossier, vaultFileCount: 3 });
    expect(orderGate.allowed).toBe(false);
    expect(orderGate.readiness.checks.some((c) => c.id === 'supply.lab_dip.not_approved')).toBe(
      true
    );
  });
});

describe('workshop2 wave2 — ERP landed cost honest import', () => {
  it('does not apply without ERP env', () => {
    const imp = importWorkshop2ErpLandedCostLines({
      dossier: { schemaVersion: 1, assignments: [] },
      env: {},
    });
    expect(imp.applied).toBe(false);
    expect(imp.configured).toBe(false);
  });

  it('applies only PO lines with erpExternalId', () => {
    const prev = process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
    process.env.WORKSHOP2_FACTORY_ERP_BASE_URL = 'https://erp.partner.test';
    try {
      const imp = importWorkshop2ErpLandedCostLines({
        dossier: {
          schemaVersion: 1,
          assignments: [],
          purchaseOrderErpMirror: {
            mirroredAt: '2026-05-26T00:00:00.000Z',
            poCount: 1,
            fakeSyncedCount: 0,
            errorCount: 0,
            pendingCount: 0,
            erpConfigured: true,
            blockerSampleOrder: false,
            blockerHandoff: false,
          },
        },
        env: { WORKSHOP2_FACTORY_ERP_BASE_URL: 'https://erp.partner.test' },
        purchaseOrders: [
          {
            id: 'po-1',
            erpExternalId: 'ERP-9',
            payload: { landedCostRub: 1200, category: 'fabric' },
          },
          { id: 'po-2', payload: { landedCostRub: 500 } },
        ],
      });
      expect(imp.applied).toBe(true);
      expect(imp.lines).toHaveLength(1);
      const rollup = computeWorkshop2BomCostingRollup(
        {
          schemaVersion: 1,
          assignments: [],
          purchaseOrderErpMirror: {
            mirroredAt: '2026-05-26T00:00:00.000Z',
            poCount: 1,
            fakeSyncedCount: 0,
            errorCount: 0,
            pendingCount: 0,
            erpConfigured: true,
            blockerSampleOrder: false,
            blockerHandoff: false,
          },
        },
        undefined,
        [
          {
            id: 'po-1',
            erpExternalId: 'ERP-9',
            payload: { landedCostRub: 1200, category: 'fabric' },
          },
        ]
      );
      expect(rollup.erpLanded?.applied).toBe(true);
    } finally {
      if (prev === undefined) delete process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
      else process.env.WORKSHOP2_FACTORY_ERP_BASE_URL = prev;
    }
  });
});

describe('workshop2 wave2 — iCal + TNA board', () => {
  it('builds VCALENDAR with dependsOn in description', () => {
    const events = buildWorkshop2BrandCalendarEventsFromDossier({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: {
        schemaVersion: 1,
        assignments: [],
        taMilestones: [
          {
            id: 'm1',
            title: 'Gold sample',
            targetDate: '2026-06-01',
            actualDate: null,
            status: 'pending',
          },
          {
            id: 'm2',
            title: 'Handoff в цех',
            targetDate: '2026-06-15',
            actualDate: null,
            status: 'pending',
          },
        ],
      },
    });
    expect(events.some((e) => e.dependsOn)).toBe(true);
    const ical = buildWorkshop2BrandCalendarIcalFeed({ events, calendarName: 'Test' });
    expect(ical).toContain('BEGIN:VCALENDAR');
    expect(ical).toContain('BEGIN:VEVENT');

    const board = buildWorkshop2CollectionTnaBoard({ collectionId: 'c1', events });
    expect(board.articles.length).toBeGreaterThan(0);
    expect(board.articles[0]?.phases.length).toBeGreaterThan(0);
  });
});

describe('workshop2 wave2 — contextual chat mentions', () => {
  it('parses and highlights @mentions', () => {
    const mentions = parseWorkshop2ContextualMentions('Привет @designer и @qc_lead');
    expect(mentions).toEqual(['designer', 'qc_lead']);
    const segments = splitWorkshop2ContextualMessageForDisplay('OK @designer');
    expect(segments.some((s) => s.kind === 'mention')).toBe(true);
  });
});

describe('workshop2 wave2 — inspector offline queue', () => {
  beforeEach(() => resetWorkshop2InspectorOfflineQueueForTests());

  it('enqueues offline PUT entries', () => {
    enqueueWorkshop2InspectorOfflinePut({
      collectionId: 'c1',
      articleId: 'a1',
      sampleOrderId: 'ord-1',
      checkedItemIds: ['chk-1'],
    });
    expect(listWorkshop2InspectorOfflineQueue()).toHaveLength(1);
  });
});

describe('workshop2 wave2 — probes', () => {
  it('reports floor MES fail-closed without env', () => {
    const probes = buildWorkshop2Wave2HorizontalProbes({});
    expect(probes.floorMes.configured).toBe(false);
    expect(probes.icalFeed.configured).toBe(true);
    expect(probes.inspectorOfflineQueue.configured).toBe(true);
  });
});
