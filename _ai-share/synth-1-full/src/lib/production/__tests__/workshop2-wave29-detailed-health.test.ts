/**
 * Wave 29 — детальный второй проход: module health P0 fixes (+25 tests).
 */
import fs from 'node:fs';
import path from 'node:path';

import { mapBrandPgThreadsToChats } from '@/lib/brand/brand-messages-pg-threads';
import { buildWorkshop2RepAppointmentsFromOrders } from '@/lib/production/workshop2-rep-appointments';
import { summarizeWorkshop2DossierConflictFieldsRu } from '@/lib/production/workshop2-dossier-conflict-fields';
import { buildWorkshop2W2secDeepLink } from '@/lib/production/workshop2-preflight-anchor-map';
import { resolveWorkshop2PurchaseOrderErpDisplayStatus } from '@/lib/production/workshop2-purchase-order-erp-display';
import { sumWorkshop2B2bMatrixTotalRub } from '@/lib/production/workshop2-b2b-campaign-hub';
import { searchWorkshop2VaultDocuments } from '@/lib/production/workshop2-vault-search';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { buildWorkshop2Wave29ModuleHealthProbe } from '@/lib/production/workshop2-live-integration-probes';
import type { Workshop2B2bOrderRecord } from '@/lib/production/workshop2-b2b-order-lifecycle';

const ROOT = process.cwd();

