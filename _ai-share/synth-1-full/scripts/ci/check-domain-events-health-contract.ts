#!/usr/bin/env node

import {
  DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA,
  parseAndValidateDomainEventsHealthResponse,
} from '../../src/lib/server/domain-events-health';
import { getDomainEventsHealthCheckConfig } from '../../src/lib/server/domain-events-health-check-config';
import {
  DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT_VALUES,
  formatDomainEventsHealthCheckEventForConsole,
  parseDomainEventsHealthCheckOutputFormat,
} from '../../src/lib/server/domain-events-health-check-output';

/**
 * Typed/canonical CI check for /api/ops/domain-events/health response contract.
 * Runtime-safe default npm command points to `.mjs` fallback.
 *
 * Env:
 * - DOMAIN_EVENTS_HEALTH_URL (example: http://127.0.0.1:3000/api/ops/domain-events/health); when missing, the check **skips** (exit 0) unless strict mode is enabled
 * - DOMAIN_EVENTS_HEALTH_CONTRACT_STRICT=1 (fail when URL is missing — for CI / gated checks)
 * - DOMAIN_EVENTS_HEALTH_SECRET (Bearer token for protected endpoint)
 * - DOMAIN_EVENTS_HEALTH_TIMEOUT_MS (default: 10000)
 * - DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT=json|pretty (default: json, one line per event; unknown → json + warn `output_format_invalid`)
 * - SKIP_DOMAIN_EVENTS_HEALTH_CONTRACT_CHECK=1 (skip check)
 */
async function main(): Promise<void> {
  const outputParse = parseDomainEventsHealthCheckOutputFormat(process.env);
  const outputFormat = outputParse.format;
  if (outputParse.invalidRaw) {
    console.warn(
      formatDomainEventsHealthCheckEventForConsole(
        {
          scope: 'domain-events-health-contract',
          level: 'warn',
          code: 'output_format_invalid',
          message: 'Unknown DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT; using json',
          details: {
            received: outputParse.invalidRaw,
            allowed: [...DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT_VALUES],
          },
        },
        'json'
      )
    );
  }
  const config = getDomainEventsHealthCheckConfig(process.env);
  if (config.kind === 'skip') {
    const message =
      config.reason === 'no_url'
        ? 'DOMAIN_EVENTS_HEALTH_URL not set; skipping live domain-events health contract probe (set DOMAIN_EVENTS_HEALTH_CONTRACT_STRICT=1 to fail when URL is missing)'
        : 'Skipped by env flag';
    console.warn(
      formatDomainEventsHealthCheckEventForConsole(
        {
          scope: 'domain-events-health-contract',
          level: 'warn',
          code: 'check_skipped',
          message,
        },
        outputFormat
      )
    );
    process.exit(0);
  }
  if (config.kind === 'error') {
    console.error(
      formatDomainEventsHealthCheckEventForConsole(
        {
          scope: 'domain-events-health-contract',
          level: 'error',
          code: 'config_error',
          message: config.message,
        },
        outputFormat
      )
    );
    process.exit(1);
  }

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), config.timeoutMs);

  try {
    const headers: Record<string, string> = {};
    if (config.secret) {
      headers.authorization = `Bearer ${config.secret}`;
    }

    const response = await fetch(config.url, {
      method: 'GET',
      headers,
      signal: abortController.signal,
    });

    if (!response.ok) {
      console.error(
        formatDomainEventsHealthCheckEventForConsole(
          {
            scope: 'domain-events-health-contract',
            level: 'error',
            code: 'http_error',
            message: `Request failed: HTTP ${response.status} ${response.statusText}`,
            details: { status: response.status, statusText: response.statusText, url: config.url },
          },
          outputFormat
        )
      );
      process.exit(1);
    }

    const parsed = await parseAndValidateDomainEventsHealthResponse(response);
    if (parsed.payload === null) {
      console.error(
        formatDomainEventsHealthCheckEventForConsole(
          {
            scope: 'domain-events-health-contract',
            level: 'error',
            code: 'payload_shape_error',
            message: 'Response payload must be a JSON object',
          },
          outputFormat
        )
      );
      process.exit(1);
    }
    if (!parsed.ok) {
      console.error(
        formatDomainEventsHealthCheckEventForConsole(
          {
            scope: 'domain-events-health-contract',
            level: 'error',
            code: 'contract_validation_failed',
            message: 'Contract validation failed',
            details: { errors: parsed.errors, url: config.url },
          },
          outputFormat
        )
      );
      process.exit(1);
    }

    const payload = parsed.payload as { status?: unknown };
    console.log(
      formatDomainEventsHealthCheckEventForConsole(
        {
          scope: 'domain-events-health-contract',
          level: 'info',
          code: 'contract_validation_ok',
          message: 'Contract validation OK',
          details: {
            version: DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA.version,
            url: config.url,
            status: String(payload.status),
          },
        },
        outputFormat
      )
    );
    process.exit(0);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      formatDomainEventsHealthCheckEventForConsole(
        {
          scope: 'domain-events-health-contract',
          level: 'error',
          code: 'request_error',
          message: `Request error: ${message}`,
        },
        outputFormat
      )
    );
    process.exit(1);
  } finally {
    clearTimeout(timeout);
  }
}

void main();
