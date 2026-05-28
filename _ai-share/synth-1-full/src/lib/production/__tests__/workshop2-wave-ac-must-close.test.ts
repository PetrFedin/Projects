/** @jest-environment node */

/**
 * Wave AC — PG retry blocked path: dev:workshop2, file-store sample-order seed,
 * Playwright reliability contract, chunk boundary MODULE_NOT_FOUND guard.
 */
import fs from 'fs';
import path from 'path';
import {
  listWorkshop2SampleOrders,
  clearWorkshop2SampleOrdersMemoryForTests,
} from '@/lib/server/workshop2-sample-order-repository';
import {
  WORKSHOP2_FILE_STORE_DEMO_SAMPLE_ORDER_ID,
  buildWorkshop2FileStoreDemoSampleOrder,
} from '@/lib/server/workshop2-file-store-sample-order-bootstrap';
import { workshop2MobileInspectorHref } from '@/lib/production/workshop2-mobile-inspector-checklist';

jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: () => false,
  getWorkshop2PgPool: () => {
    throw new Error('PG off in wave-ac test');
  },
}));

describe('workshop2-wave-ac-must-close', () => {
  beforeEach(() => {
    clearWorkshop2SampleOrdersMemoryForTests();
  });

  it('file-store demo-ss27-01 auto-seeds stable sample-order for inspector route', async () => {
    const built = buildWorkshop2FileStoreDemoSampleOrder({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    expect(built?.id).toBe(WORKSHOP2_FILE_STORE_DEMO_SAMPLE_ORDER_ID);

    const href = workshop2MobileInspectorHref({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      orderId: WORKSHOP2_FILE_STORE_DEMO_SAMPLE_ORDER_ID,
    });
    expect(href).toMatch(/\/inspector\//);
    expect(href).toMatch(/file-store-demo-ss27-01-sample-order/);
  });

  it('listWorkshop2SampleOrders seeds demo order when memory empty (PG off)', async () => {
    const orders = await listWorkshop2SampleOrders({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    expect(orders).toHaveLength(1);
    expect(orders[0]?.id).toBe(WORKSHOP2_FILE_STORE_DEMO_SAMPLE_ORDER_ID);
  });

  it('dev:workshop2 script sets PG_ONLY + loads .env.local', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    expect(pkg.scripts['dev:workshop2']).toMatch(/dev-workshop2\.sh/);

    const sh = fs.readFileSync(path.join(process.cwd(), 'scripts/dev-workshop2.sh'), 'utf8');
    expect(sh).toMatch(/NEXT_PUBLIC_WORKSHOP2_PG_ONLY/);
    expect(sh).toMatch(/WORKSHOP2_DATABASE_URL/);
    expect(sh).toMatch(/\.env\.local/);
    expect(sh).toMatch(/exec next dev/);
  });

  it('playwright SS27 spec documents rm -rf .next + stable baseURL helpers', () => {
    const spec = fs.readFileSync(path.join(process.cwd(), 'e2e/workshop2-ss27.spec.ts'), 'utf8');
    expect(spec).toMatch(/rm -rf \.next/);
    expect(spec).toMatch(/PLAYWRIGHT_BASE_URL/);
    expect(spec).toMatch(/waitForDossierLoaded|gotoArticleWorkspace/);
    expect(spec).toMatch(/file-store \(no PG\)/);
  });

  it('dev:e2e clears full .next when E2E_CLEAR_CACHE=1', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    expect(pkg.scripts['dev:e2e']).toMatch(/rm -rf \.next/);

    const pw = fs.readFileSync(path.join(process.cwd(), 'playwright.config.ts'), 'utf8');
    expect(pw).toMatch(/E2E_CLEAR_CACHE=1/);
  });

  it('tab chunk boundary catches MODULE_NOT_FOUND (Wave N/W + AC)', () => {
    const boundary = fs.readFileSync(
      path.join(
        process.cwd(),
        'src/components/brand/production/workshop2-tab-panel-chunk-boundary.tsx'
      ),
      'utf8'
    );
    expect(boundary).toMatch(/cannot find module/i);
    expect(boundary).toMatch(/Workshop2TabPanelChunkBoundary/);
  });

  it('pg preflight script exists for user retry path', () => {
    const preflight = fs.readFileSync(
      path.join(process.cwd(), 'scripts/workshop2-pg-preflight.sh'),
      'utf8'
    );
    expect(preflight).toMatch(/5433/);
    expect(preflight).toMatch(/workshop2-pg-bootstrap/);
  });
});
