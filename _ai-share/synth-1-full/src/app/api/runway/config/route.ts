/**
 * Runway feature flags + scroll-experience config — single source of truth.
 */
import { NextResponse } from 'next/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  applyRunwayProductionEnvOverrides,
  normalizeScrollExperienceConfig,
  SCROLL_EXPERIENCE_V3_DEFAULTS,
} from '@/lib/runway/scroll-experience-schema';
import { resolveRunwayAnalyticsAdapterStatus } from '@/lib/runway/runway-analytics-adapters';
import {
  applyRunwayRouteRateLimit,
  runwayRateLimitJsonResponse,
} from '@/lib/server/runway-route-rate-limit';
import {
  isRunwayUploadPresignEnabled,
  isRunwayUploadS3Configured,
} from '@/lib/server/runway-upload-presign';
import { isRunwayUploadAllowedInRuntime } from '@/lib/server/runway-upload';

function loadConfigFromDisk() {
  try {
    const path = join(process.cwd(), 'public/data/scroll-experience.json');
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    const normalized = normalizeScrollExperienceConfig(raw, SCROLL_EXPERIENCE_V3_DEFAULTS);
    return applyRunwayProductionEnvOverrides(normalized);
  } catch {
    return applyRunwayProductionEnvOverrides(SCROLL_EXPERIENCE_V3_DEFAULTS);
  }
}

export async function GET(request: Request) {
  const rate = await applyRunwayRouteRateLimit(request, 'read');
  if (!rate.allowed) return runwayRateLimitJsonResponse(rate);

  try {
    const config = loadConfigFromDisk();
    const analyticsEnabled = resolveRunwayAnalyticsAdapterStatus();

    return NextResponse.json(
      {
        ...config,
        analyticsEnabled,
        upload: {
          presignEnabled: isRunwayUploadPresignEnabled(),
          s3Configured: isRunwayUploadS3Configured(),
          localMultipartEnabled: isRunwayUploadAllowedInRuntime(),
        },
      },
      {
        headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load runway config';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
