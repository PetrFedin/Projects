'use client';

<<<<<<< HEAD
import { DigitalProductionView } from '@/components/brand/digital-production-view';
import {
  Factory,
  Activity,
  Zap,
  Cpu,
  Settings2,
  Leaf,
  Box,
  Database,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { MtoBridge } from '@/components/factory/mto-bridge';

export default function ProductionPage() {
  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div className="space-y-1">
          <div className="mb-1 flex items-center gap-2">
            <Factory className="h-5 w-5 text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
              Core Production Engine
            </span>
          </div>
          <h1 className="font-headline text-base font-black uppercase tracking-tighter">
            Линии пошива
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Мониторинг производственных потоков, мощностей и этапов сборки в реальном времени.
          </p>
        </div>
        <div className="flex gap-3">
          <Badge className="flex h-8 items-center gap-2 border-emerald-100 bg-emerald-50 px-4 text-[10px] font-black uppercase text-emerald-600">
            <Activity className="h-3 w-3 animate-pulse" /> IoT Hub: Online
          </Badge>
          <Button
            variant="outline"
            className="h-8 rounded-lg border-slate-200 text-[10px] font-black uppercase"
          >
            <Settings2 className="mr-2 h-3.5 w-3.5" /> Настроить сенсоры
          </Button>
        </div>
      </header>

      <MtoBridge />

      {/* IoT Real-time Feed Widget */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {[
          { line: 'Line A-1', efficiency: '94%', status: 'Optimal', speed: '120 ops/h' },
          { line: 'Line A-2', efficiency: '88%', status: 'Optimal', speed: '105 ops/h' },
          { line: 'Line B-1', efficiency: '72%', status: 'Warning', speed: '82 ops/h' },
          { line: 'Line C-4', efficiency: '98%', status: 'Ultra', speed: '142 ops/h' },
        ].map((l, i) => (
          <Card key={i} className="relative overflow-hidden rounded-2xl border-slate-100 shadow-sm">
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {l.line}
                  </p>
                  <h4 className="text-sm font-black">{l.efficiency}</h4>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-[8px] font-black uppercase',
                    l.status === 'Optimal'
                      ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                      : l.status === 'Ultra'
                        ? 'border-indigo-100 bg-indigo-50 text-indigo-600'
                        : 'border-rose-100 bg-rose-50 text-rose-600'
                  )}
                >
                  {l.status}
                </Badge>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: l.efficiency }}
                  className={cn(
                    'h-full rounded-full',
                    l.status === 'Optimal'
                      ? 'bg-emerald-500'
                      : l.status === 'Ultra'
                        ? 'bg-indigo-500'
                        : 'bg-rose-500'
                  )}
                />
              </div>
              <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-slate-500">
                <Cpu className="h-3 w-3" /> {l.speed}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Sustainability & Fabric Hub */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="group overflow-hidden rounded-xl border-slate-100 bg-emerald-50/30 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-lg shadow-emerald-200">
              <Leaf className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <Badge className="border-none bg-emerald-100 text-[8px] font-black uppercase text-emerald-700">
                  EU Standard 2026
                </Badge>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  ESG Tracker
                </span>
              </div>
              <h3 className="text-base font-black uppercase tracking-tight">
                Carbon Footprint Auto-Calculator
              </h3>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Авто-расчет углеродного следа каждой партии на основе логистики и типа сырья.
              </p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-emerald-100">
              <ArrowRight className="h-5 w-5 text-emerald-600" />
            </Button>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden rounded-xl border-slate-100 bg-indigo-50/30 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <Database className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <Badge className="border-none bg-indigo-100 text-[8px] font-black uppercase text-indigo-700">
                  CLO3D Sync
                </Badge>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  Asset Hub
                </span>
              </div>
              <h3 className="text-base font-black uppercase tracking-tight">
                Digital Fabric Swatch Library
              </h3>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Цифровые свойства тканей для мгновенного импорта в 3D PLM системы.
              </p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-indigo-100">
              <ArrowRight className="h-5 w-5 text-indigo-600" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="duration-700 animate-in fade-in">
        <DigitalProductionView />
      </div>
=======
import Link from 'next/link';
import { ArrowUpRight, Map } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { B2B_ORDERS_REGISTRY_LABEL } from '@/lib/ui/b2b-registry-label';
import { HubTodayPanel, type HubAlert } from '@/components/hub/hub-today-panel';
import { hubAlertsForSource } from '@/lib/hub/dashboard-hub-data';
import { useDashboardHubPanel } from '@/lib/hub/use-dashboard-hub-panel';
import { USE_FASTAPI } from '@/lib/syntha-api-mode';
import { Button } from '@/components/ui/button';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getFactoryHubCrossRoleLinks } from '@/lib/data/entity-links';

const FACTORY_MANUFACTURER_ALERTS: HubAlert[] = [
  {
    level: 'info',
    text: 'Контур производства в demo-режиме; смены и QC синхронизируются при подключении BFF.',
  },
  { level: 'warning', text: '2 партии на линии ждут подписи QC (демо-данные).' },
];

const manufacturerSections = [
  {
    title: 'Производство',
    items: [
      { href: ROUTES.brand.production, label: 'Производство', desc: 'Операции и заказы' },
      { href: ROUTES.brand.b2bOrders, label: B2B_ORDERS_REGISTRY_LABEL, desc: 'Заказы от брендов' },
    ],
  },
  {
    title: 'QC и логистика',
    items: [
      { href: ROUTES.brand.compliance, label: 'QC и Compliance', desc: 'Контроль качества' },
      { href: ROUTES.brand.logistics, label: 'Логистика', desc: 'Поставки и склады' },
    ],
  },
];

export default function FactoryProductionHubPage() {
  const { kpis, source, loading } = useDashboardHubPanel('factory');
  const alerts = hubAlertsForSource(
    USE_FASTAPI,
    loading ? undefined : source,
    FACTORY_MANUFACTURER_ALERTS
  );

  return (
    <div className="space-y-10">
      <HubTodayPanel
        e2eVariant="factory"
        hubLabel="производственный хаб"
        accentClass="text-emerald-600"
        kpis={kpis}
        actions={[
          { label: 'Производство', href: ROUTES.brand.production, desc: 'Смены и маршруты' },
          { label: B2B_ORDERS_REGISTRY_LABEL, href: ROUTES.brand.b2bOrders, desc: 'От брендов' },
          { label: 'QC и Compliance', href: ROUTES.brand.compliance, desc: 'Контроль качества' },
        ]}
        alerts={alerts}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="text-[10px] font-black uppercase" asChild>
          <Link href={ROUTES.shop.b2bWorkspaceMap}>
            <Map className="mr-2 size-3.5" />
            Карта процессов B2B
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-text-muted text-[10px] font-black uppercase"
          asChild
        >
          <Link href={ROUTES.shop.home}>Кабинет магазина</Link>
        </Button>
      </div>

      <div>
        <h2 className="text-text-secondary mb-1 text-[11px] font-black uppercase tracking-[0.2em]">
          Все разделы
        </h2>
        <p className="text-text-primary text-sm">
          Производство, заказы и QC — навигация слева и ссылки ниже.
        </p>
      </div>

      <RelatedModulesBlock
        links={getFactoryHubCrossRoleLinks()}
        title="Связь с брендом и ритейлом"
        className="border-border-default rounded-lg border bg-white p-4 shadow-sm"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {manufacturerSections.map((section) => (
          <div
            key={section.title}
            className="border-border-default rounded-lg border bg-white p-4 shadow-sm"
          >
            <h3 className="text-text-muted mb-3 text-[10px] font-black uppercase tracking-widest">
              {section.title}
            </h3>
            <ul className="space-y-1.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-text-primary hover:bg-bg-surface2 group flex items-center justify-between rounded-md px-2.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors"
                  >
                    <div>
                      <span className="transition-colors group-hover:text-emerald-600">
                        {item.label}
                      </span>
                      <p className="text-text-muted mt-0.5 text-[9px] font-normal normal-case tracking-normal">
                        {item.desc}
                      </p>
                    </div>
                    <ArrowUpRight className="text-text-muted size-3 shrink-0 group-hover:text-emerald-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
>>>>>>> recover/cabinet-wip-from-stash
    </div>
  );
}
