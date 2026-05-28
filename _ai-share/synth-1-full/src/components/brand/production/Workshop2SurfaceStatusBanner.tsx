'use client';

import {
  WORKSHOP2_SURFACE_BANNER_TONE_CLASS,
  type Workshop2SurfaceBannerTone,
} from '@/lib/production/workshop2-surface-banner-tokens';

type Props = {
  hintRu?: string;
  detailRu?: string;
  tone?: Workshop2SurfaceBannerTone;
};

export function Workshop2SurfaceStatusBanner({ hintRu, detailRu, tone = 'amber' }: Props) {
  if (!hintRu) return null;

  return (
    <div
      className={`rounded-lg border px-3 py-2 text-xs ${WORKSHOP2_SURFACE_BANNER_TONE_CLASS[tone]}`}
      data-testid="workshop2-surface-status-banner"
    >
      <p className="font-medium">{hintRu}</p>
      {detailRu ? <p className="text-text-muted mt-1">{detailRu}</p> : null}
    </div>
  );
}
