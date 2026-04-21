import { test, expect } from '@playwright/test';

/**
 * HTTP-контракт `/api/processes` без браузера (см. `CORE_OPERATING_CHAIN.md` §8.2, §8.4).
 * При `WORKFLOW_STORE_DISABLED=1` POST/PUT не пишут файл, но маршруты отвечают; в e2e dev обычно store включён.
 */
test.describe('Workflow processes API', () => {
  test('GET /api/processes returns non-empty merged list', async ({ request }) => {
    const res = await request.get('/api/processes');
    expect(res.status()).toBe(200);
    const list = (await res.json()) as unknown;
    expect(Array.isArray(list)).toBe(true);
    const arr = list as { id?: string }[];
    expect(arr.length).toBeGreaterThan(0);
    expect(arr.some((p) => typeof p.id === 'string')).toBe(true);
  });

  test('POST custom process → GET → PUT → GET roundtrip', async ({ request }) => {
    const created = await request.post('/api/processes', {
      data: {
        name: 'E2E Workflow Process',
        description: 'processes-workflow-api.spec',
        stages: [],
      },
    });
    expect(created.status()).toBe(201);
    const body = (await created.json()) as { id?: string; name?: string };
    expect(body.id).toMatch(/^custom-/);
    const id = body.id as string;

    const g1 = await request.get(`/api/processes/${encodeURIComponent(id)}`);
    expect(g1.status()).toBe(200);
    const d1 = (await g1.json()) as { name: string };
    expect(d1.name).toBe('E2E Workflow Process');

    const put = await request.put(`/api/processes/${encodeURIComponent(id)}`, {
      data: {
        name: 'E2E Workflow Process Renamed',
        description: 'updated by e2e',
        stages: [],
      },
    });
    expect(put.status()).toBe(200);
    const d2 = (await put.json()) as { name: string };
    expect(d2.name).toBe('E2E Workflow Process Renamed');

    const g2 = await request.get(`/api/processes/${encodeURIComponent(id)}`);
    expect(g2.status()).toBe(200);
    const d3 = (await g2.json()) as { name: string };
    expect(d3.name).toBe('E2E Workflow Process Renamed');
  });
});
