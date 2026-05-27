import { z } from 'zod';
import {
  applyDeclarativePresetPatches,
  parseSewingPresetDeclarativeJson,
} from '@/lib/pattern-drafting/sewing-preset-declarative';
import type { SewingCategoryPreset } from '@/lib/pattern-drafting/sewing-category-preset.types';

const sample: SewingCategoryPreset = {
  summary: 'x',
  primary: 'bodice_front',
  alternates: ['sleeve'],
  ease: { bust: 4, waist: 2, hip: 3 },
  darts: { shoulderDart: true, bustSideDart: true, waistDart: true },
  skirtLenCm: 60,
  neckDropCm: 2.4,
  forBrandNote: 'base',
};

describe('sewing preset declarative JSON', () => {
  it('парсит v1 и накладывает patch по подстрокам', () => {
    const raw = JSON.stringify({
      v: 1,
      rules: [
        {
          id: 't1',
          when: { l2Contains: 'Платья', leafContains: 'макси' },
          patch: { skirtLenCm: 130, forBrandNote: 'over' },
        },
      ],
    });
    const file = parseSewingPresetDeclarativeJson(raw);
    expect(file.rules).toHaveLength(1);
    const out = applyDeclarativePresetPatches(
      'Платья и сарафаны',
      'Платья макси',
      sample,
      file.rules
    );
    expect(out.skirtLenCm).toBe(130);
    expect(out.forBrandNote).toBe('over');
  });

  it('отклоняет пустой when', () => {
    const raw = JSON.stringify({ v: 1, rules: [{ id: 'x', when: {}, patch: {} }] });
    expect(() => parseSewingPresetDeclarativeJson(raw)).toThrow(z.ZodError);
  });
});
