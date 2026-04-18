'use client';

import { useState, useCallback } from 'react';
import { fastApiService } from '@/lib/fastapi-service';

const DEFAULT_BRAND_ID = 'syntha-1';

export interface BrandProfileSyncState {
  loading: boolean;
  error: string | null;
  lastSynced: Date | null;
}

export function useBrandProfileSync(brandId = DEFAULT_BRAND_ID) {
  const [state, setState] = useState<BrandProfileSyncState>({
    loading: false,
    error: null,
    lastSynced: null,
  });

  const sync = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await Promise.all([
        fastApiService.getBrandProfile(brandId),
        fastApiService.getBrandDashboard(brandId),
        fastApiService.getIntegrationsStatus(brandId),
      ]);
      setState({ loading: false, error: null, lastSynced: new Date() });
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка синхронизации';
      setState((s) => ({ ...s, loading: false, error: message }));
      return { success: false, error: message };
    }
  }, [brandId]);

  const retryIntegration = useCallback(
    async (provider: string) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        await fastApiService.retryIntegration(brandId, provider);
        setState((s) => ({ ...s, loading: false, lastSynced: new Date() }));
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : `Не удалось переподключить ${provider}`;
        setState((s) => ({ ...s, loading: false, error: message }));
        return { success: false, error: message };
      }
    },
    [brandId]
  );

  return { ...state, sync, retryIntegration };
}
