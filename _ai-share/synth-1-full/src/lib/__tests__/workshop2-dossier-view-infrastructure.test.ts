/**
 * @jest-environment node
 */
import {
  defaultWorkshop2DossierViewForPlatformRole,
  isWorkshop2DossierViewPrimarySection,
  parseWorkshop2DossierViewParam,
  resolveWorkshop2DossierViewFromWorkspaceUrl,
  WORKSHOP2_DOSSIER_VIEW_OPTIONS,
  WORKSHOP2_DOSSIER_VIEW_PRIMARY_SECTIONS,
  workshop2DossierViewQueryValue,
  workshop2DossierViewUiCaps,
} from '@/lib/production/workshop2-dossier-view-infrastructure';

describe('workshop2-dossier-view-infrastructure', () => {
  it('parseWorkshop2DossierViewParam normalizes and falls back', () => {
    expect(parseWorkshop2DossierViewParam(null)).toBe('full');
    expect(parseWorkshop2DossierViewParam('')).toBe('full');
    expect(parseWorkshop2DossierViewParam('FACTORY')).toBe('factory');
    expect(parseWorkshop2DossierViewParam('nope')).toBe('full');
  });

  it('isWorkshop2DossierViewPrimarySection reflects map', () => {
    expect(isWorkshop2DossierViewPrimarySection('factory', 'visuals')).toBe(true);
    expect(isWorkshop2DossierViewPrimarySection('factory', 'construction')).toBe(true);
    expect(isWorkshop2DossierViewPrimarySection('factory', 'packaging')).toBe(false);
    expect(isWorkshop2DossierViewPrimarySection('full', 'packaging')).toBe(false);
    expect(isWorkshop2DossierViewPrimarySection('full', 'construction')).toBe(true);
    expect(isWorkshop2DossierViewPrimarySection('qc', 'general')).toBe(true);
    expect(isWorkshop2DossierViewPrimarySection('finance', 'visuals')).toBe(true);
    expect(isWorkshop2DossierViewPrimarySection('manager', 'construction')).toBe(true);
    expect(isWorkshop2DossierViewPrimarySection('designer', 'construction')).toBe(true);
    expect(isWorkshop2DossierViewPrimarySection('supply', 'construction')).toBe(true);
    expect(isWorkshop2DossierViewPrimarySection('merch', 'construction')).toBe(true);
    expect(isWorkshop2DossierViewPrimarySection('finance', 'construction')).toBe(true);
  });

  it('workshop2DossierViewQueryValue', () => {
    expect(workshop2DossierViewQueryValue('full')).toBeNull();
    expect(workshop2DossierViewQueryValue('qc')).toBe('qc');
  });

  it('defaultWorkshop2DossierViewForPlatformRole', () => {
    expect(defaultWorkshop2DossierViewForPlatformRole('technologist')).toBe('technologist');
    expect(defaultWorkshop2DossierViewForPlatformRole('finance_manager')).toBe('finance');
    expect(defaultWorkshop2DossierViewForPlatformRole('retailer')).toBe('full');
  });

  it('resolveWorkshop2DossierViewFromWorkspaceUrl explicit vs fallback', () => {
    expect(resolveWorkshop2DossierViewFromWorkspaceUrl('factory', 'retailer')).toBe('factory');
    expect(resolveWorkshop2DossierViewFromWorkspaceUrl(null, 'technologist')).toBe('technologist');
  });

  it('workshop2DossierViewUiCaps: каждый профиль из опций имеет запись в матрице', () => {
    for (const { value } of WORKSHOP2_DOSSIER_VIEW_OPTIONS) {
      const c = workshop2DossierViewUiCaps(value);
      expect(typeof c.materialComplianceStrip).toBe('boolean');
      expect(typeof c.showCompactPassportContextRibbon).toBe('boolean');
    }
  });

  it('qc profile: passport (general) is first primary section', () => {
    expect(WORKSHOP2_DOSSIER_VIEW_PRIMARY_SECTIONS.qc[0]).toBe('general');
    expect(WORKSHOP2_DOSSIER_VIEW_PRIMARY_SECTIONS.qc).toEqual(['general', 'visuals', 'construction', 'material']);
  });

  it('workshop2DossierViewUiCaps parity: full enables all strips', () => {
    const c = workshop2DossierViewUiCaps('full');
    expect(c.materialComplianceStrip).toBe(true);
    expect(c.visualSketchPinLinkFieldsStrip).toBe(true);
    expect(c.showCompactPassportContextRibbon).toBe(false);
    expect(workshop2DossierViewUiCaps('finance').visualSketchExportSurfacesStrip).toBe(false);
    expect(workshop2DossierViewUiCaps('qc').showCompactPassportContextRibbon).toBe(true);
    expect(workshop2DossierViewUiCaps('finance').showCompactPassportContextRibbon).toBe(true);
  });
});
