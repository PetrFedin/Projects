'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import {
  Download, Package, DollarSign, Factory, Warehouse, Store, TrendingUp,
  Upload, FileSpreadsheet, Database, Zap, Users, Layers, ChevronRight, ArrowUpRight,
  PieChart, Truck, Megaphone, Calendar, MessageSquare, ShieldCheck, Globe,
  MapPin, Target, BarChart2
} from 'lucide-react';
import { buildBIDashboard, exportBIDataToCSV } from '@/lib/analytics/bi-service';
import { useRbac } from '@/hooks/useRbac';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getAnalyticsLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';

export default function BIAnalyticsPage() {
  const { can } = useRbac();
  const { toast } = useToast();
  const [data] = useState(() => buildBIDashboard());
  const [importSource, setImportSource] = useState<'1c' | 'excel' | 'moi_sklad' | null>(null);

  const canExport = can('analytics', 'export');

  const handleExport = () => {
    const csv = exportBIDataToCSV(data);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bi-dashboard-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Экспорт', description: 'BI дашборд экспортирован' });
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-6xl pb-24">
      <Card className="rounded-xl border-slate-200 bg-slate-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Дашборды аналитики</CardTitle>
          <CardDescription>План vs Факт, закупки, Маркетрум/Аутлет, сводная аналитика, Sell-Through BI, Markdown, Geo-Demand</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.budgetActual}>План vs Факт</Link></Button>
          <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.analyticsPhase2}>Phase 2 Закупки</Link></Button>
          <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.analyticsPlatformSales}>Маркетрум и Аутлет</Link></Button>
          <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.analyticsUnified}>Сводная аналитика</Link></Button>
          <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.analyticsExternalSales}>Внешние продажи</Link></Button>
          <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.analyticsSellThrough}>Sell-Through BI</Link></Button>
          <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.pricingMarkdown}>Markdown Optimizer</Link></Button>
          <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.analyticsGeoDemand}>Geo-Demand Heatmap</Link></Button>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase">B2B Analytics Hub</h1>
          <p className="text-sm text-slate-500">Продажи, производство, остатки, платформа, коллекции, дистрибуторы</p>
        </div>
        <div className="flex gap-2">
          {canExport && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" /> CSV
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.brand.controlCenter}>Центр управления</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-100 p-1 rounded-xl h-auto border border-slate-200 flex-wrap">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white">Сводка</TabsTrigger>
          <TabsTrigger value="sales" className="rounded-lg data-[state=active]:bg-white">Продажи</TabsTrigger>
          <TabsTrigger value="production" className="rounded-lg data-[state=active]:bg-white">Production</TabsTrigger>
          <TabsTrigger value="inventory" className="rounded-lg data-[state=active]:bg-white">Остатки</TabsTrigger>
          <TabsTrigger value="network" className="rounded-lg data-[state=active]:bg-white">Network Sell-Through</TabsTrigger>
          <TabsTrigger value="geo" className="rounded-lg data-[state=active]:bg-white">Geo-Demand</TabsTrigger>
          <TabsTrigger value="sentiment" className="rounded-lg data-[state=active]:bg-white">Trend Sentiment</TabsTrigger>
          <TabsTrigger value="budget" className="rounded-lg data-[state=active]:bg-white">Budget vs Actual</TabsTrigger>
          <TabsTrigger value="import" className="rounded-lg data-[state=active]:bg-white">Импорт данных</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI карточки */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Link href="/brand/production">
              <Card className="h-full hover:border-indigo-200 transition-colors cursor-pointer">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs flex items-center gap-2">
                    <Factory className="h-4 w-4 text-purple-600" /> Production
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-black">{data.production.poCount} PO</p>
                  <p className="text-[10px] text-slate-500">{data.production.shippedCount} отгружено · {data.production.collectionsCount} колл.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/brand/b2b-orders">
              <Card className="h-full hover:border-indigo-200 transition-colors cursor-pointer">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs flex items-center gap-2">
                    <Package className="h-4 w-4 text-indigo-600" /> B2B
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-black">{data.b2b.revenue}</p>
                  <p className="text-[10px] text-slate-500">{data.b2b.ordersCount} заказов · {data.b2b.retailersCount} ритейлеров</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/brand/finance">
              <Card className="h-full hover:border-indigo-200 transition-colors cursor-pointer">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" /> Finance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-black">{data.finance.revenueMonth}</p>
                  <p className="text-[10px] text-emerald-600 font-bold">{data.finance.pnl} P&L</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/brand/warehouse">
              <Card className="h-full hover:border-indigo-200 transition-colors cursor-pointer">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs flex items-center gap-2">
                    <Warehouse className="h-4 w-4 text-amber-600" /> Склад
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-black">{data.warehouse.totalUnits} ед.</p>
                  <p className="text-[10px] text-slate-500">{data.warehouse.skuCount} SKU · оборачиваемость {data.warehouse.turnoverRate}</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/brand/showroom">
              <Card className="h-full hover:border-indigo-200 transition-colors cursor-pointer">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs flex items-center gap-2">
                    <Store className="h-4 w-4 text-blue-600" /> Marketroom
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-black">{data.platform.marketroomRevenue}</p>
                  <p className="text-[10px] text-slate-500">Outlet: {data.platform.outletRevenue}</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/brand/customers">
              <Card className="h-full hover:border-indigo-200 transition-colors cursor-pointer">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs flex items-center gap-2">
                    <Users className="h-4 w-4 text-rose-600" /> Клиенты
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-black">{data.platform.customerBase}</p>
                  <p className="text-[10px] text-slate-500">{data.platform.preOrders} предзаказов</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* По каналам */}
          <Card className="rounded-xl border border-slate-100">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <PieChart className="h-4 w-4" /> Выручка по каналам
              </CardTitle>
              <CardDescription>Распределение продаж</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(data.byChannel).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <span className="text-[11px] font-bold uppercase text-slate-600">
                      {k === 'b2b' ? 'B2B Опт' : k === 'b2c' ? 'B2C' : k === 'marketroom' ? 'Marketroom' : 'Outlet'}
                    </span>
                    <span className="font-black text-slate-900">{v}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Топ ритейлеры + по коллекциям */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="rounded-xl border border-slate-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Топ ритейлеры</CardTitle>
                <Button variant="ghost" size="sm" className="text-[10px]" asChild>
                  <Link href="/brand/retailers">Все <ChevronRight className="h-3 w-3" /></Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.topRetailers.map((r, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50">
                      <span className="font-medium text-sm">{r.name}</span>
                      <span className="font-bold tabular-nums">{r.revenue}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl border border-slate-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">По коллекциям / дропам</CardTitle>
                <Button variant="ghost" size="sm" className="text-[10px]" asChild>
                  <Link href="/brand/planning">Планирование <ChevronRight className="h-3 w-3" /></Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.byCollection.map((c, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50">
                      <span className="font-medium text-sm">{c.name}</span>
                      <div className="text-right">
                        <span className="font-bold tabular-nums block">{c.revenue}</span>
                        <span className="text-[10px] text-slate-500">Sell-through {c.sellThrough}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card className="rounded-xl border border-indigo-100 bg-indigo-50/30">
            <CardHeader>
              <CardTitle>B2B и дистрибуторы</CardTitle>
              <CardDescription>Продажи магазинам, дистрибуторам (как у Zara, H&M)</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white border">
                <p className="text-[10px] font-bold uppercase text-slate-500">Выручка B2B</p>
                <p className="text-xl font-black">{data.b2b.revenue}</p>
              </div>
              <div className="p-4 rounded-lg bg-white border">
                <p className="text-[10px] font-bold uppercase text-slate-500">Дистрибуторы</p>
                <p className="text-xl font-black">{data.b2b.distributorsRevenue}</p>
              </div>
              <div className="p-4 rounded-lg bg-white border">
                <p className="text-[10px] font-bold uppercase text-slate-500">Дропов коллекций</p>
                <p className="text-xl font-black">{data.b2b.collectionDrops}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:border-indigo-200 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                Платформа: Marketroom, Outlet, Pre-orders
                <Link href={ROUTES.brand.analyticsPlatformSales} className="text-xs font-normal text-indigo-600 hover:underline">Полная статистика →</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
              <div><p className="text-[10px] text-slate-500">Marketroom</p><p className="font-black">{data.platform.marketroomRevenue}</p></div>
              <div><p className="text-[10px] text-slate-500">Outlet</p><p className="font-black">{data.platform.outletRevenue}</p></div>
              <div><p className="text-[10px] text-slate-500">Предзаказы</p><p className="font-black">{data.platform.preOrders}</p></div>
              <div><p className="text-[10px] text-slate-500">База клиентов</p><p className="font-black">{data.platform.customerBase}</p></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <Card><CardContent className="pt-4"><p className="text-[10px] text-slate-500">PO в работе</p><p className="text-xl font-black">{data.production.poCount}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-[10px] text-slate-500">Отгружено</p><p className="text-xl font-black">{data.production.shippedCount}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-[10px] text-slate-500">Lead time (дн.)</p><p className="text-xl font-black">{data.production.avgLeadTime}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-[10px] text-slate-500">Узких мест</p><p className="text-xl font-black text-amber-600">{data.production.bottleneckOrders}</p></CardContent></Card>
          </div>
          <Button variant="outline" asChild><Link href="/brand/production">Production →</Link></Button>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <Card><CardContent className="pt-4"><p className="text-[10px] text-slate-500">SKU</p><p className="text-xl font-black">{data.warehouse.skuCount}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-[10px] text-slate-500">Всего ед.</p><p className="text-xl font-black">{data.warehouse.totalUnits}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-[10px] text-slate-500">Оборачиваемость</p><p className="text-xl font-black">{data.warehouse.turnoverRate}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-[10px] text-slate-500">Мёртвый сток</p><p className="text-xl font-black text-rose-600">{data.warehouse.deadStock}</p></CardContent></Card>
          </div>
          <Button variant="outline" asChild><Link href="/brand/warehouse">Склад →</Link></Button>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card className="rounded-xl border border-indigo-100 bg-indigo-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Network Sell-Through BI
              </CardTitle>
              <CardDescription>
                Анонимизированное сравнение своих продаж со средними показателями индустрии. Benchmark по категориям, регионам, сезонам.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-white border">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Ваш Sell-Through</p>
                  <p className="text-2xl font-black">72%</p>
                  <p className="text-[10px] text-emerald-600 mt-1">+5% vs индустрия</p>
                </div>
                <div className="p-4 rounded-lg bg-white border">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Среднее по индустрии</p>
                  <p className="text-2xl font-black">67%</p>
                  <p className="text-[10px] text-slate-500 mt-1">Fashion, premium</p>
                </div>
                <div className="p-4 rounded-lg bg-white border">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Топ-25% брендов</p>
                  <p className="text-2xl font-black">78%</p>
                  <p className="text-[10px] text-slate-500 mt-1">Ваш потенциал</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-4">
                Данные агрегируются анонимно. Подключите импорт из 1С/Мой Склад для актуализации.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geo" className="space-y-6">
          <Card className="rounded-xl border border-indigo-100 bg-indigo-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Geo-Demand Heatmap
              </CardTitle>
              <CardDescription>
                Карта реального спроса для планирования открытий новых точек и распределения стока по регионам.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold">Интерактивная карта спроса</p>
                  <p className="text-[11px]">Москва, СПб, регионы — тепловая карта заказов</p>
                  <p className="text-[10px] mt-2 text-slate-400">Скоро: подключение к данным продаж</p>
                </div>
              </div>
              <div className="grid md:grid-cols-4 gap-3 mt-4">
                {['Москва', 'СПб', 'Регионы', 'Онлайн'].map((r, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white border text-center">
                    <p className="text-[10px] text-slate-500">{r}</p>
                    <p className="font-black">{[42, 18, 28, 12][i]}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6">
          <Card className="rounded-xl border border-indigo-100 bg-indigo-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" /> Trend Sentiment Radar
              </CardTitle>
              <CardDescription>
                Анализ соцсетей (TikTok, Instagram) для корректировки дизайна в текущем цикле. Тональность и тренды по хэштегам.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border">
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">TikTok · #streetwear #fashion</p>
                  <div className="flex items-center gap-2">
                    <div className="h-3 flex-1 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-[72%] rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-sm font-black text-emerald-600">72% позитив</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Рост упоминаний oversized, cargo</p>
                </div>
                <div className="p-4 rounded-xl bg-white border">
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">Instagram · бренд и конкуренты</p>
                  <div className="flex items-center gap-2">
                    <div className="h-3 flex-1 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-[65%] rounded-full bg-indigo-500" />
                    </div>
                    <span className="text-sm font-black text-indigo-600">65% позитив</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Запрос на экологичные материалы</p>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                <strong>Радар трендов:</strong> Подключите API TikTok/Instagram или загружайте отчёты для актуализации. Рекомендации по дизайну и ассортименту в текущем дропе.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <Card className="rounded-xl border border-indigo-100 bg-indigo-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" /> Budget vs Actual
              </CardTitle>
              <CardDescription>
                Сравнение плановых и фактических затрат по коллекциям. Контроль бюджета на каждом этапе.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'SS26 Main', planned: '2.4M ₽', actual: '2.1M ₽', diff: '-12%', ok: true },
                  { name: 'SS26 Drop 2', planned: '1.8M ₽', actual: '2.0M ₽', diff: '+11%', ok: false },
                  { name: 'AW26', planned: '3.2M ₽', actual: '—', diff: 'В работе', ok: null },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white border">
                    <span className="font-medium">{row.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500 text-sm">План: {row.planned}</span>
                      <span className="text-sm font-bold">Факт: {row.actual}</span>
                      <span className={cn(
                        "text-[11px] font-bold",
                        row.ok === true && "text-emerald-600",
                        row.ok === false && "text-amber-600",
                        row.ok === null && "text-slate-400"
                      )}>{row.diff}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="default" size="sm" asChild>
                  <Link href={ROUTES.brand.budgetActual}>Полный отчёт План vs Факт →</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/brand/production">Production → Бюджет коллекций</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <Card className="rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" /> Загрузка и интеграция данных
              </CardTitle>
              <CardDescription>
                Импорт результатов продаж из других магазинов и платформ: 1С, Excel, Мой Склад.
                Данные объединяются с аналитикой платформы.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setImportSource('1c')}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    importSource === '1c' ? "border-indigo-600 bg-indigo-50" : "border-slate-200 hover:border-indigo-200 bg-white"
                  )}
                >
                  <Database className="h-8 w-8 text-indigo-600 mb-2" />
                  <p className="font-bold text-sm">1С:Предприятие</p>
                  <p className="text-[11px] text-slate-500 mt-1">Интеграция через API или выгрузку</p>
                </button>
                <button
                  onClick={() => setImportSource('excel')}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    importSource === 'excel' ? "border-indigo-600 bg-indigo-50" : "border-slate-200 hover:border-indigo-200 bg-white"
                  )}
                >
                  <FileSpreadsheet className="h-8 w-8 text-emerald-600 mb-2" />
                  <p className="font-bold text-sm">Excel / CSV</p>
                  <p className="text-[11px] text-slate-500 mt-1">Загрузка файла выгрузки</p>
                </button>
                <button
                  onClick={() => setImportSource('moi_sklad')}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    importSource === 'moi_sklad' ? "border-indigo-600 bg-indigo-50" : "border-slate-200 hover:border-indigo-200 bg-white"
                  )}
                >
                  <Truck className="h-8 w-8 text-amber-600 mb-2" />
                  <p className="font-bold text-sm">Мой Склад</p>
                  <p className="text-[11px] text-slate-500 mt-1">Синхронизация остатков и продаж</p>
                </button>
              </div>
              {importSource && (
                <div className="mt-4 p-4 rounded-xl bg-white border">
                  <p className="text-sm font-bold mb-2">
                    {importSource === '1c' && 'Подключение 1С'}
                    {importSource === 'excel' && 'Загрузка Excel'}
                    {importSource === 'moi_sklad' && 'Подключение Мой Склад'}
                  </p>
                  <p className="text-[11px] text-slate-600 mb-3">
                    {importSource === '1c' && 'Настройте API-интеграцию в разделе Интеграции или загрузите выгрузку.'}
                    {importSource === 'excel' && 'Перетащите файл или нажмите для выбора. Форматы: .xlsx, .csv'}
                    {importSource === 'moi_sklad' && 'Подключите аккаунт Мой Склад в настройках интеграций.'}
                  </p>
                  <Button size="sm" variant="outline">
                    {importSource === 'excel' ? 'Выбрать файл' : 'Настроить'}
                  </Button>
                </div>
              )}
              <p className="text-[10px] text-slate-400 mt-4">
                Интеграции настраиваются в <Link href="/brand/integrations" className="text-indigo-600 underline">Интеграции</Link> и <Link href="/brand/settings" className="text-indigo-600 underline">Настройки</Link>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RelatedModulesBlock links={getAnalyticsLinks()} />
    </div>
  );
}
