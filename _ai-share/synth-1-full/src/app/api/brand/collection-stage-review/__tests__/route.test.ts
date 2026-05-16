/**
 * @jest-environment node
 */
import { POST } from '@/app/api/brand/collection-stage-review/route';

function postReq(body?: unknown): Request {
  if (body === undefined) {
    return new Request('http://localhost/api/brand/collection-stage-review', { method: 'POST' });
  }
  return new Request('http://localhost/api/brand/collection-stage-review', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/brand/collection-stage-review', () => {
  it('returns refs for valid payload and selected channels', async () => {
    const res = await POST(
      postReq({
        collectionKey: 'FW27-main',
        collectionIdLabel: 'FW27',
        stepId: 'step-12',
        stepTitle: 'Материалы и BOM',
        actorLabel: 'Технолог',
        channels: ['tasks', 'messages'],
        summaryNote: 'Нужна ревизия BOM',
      }) as never
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      mode: string;
      taskRef?: string;
      messageThreadRef?: string;
    };
    expect(json.ok).toBe(true);
    expect(json.mode).toBe('store');
    expect(json.taskRef).toContain('task:');
    expect(json.messageThreadRef).toContain('thread:');
  });

  it('returns invalid_json when body is not JSON', async () => {
    const res = await POST(postReq() as never);
    expect(res.status).toBe(400);
    const json = (await res.json()) as { ok: boolean; error: string };
    expect(json.ok).toBe(false);
    expect(json.error).toBe('invalid_json');
  });

  it('returns invalid_body when required fields are missing', async () => {
    const res = await POST(
      postReq({
        collectionKey: 'FW27-main',
        stepId: 'step-12',
        channels: [],
      }) as never
    );
    expect(res.status).toBe(400);
    const json = (await res.json()) as { ok: boolean; error: string };
    expect(json.ok).toBe(false);
    expect(json.error).toBe('invalid_body');
  });
});
