/** @jest-environment node */

/**
 * Wave Y — catalog #21–40 wire, #41–60 gate spot-check, migration 009 parse,
 * hub SS27 filter, workspace backend banner dedup, bootstrap script, smoke note.
 */

import fs from 'fs';
import path from 'path';
import { initialOrderItems } from '@/lib/order-data';
import {
  verifyWorkshop2CatalogItems21To40Wire,
  WORKSHOP2_CATALOG_ITEMS_21_40_WIRE,
} from '@/lib/production/workshop2-catalog-items-21-40-wire';
import {
  shouldShowWorkshop2WorkspaceBackendBanner,
  shouldSuppressWorkshop2WorkspacePgPersistHint,
} from '@/lib/production/workshop2-workspace-backend-banner-policy';
import {
  WORKSHOP2_HUB_ARTICLE_FILTER_ALL,
  filterWorkshop2HubEntries,
} from '@/lib/production/workshop2-hub-filter';
import { WORKSHOP2_FILE_STORE_DEMO_ARTICLES } from '@/lib/production/workshop2-file-store-demo-bootstrap';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';
import { evaluateWorkshop2ShowroomPublishGate } from '@/lib/production/workshop2-showroom-publish-gate';
import { buildWorkshop2FileStoreDemoDossier } from '@/lib/production/workshop2-file-store-demo-bootstrap';

const ROOT = process.cwd();
const W2_COMPONENTS = path.join(ROOT, 'src/components/brand/production');

function readTest(relFromSrc: string): string {
  return fs.readFileSync(path.join(ROOT, 'src', relFromSrc), 'utf8');
}

