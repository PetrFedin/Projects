import { expect, type APIRequestContext } from '@playwright/test';
import { b2bV1ActorShopHeaders } from './b2b-v1-api-headers';

/** Shop threads API видит contextual thread по B2B order (второй актор без shared cookies). */
export async function shopThreadsListIncludesOrderPreview(
  request: APIRequestContext,
  orderId: string,
  previewSubstring: string
): Promise<boolean> {
  const res = await request.get('/api/shop/messages/threads', {
    headers: b2bV1ActorShopHeaders,
  });
  if (!res.ok()) return false;
  const json = (await res.json()) as {
    threads?: Array<{ contextId?: string; lastMessagePreview?: string }>;
  };
  return (
    json.threads?.some(
      (t) =>
        t.contextId === orderId &&
        (t.lastMessagePreview?.includes(previewSubstring) ?? false)
    ) ?? false
  );
}

export async function expectShopThreadsIncludeOrderPreview(
  request: APIRequestContext,
  orderId: string,
  previewSubstring: string
): Promise<void> {
  await expect
    .poll(
      async () => shopThreadsListIncludesOrderPreview(request, orderId, previewSubstring),
      { timeout: 30_000 }
    )
    .toBe(true);
}
