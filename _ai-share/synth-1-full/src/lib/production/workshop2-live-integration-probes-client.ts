/**
 * Wave 32–33: клиентский fetch server env probes (ceilings UI + roadmap).
 */
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import type {
  Workshop2IntegrationCeilingProbe,
  workshop2LiveIntegrationProbeSummary,
} from '@/lib/production/workshop2-live-integration-probes-env';

export type Workshop2LiveIntegrationProbes = ReturnType<
  typeof workshop2LiveIntegrationProbeSummary
>;

export type Workshop2IntegrationProbesResponse = {
  ok?: boolean;
  probes?: Workshop2LiveIntegrationProbes;
  probeFlags?: Record<keyof Workshop2LiveIntegrationProbes, { configured: boolean; live: boolean }>;
  ceilings?: (Workshop2IntegrationCeilingProbe & { live?: boolean })[];
  allLive?: boolean;
  readyForInvestorDemo?: boolean;
  stagingContractMode?: boolean;
  catalogHonesty?: {
    totalItems: number;
    atOrAbove9: number;
    ceilingsBelow9: number;
    noteRu: string;
  };
  wave2Horizontal?: ReturnType<
    typeof import('@/lib/production/workshop2-live-integration-probes-env').buildWorkshop2Wave2HorizontalProbes
  >;
  wave4Horizontal?: ReturnType<
    typeof import('@/lib/production/workshop2-live-integration-probes').buildWorkshop2Wave4HorizontalProbes
  >;
  wave3Horizontal?: ReturnType<
    typeof import('@/lib/production/workshop2-live-integration-probes').buildWorkshop2Wave3HorizontalProbes
  >;
  wave6Horizontal?: ReturnType<
    typeof import('@/lib/production/workshop2-live-integration-probes').buildWorkshop2Wave6HorizontalProbes
  >;
  investorReadinessReasons?: string[];
  market?: 'ru' | 'global';
  wave9RuHorizontal?: ReturnType<
    typeof import('@/lib/production/workshop2-live-integration-probes').buildWorkshop2Wave9RuHorizontalProbes
  >;
  wave10RuHorizontal?: ReturnType<
    typeof import('@/lib/production/workshop2-live-integration-probes').buildWorkshop2Wave10RuHorizontalProbes
  >;
  wave20RuMaturity?: ReturnType<
    typeof import('@/lib/production/workshop2-live-integration-probes').buildWorkshop2Wave20RuMaturityProbe
  >;
};

export async function fetchWorkshop2LiveIntegrationProbes(): Promise<Workshop2IntegrationProbesResponse | null> {
  try {
    const res = await fetch('/api/workshop2/integration-probes', {
      headers: buildWorkshop2ApiRequestHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as Workshop2IntegrationProbesResponse;
  } catch {
    return null;
  }
}
