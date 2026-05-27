/**
 * Wave 13: hub filters, sustainability, matchmaker persist, visual refs, activity, fit sessions.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  filterWorkshop2HubEntries,
  hubEntryEnrichmentKey,
  WORKSHOP2_HUB_ARTICLE_FILTER_ALL,
} from '@/lib/production/workshop2-hub-filter';
import { summarizeWorkshop2HubFilterStatus } from '@/lib/production/workshop2-hub-filter-status';
import { summarizeWorkshop2SustainabilityStatus } from '@/lib/production/workshop2-sustainability-status';
import { summarizeWorkshop2MatchmakerPersistStatus } from '@/lib/production/workshop2-matchmaker-persist-status';
import { summarizeWorkshop2VisualReferencesStatus } from '@/lib/production/workshop2-visual-references-status';
import { summarizeWorkshop2HubActivityStatus } from '@/lib/production/workshop2-hub-activity-status';
import { summarizeWorkshop2FitSessionsStatus } from '@/lib/production/workshop2-fit-sessions-status';
import type { Workshop2ActivityEntry } from '@/lib/production/workshop2-activity-log';

const hubEntries = [
  {
    collectionId: 'SS27',
    collectionName: 'SS27',
    row: { id: 'a1', sku: 'W2-001', name: 'A', categoryL1: 'Одежда' },
  },
  {
    collectionId: 'SS27',
    collectionName: 'SS27',
    row: { id: 'a2', sku: 'W2-002', name: 'B', categoryL1: 'Одежда' },
  },
];

describe('workshop2 wave13 — #3 hub filters', () => {
  it('filters by min TZ and gold', () => {
    const enrichment = {
      [hubEntryEnrichmentKey('SS27', 'a1')]: {
        tzOverallPct: 80,
        goldApproved: true,
        hasSampleOrder: false,
      },
      [hubEntryEnrichmentKey('SS27', 'a2')]: {
        tzOverallPct: 40,
        goldApproved: false,
        hasSampleOrder: true,
      },
    };
    const out = filterWorkshop2HubEntries(
      hubEntries,
      {
        search: '',
        tagFilter: new Set(),
        articleFilter: WORKSHOP2_HUB_ARTICLE_FILTER_ALL,
        catL1: '',
        catL2: '',
        catL3: '',
      },
      { minTzPct: 70, goldApprovedOnly: true },
      enrichment
    );
    expect(out.map((e) => e.row.id)).toEqual(['a1']);
    const status = summarizeWorkshop2HubFilterStatus({
      totalCount: 2,
      visibleCount: 1,
      advanced: { minTzPct: 70, goldApprovedOnly: true },
    });
    expect(status.advancedActive).toBe(true);
    expect(status.state).toBe('filtered');
  });
});

describe('workshop2 wave13 — #53 sustainability', () => {
  it('empty without BOM materials', () => {
    const s = summarizeWorkshop2SustainabilityStatus({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(s.state).toBe('empty');
    expect(s.materialLineCount).toBe(0);
  });

  it('partial with BOM and registry stub', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      productionModel: {
        version: 1 as const,
        nodes: [],
        materialLines: [
          {
            id: 'm1',
            nodeId: 'n1',
            role: 'shell' as const,
            materialName: 'Хлопок',
            percentage: 100,
            consumption: 1,
          },
        ],
        trimLines: [],
        operations: [],
        measurements: [],
      },
    };
    const s = summarizeWorkshop2SustainabilityStatus({
      dossier,
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(s.state).toBe('partial');
    expect(s.registryStub).toBe(true);
    expect(s.materialLineCount).toBeGreaterThan(0);
  });
});

describe('workshop2 wave13 — #9 matchmaker persist', () => {
  it('empty without dossier result', () => {
    const s = summarizeWorkshop2MatchmakerPersistStatus({ matchmaker: null });
    expect(s.state).toBe('empty');
    expect(s.hasPersistedResult).toBe(false);
  });

  it('ready when persisted', () => {
    const s = summarizeWorkshop2MatchmakerPersistStatus({
      matchmaker: {
        recommendedContractorId: 'c1',
        recommendedLabel: 'Швейный цех',
        confidence: 88,
        syncedAt: new Date().toISOString(),
      },
      genkitConfigured: true,
    });
    expect(s.state).toBe('ready');
    expect(s.hasPersistedResult).toBe(true);
  });
});

describe('workshop2 wave13 — #31 visual references', () => {
  it('blocked without media refs', () => {
    const s = summarizeWorkshop2VisualReferencesStatus(emptyWorkshop2DossierPhase1());
    expect(s.state).toBe('blocked');
    expect(s.readyForVisualGate).toBe(false);
  });
});

describe('workshop2 wave13 — #8 hub activity', () => {
  it('merged when server ids present', () => {
    const entries: Workshop2ActivityEntry[] = [
      { id: 'local-1', at: new Date().toISOString(), line: 'local event' },
      { id: 'srv-1', at: new Date().toISOString(), line: 'pg event' },
    ];
    const s = summarizeWorkshop2HubActivityStatus(entries);
    expect(s.state).toBe('merged');
    expect(s.serverCount).toBe(1);
    expect(s.localCount).toBe(1);
  });
});

describe('workshop2 wave13 — #54 fit sessions', () => {
  it('partial without vault photos', () => {
    const s = summarizeWorkshop2FitSessionsStatus({
      sessions: [
        {
          id: 's1',
          sampleType: 'proto',
          dateStr: '2026-01-01',
          status: 'pending',
          measurementsDelta: {},
          comments: [],
        },
      ],
    });
    expect(s.state).toBe('partial');
    expect(s.withVaultPhotoCount).toBe(0);
  });

  it('ready with vault photo', () => {
    const s = summarizeWorkshop2FitSessionsStatus({
      sessions: [
        {
          id: 's1',
          sampleType: 'proto',
          dateStr: '2026-01-01',
          status: 'approved',
          measurementsDelta: {},
          comments: [],
          photoVaultDocumentId: 'vault-doc-1',
        },
      ],
    });
    expect(s.state).toBe('ready');
    expect(s.withVaultPhotoCount).toBe(1);
  });
});
