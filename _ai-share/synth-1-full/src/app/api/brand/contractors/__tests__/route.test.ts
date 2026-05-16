/**
 * @jest-environment node
 */
import { GET } from '@/app/api/brand/contractors/route';

describe('GET /api/brand/contractors', () => {
  it('returns partners with source meta', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      partners: Array<{ id: string; label: string }>;
      source: { partnersCount: number; partnersSource: 'b2b_json' | 'catalog_and_demo' };
    };
    expect(Array.isArray(json.partners)).toBe(true);
    expect(json.partners.length).toBeGreaterThan(0);
    expect(json.source.partnersCount).toBe(json.partners.length);
    expect(['b2b_json', 'catalog_and_demo']).toContain(json.source.partnersSource);
  });
});
