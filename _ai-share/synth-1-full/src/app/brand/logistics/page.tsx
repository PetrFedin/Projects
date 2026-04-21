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
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { SectionBlock } from '@/components/brand/SectionBlock';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { RegistryPageHeader } from '@/components/design-system';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { getLogisticsLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
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
function LogisticsLoadingState() {
  return (
    <Card className="border-border-subtle bg-bg-surface2">
      <div className="text-text-secondary py-10 text-center text-sm">
        Загрузка раздела логистики...
      </div>
    </Card>
  );
}
const LogisticsLiveContent = dynamic(
  () => import('@/app/brand/logistics/live/page').then((m) => m.default),
  { ssr: false, loading: () => <LogisticsLoadingState /> }
);

const logisticsTabTriggerClass = cn(
  cabinetSurface.tabsTrigger,
  'h-7 gap-1.5 data-[state=active]:text-accent-primary'
);

export default function LogisticsPage() {
  const [tab, setTab] = useState('hub');
  const kpi = LOGISTICS_KPI;
  return (
    <CabinetPageContent
      maxWidth="full"
      className="space-y-4 pb-16"
      data-testid="brand-logistics-hub-page"
    >
      <RegistryPageHeader
        title="Центр логистики"
        leadPlain="Отгрузки, перевозчики, таможня и транзитные риски в едином операционном потоке."
        actions={
          <>
            <Button asChild variant="outline" size="sm" className="h-8">
              <Link href={ROUTES.brand.documents}>Документы</Link>
            </Button>
            <Button asChild size="sm" className="h-8">
              <Link href={ROUTES.brand.logisticsDutyCalculator}>Рассчитать пошлины</Link>
            </Button>
          </>
        }
      />
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList
          className={cn(cabinetSurface.tabsList, 'h-auto min-h-9 w-full shadow-inner sm:w-fit')}
        >
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
        <TabsContent value="hub" className={cabinetSurface.cabinetProfileTabPanel}>
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
                <Card className="border-border-subtle rounded-xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                      <Package className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="text-text-muted text-[8px] font-black uppercase">
                      Отгрузки за период
                    </p>
                  </div>
                  <p className="text-text-primary text-2xl font-black tabular-nums">
                    {kpi.shipmentsPeriod.toLocaleString('ru-RU')}
                  </p>
                  <p className="text-text-secondary mt-0.5 text-[9px]">ед.</p>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Card className="border-border-subtle rounded-xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100">
                      <Route className="h-4 w-4 text-sky-600" />
                    </div>
                    <p className="text-text-muted text-[8px] font-black uppercase">В пути</p>
                  </div>
                  <p className="text-text-primary text-2xl font-black tabular-nums">
                    {kpi.inTransit}
                  </p>
                  <p className="text-text-secondary mt-0.5 text-[9px]">отправлений</p>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-border-subtle rounded-xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                      <Warehouse className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-text-muted text-[8px] font-black uppercase">Склады</p>
                  </div>
                  <p className="text-text-primary text-2xl font-black tabular-nums">
                    {kpi.warehousesCount}
                  </p>
                  <p className="text-text-secondary mt-0.5 text-[9px]">точек</p>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card className="border-border-subtle rounded-xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                      <Truck className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="text-text-muted text-[8px] font-black uppercase">Перевозчики</p>
                  </div>
                  <p className="text-text-primary text-2xl font-black tabular-nums">
                    {kpi.carriersConnected}
                  </p>
                  <p className="text-text-secondary mt-0.5 text-[9px]">подключено</p>
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
            <p className="text-text-secondary mb-3 px-0.5 text-[10px]">
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
                  <Card className="border-border-subtle group h-full rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-lg">
                    <div className="mb-3 flex items-start justify-between">
                      <div className={cn('rounded-xl p-2.5', card.bg)}>
                        <card.icon className={cn('h-5 w-5', card.color)} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-bg-surface2 text-text-secondary border-none text-[7px] font-black uppercase">
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
                    <h3 className="text-text-primary group-hover:text-accent-primary mb-1 text-sm font-black uppercase tracking-tight transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-text-secondary mb-3 line-clamp-2 text-[10px] leading-relaxed">
                      {card.description}
                    </p>
                    <div className="bg-bg-surface2 mb-3 flex items-center justify-between rounded-lg p-2.5">
                      <span className="text-text-muted text-[8px] font-black uppercase">
                        {card.stats.label}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-black',
                          card.stats.status === 'success'
                            ? 'text-emerald-600'
                            : card.stats.status === 'warning'
                              ? 'text-amber-600'
                              : 'text-text-primary'
                        )}
                      >
                        {card.stats.value}
                      </span>
                    </div>
                    <Button
                      asChild
                      variant="link"
                      className="text-accent-primary hover:text-accent-primary h-auto p-0 text-[8px] font-black uppercase"
                    >
                      <Link
                        href={card.href}
                        className="flex items-center gap-1.5"
                        {...('navTestId' in card && card.navTestId
                          ? { 'data-testid': card.navTestId }
                          : {})}
                      >
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
              <Card className="border-border-subtle rounded-xl bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-accent-primary/15 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                    <FileText className="text-accent-primary h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-text-primary text-sm font-black">ТТН, CMR, ЭТрН</h4>
                    <p className="text-text-secondary text-[10px]">
                      Товарно-транспортные накладные, международная CMR, электронная ТрН и УПД для
                      ЭДО.
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="mt-3 text-[9px] font-black">
                  <Link href={ROUTES.brand.documents}>
                    Документы <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </Card>
              <Card className="border-border-subtle rounded-xl bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100">
                    <Calculator className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="text-text-primary text-sm font-black">Таможня и пошлины</h4>
                    <p className="text-text-secondary text-[10px]">
                      Расчёт пошлин и налогов (DDP), ЕАЭС, landed cost, декларации.
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="mt-3 text-[9px] font-black">
                  <Link href={ROUTES.brand.logisticsDutyCalculator}>
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
            <Card className="border-border-subtle rounded-xl bg-white p-4">
              <p className="text-text-secondary mb-3 text-[10px]">
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
                className="text-accent-primary mt-3 h-auto p-0 text-[9px] font-black"
              >
                <Link href={ROUTES.brand.logisticsRegions}>Настроить регионы и тарифы →</Link>
              </Button>
            </Card>
          </SectionBlock>

          <RelatedModulesBlock
            links={getLogisticsLinks()}
            title="Связанные разделы"
            className="mt-6"
          />
        </TabsContent>
        <TabsContent value="duty" className={cabinetSurface.cabinetProfileTabPanel}>
          {tab === 'duty' && <DutyCalculatorPage />}
        </TabsContent>
        <TabsContent value="consolidation" className={cabinetSurface.cabinetProfileTabPanel}>
          {tab === 'consolidation' && <ConsolidationPage />}
        </TabsContent>
        <TabsContent value="shadow" className={cabinetSurface.cabinetProfileTabPanel}>
          {tab === 'shadow' && <ShadowInventoryPage />}
        </TabsContent>
        <TabsContent value="logistics-live" className={cabinetSurface.cabinetProfileTabPanel}>
          {tab === 'logistics-live' && <LogisticsLiveContent />}
        </TabsContent>
      </Tabs>
    </CabinetPageContent>
  );
}