function readSrc(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

describe('wave29 — rep appointments from orders', () => {
  it('builds appointments from B2B orders', () => {
    const orders: Workshop2B2bOrderRecord[] = [
      {
        id: 'B2B-1',
        status: 'submitted',
        tier: 'standard',
        totalRub: 10000,
        lines: [],
        repId: 'rep-anna',
        buyerId: 'buyer-1',
        requestedDeliveryDate: '2026-06-01T10:00:00.000Z',
        createdAt: '2026-05-01T10:00:00.000Z',
        updatedAt: '2026-05-01T10:00:00.000Z',
      },
    ];
    const appts = buildWorkshop2RepAppointmentsFromOrders(orders, 'rep-anna');
    expect(appts).toHaveLength(1);
    expect(appts[0]?.type).toBe('showroom');
    expect(appts[0]?.href).toContain('B2B-1');
  });

  it('sales-rep-portal loads appointments API not MOCK', () => {
    const src = readSrc('src/app/shop/b2b/sales-rep-portal/page.tsx');
    expect(src).not.toMatch(/MOCK_APPOINTMENTS/);
    expect(src).toMatch(/\/api\/shop\/b2b\/rep\/appointments/);
  });

  it('rep appointments route exists', () => {
    expect(fs.existsSync(path.join(ROOT, 'src/app/api/shop/b2b/rep/appointments/route.ts'))).toBe(
      true
    );
  });
});

describe('wave29 — sketch Genkit honest banner', () => {
  it('sketch panel uses honest banner', () => {
    const src = readSrc(
      'src/components/brand/production/category-sketch-annotator-editor-sketch-file-panel.tsx'
    );
    expect(src).toMatch(/Workshop2SketchGenkitHonestBanner/);
    expect(src).not.toMatch(/disabled=\{true\}.*Генерация/);
  });

  it('banner links to setup genkit', () => {
    const src = readSrc('src/components/brand/production/Workshop2SketchGenkitHonestBanner.tsx');
    expect(src).toMatch(/Требует Genkit|Genkit/);
    expect(src).toMatch(/\/brand\/production\/workshop2\/setup/);
  });
});

describe('wave29 — linesheets matrix ₽', () => {
  it('sumWorkshop2B2bMatrixTotalRub sums cells', () => {
    const total = sumWorkshop2B2bMatrixTotalRub({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      currency: 'RUB',
      sizes: ['M'],
      colorways: [{ code: 'BLK', label: 'Black' }],
      cells: [
        {
          colorCode: 'BLK',
          colorLabel: 'Black',
          size: 'M',
          moq: 10,
          wholesalePriceRub: 5000,
          qty: 0,
        },
      ],
    });
    expect(total).toBe(50000);
  });

  it('linesheets page uses sumWorkshop2B2bMatrixTotalRub', () => {
    const src = readSrc('src/app/brand/b2b/linesheets/page.tsx');
    expect(src).toMatch(/sumWorkshop2B2bMatrixTotalRub/);
  });
});

describe('wave29 — B2B cart validation + thumbnail', () => {
  it('checkout rejects missing articleId fallback demo', () => {
    const src = readSrc('src/app/shop/b2b/checkout/page.tsx');
    expect(src).not.toMatch(/demo-ss27-01/);
    expect(src).toMatch(/missing_article_id/);
  });

  it('cart lines attach heroImageUrl', () => {
    const src = readSrc('src/app/api/shop/b2b/cart/lines/route.ts');
    expect(src).toMatch(/heroImageUrl/);
    expect(src).toMatch(/buildWorkshop2B2bCampaign/);
  });
});

describe('wave29 — showroom tier from invite', () => {
  it('resolveB2bBuyerTierFromSession reads cookie key', () => {
    const src = readSrc('src/lib/b2b/resolve-b2b-buyer-tier.ts');
    expect(src).toMatch(/b2b_partner_tier/);
  });

  it('showroom uses session tier on mount', () => {
    const src = readSrc('src/app/shop/b2b/showroom/page.tsx');
    expect(src).toMatch(/resolveB2bBuyerTierFromSession/);
  });
});

describe('wave29 — brand messages merge b2b_order', () => {
  it('maps b2b_order thread with RU label', () => {
    const chats = mapBrandPgThreadsToChats([
      {
        contextType: 'b2b_order',
        contextId: 'B2B-SS27-001',
        lastMessageAt: '2026-05-26T10:00:00.000Z',
        lastMessagePreview: 'Подтвердите MOQ',
        messageCount: 2,
      },
    ]);
    expect(chats[0]?.title).toContain('B2B заказ');
    expect(chats[0]?.type).toBe('b2b');
  });

  it('threads API merges both context types', () => {
    const src = readSrc('src/app/api/brand/messages/threads/route.ts');
    expect(src).toMatch(/WORKSHOP2_B2B_ORDER_CONTEXT_TYPE/);
    expect(src).toMatch(/WORKSHOP2_ARTICLE_CONTEXT_TYPE/);
  });
});

describe('wave29 — calendar overdue + links', () => {
  it('TNA board marks overdue rose with href', () => {
    const src = readSrc('src/lib/production/workshop2-collection-tna-board.ts');
    expect(src).toMatch(/bg-rose-600/);
    expect(src).toMatch(/href: e\.href/);
  });

  it('gantt chart supports phase href', () => {
    const src = readSrc('src/components/brand/production/workshop2-sample-gantt-chart.tsx');
    expect(src).toMatch(/phase\.href/);
  });
});

describe('wave29 — PO ERP journal RU', () => {
  it('journal_only label when ERP not configured', () => {
    const display = resolveWorkshop2PurchaseOrderErpDisplayStatus({
      status: 'synced',
      erpConfigured: false,
      erpExternalId: null,
    });
    expect(display.labelRu).toMatch(/Журнал ERP/);
  });
});

describe('wave29 — sample gate scroll + handoff w2sec', () => {
  it('GateChecksBlock supports onGateAction', () => {
    const src = readSrc('src/components/brand/production/Workshop2GateChecksBlock.tsx');
    expect(src).toMatch(/onGateAction/);
  });

  it('sample panel scrolls on gate action', () => {
    const src = readSrc('src/components/brand/production/Workshop2ArticleSamplePanel.tsx');
    expect(src).toMatch(/scrollIntoView/);
  });

  it('w2sec deep link builder', () => {
    const href = buildWorkshop2W2secDeepLink({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossierSection: 'construction',
      anchorId: 'w2-construction-sketch-hub',
    });
    expect(href).toMatch(/w2sec=w2-construction-sketch-hub/);
    expect(href).toMatch(/w2pane=tz/);
  });
});

describe('wave29 — brand analytics B2B strip', () => {
  it('analytics page includes BrandB2bAnalyticsStrip', () => {
    const src = readSrc('src/app/brand/analytics/page.tsx');
    expect(src).toMatch(/BrandB2bAnalyticsStrip/);
  });
});

describe('wave29 — rep offline sync on mount', () => {
  it('sync on mount and online event', () => {
    const src = readSrc('src/app/shop/b2b/sales-rep-portal/page.tsx');
    expect(src).toMatch(/addEventListener\('online'/);
    expect(src).toMatch(/syncOfflineDrafts/);
  });
});

describe('wave29 — compare hero from campaign', () => {
  it('compare loads heroImageUrl from matrix campaign', () => {
    const src = readSrc('src/app/shop/b2b/compare/page.tsx');
    expect(src).toMatch(/heroImageUrl/);
  });
});

describe('wave29 — phase1 dossier 409 conflict RU', () => {
  it('summarize conflict fields RU', () => {
    const client = emptyWorkshop2DossierPhase1();
    const server = { ...emptyWorkshop2DossierPhase1(), updatedAt: '2026-05-27T00:00:00.000Z' };
    const fields = summarizeWorkshop2DossierConflictFieldsRu({
      clientDossier: client,
      serverDossier: server,
    });
    expect(fields.some((f) => f.includes('обновления') || f.includes('updatedAt'))).toBe(true);
  });

  it('phase1-dossier PUT returns conflictFieldsRu', () => {
    const src = readSrc('src/app/api/brand/workshop2/phase1-dossier/route.ts');
    expect(src).toMatch(/conflictFieldsRu/);
  });

  it('conflict dialog lists fields', () => {
    const src = readSrc(
      'src/components/brand/production/Workshop2DossierVersionConflictDialog.tsx'
    );
    expect(src).toMatch(/conflictFieldsRu/);
  });
});

describe('wave29 — vault search demo-ss27-01', () => {
  it('vault search finds demo-ss27-01 in document id', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.vaultDocuments = [
      { id: 'demo-ss27-01-sketch', title: 'SS27 sketch front', type: 'sketch' },
    ];
    const hits = searchWorkshop2VaultDocuments({ dossier, query: 'demo-ss27-01' });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]?.id).toContain('demo-ss27-01');
  });
});

describe('wave29 — wave29ModuleHealth probe', () => {
  it('probe count >= 12', () => {
    const probe = buildWorkshop2Wave29ModuleHealthProbe({
      WORKSHOP2_MARKET: 'ru',
      NODE_ENV: 'test',
    });
    expect(probe.wave29ModuleHealth).toBeGreaterThanOrEqual(12);
    expect(probe.ok).toBe(true);
  });
});
