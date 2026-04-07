'use client';

import { useEffect } from 'react';
import {
  HttpProductionDataPort,
  LocalStorageProductionDataPort,
  setProductionDataPort,
} from '@/lib/production-data';

/**
 * Инициализирует ProductionDataPort один раз на клиенте.
 * NEXT_PUBLIC_PRODUCTION_DATA_HTTP=true — HttpProductionDataPort (нужен бэкенд по контракту http-production-data-port.ts).
 */
export function ProductionDataBootstrap() {
  useEffect(() => {
    const useHttp = process.env.NEXT_PUBLIC_PRODUCTION_DATA_HTTP === 'true';
    const base =
      process.env.NEXT_PUBLIC_PRODUCTION_DATA_BASE_URL ||
      `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/production-data`;

    if (useHttp) {
      setProductionDataPort(
        new HttpProductionDataPort({
          baseUrl: base.replace(/\/$/, ''),
          getToken: () =>
            typeof window !== 'undefined' ? localStorage.getItem('syntha_access_token') : null,
        })
      );
    } else {
      setProductionDataPort(new LocalStorageProductionDataPort());
    }
  }, []);

  return null;
}
