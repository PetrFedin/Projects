'use client';

import {
  Factory,
  Truck,
  ShieldCheck,
  Wallet,
  AlertCircle,
  Activity,
} from 'lucide-react';

export const KPI_STATS = [
  {
    id: 'production',
    label: 'В производстве',
    kpiKey: 'production' as const,
    icon: Factory,
    color: 'text-accent-primary',
    bg: 'bg-accent-primary/10',
    border: 'border-accent-primary/20',
  },
  {
    id: 'cargo',
    label: 'В пути (Карго)',
    kpiKey: 'cargo' as const,
    icon: Truck,
    color: 'text-sky-600',
    bg: 'bg-sky-50/50',
    border: 'border-sky-100/50',
  },
  {
    id: 'qc',
    label: 'Контроль QC',
    kpiKey: 'qc' as const,
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50/50',
    border: 'border-emerald-100/50',
  },
  {
    id: 'finance',
    label: 'К оплате',
    kpiKey: 'finance' as const,
    icon: Wallet,
    color: 'text-rose-600',
    bg: 'bg-rose-50/50',
    border: 'border-rose-100/50',
  },
  {
    id: 'risk',
    label: 'Риск задержки',
    kpiKey: 'risk' as const,
    icon: AlertCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-50/50',
    border: 'border-amber-100/50',
  },
  {
    id: 'efficiency',
    label: 'Эко-эффект',
    kpiKey: 'efficiency' as const,
    icon: Activity,
    color: 'text-teal-600',
    bg: 'bg-teal-50/50',
    border: 'border-teal-100/50',
  },
] as const;
