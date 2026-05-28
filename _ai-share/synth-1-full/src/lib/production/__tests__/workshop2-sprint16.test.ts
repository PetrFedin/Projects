import {
  resolveColor,
  resolveColorWithStaticFallback,
} from '@/lib/production/workshop2-color-master';
import { resolveWorkshop2RequiredFieldIdsForLeaf } from '@/lib/production/workshop2-required-fields';
import {
  parseWorkshop2ArticlesImportCsv,
  normalizeWorkshop2ImportAudienceId,
} from '@/lib/production/workshop2-articles-import';
import { resolveWorkshop2PreflightJumpTarget } from '@/lib/production/workshop2-preflight-anchor-map';

describe('workshop2-color-master', () => {
  it('resolves color by code and Russian name', () => {
    expect(resolveColor('BLK')?.code).toBe('BLK');
    expect(resolveColor('Чёрный')?.code).toBe('BLK');
    expect(resolveColorWithStaticFallback('NVY')?.code).toBe('NVY');
  });

  it('returns null for unknown color', () => {
    expect(resolveColor('NOT-A-COLOR')).toBeNull();
  });
});

describe('workshop2-required-fields', () => {
  it('merges required ids for coat leaf', () => {
    const payload = resolveWorkshop2RequiredFieldIdsForLeaf('catalog-apparel-g0-l0');
    expect(payload).not.toBeNull();
    expect(payload!.count).toBeGreaterThan(0);
    expect(payload!.requiredIds).toContain('mat');
    expect(payload!.fromCatalogRequiredForPhase1.length).toBeGreaterThan(0);
  });
});

describe('workshop2-articles-import', () => {
  it('parses csv with header', () => {
    const rows = parseWorkshop2ArticlesImportCsv(
      'sku,name,audience,leafId\nA1,Test,men,catalog-apparel-g0-l0'
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]?.sku).toBe('A1');
    expect(rows[0]?.leafId).toBe('catalog-apparel-g0-l0');
  });

  it('normalizes audience aliases', () => {
    expect(normalizeWorkshop2ImportAudienceId('мужчины')).toBe('men');
    expect(normalizeWorkshop2ImportAudienceId('')).toBe('women');
  });
});

describe('workshop2-preflight-anchor-map', () => {
  it('maps passport sku blocker to identity anchor', () => {
    const target = resolveWorkshop2PreflightJumpTarget({
      id: 'passport.sku.missing',
      section: 'passport',
      anchor: 'passport',
    });
    expect(target.anchorId).toBe('w2-passport-start');
    expect(target.dossierSection).toBe('general');
  });
});
