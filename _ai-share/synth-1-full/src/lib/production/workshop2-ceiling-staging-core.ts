/**
 * Wave 38: общий контракт staging/journal для integration ceilings — fail-closed, без mock success.
 */
export type Workshop2CeilingJournalOutcome = 'skipped' | 'attempt' | 'success' | 'failed';

export type Workshop2CeilingJournalEntry = {
  at: string;
  actor: string;
  event: string;
  outcome: Workshop2CeilingJournalOutcome;
  httpStatus?: number;
  error?: string;
  stagingUrl?: string;
  /** true только при записанном ACK id в PG (live или staging contract localhost) */
  partnerAckRecorded?: boolean;
  ackId?: string | null;
  /** ISO timestamp partner ACK (wave 40) */
  ackAt?: string | null;
};

export const WORKSHOP2_CEILING_ROADMAP_PATH =
  '.planning/workshop2-integration-ceilings-roadmap.md' as const;

export type Workshop2CeilingFetchFn = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>;

export function appendWorkshop2CeilingJournalEntry(
  prev: Workshop2CeilingJournalEntry[] | undefined,
  entry: Workshop2CeilingJournalEntry
): Workshop2CeilingJournalEntry[] {
  return [...(prev ?? []), entry];
}

export function workshop2CeilingJournalEntry(input: {
  actor: string;
  event: string;
  outcome: Workshop2CeilingJournalOutcome;
  httpStatus?: number;
  error?: string;
  stagingUrl?: string;
  partnerAckRecorded?: boolean;
  ackId?: string | null;
  ackAt?: string | null;
}): Workshop2CeilingJournalEntry {
  const at = new Date().toISOString();
  const partnerAckRecorded = input.partnerAckRecorded ?? false;
  return {
    at,
    actor: input.actor,
    event: input.event,
    outcome: input.outcome,
    httpStatus: input.httpStatus,
    error: input.error,
    stagingUrl: input.stagingUrl,
    partnerAckRecorded,
    ackId: input.ackId ?? null,
    ackAt: partnerAckRecorded ? (input.ackAt ?? at) : (input.ackAt ?? null),
  };
}

/** HTTP POST staging — fail-closed: !res.ok → ok:false, никогда не маскирует 500 как success. */
export async function workshop2CeilingStagingHttpPost(input: {
  baseUrl: string;
  path: string;
  body: unknown;
  fetchImpl?: Workshop2CeilingFetchFn;
  timeoutMs?: number;
}): Promise<{ ok: boolean; httpStatus?: number; error?: string; json?: Record<string, unknown> }> {
  const fetchFn = input.fetchImpl ?? fetch;
  const url = input.baseUrl.replace(/\/$/, '') + input.path;
  try {
    const res = await fetchFn(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input.body),
      signal: AbortSignal.timeout(input.timeoutMs ?? 12_000),
    });
    let json: Record<string, unknown> | undefined;
    try {
      json = (await res.json()) as Record<string, unknown>;
    } catch {
      json = undefined;
    }
    if (!res.ok) {
      return { ok: false, httpStatus: res.status, error: `http_${res.status}`, json };
    }
    return { ok: true, httpStatus: res.status, json };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'staging_unreachable',
    };
  }
}

/** HTTP GET probe — fail-closed; optional JSON для staging contract ACK. */
export async function workshop2CeilingStagingHttpGet(input: {
  url: string;
  fetchImpl?: Workshop2CeilingFetchFn;
  timeoutMs?: number;
}): Promise<{
  ok: boolean;
  httpStatus?: number;
  error?: string;
  json?: Record<string, unknown>;
}> {
  const fetchFn = input.fetchImpl ?? fetch;
  try {
    const res = await fetchFn(input.url, {
      method: 'GET',
      signal: AbortSignal.timeout(input.timeoutMs ?? 10_000),
    });
    let json: Record<string, unknown> | undefined;
    try {
      json = (await res.json()) as Record<string, unknown>;
    } catch {
      json = undefined;
    }
    if (!res.ok) {
      return { ok: false, httpStatus: res.status, error: `http_${res.status}`, json };
    }
    return { ok: true, httpStatus: res.status, json };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'probe_unreachable',
    };
  }
}
