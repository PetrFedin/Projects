/**
 * Fire-and-forget POST analytics batch to brand webhook — retry + idempotency.
 */
import { createHash } from 'node:crypto';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { ScrollExperienceEventLogEntry } from '@/lib/scroll-experience-analytics';

export const RUNWAY_WEBHOOK_MAX_ATTEMPTS = 3;
export const RUNWAY_WEBHOOK_TIMEOUT_MS = 8_000;
export const RUNWAY_WEBHOOK_BACKOFF_MS = [0, 500, 1500] as const;

export interface RunwayWebhookDeliveryDeps {
  fetchImpl?: typeof fetch;
  sleepMs?: (ms: number) => Promise<void>;
  logFailure?: (entry: RunwayWebhookFailureLog) => Promise<void>;
}

export interface RunwayWebhookFailureLog {
  webhookUrl: string;
  idempotencyKey: string;
  attempts: number;
  lastStatus?: number;
  error?: string;
  sentAt: string;
  eventCount: number;
}

async function defaultSleepMs(ms: number): Promise<void> {
  if (ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function failuresLogPath(): string {
  const fromEnv = process.env.RUNWAY_ANALYTICS_WEBHOOK_FAILURES_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'runway-analytics-webhook-failures.jsonl');
}

async function appendWebhookFailureLog(entry: RunwayWebhookFailureLog): Promise<void> {
  const p = failuresLogPath();
  await mkdir(path.dirname(p), { recursive: true });
  await appendFile(p, `${JSON.stringify(entry)}\n`, 'utf8');
}

export function buildRunwayWebhookIdempotencyKey(
  events: ScrollExperienceEventLogEntry[],
  sentAt: string
): string {
  const fingerprint = events
    .map((e) => `${e.timestamp}:${e.event}:${e.productSlug}:${e.sectionIndex ?? -1}`)
    .join('|');
  return createHash('sha256').update(`${sentAt}:${fingerprint}`).digest('hex');
}

async function postWebhookOnce(
  webhookUrl: string,
  body: string,
  idempotencyKey: string,
  fetchImpl: typeof fetch
): Promise<{ ok: boolean; status?: number; error?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RUNWAY_WEBHOOK_TIMEOUT_MS);
  try {
    const res = await fetchImpl(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body,
      signal: controller.signal,
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'network_error',
    };
  } finally {
    clearTimeout(timeout);
  }
}

/** Доставка webhook с exponential backoff (до 3 попыток). Экспорт для unit-тестов. */
export async function deliverRunwayAnalyticsWebhook(
  webhookUrl: string,
  events: ScrollExperienceEventLogEntry[],
  deps: RunwayWebhookDeliveryDeps = {}
): Promise<{ delivered: boolean; attempts: number; lastStatus?: number }> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const sleepMs = deps.sleepMs ?? defaultSleepMs;
  const logFailure = deps.logFailure ?? appendWebhookFailureLog;

  const sentAt = new Date().toISOString();
  const payload = JSON.stringify({
    source: 'syntha-runway',
    sentAt,
    events,
  });
  const idempotencyKey = buildRunwayWebhookIdempotencyKey(events, sentAt);

  let lastStatus: number | undefined;
  let lastError: string | undefined;

  for (let attempt = 0; attempt < RUNWAY_WEBHOOK_MAX_ATTEMPTS; attempt++) {
    const backoff = RUNWAY_WEBHOOK_BACKOFF_MS[attempt] ?? 1500;
    if (backoff > 0) await sleepMs(backoff);

    const result = await postWebhookOnce(webhookUrl, payload, idempotencyKey, fetchImpl);
    if (result.ok) {
      return { delivered: true, attempts: attempt + 1, lastStatus: result.status };
    }
    lastStatus = result.status;
    lastError = result.error;
  }

  const failure: RunwayWebhookFailureLog = {
    webhookUrl,
    idempotencyKey,
    attempts: RUNWAY_WEBHOOK_MAX_ATTEMPTS,
    lastStatus,
    error: lastError,
    sentAt,
    eventCount: events.length,
  };

  try {
    await logFailure(failure);
  } catch {
    /* stderr fallback ниже */
  }

  console.error(
    '[runway] analytics webhook failed after retries',
    JSON.stringify({
      status: lastStatus ?? 'network',
      error: lastError,
      webhookUrl,
      idempotencyKey,
      eventCount: events.length,
    })
  );

  return { delivered: false, attempts: RUNWAY_WEBHOOK_MAX_ATTEMPTS, lastStatus };
}

/** Fire-and-forget POST analytics batch to brand webhook. */
export async function fireRunwayAnalyticsWebhook(
  webhookUrl: string | undefined,
  events: ScrollExperienceEventLogEntry[]
): Promise<void> {
  if (!webhookUrl?.trim() || events.length === 0) return;
  await deliverRunwayAnalyticsWebhook(webhookUrl.trim(), events);
}
