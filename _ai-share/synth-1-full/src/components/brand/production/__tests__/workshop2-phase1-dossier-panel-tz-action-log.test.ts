import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import type { Workshop2TzActionLogEntry } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  canRevokeTzSignoff,
  formatTzActionLogDetailRu,
  pushTzActionLog,
  TZ_ACTION_LOG_MAX,
} from '../workshop2-phase1-dossier-panel-tz-action-log';

const SECTION_LABELS = {
  general: 'Паспорт',
  visuals: 'Визуал',
  material: 'Материалы',
  construction: 'Конструкция',
  assignment: 'Задание',
  measurements: 'Табель мер',
  packaging: 'Упаковка',
  sample_intake: 'Приёмка сэмпла',
} as const;

describe('workshop2-phase1-dossier-panel-tz-action-log', () => {
  it('pushTzActionLog appends and trims overflow', () => {
    const spy = jest.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('id');
    let d = emptyWorkshop2DossierPhase1();
    for (let i = 0; i < TZ_ACTION_LOG_MAX + 3; i++) {
      d = pushTzActionLog(d, 'u', { type: 'dossier_edit', summaries: [`L${i}`] });
    }
    expect(d.tzActionLog?.length).toBe(TZ_ACTION_LOG_MAX);
    expect(d.tzActionLog?.[0]?.action).toMatchObject({ summaries: ['L3'] });
    spy.mockRestore();
  });

  it('canRevokeTzSignoff matches case-insensitively', () => {
    expect(canRevokeTzSignoff('  Anna ', ['anna', 'bob'])).toBe(true);
    expect(canRevokeTzSignoff('', ['anna'])).toBe(false);
  });

  it('formatTzActionLogDetailRu formats section_signoff', () => {
    const e: Workshop2TzActionLogEntry = {
      entryId: 'e1',
      at: '2020-01-01T12:00:00.000Z',
      by: 'Test',
      action: {
        type: 'section_signoff',
        section: 'material',
        role: 'brand',
        set: true,
        signerOrganization: 'ACME',
      },
    };
    const { text } = formatTzActionLogDetailRu(e, SECTION_LABELS);
    expect(text).toContain('Материалы');
    expect(text).toContain('бренд');
    expect(text).toContain('ACME');
  });
});
