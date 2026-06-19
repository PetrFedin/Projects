/**
 * Wave 28 — dead-ends fix: PG paths, empty states, linkedPaths, domain-events sync.
 */
import fs from 'node:fs';
import path from 'node:path';

import {
  isBrandPgContextChatId,
  mapBrandPgThreadsToChats,
} from '@/lib/brand/brand-messages-pg-threads';
import { buildWorkshop2DossierLinkedPaths } from '@/lib/production/workshop2-dossier-linked-paths';
import { assertRouteHasBackend } from '@/lib/production/workshop2-dead-end-guard';
import { buildWorkshop2Wave28DeadEndsFixedProbe } from '@/lib/production/workshop2-live-integration-probes';

const ROOT = process.cwd();

function readSrc(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

describe('workshop2 wave28 — brand messages PG threads (no demo)', () => {
  it('parses w2ctx chat id', () => {
    const { parseBrandPgContextChatId } = require('@/lib/brand/brand-messages-pg-threads');
    expect(parseBrandPgContextChatId('w2ctx:workshop2_article:SS27:demo-ss27-01')).toEqual({
      contextType: 'workshop2_article',
      contextId: 'SS27:demo-ss27-01',
    });
  });

  it('maps PG threads to Chat without initialConversations ids', () => {
    const chats = mapBrandPgThreadsToChats([
      {
        contextType: 'workshop2_article',
        contextId: 'SS27:demo-ss27-01',
        lastMessageAt: '2026-05-26T10:00:00.000Z',
        lastMessagePreview: 'Образец согласован',
        messageCount: 3,
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
      },
    ]);
    expect(chats).toHaveLength(1);
    expect(chats[0]?.title).toContain('SS27');
    expect(isBrandPgContextChatId(chats[0]!.id)).toBe(true);
  });

  it('useChatState supports pgThreadsOnly flag', () => {
    const src = readSrc('src/components/user/messages/hooks/useChatState.ts');
    expect(src).toMatch(/pgThreadsOnly/);
    expect(src).toMatch(/mapBrandPgThreadsToChats/);
  });
});

describe('workshop2 wave28 — notifications bell dynamic collection', () => {
  it('bell reads w2col not hardcoded SS27 only', () => {
    const src = readSrc('src/components/brand/Workshop2BrandNotificationsBell.tsx');
    expect(src).toMatch(/searchParams\?\.get\('w2col'\)/);
    expect(src).toMatch(/sessionStorage\.getItem\('workshop2:lastCollectionId'\)/);
  });
});

describe('workshop2 wave28 — B2bBuyerShell nav', () => {
  it('active tab respects query params (wishlist)', () => {
    const src = readSrc('src/components/shop/b2b/B2bBuyerShell.tsx');
    expect(src).toMatch(/isNavActive/);
    expect(src).toMatch(/useSearchParams/);
  });
});

describe('workshop2 wave28 — B2B buyer paths', () => {
  it('compare empty state links to assortment', () => {
    const src = readSrc('src/app/shop/b2b/compare/page.tsx');
    expect(src).toMatch(/b2b-compare-empty/);
    expect(src).toMatch(/\/shop\/b2b\/assortment/);
  });

  it('checkout persists cart line fields to submit API', () => {
    const src = readSrc('src/app/shop/b2b/checkout/page.tsx');
    expect(src).toMatch(/item\.articleId \?\? item\.sku/);
    expect(src).toMatch(/requestedDeliveryDate/);
    expect(src).toMatch(/paymentTermsRu/);
  });

  it('wishlist heart loads persisted state on mount', () => {
    const src = readSrc('src/components/shop/b2b/B2bLinesheetCampaignCard.tsx');
    expect(src).toMatch(/fetch\('\/api\/shop\/b2b\/wishlist'/);
    expect(src).toMatch(/useEffect/);
  });
});

describe('workshop2 wave28 — brand B2B linesheets', () => {
  it('loads campaigns from catalog matrix API', () => {
    const src = readSrc('src/app/brand/b2b/linesheets/page.tsx');
    expect(src).toMatch(/loadBrandLinesheetsFromCampaigns/);
    expect(src).not.toMatch(/ls-fw24/);
    expect(src).toMatch(/\/brand\/b2b\/campaigns/);
  });

  it('campaign edit uses API headers and GET showroom', () => {
    const src = readSrc('src/app/brand/b2b/campaigns/[id]/edit/page.tsx');
    expect(src).toMatch(/buildWorkshop2ApiRequestHeaders/);
    expect(src).toMatch(/\/showroom/);
  });
});

describe('workshop2 wave28 — factory / supplier', () => {
  it('factory sample queue empty has W2 hub CTA', () => {
    const src = readSrc('src/app/factory/production/page.tsx');
    expect(src).toMatch(/factory-w2-sample-queue-empty/);
    expect(src).toMatch(/workshop2\?w2col=SS27/);
  });

  it('supplier material bridge handles API errors separately', () => {
    const src = readSrc('src/app/factory/supplier/page.tsx');
    expect(src).toMatch(/loadError/);
    expect(src).toMatch(/supplier-w2-no-requisition/);
  });
});

describe('workshop2 wave28 — workshop2 horizontal', () => {
  it('brand phase1-dossier PUT returns linkedPaths', () => {
    const src = readSrc('src/app/api/brand/workshop2/phase1-dossier/route.ts');
    expect(src).toMatch(/linkedPaths: buildWorkshop2DossierLinkedPaths/);
    const paths = buildWorkshop2DossierLinkedPaths({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    expect(paths.workspace).toContain('demo-ss27-01');
  });

  it('hub bulk menu uses toast for gate messages', () => {
    const src = readSrc('src/components/brand/production/Workshop2HubBulkActionsMenu.tsx');
    expect(src).toMatch(/useToast/);
    expect(src).toMatch(/destructive/);
  });

  it('workspace shows honest empty when dossier missing', () => {
    const src = readSrc('src/components/brand/production/Workshop2ArticleWorkspace.tsx');
    expect(src).toMatch(/workshop2-workspace-dossier-empty/);
    expect(src).toMatch(/demo-ss27-01/);
  });

  it('inspector reloads dossier before QC mirror', () => {
    const src = readSrc(
      'src/app/brand/production/workshop2/(w2-enterprise)/inspector/[orderId]/page.tsx'
    );
    expect(src).toMatch(/loadWorkshop2DossierFromApi/);
    expect(src).toMatch(/dossierForMirror/);
  });

  it('matchmaker shows RU error for contractors load', () => {
    const src = readSrc('src/components/brand/production/workshop2-contractor-matchmaker.tsx');
    expect(src).toMatch(/contractorsLoadError/);
    expect(src).toMatch(/messageRu/);
  });

  it('references page warns on static source', () => {
    const src = readSrc('src/app/brand/production/workshop2/(w2-enterprise)/references/page.tsx');
    expect(src).toMatch(/workshop2-references-static-banner/);
  });

  it('setup has domain-events sync button', () => {
    const src = readSrc('src/app/brand/production/workshop2/(w2-enterprise)/setup/page.tsx');
    expect(src).toMatch(/Workshop2DomainEventsSyncButton/);
  });
});

describe('workshop2 wave28 — distributor orders links', () => {
  it('distributor orders page links to B2B showroom and W2', () => {
    const src = readSrc('src/app/distributor/orders/page.tsx');
    expect(src).toMatch(/shop\/b2b\/showroom/);
    expect(src).toMatch(/workshop2\?w2col=SS27/);
  });
});

describe('workshop2 wave28 — dead-end guard P1', () => {
  it('assertRouteHasBackend warns in dev for non-api mode', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    assertRouteHasBackend('/test/route', 'static', 'hint');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
    assertRouteHasBackend('/test/route', 'api');
  });
});

describe('workshop2 wave28 — integration probe', () => {
  it('wave28DeadEndsFixed probe count >= 10', () => {
    const probe = buildWorkshop2Wave28DeadEndsFixedProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.wave28DeadEndsFixed).toBeGreaterThanOrEqual(10);
    expect(probe.ok).toBe(true);
    expect(probe.checks.some((c) => c.id === 'brand_messages_pg_only_ru')).toBe(true);
  });
});
