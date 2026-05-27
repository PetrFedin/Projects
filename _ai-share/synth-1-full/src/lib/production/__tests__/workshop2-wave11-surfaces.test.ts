import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { summarizeWorkshop2DocumentsIndexStatus } from '@/lib/production/workshop2-documents-index-status';
import { summarizeWorkshop2HubArticlesListStatus } from '@/lib/production/workshop2-hub-articles-list-status';
import { summarizeWorkshop2MainTabStripStatus } from '@/lib/production/workshop2-main-tab-strip-status';
import { summarizeWorkshop2TzExportBundleStatus } from '@/lib/production/workshop2-tz-export-bundle-status';
import { summarizeWorkshop2VaultPanelStatus } from '@/lib/production/workshop2-vault-panel-status';
import { summarizeWorkshop2WorkspaceHandoffChecklistStatus } from '@/lib/production/workshop2-workspace-handoff-checklist-status';

describe('workshop2 wave11 — vault panel', () => {
  it('empty vault hints handoff min files', () => {
    const s = summarizeWorkshop2VaultPanelStatus({
      backendMode: 'server',
      vaultDocuments: [],
      s3Configured: true,
    });
    expect(s.state).toBe('empty');
    expect(s.hintRu).toMatch(/handoff/i);
  });

  it('local-only docs on server mode', () => {
    const s = summarizeWorkshop2VaultPanelStatus({
      backendMode: 'server',
      vaultDocuments: [{ id: '1', title: 'a.pdf' }],
      s3Configured: true,
    });
    expect(s.localOnlyDocs).toBe(1);
    expect(s.hintRu).toMatch(/storage_path/i);
  });
});

describe('workshop2 wave11 — documents index', () => {
  it('static index with no full-text search', () => {
    const s = summarizeWorkshop2DocumentsIndexStatus({
      collectionId: 'SS27',
      articleUrlSegment: 'demo',
      vaultDocuments: [],
    });
    expect(s.staticEntryCount).toBe(3);
    expect(s.fullTextSearchAvailable).toBe(false);
  });
});

describe('workshop2 wave11 — hub articles list', () => {
  it('enables bulk handoff when hub list ready (Wave 4)', () => {
    const s = summarizeWorkshop2HubArticlesListStatus({
      visibleArticleCount: 5,
      withoutDossierCount: 0,
      lowTzPctCount: 0,
    });
    expect(s.bulkHandoffAvailable).toBe(true);
    expect(s.hintRu).toMatch(/массовый handoff/i);
  });

  it('blocks bulk handoff when dossier missing', () => {
    const s = summarizeWorkshop2HubArticlesListStatus({
      visibleArticleCount: 5,
      withoutDossierCount: 2,
      lowTzPctCount: 0,
    });
    expect(s.bulkHandoffAvailable).toBe(false);
  });
});

describe('workshop2 wave11 — main tab strip', () => {
  it('designer hides tabs', () => {
    const s = summarizeWorkshop2MainTabStripStatus({
      role: 'designer',
      visibleTabIds: ['tz', 'fit', 'supply'],
    });
    expect(s.orderConfigurable).toBe(false);
    expect(s.hiddenTabIds.length).toBeGreaterThan(0);
  });
});

describe('workshop2 wave11 — handoff checklist', () => {
  it('blocked without vault files', () => {
    const s = summarizeWorkshop2WorkspaceHandoffChecklistStatus({
      dossier: emptyWorkshop2DossierPhase1(),
      vaultFileCount: 0,
    });
    expect(s.allTabsBlockedUntilHandoff).toBe(false);
    expect(s.sampleOrderGateOnly).toBe(true);
    expect(s.state).toBe('blocked');
  });
});

describe('workshop2 wave11 — TZ export bundle', () => {
  it('partial without vault storage_path', () => {
    const s = summarizeWorkshop2TzExportBundleStatus({
      dossier: emptyWorkshop2DossierPhase1(),
      vaultDocuments: [],
    });
    expect(s.state).toBe('empty');
    expect(s.hintRu).toMatch(/ZIP/i);
  });
});
