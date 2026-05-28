/**
 * Wave 7 integration tests (+20 cases).
 */
jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: () => false,
}));

import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  appendWorkshop2FitCommentToDossier,
  evaluateWorkshop2FitCommentsGoldGate,
  isWorkshop2FitCommentsGateEnabled,
  resolveWorkshop2FitCommentInDossier,
  summarizeWorkshop2FitCommentsLog,
} from '@/lib/production/workshop2-fit-comments-log';
import {
  appendWorkshop2VendorBidToDossier,
  compareWorkshop2VendorBidsLowestCmt,
} from '@/lib/production/workshop2-vendor-bids';
import {
  evaluateWorkshop2DynamicSignoffGate,
  normalizeWorkshop2SignoffStages,
  summarizeWorkshop2SignoffStagesProgress,
  WORKSHOP2_DEFAULT_SIGNOFF_STAGES,
} from '@/lib/production/workshop2-signoff-stages-config';
import { persistWorkshop2SignoffStagesProgressMirror } from '@/lib/production/workshop2-signoff-stages-dossier-persist';
import {
  evaluateWorkshop2BulkShowroomPublishForArticle,
  summarizeWorkshop2BulkShowroomPublish,
} from '@/lib/production/workshop2-bulk-showroom-publish';
import {
  buildWorkshop2Ss27UatChecklistResponse,
  parseWorkshop2Ss27UatChecklistMarkdown,
} from '@/lib/production/workshop2-ss27-uat-checklist-api';
import {
  formatWorkshop2InvestorReadinessStagingNoteRu,
  isWorkshop2StagingContractModeEnabled,
  resolveWorkshop2StagingContractProbeStatus,
} from '@/lib/production/workshop2-staging-contract-mode';
import { buildWorkshop2Wave7HorizontalProbes } from '@/lib/production/workshop2-live-integration-probes';
import { buildWorkshop2InvestorReadinessReport } from '@/lib/production/workshop2-investor-readiness';
import { isWorkshop2DomainEventType } from '@/lib/production/workshop2-domain-event-types';
import { evaluateWorkshop2FitGoldApprovalGate } from '@/lib/production/workshop2-fit-gold-approval-gate';
import { evaluateWorkshop2B2bCreditHold } from '@/lib/production/workshop2-b2b-credit-hold';

describe('workshop2 wave7 — fit comments log', () => {
  it('gate disabled by default', () => {
    expect(isWorkshop2FitCommentsGateEnabled({})).toBe(false);
  });

  it('appends comment with pin and vault', () => {
    const d = appendWorkshop2FitCommentToDossier({
      dossier: emptyWorkshop2DossierPhase1(),
      text: 'Укоротить рукав',
      author: 'technologist',
      vaultAttachmentId: 'vault-1',
      pin: { xPct: 42, yPct: 55 },
    });
    expect(d.fitComments).toHaveLength(1);
    expect(d.fitCommentsMirror?.openCount).toBe(1);
  });

  it('blocks gold when gate enabled and open comments', () => {
    process.env.WORKSHOP2_FIT_COMMENTS_GATE = 'true';
    const d = appendWorkshop2FitCommentToDossier({
      dossier: emptyWorkshop2DossierPhase1(),
      text: 'open',
      author: 'a',
    });
    const gate = evaluateWorkshop2FitCommentsGoldGate({ dossier: d });
    expect(gate?.severity).toBe('blocker');
    delete process.env.WORKSHOP2_FIT_COMMENTS_GATE;
  });

  it('resolves comment clears open count', () => {
    let d = appendWorkshop2FitCommentToDossier({
      dossier: emptyWorkshop2DossierPhase1(),
      text: 'fix',
      author: 'a',
      commentId: 'c1',
    });
    d = resolveWorkshop2FitCommentInDossier({ dossier: d, commentId: 'c1', resolvedBy: 'brand' });
    expect(summarizeWorkshop2FitCommentsLog({ dossier: d }).openCount).toBe(0);
  });

  it('registers fit.comment.added domain event type', () => {
    expect(isWorkshop2DomainEventType('fit.comment.added')).toBe(true);
  });

  it('fit gold gate includes fit comments blocker', () => {
    process.env.WORKSHOP2_FIT_COMMENTS_GATE = 'true';
    const d = appendWorkshop2FitCommentToDossier({
      dossier: emptyWorkshop2DossierPhase1(),
      text: 'x',
      author: 'a',
    });
    const gate = evaluateWorkshop2FitGoldApprovalGate({
      dossier: d,
      fitGold: {
        goldApproved: false,
        fitComments: [],
        sessions: [
          {
            id: 's1',
            sampleType: 'proto',
            status: 'approved',
            dateStr: '2026-05-01',
            measurementsDelta: {},
            comments: [],
          },
        ],
      },
      hasActiveSampleOrder: true,
    });
    expect(gate.checks.some((c) => c.id === 'fit.comments.open')).toBe(true);
    delete process.env.WORKSHOP2_FIT_COMMENTS_GATE;
  });
});

