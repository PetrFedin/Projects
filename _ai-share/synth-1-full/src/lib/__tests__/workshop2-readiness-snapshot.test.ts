/**
 * @jest-environment node
 */
import {
  getWorkshop2ReadinessSnapshot,
  serializeWorkshop2ReadinessSnapshotFingerprint,
  WORKSHOP2_TZ_OVERALL_SECTION_KEYS,
  workshop2TzTabSectionPct,
} from '@/lib/production/workshop2-readiness-snapshot';
import { calculateWorkshopTzSectionCompletion } from '@/lib/production/workshop2-tz-section-readiness';
import { resolvePhase1AttributeRows } from '@/lib/production/attribute-catalog';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import { buildHubCardProgressLabel } from '@/lib/production/workshop2-hub-card-display';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

function minimalDossier(partial: Partial<Workshop2DossierPhase1> = {}): Workshop2DossierPhase1 {
  return {
    schemaVersion: 1,
    assignments: [],
    sectionSignoffs: {},
    ...partial,
  } as Workshop2DossierPhase1;
}

describe('workshop2-readiness-snapshot', () => {
  it('aligns tzOverallPct with section pcts and hub card label', () => {
    const dossier = minimalDossier({
      assignments: [
        {
          attributeId: 'sku',
          kind: 'canonical',
          values: [{ valueSource: 'text', text: 'SS27-TEST-01' }],
        },
        {
          attributeId: 'name',
          kind: 'canonical',
          values: [{ valueSource: 'text', text: 'Тестовая модель' }],
        },
      ],
    });

    const snapshot = getWorkshop2ReadinessSnapshot({
      dossier,
      articleSkuDraft: 'SS27-DRAFT',
      articleNameDraft: 'Черновик',
    });

    const sectionPcts = WORKSHOP2_TZ_OVERALL_SECTION_KEYS.map((k) => snapshot.sections[k].pct);
    const expectedOverall = Math.round(
      sectionPcts.reduce((a, b) => a + b, 0) / WORKSHOP2_TZ_OVERALL_SECTION_KEYS.length
    );
    expect(snapshot.tzOverallPct).toBe(expectedOverall);

    const hub = buildHubCardProgressLabel({
      finalized: false,
      tzPct: snapshot.tzOverallPct,
      stagesPct: 40,
      pulseScore: snapshot.preflightScore,
      isComplete: false,
    });
    expect(hub.overallReadinessPct).toBe(snapshot.tzOverallPct);
    expect(hub.label).toBe(`${snapshot.tzOverallPct}%`);
  });

  it('applies passport draft bonus only to general section pct', () => {
    const dossier = minimalDossier();
    const withoutDraft = getWorkshop2ReadinessSnapshot({ dossier });
    const withDraft = getWorkshop2ReadinessSnapshot({
      dossier,
      articleSkuDraft: 'SKU-DRAFT',
      articleNameDraft: 'Name draft',
    });
    expect(withDraft.sections.general.pct).toBeGreaterThanOrEqual(
      withoutDraft.sections.general.pct
    );
    expect(withDraft.sections.material.pct).toBe(withoutDraft.sections.material.pct);
  });

  it('returns zero snapshot for null dossier', () => {
    const snapshot = getWorkshop2ReadinessSnapshot({ dossier: null });
    expect(snapshot.tzOverallPct).toBe(0);
    expect(snapshot.preflightScore).toBe(0);
    expect(snapshot.preflight).toBeNull();
  });

  it('materials pct matches tab ring helper and differs from full-catalog row set', () => {
    const leaf = {
      leafId: 'coat_men',
      l1Name: 'Мужское',
      l2Name: 'Верхняя одежда',
      l3Name: 'Пальто',
      pathLabel: 'Мужское / Верхняя одежда / Пальто',
    } as HandbookCategoryLeaf;
    const dossier = minimalDossier({
      assignments: [
        {
          attributeId: 'mat',
          kind: 'canonical',
          values: [
            {
              valueSource: 'handbook_parameter',
              parameterId: 'fabric-1',
              displayLabel: 'Шерсть',
            },
          ],
        },
      ],
    });
    const phaseRows = resolvePhase1AttributeRows(leaf.leafId).slice(0, 8);
    const snapshot = getWorkshop2ReadinessSnapshot({
      dossier,
      leaf,
      attributeRows: phaseRows,
      tzPhase: '1',
    });
    const materialPct = snapshot.sections.material.pct;
    expect(workshop2TzTabSectionPct(snapshot, 'material')).toBe(materialPct);
    const allPhase1Rows = resolvePhase1AttributeRows(leaf.leafId);
    const engineAllRows = calculateWorkshopTzSectionCompletion('material', dossier, allPhase1Rows, {
      tzPhase: '1',
    }).pct;
    const enginePhaseRows = calculateWorkshopTzSectionCompletion('material', dossier, phaseRows, {
      tzPhase: '1',
    }).pct;
    expect(materialPct).toBe(enginePhaseRows);
    expect(engineAllRows).toBeLessThanOrEqual(100);
  });

  it('fingerprint is stable for equivalent readiness snapshots', () => {
    const dossier = minimalDossier({
      assignments: [
        {
          attributeId: 'sku',
          kind: 'canonical',
          values: [{ valueSource: 'text', text: 'A-1' }],
        },
      ],
    });
    const a = getWorkshop2ReadinessSnapshot({ dossier });
    const b = getWorkshop2ReadinessSnapshot({ dossier });
    expect(a).not.toBe(b);
    expect(serializeWorkshop2ReadinessSnapshotFingerprint(a)).toBe(
      serializeWorkshop2ReadinessSnapshotFingerprint(b)
    );
  });
});
