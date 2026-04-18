'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Truck,
  Package,
  ArrowRight,
  ArrowUpRight,
  Warehouse,
  FileText,
  MapPin,
  Calculator,
  Route,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SectionBlock } from '@/components/brand/SectionBlock';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getLogisticsLinks } from '@/lib/data/entity-links';
import { SECTION_META, LOGISTICS_KPI, LOGISTICS_NAV_CARDS } from './page-data';

const DutyCalculatorPage = dynamic(() => import('@/app/brand/logistics/duty-calculator/page'), {
  ssr: false,
});
const ConsolidationPage = dynamic(() => import('@/app/brand/logistics/consolidation/page'), {
  ssr: false,
});
const ShadowInventoryPage = dynamic(() => import('@/app/brand/logistics/shadow-inventory/page'), {
  ssr: false,
});
const LogisticsLiveContent = dynamic(
  () => import('@/app/brand/logistics/live/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);

const logisticsTabTriggerClass =
  'text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5';

export default function LogisticsPage() {
  const [tab, setTab] = useState('hub');
  const kpi = LOGISTICS_KPI;
  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 pb-20 md:px-6">
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="h-9 w-fit gap-0.5 border border-slate-200 bg-slate-50 px-1">
          <TabsTrigger value="hub" className={logisticsTabTriggerClass}>
            <Truck className="h-3 w-3 shrink-0" />
            Центр логистики
          </TabsTrigger>
          <TabsTrigger value="duty" className={logisticsTabTriggerClass}>
            <Calculator className="h-3 w-3 shrink-0" />
            Таможня и пошлины
          </TabsTrigger>
          <TabsTrigger value="consolidation" className={logisticsTabTriggerClass}>
            <Package className="h-3 w-3 shrink-0" />
            Консолидация
          </TabsTrigger>
          <TabsTrigger value="shadow" className={logisticsTabTriggerClass}>
            <Route className="h-3 w-3 shrink-0" />
            Товар в пути
          </TabsTrigger>
          <TabsTrigger value="logistics-live" className={logisticsTabTriggerClass}>
            <Zap className="h-3 w-3 shrink-0" />
            LIVE
          </TabsTrigger>
        </TabsList>
        <TabsContent value="hub" className="mt-0 space-y-6">
          {/* Ключевые показатели */}
          <SectionBlock
            title="Ключевые показатели"
            meta={SECTION_META.overview}
            accentColor="amber"
            className="min-w-0"
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
              >
                <Card className="rounded-xl border-slate-100 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                      <Package className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="text-[8px] font-black uppercase text-slate-400">
                      Отгрузки за период
                    </p>
                  </div>
                  <p className="text-2xl font-black tabular-nums text-slate-900">
                    {kpi.shipmentsPeriod.toLocaleString('ru-RU')}
                  </p>
                  <p className="mt-0.5 text-[9px] text-slate-500">ед.</p>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Card className="rounded-xl border-slate-100 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100">
                      <Route className="h-4 w-4 text-sky-600" />
                    </div>
                    <p className="text-[8px] font-black uppercase text-slate-400">В пути</p>
                  </div>
                  <p className="text-2xl font-black tabular-nums text-slate-900">{kpi.inTransit}</p>
                  <p className="mt-0.5 text-[9px] text-slate-500">отправлений</p>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="rounded-xl border-slate-100 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                      <Warehouse className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-[8px] font-black uppercase text-slate-400">Склады</p>
                  </div>
                  <p className="text-2xl font-black tabular-nums text-slate-900">
                    {kpi.warehousesCount}
                  </p>
                  <p className="mt-0.5 text-[9px] text-slate-500">точек</p>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card className="rounded-xl border-slate-100 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                      <Truck className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="text-[8px] font-black uppercase text-slate-400">Перевозчики</p>
                  </div>
                  <p className="text-2xl font-black tabular-nums text-slate-900">
                    {kpi.carriersConnected}
                  </p>
                  <p className="mt-0.5 text-[9px] text-slate-500">подключено</p>
                </Card>
              </motion.div>
            </div>
          </SectionBlock>

          {/* Разделы логистики — карточки как в Организации */}
          <SectionBlock
            title="Разделы логистики"
            meta={SECTION_META.modules}
            accentColor="blue"
            className="min-w-0"
          >
            <p className="mb-3 px-0.5 text-[10px] text-slate-500">
              Склады, перевозчики (СДЭК, Боксберри, ПЭК, ДПД, Почта РФ), документы (ТТН, CMR, ЭТрН),
              таможня, трекинг, регионы и возвраты.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {LOGISTICS_NAV_CARDS.map((card, i) => (
                <motion.div
                  key={card.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="group h-full rounded-xl border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-lg">
                    <div className="mb-3 flex items-start justify-between">
                      <div className={cn('rounded-xl p-2.5', card.bg)}>
                        <card.icon className={cn('h-5 w-5', card.color)} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="border-none bg-slate-50 text-[7px] font-black uppercase text-slate-600">
                          {card.badge}
                        </Badge>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Link href={card.href}>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <h3 className="mb-1 text-sm font-black uppercase tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                      {card.title}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-[10px] leading-relaxed text-slate-500">
                      {card.description}
                    </p>
                    <div className="mb-3 flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
                      <span className="text-[8px] font-black uppercase text-slate-400">
                        {card.stats.label}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-black',
                          card.stats.status === 'success'
                            ? 'text-emerald-600'
                            : card.stats.status === 'warning'
                              ? 'text-amber-600'
                              : 'text-slate-900'
                        )}
                      >
                        {card.stats.value}
                      </span>
                    </div>
                    <Button
                      asChild
                      variant="link"
                      className="h-auto p-0 text-[8px] font-black uppercase text-indigo-600 hover:text-indigo-700"
                    >
                      <Link href={card.href} className="flex items-center gap-1.5">
                        Перейти <ArrowRight className="h-2.5 w-2.5" />
                      </Link>
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </SectionBlock>

          {/* Документы и таможня — краткий блок */}
          <SectionBlock
            title="Документы и таможня"
            meta={SECTION_META.documents}
            accentColor="slate"
            className="min-w-0"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Card className="rounded-xl border-slate-100 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">ТТН, CMR, ЭТрН</h4>
                    <p className="text-[10px] text-slate-500">
                      Товарно-транспортные накладные, международная CMR, электронная ТрН и УПД для
                      ЭДО.
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="mt-3 text-[9px] font-black">
                  <Link href="/brand/documents">
                    Документы <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </Card>
              <Card className="rounded-xl border-slate-100 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100">
                    <Calculator className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Таможня и пошлины</h4>
                    <p className="text-[10px] text-slate-500">
                      Расчёт пошлин и налогов (DDP), ЕАЭС, landed cost, декларации.
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="mt-3 text-[9px] font-black">
                  <Link href="/brand/logistics/duty-calculator">
                    Калькулятор пошлин <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </Card>
            </div>
          </SectionBlock>

          {/* Регионы и сроки доставки */}
          <SectionBlock
            title="Регионы и сроки доставки"
            meta={SECTION_META.regions}
            accentColor="emerald"
            className="min-w-0"
          >
            <Card className="rounded-xl border-slate-100 bg-white p-4">
              <p className="mb-3 text-[10px] text-slate-600">
                РФ и СНГ: зоны доставки перевозчиков (СДЭК, Боксберри, ПЭК, ДПД, Почта России).
                Условия Ex-Works, DDP, до двери. Сроки и ограничения по регионам.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-[9px]">
                  Москва и МО
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  Санкт-Петербург
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  Регионы РФ
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  СНГ
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  Международная доставка
                </Badge>
              </div>
              <Button
                asChild
                variant="link"
                className="mt-3 h-auto p-0 text-[9px] font-black text-indigo-600"
              >
                <Link href="/brand/logistics/regions">Настроить регионы и тарифы →</Link>
              </Button>
            </Card>
          </SectionBlock>

          <RelatedModulesBlock
            links={getLogisticsLinks()}
            title="Связанные разделы"
            className="mt-6"
          />
        </TabsContent>
        <TabsContent value="duty" className="mt-0">
          {tab === 'duty' && <DutyCalculatorPage />}
        </TabsContent>
        <TabsContent value="consolidation" className="mt-0">
          {tab === 'consolidation' && <ConsolidationPage />}
        </TabsContent>
        <TabsContent value="shadow" className="mt-0">
          {tab === 'shadow' && <ShadowInventoryPage />}
        </TabsContent>
        <TabsContent value="logistics-live" className="mt-0">
          {tab === 'logistics-live' && <LogisticsLiveContent />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
