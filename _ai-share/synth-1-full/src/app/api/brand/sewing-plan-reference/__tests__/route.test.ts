/**
 * @jest-environment node
 */
import { GET } from '@/app/api/brand/sewing-plan-reference/route';

describe('GET /api/brand/sewing-plan-reference', () => {
  it('returns narrowed reference payload for RF subjects', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      partners: Array<{ id: string; label: string }>;
      rfSubjectExtras: Array<{ iso31662: string; name: string }>;
      rfSubjects: Array<{ iso31662: string; name: string }>;
      source: {
        partners: 'b2b_json' | 'catalog_and_demo';
        rfSubjects: 'base_only' | 'base_plus_extra';
      };
    };

    expect(Array.isArray(json.partners)).toBe(true);
    expect(json.partners.length).toBeGreaterThan(0);
    expect(['b2b_json', 'catalog_and_demo']).toContain(json.source.partners);

    expect(Array.isArray(json.rfSubjectExtras)).toBe(true);
    expect(Array.isArray(json.rfSubjects)).toBe(true);
    expect(json.rfSubjects.length).toBeGreaterThan(0);
    expect(['base_only', 'base_plus_extra']).toContain(json.source.rfSubjects);
  });
});
