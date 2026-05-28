/**
 * Wave 25 — push ≥9.0: form mirror, pulse/grading handoff, CR, lab dip, docs index.
 */
import fs from 'node:fs';
import path from 'node:path';

import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { summarizeWorkshop2ReleaseRoutingPanelDisplay } from '@/lib/production/workshop2-release-routing-status';
import { assembleWorkshop2ArticleFromTaxonomy } from '@/lib/production/workshop2-article-assembler';
import { findHandbookLeafById } from '@/lib/production/category-catalog';
import {
  evaluateWorkshop2ArticleFormMirrorSampleGate,
  persistWorkshop2ArticleFormMirrorToDossier,
} from '@/lib/production/workshop2-article-form-dossier-persist';
import {
  evaluateWorkshop2ChangeRequestMirrorGate,
  persistWorkshop2ChangeRequestMirrorToDossier,
} from '@/lib/production/workshop2-change-request-dossier-persist';
import {
  evaluateWorkshop2LabDipMirrorGate,
  persistWorkshop2LabDipMirrorToDossier,
} from '@/lib/production/workshop2-lab-dip-dossier-persist';
import {
  evaluateWorkshop2DocumentsIndexExportGate,
  persistWorkshop2DocumentsIndexMirrorToDossier,
} from '@/lib/production/workshop2-documents-index-dossier-persist';
import {
  evaluateWorkshop2GradingApplyHandoffGate,
  evaluateWorkshop2GradingApplyExportGate,
  persistWorkshop2GradingApplyMirrorToDossier,
} from '@/lib/production/workshop2-grading-apply-dossier-persist';
import {
  evaluateWorkshop2ReadinessPulseHandoffGate,
  evaluateWorkshop2ReadinessPulseSampleGate,
  persistWorkshop2ReadinessPulseMirrorToDossier,
} from '@/lib/production/workshop2-readiness-pulse-dossier-persist';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2TzExportBundleGate } from '@/lib/production/workshop2-tz-export-bundle-gate';
import { getWorkshop2ReadinessSnapshot } from '@/lib/production/workshop2-readiness-snapshot';

const COAT_LEAF = 'catalog-apparel-g0-l0';
const COLLECTION = 'c-wave25';
const ARTICLE_SEG = 'sku-wave25';
const W2_COMPONENTS = path.join(process.cwd(), 'src/components/brand/production');

describe('workshop2 wave25 — release routing PG chip (UI contract)', () => {
  it('panel status banners expose release-routing-pg-chip testid', () => {
    const src = fs.readFileSync(
      path.join(W2_COMPONENTS, 'workshop2-panel-status-banners.tsx'),
      'utf8'
    );
    expect(src).toMatch(/data-testid="release-routing-pg-chip"/);
  });

  it('summarize downgrades ready without PG mirror (ERP/routing honesty)', () => {
    const live = summarizeWorkshop2ReleaseRoutingPanelDisplay({
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        smartRoutingSequence: [
          { id: '1', category: 'Монтаж', name: 'Шов', equipment: 'M', sash: 1 },
        ],
      },
      release: {
        operations: [{ id: 'op-1', name: 'Шов', sash: 1, costPerUnit: 10, status: 'pending' }],
      },
    });
    expect(live.mirrorInPg).toBe(false);
    expect(live.state).not.toBe('ready');
    expect(live.hintRu).toMatch(/PG|mirror/i);
  });
});

describe('workshop2 wave25 — #11 article form mirror → sample-order', () => {
  it('integration: assemble writes articleFormMirror ready', () => {
    const built = assembleWorkshop2ArticleFromTaxonomy({
      audienceId: 'men',
      categoryLeafId: COAT_LEAF,
      sku: 'W25-SKU',
      formReadiness: {
        state: 'ready',
        canSubmit: true,
        errorCount: 0,
        warningCount: 0,
      },
    });
    expect(built?.dossier.articleFormMirror?.formState).toBe('ready');
    expect(evaluateWorkshop2ArticleFormMirrorSampleGate(built!.dossier)).toBeNull();
  });

  it('integration: blocked form mirror blocks sample-order', () => {
    const dossier = persistWorkshop2ArticleFormMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      readiness: {
        state: 'blocked',
        canSubmit: false,
        errorCount: 2,
        warningCount: 0,
        hintRu: 'SKU занят',
      },
      sku: 'DUPE',
      categoryLeafId: COAT_LEAF,
    });
    expect(evaluateWorkshop2ArticleFormMirrorSampleGate(dossier)?.id).toBe(
      'article.form.not_ready'
    );
    const gate = evaluateWorkshop2SampleOrderGate({ dossier, categoryLeafId: COAT_LEAF });
    expect(gate.readiness.checks.some((c) => c.id === 'article.form.not_ready')).toBe(true);
  });
});

describe('workshop2 wave25 — #17 pulse mirror → handoff-commit (2nd layer)', () => {
  it('integration: warns handoff when pulse mirror missing', () => {
    expect(evaluateWorkshop2ReadinessPulseHandoffGate(emptyWorkshop2DossierPhase1())?.id).toBe(
      'readiness.pulse.mirror_missing'
    );
  });

  it('integration: misaligned pulse mirror blocks handoff-commit', () => {
    const snapshot = getWorkshop2ReadinessSnapshot({
      dossier: emptyWorkshop2DossierPhase1(),
      leaf: findHandbookLeafById(COAT_LEAF),
    });
    const dossier = persistWorkshop2ReadinessPulseMirrorToDossier(
      emptyWorkshop2DossierPhase1(),
      snapshot
    );
    const forced = {
      ...dossier,
      readinessPulseMirror: {
        mirroredAt: new Date().toISOString(),
        tzOverallPct: 90,
        preflightScore: 10,
        scoreGap: 80,
        preflightBlockerCount: 2,
        canSendToFactory: false,
        pulseState: 'at_risk' as const,
        blockerSampleOrder: true,
        hintRu: 'test blocker',
      },
    };
    expect(evaluateWorkshop2ReadinessPulseSampleGate(forced)?.severity).toBe('blocker');
    expect(evaluateWorkshop2ReadinessPulseHandoffGate(forced)?.id).toBe(
      'readiness.pulse.misaligned'
    );
    const commit = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier: forced,
      categoryLeafId: COAT_LEAF,
      vaultFileCount: 2,
    });
    expect(commit.readiness.checks.some((c) => c.id === 'readiness.pulse.misaligned')).toBe(true);
  });
});

