import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  WORKSHOP2_CAD_VIEWER_MIN_VAULT_METADATA_MEASURES,
  applyVaultCadMeasuresToDossierPom,
  countCadVaultMetadataMeasures,
  extractCadMeasuresFromVaultMetadata,
  meetsWorkshop2CadViewerMinimum,
} from '@/lib/production/workshop2-cad-metadata';

describe('workshop2-cad-metadata', () => {
  it('requires at least one vault metadata measure for CAD viewer minimum', () => {
    expect(WORKSHOP2_CAD_VIEWER_MIN_VAULT_METADATA_MEASURES).toBe(1);
    const fromVault = extractCadMeasuresFromVaultMetadata({
      measures: [{ label: 'Длина по спинке', valueCm: 72 }],
    });
    expect(countCadVaultMetadataMeasures(fromVault)).toBe(1);
    expect(meetsWorkshop2CadViewerMinimum(fromVault)).toBe(true);
    expect(meetsWorkshop2CadViewerMinimum([])).toBe(false);
  });

  it('applyVaultCadMeasuresToDossierPom fills empty POM cells from vault metadata', () => {
    const vaultMeasures = extractCadMeasuresFromVaultMetadata({
      measures: [{ label: 'Длина по спинке', valueCm: 72 }],
    });
    const { dossier, imported } = applyVaultCadMeasuresToDossierPom(
      emptyWorkshop2DossierPhase1(),
      vaultMeasures
    );
    expect(imported).toBe(1);
    expect(dossier.sampleBasePerSizeDimensions?.base?.['Длина по спинке']).toBe('72');
    expect(dossier.cadPomImport?.importedCellCount).toBe(1);
  });
});
