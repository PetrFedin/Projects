/**
 * @jest-environment node
 */
import {
  normalizeWorkshopTzSignatoryBindings,
  technologistEarlyStagesRequired,
} from '@/lib/production/workshop2-tz-signatory-options';

describe('workshop2-tz-signatory-options', () => {
  it('enforces technologist early stages during normalization', () => {
    const normalized = normalizeWorkshopTzSignatoryBindings({
      technologistDisplayLabel: 'Технолог Тест',
      technologistSignStages: { tz: false, sample: false, supply: false, qc: false },
    });
    expect(normalized?.technologistSignStages?.tz).toBeUndefined();
    expect(normalized?.technologistSignStages?.sample).toBeUndefined();
    expect(normalized?.technologistSignStages?.supply).toBeUndefined();
    expect(normalized?.technologistSignStages?.qc).toBe(false);
  });

  it('reports missing early stages when they are explicitly disabled', () => {
    const missing = technologistEarlyStagesRequired({ tz: false, sample: false, supply: true });
    expect(missing).toEqual(['tz', 'sample']);
  });
});
