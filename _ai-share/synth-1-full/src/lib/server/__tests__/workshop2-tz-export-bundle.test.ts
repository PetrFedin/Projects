import { buildWorkshop2NestingFactoryExport } from '@/lib/production/workshop2-nesting-request';
import { buildWorkshop2TzExportBundleZip } from '@/lib/server/workshop2-tz-export-bundle';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import JSZip from 'jszip';

describe('workshop2-tz-export-bundle', () => {
  it('builds zip with readme dossier and readiness json', async () => {
    const dossier: Workshop2DossierPhase1 = {
      schemaVersion: 1,
      assignments: [],
      selectedAudienceId: 'men',
      categoryBindings: [{ leafId: 'catalog-apparel-g0-l0', boundAt: '2026-05-19T00:00:00.000Z' }],
    };
    const { buffer, filename } = await buildWorkshop2TzExportBundleZip({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      articleSku: 'SS27-M-COAT-01',
      categoryLeafId: 'catalog-apparel-g0-l0',
      audienceId: 'men',
      dossier,
      version: 2,
      updatedAt: '2026-05-19T12:00:00.000Z',
    });
    expect(buffer.length).toBeGreaterThan(100);
    expect(filename).toContain('w2-tz');
    expect(filename).toContain('v2.zip');
  });

  it('includes nesting factory params when provided', async () => {
    const dossier: Workshop2DossierPhase1 = {
      schemaVersion: 1,
      assignments: [],
      selectedAudienceId: 'men',
    };
    const nestingFactoryExport = buildWorkshop2NestingFactoryExport({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      sampleOrderId: 'ord-nest-1',
      nesting: { fabricWidthCm: 150, efficiencyPct: 82 },
    });
    const { buffer } = await buildWorkshop2TzExportBundleZip({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      dossier,
      version: 1,
      updatedAt: '2026-05-19T12:00:00.000Z',
      nestingFactoryExport,
    });
    const zip = await JSZip.loadAsync(buffer);
    const nestingFile = zip.file('nesting/factory-params.json');
    expect(nestingFile).toBeTruthy();
    const raw = await nestingFile!.async('string');
    expect(raw).toContain('workshop2-nesting-factory-v1');
    expect(raw).toContain('ord-nest-1');
  });
});
