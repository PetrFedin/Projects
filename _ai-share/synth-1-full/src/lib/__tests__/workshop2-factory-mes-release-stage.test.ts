import {
  canAdvanceFactoryMesReleaseStage,
  factoryMesReleaseStageLabelRu,
  getNextFactoryMesReleaseStage,
  resolveFactoryMesReleaseStage,
} from '@/lib/production/workshop2-factory-mes-release-stage';

describe('workshop2-factory-mes-release-stage', () => {
  it('resolve unknown → queued', () => {
    expect(resolveFactoryMesReleaseStage('')).toBe('queued');
    expect(resolveFactoryMesReleaseStage('bogus')).toBe('queued');
  });

  it('labels RU', () => {
    expect(factoryMesReleaseStageLabelRu('cut')).toBe('Раскрой');
    expect(factoryMesReleaseStageLabelRu('qc')).toBe('ОТК');
  });

  it('happy path queued → cut → sew → qc → released', () => {
    expect(getNextFactoryMesReleaseStage('queued')).toBe('cut');
    expect(getNextFactoryMesReleaseStage('cut')).toBe('sew');
    expect(getNextFactoryMesReleaseStage('sew')).toBe('qc');
    expect(getNextFactoryMesReleaseStage('qc')).toBe('released');
    expect(getNextFactoryMesReleaseStage('released')).toBeNull();
  });

  it('advance только при synced PO', () => {
    expect(canAdvanceFactoryMesReleaseStage('pending_erp', 'queued')).toBe(false);
    expect(canAdvanceFactoryMesReleaseStage('synced', 'queued')).toBe(true);
    expect(canAdvanceFactoryMesReleaseStage('synced', 'released')).toBe(false);
  });
});
