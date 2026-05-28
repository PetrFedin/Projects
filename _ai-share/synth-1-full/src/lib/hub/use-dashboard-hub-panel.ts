'use client';

import { useMemo, useState, useEffect } from 'react';
import type { HubKpi } from '@/components/hub/hub-today-panel';

const SHOP_KPIS: HubKpi[] = [
  { label: 'Активные B2B', value: '12', hint: 'в работе' },
  { label: 'К оплате', value: '3', hint: 'инвойсы' },
  { label: 'Отгрузки недели', value: '8' },
];

const DISTRIBUTOR_KPIS: HubKpi[] = [
  { label: 'Партнёры', value: '24' },
  { label: 'Риск по окнам', value: '2', hint: 'отгрузки' },
  { label: 'OTB остаток', value: '64%', hint: 'квартал' },
];

/** Хаб `/shop/b2b`: те же демо-величины, что и у ритейл-хаба, подписи под опт. */
const B2B_HUB_KPIS: HubKpi[] = [
  { label: 'B2B в работе', value: '12', hint: 'заказы' },
  { label: 'К оплате', value: '3', hint: 'инвойсы' },
  { label: 'Отгрузки недели', value: '8' },
];

const ADMIN_KPIS: HubKpi[] = [
  { label: 'Организации', value: '48', hint: 'тенанты · 2 демо-бренда' },
  { label: 'События audit (24ч)', value: '1.4k', hint: 'демо' },
  { label: 'Открытые кейсы', value: '3', hint: 'апелляции' },
];

const CLIENT_KPIS: HubKpi[] = [
  { label: 'Активных заказов', value: '2', hint: 'демо' },
  { label: 'В гардеробе', value: '24', hint: 'единицы' },
  { label: 'Карточек «Для вас»', value: '18', hint: 'демо' },
];

const FACTORY_KPIS: HubKpi[] = [
  { label: 'Заказов в контуре', value: '18', hint: 'производство' },
  { label: 'На QC', value: '4', hint: 'смена' },
  { label: 'Отгрузок недели', value: '6' },
];

const FACTORY_SUPPLIER_KPIS: HubKpi[] = [
  { label: 'Открытых RFQ', value: '7', hint: 'ожидают ответа' },
  { label: 'Активных контрактов', value: '12' },
  { label: 'Поставки в окне', value: '3', hint: 'демо' },
];

const BRAND_KPIS: HubKpi[] = [
  { label: 'B2B в работе', value: '14', hint: 'заказы' },
  { label: 'Линий в цеху', value: '6', hint: 'смены' },
  { label: 'Профиль и PIM', value: '92%', hint: 'демо' },
];

export type DashboardHubRole =
  | 'shop'
  | 'distributor'
  | 'b2b'
  | 'admin'
  | 'client'
  | 'factory'
  | 'factory-supplier'
  | 'brand';

export function useDashboardHubPanel(role: DashboardHubRole): {
  kpis: HubKpi[];
  source: string | undefined;
  loading: boolean;
} {
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    setSource(undefined);
    const t = window.setTimeout(() => {
      setSource('demo');
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(t);
  }, [role]);

  const kpis = useMemo(() => {
    if (role === 'admin') return ADMIN_KPIS;
    if (role === 'brand') return BRAND_KPIS;
    if (role === 'client') return CLIENT_KPIS;
    if (role === 'factory-supplier') return FACTORY_SUPPLIER_KPIS;
    if (role === 'factory') return FACTORY_KPIS;
    if (role === 'distributor') return DISTRIBUTOR_KPIS;
    if (role === 'b2b') return B2B_HUB_KPIS;
    return SHOP_KPIS;
  }, [role]);

  return { kpis, source, loading };
}
