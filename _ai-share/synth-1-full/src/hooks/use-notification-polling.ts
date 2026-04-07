'use client';

import { useCallback, useEffect, useRef } from 'react';
import { fastApiService } from '@/lib/fastapi-service';
import { useToast } from './use-toast';

/** Polls dashboard and shows toast when B2B order count increases. */
export function useNotificationPolling(brandId: string | undefined, intervalMs = 60000) {
  const { toast } = useToast();
  const lastCount = useRef(0);
  const mounted = useRef(true);

  const check = useCallback(async () => {
    if (!brandId || !mounted.current) return;
    try {
      const dash = await fastApiService.getBrandDashboard(brandId);
      const open = (dash as { openB2bOrders?: number })?.openB2bOrders ?? 0;
      if (open > lastCount.current && lastCount.current > 0) {
        toast({ title: 'Новые B2B заказы', description: `Открытых заказов: ${open}` });
      }
      lastCount.current = open;
    } catch {
      // Ignore; API may be offline
    }
  }, [brandId, toast]);

  useEffect(() => {
    mounted.current = true;
    check();
    const id = setInterval(check, intervalMs);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [check, intervalMs]);
}
