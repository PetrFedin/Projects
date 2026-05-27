'use client';

import { Workshop2SurfaceStatusBanner } from '@/components/brand/production/Workshop2SurfaceStatusBanner';
import {
  WORKSHOP2_LIVE_INTEGRATION_LABELS,
  type Workshop2LiveIntegrationKind,
} from '@/lib/production/workshop2-integration-live-required';

/** Явная подпись integration ceiling — mock/stub не считается production path. */
export function Workshop2LiveIntegrationRequiredBanner({
  kind,
  detailRu,
}: {
  kind: Workshop2LiveIntegrationKind;
  detailRu?: string;
}) {
  return (
    <Workshop2SurfaceStatusBanner
      hintRu={WORKSHOP2_LIVE_INTEGRATION_LABELS[kind]}
      detailRu={detailRu}
      tone="amber"
    />
  );
}
