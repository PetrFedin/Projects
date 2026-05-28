/** @jest-environment node */

import { GET as taGet } from '@/app/api/brand/workshop2/phase1-dossier/time-and-action/route';
import { GET as labGet } from '@/app/api/brand/workshop2/materials/lab-dips/route';
import { GET as testingGet } from '@/app/api/brand/workshop2/materials/testing/route';
import { POST as reqPost } from '@/app/api/brand/workshop2/phase1-dossier/requisitions/route';

describe('workshop2 legacy mock routes removed', () => {
  it('time-and-action returns 503 without dossier params', async () => {
    const res = await taGet(new Request('http://localhost/api/ta'));
    expect(res.status).toBe(503);
    const json = (await res.json()) as { source?: string; error?: string };
    expect(json.error).toBe('dossier_required');
    expect(json.source).toBeUndefined();
  });

  it('lab-dips returns 503 without dossier params', async () => {
    const res = await labGet(new Request('http://localhost/api/lab-dips'));
    expect(res.status).toBe(503);
    const json = (await res.json()) as { source?: string };
    expect(json.source).not.toBe('legacy_mock');
  });

  it('material testing returns 503 without dossier context', async () => {
    const res = await testingGet(new Request('http://localhost/api/testing?materialId=mat-1'));
    expect(res.status).toBe(503);
  });

  it('requisitions POST redirects to sample-material-request', async () => {
    const res = await reqPost(
      new Request('http://localhost/api/requisitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId: 'c1', articleId: 'a1' }),
      })
    );
    expect(res.status).toBe(308);
    expect(res.headers.get('Location')).toContain('sample-material-request');
  });
});
