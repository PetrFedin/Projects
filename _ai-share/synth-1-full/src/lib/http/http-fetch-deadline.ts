const DEFAULT_MS = 30_000;

/** fetch с таймаутом (демо; при необходимости объединять с внешним AbortSignal). */
export function fetchWithHttpDeadline(
  input: RequestInfo | URL,
  init?: RequestInit,
  deadlineMs: number = DEFAULT_MS
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), deadlineMs);
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(id));
}
