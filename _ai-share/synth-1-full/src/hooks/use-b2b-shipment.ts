'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchOrderShipment } from '@/lib/b2b/b2b-api-client';
import type { OrderShipmentTracking } from '@/lib/b2b/order-shipment-tracking';
import { getOrderShipmentTracking } from '@/lib/b2b/order-shipment-tracking';

export function useOrderShipmentTracking(orderId: string): {
  data: OrderShipmentTracking | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<OrderShipmentTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!orderId) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchOrderShipment(orderId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки трекинга');
      setData(getOrderShipmentTracking(orderId)); // fallback на мок
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
