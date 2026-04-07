import { createHmac } from 'crypto';

/**
 * Универсальный POST JSON для Slack/Discord/custom (архив, алерты).
 * Опционально: W2_METRICS_WEBHOOK_SECRET → заголовок X-W2-Webhook-Signature: sha256=<hex>.
 */
export async function postW2MetricsWebhook(
  url: string,
  payload: Record<string, unknown>,
  options?: { secret?: string; timeoutMs?: number }
): Promise<{ ok: boolean; status?: number; err?: string }> {
  const body = JSON.stringify(payload);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const secret = options?.secret?.trim();
  if (secret) {
    const sig = createHmac('sha256', secret).update(body).digest('hex');
    headers['X-W2-Webhook-Signature'] = `sha256=${sig}`;
  }
  const timeoutMs = options?.timeoutMs ?? 12_000;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body,
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      return { ok: false, status: res.status, err: t.slice(0, 300) };
    }
    return { ok: true, status: res.status };
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    return { ok: false, err };
  }
}
