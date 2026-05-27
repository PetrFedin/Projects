/**
 * OpenAPI spec для runway API — YAML или JSON.
 * GET /api/runway/openapi?format=json
 */
import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  applyRunwayRouteRateLimit,
  runwayRateLimitJsonResponse,
} from '@/lib/server/runway-route-rate-limit';

const DOCS_DIR = join(process.cwd(), 'docs');
const YAML_PATH = join(DOCS_DIR, 'runway-api.openapi.yaml');
const JSON_PATH = join(DOCS_DIR, 'runway-api.openapi.json');

export async function GET(request: Request) {
  const rate = await applyRunwayRouteRateLimit(request, 'read');
  if (!rate.allowed) return runwayRateLimitJsonResponse(rate);

  try {
    const url = new URL(request.url);
    const format = url.searchParams.get('format') ?? 'yaml';

    if (format === 'json') {
      if (!existsSync(JSON_PATH)) {
        return NextResponse.json({ error: 'OpenAPI JSON spec not found' }, { status: 404 });
      }
      const json = readFileSync(JSON_PATH, 'utf8');
      return new NextResponse(json, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        },
      });
    }

    const yaml = readFileSync(YAML_PATH, 'utf8');
    return new NextResponse(yaml, {
      status: 200,
      headers: {
        'Content-Type': 'application/yaml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load OpenAPI spec';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
