'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fastApiService } from '@/lib/fastapi-service';

const DEFAULT_BRAND_ID = 'syntha-1';

export const BRAND_PROFILE_QUERY_KEY = ['brand-profile', DEFAULT_BRAND_ID] as const;
export const BRAND_DASHBOARD_QUERY_KEY = ['brand-dashboard', DEFAULT_BRAND_ID] as const;
export const BRAND_INTEGRATIONS_QUERY_KEY = ['brand-integrations', DEFAULT_BRAND_ID] as const;

const DEFAULTS = {
  retailersCount: 24,
  openB2bOrders: 7,
  certsActive: 1,
  poInProduction: 4,
  poShipped: 3,
  collectionsCount: 12,
  activeDisputes: 1,
  lastDisputeDate: '10.03.2026',
  lastComplianceEvent: 'Синхр. маркировки 09:12',
  lastProductionEvent: 'TOP-заказ #4521 отправлен',
  markingSyncStatus: 'ok' as const,
  markingLastSync: '09:12',
  linesheetsActive: 2,
  linesheetsCollections: ['SS26 Main', 'SS26 Pre-collection'],
  topRetailers: [
    { name: 'TSUM', volume: '2.1M ₽', lastOrder: '08.03.2026' },
    { name: 'ЦУМ Online', volume: '1.8M ₽', lastOrder: '07.03.2026' },
    { name: 'Lamoda', volume: '1.2M ₽', lastOrder: '05.03.2026' },
  ],
};

export interface BrandDashboardData {
  retailersCount: number;
  openB2bOrders: number;
  certsActive: number;
  certsExpiring?: number;
  poInProduction: number;
  poShipped: number;
  collectionsCount: number;
  activeDisputes: number;
  lastDisputeDate: string;
  lastComplianceEvent: string;
  lastProductionEvent: string;
  markingSyncStatus: 'ok' | 'error' | 'pending';
  markingLastSync: string;
  linesheetsActive: number;
  linesheetsCollections: string[];
  topRetailers: { name: string; volume: string; lastOrder: string }[];
}

function mergeDashboard(
  api: Partial<Record<string, unknown>> | null,
  certsActive = 0,
  certsExpiring = 0
): BrandDashboardData {
  const d = { ...DEFAULTS, certsActive: certsActive || DEFAULTS.certsActive, certsExpiring };
  if (!api || typeof api !== 'object') return d;
  return {
    retailersCount: (api.retailersCount as number) ?? d.retailersCount,
    openB2bOrders: (api.openB2bOrders as number) ?? d.openB2bOrders,
    certsActive: (api.certsActive as number) ?? d.certsActive,
    certsExpiring: (api.certsExpiring as number) ?? d.certsExpiring,
    poInProduction: (api.poInProduction as number) ?? d.poInProduction,
    poShipped: (api.poShipped as number) ?? d.poShipped,
    collectionsCount: (api.collectionsCount as number) ?? d.collectionsCount,
    activeDisputes: (api.activeDisputes as number) ?? d.activeDisputes,
    lastDisputeDate: (api.lastDisputeDate as string) ?? d.lastDisputeDate,
    lastComplianceEvent: (api.lastComplianceEvent as string) ?? d.lastComplianceEvent,
    lastProductionEvent: (api.lastProductionEvent as string) ?? d.lastProductionEvent,
    markingSyncStatus: (api.markingSyncStatus as 'ok' | 'error' | 'pending') ?? d.markingSyncStatus,
    markingLastSync: (api.markingLastSync as string) ?? d.markingLastSync,
    linesheetsActive: (api.linesheetsActive as number) ?? d.linesheetsActive,
    linesheetsCollections: Array.isArray(api.linesheetsCollections)
      ? api.linesheetsCollections as string[]
      : d.linesheetsCollections,
    topRetailers: Array.isArray(api.topRetailers)
      ? api.topRetailers as { name: string; volume: string; lastOrder: string }[]
      : d.topRetailers,
  };
}

export function useBrandProfileData(brandId = DEFAULT_BRAND_ID) {
  const client = useQueryClient();

  const profile = useQuery({
    queryKey: ['brand-profile', brandId],
    queryFn: () => fastApiService.getBrandProfile(brandId),
    staleTime: 60 * 1000,
  });

  const dashboard = useQuery({
    queryKey: ['brand-dashboard', brandId],
    queryFn: () => fastApiService.getBrandDashboard(brandId),
    staleTime: 45 * 1000,
  });

  const integrations = useQuery({
    queryKey: ['brand-integrations', brandId],
    queryFn: () => fastApiService.getIntegrationsStatus(brandId),
    staleTime: 45 * 1000,
  });

  const isLoading = profile.isLoading || dashboard.isLoading || integrations.isLoading;
  const isError = profile.isError || dashboard.isError || integrations.isError;
  const error = profile.error || dashboard.error || integrations.error;

  const refetch = async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: ['brand-profile', brandId] }),
      client.invalidateQueries({ queryKey: ['brand-dashboard', brandId] }),
      client.invalidateQueries({ queryKey: ['brand-integrations', brandId] }),
    ]);
  };

  return {
    profile: profile.data,
    dashboard: dashboard.data,
    integrations: integrations.data,
    isLoading,
    isError,
    error,
    refetch,
    profileQuery: profile,
    dashboardQuery: dashboard,
    integrationsQuery: integrations,
  };
}

export function useBrandDashboardMerged(
  brandId: string,
  certsActive: number,
  certsExpiring: number
) {
  const { dashboard, dashboardQuery } = useBrandProfileData(brandId);
  return {
    data: mergeDashboard(
      dashboard && typeof dashboard === 'object' ? (dashboard as Record<string, unknown>) : null,
      certsActive,
      certsExpiring
    ),
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    refetch: dashboardQuery.refetch,
  };
}
