/**
 * @jest-environment node
 */
import {
  normalizeWorkshopTzSignatoryBindings,
  technologistEarlyStagesRequired,
  WORKSHOP2_TZ_STAGE_LABEL_RU,
} from '@/lib/production/workshop2-tz-signatory-options';

describe('workshop2-tz-signatory-options', () => {
  it('technologistEarlyStagesRequired returns disabled early stages', () => {
    const missing = technologistEarlyStagesRequired({
      tz: false,
      sample: false,
      supply: true,
    });
    expect(missing).toEqual(['tz', 'sample']);
    expect(missing.map((s) => WORKSHOP2_TZ_STAGE_LABEL_RU[s])).toEqual(['ТЗ', 'Образец']);
  });

  it('normalizeWorkshopTzSignatoryBindings keeps technologist early stages enabled', () => {
    const normalized = normalizeWorkshopTzSignatoryBindings({
      technologistDisplayLabel: 'Тест Технолог',
      technologistSignStages: {
        tz: false,
        sample: false,
        supply: false,
        fit: false,
      },
    });
    expect(normalized?.technologistSignStages?.tz).toBeUndefined();
    expect(normalized?.technologistSignStages?.sample).toBeUndefined();
    expect(normalized?.technologistSignStages?.supply).toBeUndefined();
    expect(normalized?.technologistSignStages?.fit).toBe(false);
  });
});
