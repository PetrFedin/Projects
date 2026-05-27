import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { validateWorkshop2ArticleForm } from '@/lib/production/workshop2-article-form-validation';
import { summarizeWorkshop2ArticleFormReadiness } from '@/lib/production/workshop2-article-form-readiness';
import { summarizeWorkshop2AssemblyPreviewStatus } from '@/lib/production/workshop2-assembly-preview-status';
import { buildWorkshop2ArticleAssemblyPreview } from '@/lib/production/workshop2-article-assembler';
import { findHandbookLeafById } from '@/lib/production/category-catalog';
import { summarizeWorkshop2ColorPaletteStatus } from '@/lib/production/workshop2-color-palette-status';
import { summarizeWorkshop2MaterialCompositionStatus } from '@/lib/production/workshop2-material-composition-status';
import { summarizeWorkshop2PassportIdentityStatus } from '@/lib/production/workshop2-passport-identity-status';
import { getWorkshop2ReadinessSnapshot } from '@/lib/production/workshop2-readiness-snapshot';
import { summarizeWorkshop2WorkspaceHeaderPulseStatus } from '@/lib/production/workshop2-workspace-header-pulse-status';

describe('workshop2 wave9 — article form readiness', () => {
  it('blocks when SKU check pending', () => {
    const v = validateWorkshop2ArticleForm({
      mode: 'new',
      sku: 'SS27-M-COAT-01',
      name: 'Coat',
      audienceId: 'men',
      resolvedLeafId: 'men-outerwear-coat',
    });
    const r = summarizeWorkshop2ArticleFormReadiness({
      validation: v,
      skuAvailabilityChecking: true,
    });
    expect(r.state).toBe('blocked');
    expect(r.canSubmit).toBe(false);
  });
});

describe('workshop2 wave9 — assembly preview', () => {
  it('empty without leaf preview', () => {
    const s = summarizeWorkshop2AssemblyPreviewStatus(null);
    expect(s.state).toBe('empty');
  });

  it('warns on forbidden audience', () => {
    const leaf = findHandbookLeafById('men-outerwear-coat');
    if (!leaf) return;
    const preview = buildWorkshop2ArticleAssemblyPreview(
      {
        categoryLeafId: leaf.leafId,
        audienceId: 'other',
        l1Name: leaf.l1Name,
        l2Name: leaf.l2Name,
        l3Name: leaf.l3Name,
      },
      leaf
    );
    const s = summarizeWorkshop2AssemblyPreviewStatus(preview);
    expect(s.state).toBe('blocked');
  });
});

describe('workshop2 wave9 — header pulse', () => {
  it('flags gap between tz and preflight', () => {
    const snap = getWorkshop2ReadinessSnapshot({ dossier: emptyWorkshop2DossierPhase1() });
    const s = summarizeWorkshop2WorkspaceHeaderPulseStatus(snap);
    expect(s.tzOverallPct).toBeGreaterThanOrEqual(0);
    expect(s.hintRu).toBeTruthy();
  });
});

describe('workshop2 wave9 — passport identity', () => {
  it('empty without category binding', () => {
    const s = summarizeWorkshop2PassportIdentityStatus({
      dossier: emptyWorkshop2DossierPhase1(),
    });
    expect(s.state).toBe('empty');
    expect(s.hintRu).toMatch(/категор/i);
  });
});

describe('workshop2 wave9 — color palette', () => {
  it('empty without colorway', () => {
    const s = summarizeWorkshop2ColorPaletteStatus(emptyWorkshop2DossierPhase1());
    expect(s.state).toBe('empty');
  });

  it('tracks colorway from assignments', () => {
    const s = summarizeWorkshop2ColorPaletteStatus({
      ...emptyWorkshop2DossierPhase1(),
      assignments: [
        {
          kind: 'canonical' as const,
          attributeId: 'color',
          values: [{ displayLabel: 'Navy' }],
        },
      ],
    });
    expect(s.colorwayCount).toBe(1);
  });
});

describe('workshop2 wave9 — material composition', () => {
  it('empty without mat', () => {
    const s = summarizeWorkshop2MaterialCompositionStatus(emptyWorkshop2DossierPhase1());
    expect(s.state).toBe('empty');
    expect(s.hintRu).toMatch(/Материалы/i);
  });
});
