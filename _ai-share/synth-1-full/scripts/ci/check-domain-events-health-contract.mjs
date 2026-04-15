#!/usr/bin/env node

/**
 * Dependency-light fallback runner (plain Node.js, no tsx).
 * Keep behavior aligned with `check-domain-events-health-contract.ts`.
 *
 * Env:
 * - DOMAIN_EVENTS_HEALTH_URL (optional for local `check:contracts`; missing URL → skip exit 0 unless STRICT)
 *
 * Optional env:
 * - DOMAIN_EVENTS_HEALTH_SECRET
 * - DOMAIN_EVENTS_HEALTH_TIMEOUT_MS (default: 10000)
 * - DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT=json|pretty (default: json; unknown -> json + warn)
 * - SKIP_DOMAIN_EVENTS_HEALTH_CONTRACT_CHECK=1
 * - DOMAIN_EVENTS_HEALTH_CONTRACT_STRICT=1 (require DOMAIN_EVENTS_HEALTH_URL; otherwise missing URL skips with exit 0)
 */

const CONTRACT_VERSION = 'v1';
const REQUIRED_RESPONSE_KEYS = [
  'contractVersion',
  'ok',
  'status',
  'summaryCode',
  'summary',
  'alerts',
  'degradedReasons',
  'recommendations',
  'thresholds',
  'bus',
  'outbox',
  'requestId',
];
const REQUIRED_HEADER_KEYS = ['x-request-id', 'x-domain-events-health-contract-version'];
const OUTPUT_VALUES = ['json', 'pretty'];

function formatEvent(event, format) {
  return format === 'pretty' ? JSON.stringify(event, null, 2) : JSON.stringify(event);
}

function parseOutputFormat(env) {
  const raw = env.DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT?.trim();
  if (!raw) return { format: 'json', invalidRaw: null };
  const lower = raw.toLowerCase();
  if (lower === 'json' || lower === 'pretty') return { format: lower, invalidRaw: null };
  return { format: 'json', invalidRaw: raw };
}

async function main() {
  const output = parseOutputFormat(process.env);
  if (output.invalidRaw) {
    console.warn(
      formatEvent(
        {
          scope: 'domain-events-health-contract',
          level: 'warn',
          code: 'output_format_invalid',
          message: 'Unknown DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT; using json',
          details: { received: output.invalidRaw, allowed: OUTPUT_VALUES },
        },
        'json'
      )
    );
  }

  if (process.env.SKIP_DOMAIN_EVENTS_HEALTH_CONTRACT_CHECK === '1') {
    console.warn(
      formatEvent(
        {
          scope: 'domain-events-health-contract',
          level: 'warn',
          code: 'check_skipped',
          message: 'Skipped by env flag',
        },
        output.format
      )
    );
    process.exit(0);
  }

  const url = process.env.DOMAIN_EVENTS_HEALTH_URL?.trim();
  if (!url) {
    if (process.env.DOMAIN_EVENTS_HEALTH_CONTRACT_STRICT === '1') {
      console.error(
        formatEvent(
          {
            scope: 'domain-events-health-contract',
            level: 'error',
            code: 'config_error',
            message:
              'DOMAIN_EVENTS_HEALTH_URL is required when DOMAIN_EVENTS_HEALTH_CONTRACT_STRICT=1 (CI / gated checks)',
          },
          output.format
        )
      );
      process.exit(1);
    }
    console.warn(
      formatEvent(
        {
          scope: 'domain-events-health-contract',
          level: 'warn',
          code: 'check_skipped',
          message:
            'DOMAIN_EVENTS_HEALTH_URL not set; skipping live domain-events health contract probe (set DOMAIN_EVENTS_HEALTH_CONTRACT_STRICT=1 to fail when URL is missing)',
        },
        output.format
      )
    );
    process.exit(0);
  }

  const timeoutMsRaw = Number.parseInt(process.env.DOMAIN_EVENTS_HEALTH_TIMEOUT_MS || '', 10);
  const timeoutMs = Number.isFinite(timeoutMsRaw) && timeoutMsRaw > 0 ? timeoutMsRaw : 10000;
  const secret = process.env.DOMAIN_EVENTS_HEALTH_SECRET?.trim();

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), timeoutMs);

  try {
    const headers = {};
    if (secret) headers.authorization = `Bearer ${secret}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: abortController.signal,
    });

    if (!response.ok) {
      console.error(
        formatEvent(
          {
            scope: 'domain-events-health-contract',
            level: 'error',
            code: 'http_error',
            message: `Request failed: HTTP ${response.status} ${response.statusText}`,
            details: { status: response.status, statusText: response.statusText, url },
          },
          output.format
        )
      );
      process.exit(1);
    }

    const payloadUnknown = await response.json();
    if (!payloadUnknown || typeof payloadUnknown !== 'object' || Array.isArray(payloadUnknown)) {
      console.error(
        formatEvent(
          {
            scope: 'domain-events-health-contract',
            level: 'error',
            code: 'payload_shape_error',
            message: 'Response payload must be a JSON object',
          },
          output.format
        )
      );
      process.exit(1);
    }

    const payload = payloadUnknown;
    const errors = [];
    const actualKeys = Object.keys(payload).sort();
    const expectedKeys = [...REQUIRED_RESPONSE_KEYS].sort();
    if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
      errors.push('payload_keys_mismatch');
    }
    if (payload.contractVersion !== CONTRACT_VERSION) {
      errors.push('payload_contract_version_mismatch');
    }
    for (const key of REQUIRED_HEADER_KEYS) {
      const v = response.headers.get(key);
      if (!v || !v.trim()) errors.push(`header_missing:${key}`);
    }
    const headerVersion = response.headers.get('x-domain-events-health-contract-version');
    if (headerVersion?.trim() !== CONTRACT_VERSION) {
      errors.push('header_contract_version_mismatch');
    }

    if (errors.length > 0) {
      console.error(
        formatEvent(
          {
            scope: 'domain-events-health-contract',
            level: 'error',
            code: 'contract_validation_failed',
            message: 'Contract validation failed',
            details: { errors, url },
          },
          output.format
        )
      );
      process.exit(1);
    }

    console.log(
      formatEvent(
        {
          scope: 'domain-events-health-contract',
          level: 'info',
          code: 'contract_validation_ok',
          message: 'Contract validation OK',
          details: { version: CONTRACT_VERSION, url, status: String(payload.status) },
        },
        output.format
      )
    );
    process.exit(0);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      formatEvent(
        {
          scope: 'domain-events-health-contract',
          level: 'error',
          code: 'request_error',
          message: `Request error: ${message}`,
        },
        output.format
      )
    );
    process.exit(1);
  } finally {
    clearTimeout(timeout);
  }
}

void main();
