import { buildWorkshop2FinalTzExportContextFromDossier } from '@/lib/production/workshop2-final-tz-spec-export';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

describe('buildWorkshop2FinalTzExportContextFromDossier', () => {
  it('берёт SKU и категорию из articleFormMirror PG', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      articleFormMirror: {
        mirroredAt: '2026-01-01T00:00:00.000Z',
        sku: 'SKU-DEMO-01',
        categoryLeafId: 'catalog-apparel-g0-l3',
        formState: 'ready',
        canSubmit: true,
        errorCount: 0,
        warningCount: 0,
        blockerSampleOrder: false,
      },
      finalTzDocumentLastExport: {
        exportedAt: '2026-01-02T00:00:00.000Z',
        exportedBy: 'brand',
        format: 'html',
        dossierUpdatedAtSnapshot: '2026-01-01T00:00:00.000Z',
        articleSkuSnapshot: 'OLD-SKU',
        articleNameSnapshot: 'Пальто демо',
        pathLabelSnapshot: 'Одежда › Верхняя одежда › Пуховики',
      },
    };

    const ctx = buildWorkshop2FinalTzExportContextFromDossier(dossier, {
      articleId: 'demo-ss27-01',
    });

    expect(ctx.articleSku).toBe('SKU-DEMO-01');
    expect(ctx.articleName).toBe('Пальто демо');
    expect(ctx.pathLabel).toBe('Одежда › Верхняя одежда › Пуховики');
    expect(ctx.categoryLeafId).toBe('catalog-apparel-g0-l3');
    expect(ctx.tzPhase).toBe('1');
  });

  it('не подставляет mock «Тестовое изделие»', () => {
    const ctx = buildWorkshop2FinalTzExportContextFromDossier(emptyWorkshop2DossierPhase1(), {
      articleId: 'demo-ss27-01',
    });
    expect(ctx.articleName).not.toBe('Тестовое изделие');
    expect(ctx.articleName).toContain('demo-ss27-01');
  });
});