describe('workshop2 wave25 — #39 grading mirror → handoff-commit (2nd layer)', () => {
  it('integration: handoff warns when grading mirror missing', () => {
    const check = evaluateWorkshop2GradingApplyHandoffGate(emptyWorkshop2DossierPhase1());
    expect(check?.id).toBe('grading.apply.mirror_missing');
  });

  it('integration: scale without apply blocks export and handoff', () => {
    const dossier = persistWorkshop2GradingApplyMirrorToDossier({
      ...emptyWorkshop2DossierPhase1(),
      sampleSizeScaleId: 'men-apparel-eu',
      gradingRules: [],
    });
    expect(evaluateWorkshop2GradingApplyExportGate(dossier)?.id).toBe('grading.apply.missing');
    expect(evaluateWorkshop2GradingApplyHandoffGate(dossier)?.id).toBe('grading.apply.missing');
    const exportGate = evaluateWorkshop2TzExportBundleGate({
      dossier,
      categoryLeafId: COAT_LEAF,
    });
    expect(exportGate.checks.some((c) => c.id === 'grading.apply.missing')).toBe(true);
  });
});

describe('workshop2 wave25 — #28 change request mirror → sample-order', () => {
  it('integration: mirror blocks when pending CR', () => {
    const dossier = persistWorkshop2ChangeRequestMirrorToDossier({
      ...emptyWorkshop2DossierPhase1(),
      changeRequests: [
        {
          id: 'cr-w25',
          description: 'Укоротить рукав',
          status: 'pending',
          requestedAt: '2026-05-19T10:00:00.000Z',
        },
      ],
    });
    expect(dossier.changeRequestMirror?.pendingCount).toBe(1);
    expect(evaluateWorkshop2ChangeRequestMirrorGate(dossier)?.id).toBe('change_requests.pending');
    const gate = evaluateWorkshop2SampleOrderGate({ dossier, categoryLeafId: COAT_LEAF });
    expect(gate.readiness.checks.some((c) => c.id === 'change_requests.pending')).toBe(true);
  });

  it('fallback: live pending when mirror absent', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      changeRequests: [
        {
          id: 'cr-live',
          description: 'Test',
          status: 'pending' as const,
          requestedAt: '2026-05-19T10:00:00.000Z',
        },
      ],
    };
    expect(evaluateWorkshop2ChangeRequestMirrorGate(dossier)?.id).toBe('change_requests.pending');
  });
});

describe('workshop2 wave25 — #52 lab dip mirror → sample-order', () => {
  it('integration: mirror blocks when colorway pending approval', () => {
    const base = {
      ...emptyWorkshop2DossierPhase1(),
      assignments: [
        {
          assignmentId: 'a-color',
          kind: 'canonical' as const,
          attributeId: 'color',
          values: [
            {
              valueId: 'v1',
              valueSource: 'free_text' as const,
              text: 'Navy',
              displayLabel: 'Navy',
            },
          ],
        },
      ],
      colorLabDipStatuses: { NAV: 'pending' as const },
    };
    const dossier = persistWorkshop2LabDipMirrorToDossier(base);
    expect(dossier.labDipMirror?.blockerSampleOrder).toBe(true);
    expect(evaluateWorkshop2LabDipMirrorGate(dossier)?.id).toBe('supply.lab_dip.not_approved');
    const gate = evaluateWorkshop2SampleOrderGate({ dossier, categoryLeafId: COAT_LEAF });
    expect(gate.readiness.checks.some((c) => c.id === 'supply.lab_dip.not_approved')).toBe(true);
  });
});

describe('workshop2 wave25 — #77 documents index mirror → export-tz', () => {
  it('integration: warns export when index empty in mirror', () => {
    const dossier = persistWorkshop2DocumentsIndexMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      collectionId: COLLECTION,
      articleUrlSegment: ARTICLE_SEG,
      backendMode: 'local',
    });
    expect(dossier.documentsIndexMirror?.state).toBe('empty');
    expect(evaluateWorkshop2DocumentsIndexExportGate(dossier)?.id).toBe('documents.index.empty');
    const exportGate = evaluateWorkshop2TzExportBundleGate({
      dossier,
      categoryLeafId: COAT_LEAF,
    });
    expect(exportGate.checks.some((c) => c.id === 'documents.index.empty')).toBe(true);
  });

  it('integration: vault with storage_path clears partial warning', () => {
    const dossier = persistWorkshop2DocumentsIndexMirrorToDossier(
      {
        ...emptyWorkshop2DossierPhase1(),
        vaultDocuments: [
          {
            id: 'd1',
            type: 'contract',
            title: 'Contract',
            uploadedAt: '2026-05-01',
            storagePath: 's3://a',
          },
        ],
      },
      {
        collectionId: COLLECTION,
        articleUrlSegment: ARTICLE_SEG,
        backendMode: 'server',
      }
    );
    expect(dossier.documentsIndexMirror?.vaultIndexedCount).toBe(1);
    expect(evaluateWorkshop2DocumentsIndexExportGate(dossier)).toBeNull();
  });
});