describe('workshop2 wave-y must-close', () => {
  it('catalog items #21–40 have API + UI wire (no gaps)', () => {
    expect(WORKSHOP2_CATALOG_ITEMS_21_40_WIRE).toHaveLength(20);
    const gaps = verifyWorkshop2CatalogItems21To40Wire();
    expect(gaps).toEqual([]);
  });

  it('hub SS27 search keeps demo articles 01–04 visible', () => {
    const ss27Rows = initialOrderItems.filter((row) => row.season === 'SS27');
    expect(ss27Rows.map((r) => r.id)).toEqual([
      'demo-ss27-01',
      'demo-ss27-02',
      'demo-ss27-03',
      'demo-ss27-04',
    ]);
    const entries = ss27Rows.map((row) => ({
      collectionId: 'SS27',
      collectionName: 'SS27',
      row: {
        id: row.id,
        sku: row.sku,
        name: row.name,
        season: row.season,
        workshopTags: ['SS27'],
      },
    }));
    const filtered = filterWorkshop2HubEntries(entries, {
      search: 'SS27',
      tagFilter: new Set(),
      articleFilter: WORKSHOP2_HUB_ARTICLE_FILTER_ALL,
      catL1: '',
      catL2: '',
      catL3: '',
    });
    expect(filtered.map((e) => e.row.id)).toEqual([
      'demo-ss27-01',
      'demo-ss27-02',
      'demo-ss27-03',
      'demo-ss27-04',
    ]);
  });

  it('migration 009 WMS SQL parses (tables + indexes + movement kind check)', () => {
    const sql = fs.readFileSync(
      path.join(ROOT, 'db/migrations/009_workshop2_internal_wms.sql'),
      'utf8'
    );
    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS workshop2_wms_items/i);
    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS workshop2_wms_balances/i);
    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS workshop2_wms_movements/i);
    expect(sql).toMatch(/kind IN \('reserve', 'release', 'receipt', 'issue'\)/);
    expect(sql).not.toMatch(/;\s*;/);
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
    expect(statements.length).toBeGreaterThanOrEqual(6);
  });

  it('workspace backend banner policy — single banner, no persist footer dup', () => {
    expect(shouldShowWorkshop2WorkspaceBackendBanner('pg_disabled')).toBe(true);
    expect(shouldShowWorkshop2WorkspaceBackendBanner('offline')).toBe(true);
    expect(shouldShowWorkshop2WorkspaceBackendBanner('server')).toBe(false);
    expect(shouldSuppressWorkshop2WorkspacePgPersistHint('pg_disabled')).toBe(true);
    const articlePage = readTest(
      'app/brand/production/workshop2/(w2-enterprise)/c/[collectionId]/a/[articleId]/page.tsx'
    );
    expect(articlePage).toMatch(/Workshop2BackendStatusBanner/);
    expect(articlePage).toMatch(/workshop2-workspace-backend-banner/);
    const persist = fs.readFileSync(
      path.join(W2_COMPONENTS, 'use-workshop2-phase1-dossier-persist.ts'),
      'utf8'
    );
    expect(persist).toMatch(/filePersistOnly\s*\?\s*null/);
  });

  it('catalog #41–60 gates — handoff, ERP, nesting, B2B covered in wave/critical suites', () => {
    const waveSuites = [
      'workshop2-wave-s-must-close.test.ts',
      'workshop2-wave-t-must-close.test.ts',
      'workshop2-wave-w-must-close.test.ts',
      'workshop2-wave-x-must-close.test.ts',
      'workshop2-critical-path-file-store.test.ts',
      'workshop2-wave18-functional.test.ts',
      'workshop2-wave24-functional.test.ts',
      'workshop2-wave26-functional.test.ts',
      'workshop2-wave31-functional.test.ts',
      'workshop2-wave34-strict-improvement.test.ts',
      'workshop2-wave35-strict-improvement.test.ts',
    ];
    const combined = waveSuites
      .map((f) => fs.readFileSync(path.join(ROOT, 'src/lib/production/__tests__', f), 'utf8'))
      .join('\n');
    for (const needle of [
      'evaluateWorkshop2FactoryHandoffCommitGate',
      'handoff-readiness',
      'nesting',
      'evaluateWorkshop2ShowroomPublishGate',
      'Workshop2PurchaseOrdersErpPanel',
      'purchase-order-erp-dossier-persist',
      'workshop2-showroom-publish-gate',
    ]) {
      expect(combined).toMatch(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
    const handoffGate = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier: buildWorkshop2FileStoreDemoDossier({
        collectionId: 'SS27',
        articleId: 'demo-ss27-02',
      })!,
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
    });
    expect(handoffGate.allowed).toBe(false);
    const b2bGate = evaluateWorkshop2ShowroomPublishGate({
      published: true,
      wholesalePrice: 0,
      msrp: 0,
      moq: 0,
    });
    expect(b2bGate.allowed).toBe(false);
  });

  it('pg-bootstrap script detects OrbStack socket path + native PG hint', () => {
    const sh = fs.readFileSync(path.join(ROOT, 'scripts/workshop2-pg-bootstrap.sh'), 'utf8');
    expect(sh).toMatch(/ORBSTACK_SOCK/);
    expect(sh).toMatch(/\.orbstack\/run\/docker\.sock/);
    expect(sh).toMatch(/brew install orbstack/);
    expect(sh).toMatch(/postgres_ready_native/);
    expect(sh).toMatch(/Native PostgreSQL detected/);
    expect(sh).toMatch(/exit 1/);
  });

  it('file-store demo catalog lists 01–04 for hub UAT', () => {
    expect(WORKSHOP2_FILE_STORE_DEMO_ARTICLES.map((a) => a.articleId)).toEqual([
      'demo-ss27-01',
      'demo-ss27-02',
      'demo-ss27-03',
      'demo-ss27-04',
    ]);
  });

  it('hub FlatHub dedups pg_disabled drift banner (BackendStatusBanner owns PG off)', () => {
    const hub = fs.readFileSync(path.join(W2_COMPONENTS, 'Workshop2ArticleFlatHub.tsx'), 'utf8');
    expect(hub).toMatch(/backendStatus === 'pg_disabled' \|\| backendStatus === 'offline'/);
  });
});
