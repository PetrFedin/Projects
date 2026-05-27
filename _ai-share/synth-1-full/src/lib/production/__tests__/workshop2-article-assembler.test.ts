/**
 * @jest-environment node
 */
import {
  assembleWorkshop2ArticleFromTaxonomy,
  buildWorkshop2ArticleAssemblyPreview,
  buildWorkshop2AssemblySummaryRu,
  formatWorkshop2AssemblyScaleLabelRu,
  previewWorkshop2ArticleAssemblyMerge,
} from '@/lib/production/workshop2-article-assembler';
import { findHandbookLeafById } from '@/lib/production/category-catalog';
import { defaultSampleSizeScaleIdForWorkshopLine } from '@/lib/production/workshop2-apparel-audience-domain';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

const COAT_LEAF = 'catalog-apparel-g0-l0';
const SNEAKERS_LEAF = 'catalog-shoes-g0-l0';

describe('workshop2-article-assembler', () => {
  it('coat men L3 → men outerwear scale and outerwear T&A', () => {
    const leaf = findHandbookLeafById(COAT_LEAF);
    expect(leaf).toBeDefined();
    const scaleId = defaultSampleSizeScaleIdForWorkshopLine(leaf, 'men', false);
    expect(scaleId).toContain('men-apparel');
    const built = assembleWorkshop2ArticleFromTaxonomy({
      categoryLeafId: COAT_LEAF,
      audienceId: 'men',
      isUnisex: false,
    });
    expect(built).not.toBeNull();
    expect(built!.dossier.selectedAudienceId).toBe('men');
    expect(built!.dossier.isUnisex).toBe(false);
    expect(built!.dossier.sampleSizeScaleId).toContain('men-apparel');
    expect(built!.dossier.passportProductionBrief?.lifecycleTaTemplateId).toBe('outerwear-90');
    expect(built!.dossier.categoryBindings?.[0]?.categoryLeafId).toBe(COAT_LEAF);
    expect(built!.dossier.assignments.length).toBeGreaterThan(5);
    expect(built!.preview.taTemplateId).toBe('outerwear-90');
    expect(built!.preview.audienceForbidden).toBe(false);
  });

  it('sneakers unisex men → men audience + isUnisex + footwear scale', () => {
    const leaf = findHandbookLeafById(SNEAKERS_LEAF);
    expect(leaf).toBeDefined();
    const built = assembleWorkshop2ArticleFromTaxonomy({
      categoryLeafId: SNEAKERS_LEAF,
      audienceId: 'men',
      isUnisex: true,
    });
    expect(built).not.toBeNull();
    expect(built!.dossier.selectedAudienceId).toBe('men');
    expect(built!.dossier.isUnisex).toBe(true);
    const scaleId = built!.dossier.sampleSizeScaleId ?? '';
    expect(scaleId.includes('shoes') || scaleId.includes('unisex')).toBe(true);
    expect(built!.preview.isUnisex).toBe(true);
    expect(built!.preview.audienceForbidden).toBe(false);
  });

  it('forbidden other on apparel domain', () => {
    const leaf = findHandbookLeafById(COAT_LEAF)!;
    const preview = buildWorkshop2ArticleAssemblyPreview(
      { categoryLeafId: COAT_LEAF, audienceId: 'other', isUnisex: false },
      leaf
    );
    expect(preview.audienceForbidden).toBe(true);
    expect(preview.audienceForbiddenReasonRu).toMatch(/Остальное/);
  });

  it('formatWorkshop2AssemblyScaleLabelRu: men coat', () => {
    const leaf = findHandbookLeafById(COAT_LEAF);
    const label = formatWorkshop2AssemblyScaleLabelRu(leaf, 'men', false);
    expect(label).toMatch(/муж/i);
  });

  it('buildWorkshop2AssemblySummaryRu: men coat', () => {
    const summary = buildWorkshop2AssemblySummaryRu({
      audienceId: 'men',
      categoryLeafId: COAT_LEAF,
    });
    expect(summary).toContain('Мужчины');
    expect(summary).toContain('·');
  });

  it('preview one line is compact Russian', () => {
    const leaf = findHandbookLeafById(SNEAKERS_LEAF)!;
    const preview = buildWorkshop2ArticleAssemblyPreview(
      { categoryLeafId: SNEAKERS_LEAF, audienceId: 'men', isUnisex: true },
      leaf
    );
    expect(preview.oneLineRu).toContain('Шкала:');
    expect(preview.oneLineRu).toContain('Унисекс: да');
  });

  it('preview merge warns on scale change when category changes', () => {
    const built = assembleWorkshop2ArticleFromTaxonomy({
      categoryLeafId: COAT_LEAF,
      audienceId: 'men',
      isUnisex: false,
    });
    expect(built).not.toBeNull();
    const womenBuilt = assembleWorkshop2ArticleFromTaxonomy({
      categoryLeafId: COAT_LEAF,
      audienceId: 'women',
      isUnisex: false,
    });
    expect(womenBuilt).not.toBeNull();
    const diff = previewWorkshop2ArticleAssemblyMerge(built!.dossier, {
      categoryLeafId: COAT_LEAF,
      audienceId: 'women',
      isUnisex: false,
    });
    if (built!.dossier.sampleSizeScaleId !== womenBuilt!.dossier.sampleSizeScaleId) {
      expect(diff.hasChanges).toBe(true);
      expect(diff.warningsRu.some((w) => w.includes('Шкала'))).toBe(true);
    }
  });

  it('applyPomOnCreate flag is optional on commit type', () => {
    const commit = {
      kind: 'new' as const,
      sku: 'W2-TEST',
      categoryLeafId: COAT_LEAF,
      applyPomOnCreate: true,
    };
    expect(commit.applyPomOnCreate).toBe(true);
    const dossier = assembleWorkshop2ArticleFromTaxonomy({
      categoryLeafId: COAT_LEAF,
      audienceId: 'men',
    })!.dossier;
    expect(dossier.pomTemplateSuggested?.preMergeAvailable).toBe(true);
    expect(emptyWorkshop2DossierPhase1().assignments).toEqual([]);
  });
});
