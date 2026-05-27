/**
 * Wave 34 P1: 3D virtual showroom stream token scaffold (без fake live ACK).
 */
import type { Workshop2ProcessEnvLike } from '@/lib/production/workshop2-live-integration-probes-env';

export type Workshop2B2bShowroom3dStreamMode = 'placeholder' | 'live';

export type Workshop2B2bShowroom3dStreamTokenResponse = {
  mode: Workshop2B2bShowroom3dStreamMode;
  token?: string;
  streamUrlConfigured: boolean;
  hintRu: string;
};

export function resolveWorkshop2B2bShowroom3dStreamToken(
  env: Workshop2ProcessEnvLike = process.env
): Workshop2B2bShowroom3dStreamTokenResponse {
  const streamUrl = String(env.WORKSHOP2_B2B_3D_STREAM_URL ?? '').trim();
  if (!streamUrl) {
    return {
      mode: 'placeholder',
      streamUrlConfigured: false,
      hintRu:
        '3D stream не настроен: задайте WORKSHOP2_B2B_3D_STREAM_URL на staging (RU tooltip в UI).',
    };
  }
  const tokenSeed = `${streamUrl}:w34-scaffold`;
  let hash = 0;
  for (let i = 0; i < tokenSeed.length; i++) {
    hash = (hash * 31 + tokenSeed.charCodeAt(i)) >>> 0;
  }
  return {
    mode: 'live',
    token: `w2-3d-${hash.toString(16).padStart(8, '0')}`,
    streamUrlConfigured: true,
    hintRu: '3D stream URL задан — token scaffold (не OAuth / не fake ACK).',
  };
}

export function workshop2B2bShowroom3dStreamTooltipRu(
  env: Workshop2ProcessEnvLike = process.env
): string {
  const resolved = resolveWorkshop2B2bShowroom3dStreamToken(env);
  if (resolved.mode === 'live') return '3D stream: URL настроен на staging.';
  return '3D stream недоступен: укажите WORKSHOP2_B2B_3D_STREAM_URL в .env.staging.live.ru.example.';
}
