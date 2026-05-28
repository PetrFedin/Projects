/** @jest-environment node */

/**
 * Wave S — hub batch development path, gold gate, export fail-closed, nesting 503, PO ERP honesty.
 */

import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { POST as batchPost } from '@/app/api/workshop2/articles/dossiers/batch/route';
import { POST as nestingPost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/nesting/simulate/route';
import {
  buildWorkshop2FileStoreDemoDossier,
  WORKSHOP2_FILE_STORE_DEMO_ARTICLES,
} from '@/lib/production/workshop2-file-store-demo-bootstrap';
import { evaluateWorkshop2FitGoldApprovalGate } from '@/lib/production/workshop2-fit-gold-approval-gate';
import {
  collectWorkshop2DppExportChecks,
  workshop2DppExportBlocked,
} from '@/lib/production/workshop2-dpp-export-checks';
import {
  collectWorkshop2SustainabilityExportChecks,
  workshop2SustainabilityExportBlocked,
} from '@/lib/production/workshop2-sustainability-export-checks';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import type { FitGoldSnapshot } from '@/lib/production/article-workspace/types';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';

jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: jest.fn(() => false),
  getWorkshop2PgPool: jest.fn(),
}));

jest.mock('@/lib/server/workshop2-phase1-dossier-server-store', () => {
  const actual = jest.requireActual('@/lib/server/workshop2-phase1-dossier-server-store');
  return {
    ...actual,
    getWorkshop2ServerDossierStoreMode: jest.fn(() => 'server_file_persist'),
  };
});

jest.mock('@/lib/server/workshop2-dossier-repository', () => ({
  listWorkshop2VaultDocumentsFromPg: jest.fn(async () => []),
}));

jest.mock('@/lib/server/workshop2-sample-order-repository', () => ({
  listWorkshop2SampleOrders: jest.fn(async () => []),
  createWorkshop2SampleOrder: jest.fn(async (input: Record<string, unknown>) => ({
    id: 'so-wave-s-1',
    status: 'draft',
    movementStatus: 'pending',
    movementLog: [],
    createdAt: new Date().toISOString(),
    ...input,
  })),
}));

const W2_HEADERS = {
  'content-type': 'application/json',
  'x-w2-actor-id': 'wave-s',
  'x-w2-actor-label': 'Wave S',
  'x-w2-actor-roles': 'production:edit,production:read',
};

const ROOT = path.join(process.cwd(), 'src/components/brand/production');

describe('workshop2 wave-s must-close', () => {
  beforeEach(() => {
    process.env.WORKSHOP2_TRUST_ACTOR_HEADERS = '1';
    delete process.env.WORKSHOP2_NESTING_API_URL;
    delete process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
  });

  it('file-store bootstrap includes demo-ss27-01/02/03', () => {
    const ids = WORKSHOP2_FILE_STORE_DEMO_ARTICLES.map((a) => a.articleId);
    expect(ids).toEqual(['demo-ss27-01', 'demo-ss27-02', 'demo-ss27-03', 'demo-ss27-04']);
    for (const id of ids) {
      const d = buildWorkshop2FileStoreDemoDossier({ collectionId: 'SS27', articleId: id });
      expect(d?.assignments.length).toBeGreaterThan(0);
    }
  });

  it('hub batch returns developmentPath for demo-ss27-01/02/03', async () => {
    for (const articleId of ['demo-ss27-01', 'demo-ss27-02', 'demo-ss27-03']) {
      await getWorkshop2ServerDossierRecord('SS27', articleId);
    }
    const res = await batchPost(
      new NextRequest('http://localhost/api/workshop2/articles/dossiers/batch', {
        method: 'POST',
        headers: W2_HEADERS,
        body: JSON.stringify({
          items: [
            { collectionId: 'SS27', articleId: 'demo-ss27-01' },
            { collectionId: 'SS27', articleId: 'demo-ss27-02' },
            { collectionId: 'SS27', articleId: 'demo-ss27-03' },
          ],
        }),
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.items).toHaveLength(3);
    for (const row of json.items) {
      expect(row.found).toBe(true);
      expect(row.developmentPath?.labelRu).toMatch(/Critical path/i);
      expect(typeof row.developmentPath?.criticalPathReady).toBe('boolean');
    }
  });

  it('fit gold approval gate returns full checks[] when no sessions', () => {
    const fg: FitGoldSnapshot = {
      goldApproved: false,
      sessions: [],
      fitComments: [],
    };
    const gate = evaluateWorkshop2FitGoldApprovalGate({
      dossier: buildWorkshop2FileStoreDemoDossier({
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
      }),
      fitGold: fg,
      hasActiveSampleOrder: false,
    });
    expect(gate.allowed).toBe(false);
    expect(gate.checks.some((c) => c.id === 'fit.gold.no_sessions')).toBe(true);
    expect(gate.checks.length).toBeGreaterThan(1);
  });

  it('fit panel wires gold gate checks block testids', () => {
    const fit = fs.readFileSync(
      path.join(ROOT, 'workshop2-article-workspace-fit-gold-panel.tsx'),
      'utf8'
    );
    expect(fit).toMatch(/workshop2-fit-gold-gate-checks/);
    expect(fit).toMatch(/evaluateWorkshop2FitGoldApprovalGate/);
  });

  it('DPP export checks block silent download on empty dossier', () => {
    const checks = collectWorkshop2DppExportChecks({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    expect(workshop2DppExportBlocked(checks)).toBe(true);
    expect(checks.length).toBeGreaterThan(0);
  });

  it('DPP panel wires export gate checks UI', () => {
    const dpp = fs.readFileSync(path.join(ROOT, 'Workshop2DppDossierExportBlock.tsx'), 'utf8');
    expect(dpp).toMatch(/workshop2-dpp-export-gate-checks/);
    expect(dpp).toMatch(/collectWorkshop2DppExportChecks/);
  });

  it('Sustainability export fail-closed without BOM', () => {
    const checks = collectWorkshop2SustainabilityExportChecks({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    expect(workshop2SustainabilityExportBlocked(checks)).toBe(true);
  });

  it('nesting simulate returns 503 messageRu in production file mode', async () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    await getWorkshop2ServerDossierRecord('SS27', 'demo-ss27-02');
    const res = await nestingPost(
      new NextRequest(
        'http://localhost/api/workshop2/articles/SS27/demo-ss27-02/nesting/simulate',
        {
          method: 'POST',
          headers: W2_HEADERS,
          body: JSON.stringify({ sampleOrderId: 'so-wave-s-1', nesting: { fabricWidthCm: 150 } }),
        }
      ),
      { params: Promise.resolve({ collectionId: 'SS27', articleId: 'demo-ss27-02' }) }
    );
    process.env.NODE_ENV = prev;
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.messageRu).toMatch(/NESTING_API_URL|production/i);
  });

  it('PO ERP panel sync disabled without configured URL', () => {
    const po = fs.readFileSync(path.join(ROOT, 'Workshop2PurchaseOrdersErpPanel.tsx'), 'utf8');
    expect(po).toMatch(/disabled=\{busy \|\| filtered\.length === 0 \|\| !erpConfigured\}/);
    expect(po).toMatch(/persistErpMirrorToPg/);
  });

  it('nesting panel disables simulate in production without API URL', () => {
    const nest = fs.readFileSync(
      path.join(ROOT, 'workshop2-article-workspace-nesting-panel.tsx'),
      'utf8'
    );
    expect(nest).toMatch(/prodStubDisabled/);
    expect(nest).toMatch(/workshop2-nesting-simulate/);
  });
});