describe('workshop2 wave7 — staging contract central', () => {
  it('detects staging contract mode', () => {
    expect(isWorkshop2StagingContractModeEnabled({ WORKSHOP2_STAGING_CONTRACT_MODE: 'true' })).toBe(
      true
    );
  });

  it('stagingOk for localhost ceiling URL', () => {
    const s = resolveWorkshop2StagingContractProbeStatus({
      configured: true,
      env: {
        WORKSHOP2_STAGING_CONTRACT_MODE: 'true',
        WORKSHOP2_FACTORY_ERP_BASE_URL: 'http://127.0.0.1:18766',
      },
      envKeys: ['WORKSHOP2_FACTORY_ERP_BASE_URL'],
    });
    expect(s.stagingOk).toBe(true);
    expect(s.modeLabelRu).toBe('staging');
  });

  it('investor readiness staging note honest', () => {
    const note = formatWorkshop2InvestorReadinessStagingNoteRu({
      WORKSHOP2_STAGING_CONTRACT_MODE: 'true',
    });
    expect(note).toMatch(/staging/i);
    expect(note).toMatch(/не production/i);
  });

  it('investor report exposes stagingMode fields', () => {
    const r = buildWorkshop2InvestorReadinessReport({
      env: { WORKSHOP2_STAGING_CONTRACT_MODE: 'true', WORKSHOP2_UNIT_TESTS_PASSING: 'true' },
    });
    expect(r.stagingMode).toBe(true);
    expect(r.stagingNoteRu).toBeTruthy();
  });
});

describe('workshop2 wave7 — vendor bids PG mirror', () => {
  it('picks lowest CMT bid', () => {
    const lowest = compareWorkshop2VendorBidsLowestCmt([
      {
        id: '1',
        vendorId: 'a',
        vendorName: 'A',
        cmtPrice: 12,
        currency: 'RUB',
        leadTimeDays: 10,
        moq: 100,
        status: 'pending',
        submittedAt: 'x',
      },
      {
        id: '2',
        vendorId: 'b',
        vendorName: 'B',
        cmtPrice: 9,
        currency: 'RUB',
        leadTimeDays: 10,
        moq: 100,
        status: 'pending',
        submittedAt: 'x',
      },
    ]);
    expect(lowest?.vendorId).toBe('b');
  });

  it('persists vendorBidsMirror on append', () => {
    const { dossier } = appendWorkshop2VendorBidToDossier({
      dossier: emptyWorkshop2DossierPhase1(),
      bid: {
        vendorId: 'v1',
        vendorName: 'Fab',
        cmtPrice: 100,
        currency: 'RUB',
        leadTimeDays: 14,
        moq: 50,
      },
    });
    expect(dossier.vendorBidsMirror?.bidCount).toBe(1);
  });

  it('registers supply.vendor_bid.received event', () => {
    expect(isWorkshop2DomainEventType('supply.vendor_bid.received')).toBe(true);
  });
});

