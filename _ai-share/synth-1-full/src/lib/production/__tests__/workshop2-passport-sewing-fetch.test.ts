/**
 * @jest-environment node
 */
import { loadWorkshop2PassportSewingSources } from '@/lib/production/workshop2-passport-sewing-fetch';

function okJson(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

describe('loadWorkshop2PassportSewingSources', () => {
  it('loads both endpoints and returns normalized payloads', async () => {
    const fetchMock = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValueOnce(
        okJson({
          rfSubjects: [{ iso31662: 'RU-MOW', name: 'Москва' }],
          source: { rfSubjects: 'base_plus_extra' },
        })
      )
      .mockResolvedValueOnce(
        okJson({
          partners: [{ id: 'p-1', label: 'Партнёр 1' }],
          source: { partnersCount: 1, partnersSource: 'b2b_json' },
        })
      );

    const out = await loadWorkshop2PassportSewingSources(fetchMock as unknown as typeof fetch);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[0]?.[0] ?? '')).toContain('/api/brand/sewing-plan-reference');
    expect(String(fetchMock.mock.calls[1]?.[0] ?? '')).toContain('/api/brand/sewing-contractors');
    expect(out.refPayload?.rfSubjects.length).toBe(1);
    expect(out.contractorsPayload?.partners.length).toBe(1);
  });

  it('returns null payloads on fetch failure', async () => {
    const fetchMock = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockRejectedValue(new Error('network'));
    const out = await loadWorkshop2PassportSewingSources(fetchMock as unknown as typeof fetch);
    expect(out.refPayload).toBeNull();
    expect(out.contractorsPayload).toBeNull();
  });
});