describe('workshop2 wave7 — signoff stages', () => {
  it('default stages include tz_core + assignment', () => {
    expect(normalizeWorkshop2SignoffStages(null).length).toBeGreaterThanOrEqual(2);
  });

  it('progress blocked on empty dossier', () => {
    const p = summarizeWorkshop2SignoffStagesProgress({
      dossier: emptyWorkshop2DossierPhase1(),
      stages: WORKSHOP2_DEFAULT_SIGNOFF_STAGES,
    });
    expect(p.stagesComplete).toBeLessThan(p.stagesTotal);
  });

  it('dynamic gate returns blocker when incomplete', () => {
    const gate = evaluateWorkshop2DynamicSignoffGate({
      dossier: emptyWorkshop2DossierPhase1(),
      stages: WORKSHOP2_DEFAULT_SIGNOFF_STAGES,
    });
    expect(gate?.id).toBe('signoff.stages.incomplete');
  });

  it('persist signoff progress mirror', () => {
    const d = persistWorkshop2SignoffStagesProgressMirror({
      dossier: emptyWorkshop2DossierPhase1(),
      stages: WORKSHOP2_DEFAULT_SIGNOFF_STAGES,
    });
    expect(d.signoffStagesProgressMirror?.blockerHandoff).toBe(true);
  });
});

describe('workshop2 wave7 — bulk showroom publish', () => {
  it('blocks without b2b prices', () => {
    const r = evaluateWorkshop2BulkShowroomPublishForArticle({
      articleId: 'a1',
      dossier: emptyWorkshop2DossierPhase1(),
      publish: { published: true },
    });
    expect(r.passed).toBe(false);
    expect(r.reasons.length).toBeGreaterThan(0);
  });

  it('passes with valid b2bIntegrationDraft', () => {
    const d = {
      ...emptyWorkshop2DossierPhase1(),
      b2bIntegrationDraft: {
        wholesalePrice: '100',
        msrp: '199',
        moq: '12',
        startDate: '2026-06-01',
        endDate: '2026-08-01',
      },
    };
    const r = evaluateWorkshop2BulkShowroomPublishForArticle({
      articleId: 'a1',
      dossier: d,
      publish: { published: true },
    });
    expect(r.passed).toBe(true);
  });

  it('summarize bulk publish counts', () => {
    const s = summarizeWorkshop2BulkShowroomPublish({
      collectionId: 'SS27',
      results: [
        { articleId: 'a', passed: true, reasons: [] },
        { articleId: 'b', passed: false, reasons: ['x'] },
      ],
    });
    expect(s.passed).toBe(1);
    expect(s.blocked).toHaveLength(1);
  });
});

describe('workshop2 wave7 — UAT checklist API', () => {
  it('parses markdown checklist rows', () => {
    const md = `| 1 | Hub load | H0 | ok | ✅ |
| 2 | Workspace | A1 | ok | ✅ |`;
    const items = parseWorkshop2Ss27UatChecklistMarkdown(md);
    expect(items.length).toBe(2);
  });

  it('builds checklist response shape', () => {
    const r = buildWorkshop2Ss27UatChecklistResponse({ dossiers: [] });
    expect(r.collectionId).toBe('SS27');
    expect(Array.isArray(r.items)).toBe(true);
  });
});

describe('workshop2 wave7 — wave7Horizontal probes', () => {
  it('exposes teams webhook and fit comments gate flags', () => {
    process.env.WORKSHOP2_TEAMS_WEBHOOK_URL = 'https://outlook.office.com/webhook/test';
    process.env.WORKSHOP2_FIT_COMMENTS_GATE = 'true';
    const probes = buildWorkshop2Wave7HorizontalProbes();
    expect(probes.teamsWebhook.configured).toBe(true);
    expect(probes.fitCommentsGate.enabled).toBe(true);
    expect(probes.ss27UatChecklistApi.path).toContain('ss27-checklist');
    delete process.env.WORKSHOP2_TEAMS_WEBHOOK_URL;
    delete process.env.WORKSHOP2_FIT_COMMENTS_GATE;
  });

  it('stagingContractCentral follows env', () => {
    process.env.WORKSHOP2_STAGING_CONTRACT_MODE = 'true';
    expect(buildWorkshop2Wave7HorizontalProbes().stagingContractCentral.enabled).toBe(true);
    delete process.env.WORKSHOP2_STAGING_CONTRACT_MODE;
  });
});

describe('workshop2 wave7 — B2B credit territories hook', () => {
  it('credit hold still works with demo accounts', () => {
    process.env.WORKSHOP2_B2B_CREDIT_HOLD = 'true';
    const r = evaluateWorkshop2B2bCreditHold({ territoryId: 'RU-MOW', orderTotalRub: 200_000 });
    expect(r.allowed).toBe(false);
    delete process.env.WORKSHOP2_B2B_CREDIT_HOLD;
  });
});
