'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  ListOrdered,
  Users,
  CheckCircle,
  Percent,
  Calendar as CalendarIcon,
  X,
  Factory as FactoryIcon,
  ShieldCheck,
  Zap,
  AlertTriangle,
  TrendingUp as TrendingUpIcon,
  ArrowRight,
  DollarSign,
  Lock,
  History,
  Info,
  Cpu,
  Activity,
  Scissors,
  Leaf,
  Scan,
} from 'lucide-react';
import { StatCard } from '../stat-card';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
<<<<<<< HEAD
import { cn } from '@/lib/utils';
=======
>>>>>>> recover/cabinet-wip-from-stash
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
} from 'recharts';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { motion } from 'framer-motion';
import { fastApiService } from '@/lib/fastapi-service';
import { useEffect } from 'react';

type Period = 'week' | 'month' | 'year' | 'custom';

const productionLoadData = [
  { month: 'Август', plan: 4200, fact: 3800 },
  { month: 'Сентябрь', plan: 5000, fact: 4500 },
  { month: 'Октябрь', plan: 5000, fact: 5100 },
  { month: 'Ноябрь', plan: 4800, fact: 0 },
  { month: 'Декабрь', plan: 4800, fact: 0 },
];

const recentOrders = [
  {
    order: 'PO-001',
<<<<<<< HEAD
    brand: 'Syntha',
=======
    brand: 'Syntha Lab',
>>>>>>> recover/cabinet-wip-from-stash
    item: 'Кашемировый свитер',
    quantity: 500,
    cost: 3500000,
    deadline: '2024-08-15',
    status: 'В производстве',
    scfAvailable: true,
  },
  {
    order: 'PO-002',
<<<<<<< HEAD
    brand: 'A.P.C.',
=======
    brand: 'Nordic Wool',
>>>>>>> recover/cabinet-wip-from-stash
    item: 'Классические брюки',
    quantity: 750,
    cost: 4200000,
    deadline: '2024-08-20',
    status: 'Контроль качества',
    scfAvailable: true,
  },
  {
    order: 'PO-003',
<<<<<<< HEAD
    brand: 'Acne Studios',
=======
    brand: 'Syntha Lab',
>>>>>>> recover/cabinet-wip-from-stash
    item: 'Джинсовая куртка',
    quantity: 300,
    cost: 1800000,
    deadline: '2024-09-01',
    status: 'Запланировано',
    scfAvailable: false,
  },
];

const statusConfig: { [key: string]: string } = {
  'В производстве': 'bg-blue-500',
  'Контроль качества': 'bg-yellow-500',
  Запланировано: 'bg-gray-400',
};

export function ManufacturerDashboard() {
  const [period, setPeriod] = useState<Period>('month');
  const [date, setDate] = useState<DateRange | undefined>();
  const [serverKpis, setServerKpis] = useState<any>(null);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const response = await fastApiService.getDashboardKpis();
        if (response.data && response.data.kpis) {
          setServerKpis(response.data.kpis);
        }
      } catch (err) {
        console.warn('Failed to fetch manufacturer KPIs:', err);
      }
    };
    fetchKpis();
  }, [period]);

  return (
    <div className="space-y-4">
      {/* Industrial Fintech Integration — Compact Banner */}
<<<<<<< HEAD
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 text-white shadow-xl">
=======
      <div className="bg-text-primary border-text-primary/30 relative overflow-hidden rounded-2xl border p-4 text-white shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
        <div className="absolute right-0 top-0 rotate-12 p-4 opacity-[0.03]">
          <DollarSign className="h-32 w-32" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-between gap-3 md:flex-row">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500 bg-indigo-600 shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="mb-1 text-[9px] font-black uppercase leading-none tracking-[0.2em] text-indigo-400">
=======
            <div className="bg-accent-primary border-accent-primary flex h-12 w-12 items-center justify-center rounded-xl border shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-accent-primary mb-1 text-[9px] font-black uppercase leading-none tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                Industrial Fintech Hub
              </p>
              <h3 className="text-base font-black uppercase italic leading-none tracking-tight">
                Supply Chain Financing
              </h3>
              <div className="mt-2 flex items-center gap-3">
                <p className="text-[10px] font-bold uppercase leading-none tracking-widest text-white/40">
                  Available for factoring:
                </p>
<<<<<<< HEAD
                <span className="text-[11px] font-black tabular-nums text-indigo-400">
=======
                <span className="text-accent-primary text-[11px] font-black tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                  7,700,000 ₽
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="mr-2 hidden text-right xl:block">
              <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-white/30">
                Industrial Score
              </p>
              <p className="text-sm font-black italic leading-none text-white">
                850 <span className="text-[9px] not-italic text-white/20">/ 1000</span>
              </p>
            </div>
            <div className="mx-2 hidden h-8 w-px bg-white/10 xl:block" />
            <Button
              size="sm"
<<<<<<< HEAD
              className="h-9 w-full rounded-lg bg-white px-6 text-[9px] font-black uppercase tracking-widest text-black shadow-md transition-all hover:bg-indigo-400 hover:text-white md:w-auto"
=======
              className="hover:bg-accent-primary h-9 w-full rounded-lg bg-white px-6 text-[9px] font-black uppercase tracking-widest text-black shadow-md transition-all hover:text-white md:w-auto"
>>>>>>> recover/cabinet-wip-from-stash
              asChild
            >
              <Link href="/wallet">Open Wallet</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Production Header Stats */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Цех пошива',
            value: '92%',
            sub: 'Загрузка Drop 1',
            icon: FactoryIcon,
<<<<<<< HEAD
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
=======
            color: 'text-accent-primary',
            bg: 'bg-accent-primary/10',
>>>>>>> recover/cabinet-wip-from-stash
          },
          {
            label: 'Контроль качества',
            value: '99.8%',
            sub: '0.2% брака',
            icon: ShieldCheck,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            label: 'Активные потоки',
            value: '14',
            sub: 'Линий в работе',
            icon: Zap,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          },
          {
            label: 'Дедлайны',
            value: '3',
            sub: 'Ближайшие 48ч',
            icon: AlertTriangle,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="group overflow-hidden rounded-3xl border-none bg-white shadow-sm transition-all hover:shadow-md"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-2xl transition-transform group-hover:scale-110',
                    stat.bg
                  )}
                >
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <Badge
                  variant="outline"
<<<<<<< HEAD
                  className="border-slate-100 text-[8px] font-black uppercase"
=======
                  className="border-border-subtle text-[8px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  Live
                </Badge>
              </div>
              <div className="mt-4">
<<<<<<< HEAD
                <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-sm font-black tracking-tighter text-slate-900">
                    {stat.value}
                  </h4>
                  <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
=======
                <p className="text-text-muted mb-1 text-[10px] font-black uppercase tracking-widest">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-text-primary text-sm font-black tracking-tighter">
                    {stat.value}
                  </h4>
                  <p className="text-text-secondary text-[10px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                    {stat.sub}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
<<<<<<< HEAD
        <Card className="overflow-hidden rounded-xl border-slate-100 shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-6">
=======
        <Card className="border-border-subtle overflow-hidden rounded-xl shadow-sm lg:col-span-2">
          <CardHeader className="bg-bg-surface2/80 border-border-subtle border-b pb-6">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-tight">
                  Загруженность мощностей
                </CardTitle>
<<<<<<< HEAD
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
                <CardDescription className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  План vs Факт (единиц продукции)
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
<<<<<<< HEAD
                  <TabsList className="border-none bg-slate-100">
                    <TabsTrigger value="week" className="px-3 text-[9px] font-black uppercase">
                      Неделя
                    </TabsTrigger>
                    <TabsTrigger value="month" className="px-3 text-[9px] font-black uppercase">
                      Месяц
                    </TabsTrigger>
                    <TabsTrigger value="year" className="px-3 text-[9px] font-black uppercase">
=======
                  {/* cabinetSurface v1 */}
                  <TabsList className={cn(cabinetSurface.tabsList, 'w-fit flex-wrap border-0')}>
                    <TabsTrigger
                      value="week"
                      className={cn(cabinetSurface.tabsTrigger, 'h-8 px-3 text-[9px] font-black')}
                    >
                      Неделя
                    </TabsTrigger>
                    <TabsTrigger
                      value="month"
                      className={cn(cabinetSurface.tabsTrigger, 'h-8 px-3 text-[9px] font-black')}
                    >
                      Месяц
                    </TabsTrigger>
                    <TabsTrigger
                      value="year"
                      className={cn(cabinetSurface.tabsTrigger, 'h-8 px-3 text-[9px] font-black')}
                    >
>>>>>>> recover/cabinet-wip-from-stash
                      Год
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <ResponsiveContainer width="100%" height={320}>
              <RechartsBarChart data={productionLoadData} margin={{ left: -20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toLocaleString('ru-RU') + ' ед.' : value,
                    name === 'plan' ? 'План' : 'Факт',
                  ]}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="fact" name="Факт" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="plan" name="План" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={24} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

<<<<<<< HEAD
        <Card className="flex flex-col rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-black uppercase tracking-tight">
              Потоки в работе
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
        <Card className="border-border-subtle flex flex-col rounded-xl shadow-sm">
          <CardHeader className="bg-bg-surface2/80 border-border-subtle border-b">
            <CardTitle className="text-sm font-black uppercase tracking-tight">
              Потоки в работе
            </CardTitle>
            <CardDescription className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Текущий статус по заказам
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
<<<<<<< HEAD
            <div className="divide-y divide-slate-100">
              {recentOrders.map((order, i) => (
                <div key={i} className="group p-3 transition-colors hover:bg-slate-50">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                        {order.brand}
                      </p>
                      <h5 className="text-sm font-black uppercase tracking-tighter text-slate-900">
=======
            <div className="divide-border-subtle divide-y">
              {recentOrders.map((order, i) => (
                <div key={i} className="hover:bg-bg-surface2 group p-3 transition-colors">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="text-accent-primary text-[10px] font-black uppercase tracking-widest">
                        {order.brand}
                      </p>
                      <h5 className="text-text-primary text-sm font-black uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                        {order.item}
                      </h5>
                    </div>
                    <Badge
                      className={cn(
                        'border-none text-[8px] font-black uppercase',
                        statusConfig[order.status]
                          .replace('bg-', 'bg-')
                          .replace('500', '100')
                          .replace('400', '100'),
                        statusConfig[order.status].replace('bg-', 'text-')
                      )}
                    >
                      {order.status}
                    </Badge>
                  </div>
<<<<<<< HEAD
                  <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
                  <div className="text-text-muted mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    <span className="flex items-center gap-1.5">
                      <ListOrdered className="h-3 w-3" /> {order.quantity} шт.
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3 w-3" /> {order.deadline}
                    </span>
                  </div>
                  {order.scfAvailable && (
<<<<<<< HEAD
                    <div className="group/scf mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 transition-all hover:bg-indigo-600 hover:text-white">
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-indigo-600 group-hover/scf:text-white" />
=======
                    <div className="bg-accent-primary/10 border-accent-primary/20 group/scf hover:bg-accent-primary mt-4 flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all hover:text-white">
                      <div className="flex items-center gap-2">
                        <Zap className="text-accent-primary h-3 w-3 group-hover/scf:text-white" />
>>>>>>> recover/cabinet-wip-from-stash
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          Доступен SCF Факторинг
                        </span>
                      </div>
                      <span className="text-[10px] font-black italic tabular-nums">
                        {(order.cost * 0.95).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  )}
<<<<<<< HEAD
                  <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
=======
                  <div className="bg-bg-surface2 mt-4 h-1 w-full overflow-hidden rounded-full">
>>>>>>> recover/cabinet-wip-from-stash
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          order.status === 'В производстве'
                            ? '65%'
                            : order.status === 'Контроль качества'
                              ? '95%'
                              : '10%',
                      }}
                      className={cn('h-full rounded-full', statusConfig[order.status])}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto p-4">
              <Button
                variant="outline"
<<<<<<< HEAD
                className="w-full rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50"
                asChild
              >
                <Link href="/factory/orders">
=======
                className="border-border-default hover:bg-bg-surface2 w-full rounded-xl text-[10px] font-black uppercase tracking-widest"
                asChild
              >
                <Link href={ROUTES.factory.productionOrders}>
>>>>>>> recover/cabinet-wip-from-stash
                  Все заказы <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrated Industrial Modules Grid — Compact & Actionable */}
      <div className="mt-8 grid grid-cols-1 gap-3 pb-12 md:grid-cols-2 xl:grid-cols-3">
<<<<<<< HEAD
        <Card className="group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-3 text-white shadow-sm">
          <div className="absolute -bottom-2 -right-2 opacity-10 transition-transform group-hover:scale-110">
            <Scan className="h-24 w-24 text-indigo-400" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg">
=======
        <Card className="border-text-primary/30 bg-text-primary group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl border p-3 text-white shadow-sm">
          <div className="absolute -bottom-2 -right-2 opacity-10 transition-transform group-hover:scale-110">
            <Scan className="text-accent-primary h-24 w-24" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="bg-accent-primary flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
              <FactoryIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="mb-1 text-[13px] font-black uppercase italic leading-none tracking-tight text-white">
                RFID Warehouse Gates
              </h3>
<<<<<<< HEAD
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 opacity-70">
=======
              <p className="text-accent-primary text-[10px] font-black uppercase tracking-widest opacity-70">
>>>>>>> recover/cabinet-wip-from-stash
                Industrial Automation P3
              </p>
            </div>
          </div>
          <Button
            asChild
            size="sm"
<<<<<<< HEAD
            className="relative z-10 mt-4 h-8 w-full rounded-lg bg-white text-[9px] font-black uppercase text-indigo-900 shadow-md transition-all hover:bg-indigo-400 hover:text-white"
          >
            <Link href="/factory/inventory/rfid-gates">Управление воротами</Link>
          </Button>
        </Card>

        <Card className="group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
          <div className="absolute -bottom-2 -right-2 opacity-5 transition-transform group-hover:scale-110">
            <ShieldCheck className="h-24 w-24 text-slate-900" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-slate-900" />
            </div>
            <div>
              <h3 className="mb-1 text-[13px] font-black uppercase italic leading-none tracking-tight text-slate-900">
                Quality Control Hub
              </h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-70">
=======
            className="text-accent-primary hover:bg-accent-primary relative z-10 mt-4 h-8 w-full rounded-lg bg-white text-[9px] font-black uppercase shadow-md transition-all hover:text-white"
          >
            <Link href={ROUTES.factory.productionInventoryRfidGates}>Управление воротами</Link>
          </Button>
        </Card>

        <Card className="border-border-subtle group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl border bg-white p-3 shadow-sm">
          <div className="absolute -bottom-2 -right-2 opacity-5 transition-transform group-hover:scale-110">
            <ShieldCheck className="text-text-primary h-24 w-24" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-xl shadow-sm">
              <ShieldCheck className="text-text-primary h-5 w-5" />
            </div>
            <div>
              <h3 className="text-text-primary mb-1 text-[13px] font-black uppercase italic leading-none tracking-tight">
                Quality Control Hub
              </h3>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest opacity-70">
>>>>>>> recover/cabinet-wip-from-stash
                Compliance & Standards
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
<<<<<<< HEAD
            className="relative z-10 mt-4 h-8 w-full rounded-lg border-slate-200 text-[9px] font-black uppercase text-slate-900 transition-all hover:bg-slate-50"
          >
            <Link href="/factory/qc">Открыть инспекции</Link>
          </Button>
        </Card>

        <Card className="group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl border border-indigo-800 bg-indigo-900 p-3 text-white shadow-sm">
          <div className="absolute -bottom-2 -right-2 opacity-10 transition-transform group-hover:scale-110">
            <Cpu className="h-24 w-24 text-indigo-400" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-lg">
              <Activity className="h-5 w-5 text-indigo-400" />
=======
            className="border-border-default text-text-primary hover:bg-bg-surface2 relative z-10 mt-4 h-8 w-full rounded-lg text-[9px] font-black uppercase transition-all"
          >
            <Link href={ROUTES.factory.qc}>Открыть инспекции</Link>
          </Button>
        </Card>

        <Card className="border-accent-primary bg-accent-primary group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl border p-3 text-white shadow-sm">
          <div className="absolute -bottom-2 -right-2 opacity-10 transition-transform group-hover:scale-110">
            <Cpu className="text-accent-primary h-24 w-24" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-lg">
              <Activity className="text-accent-primary h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
            </div>
            <div>
              <h3 className="mb-1 text-[13px] font-black uppercase italic leading-none tracking-tight text-white">
                IoT Machine Monitoring
              </h3>
<<<<<<< HEAD
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 opacity-70">
=======
              <p className="text-accent-primary text-[10px] font-black uppercase tracking-widest opacity-70">
>>>>>>> recover/cabinet-wip-from-stash
                Real-time Telemetry (OEE)
              </p>
            </div>
          </div>
          <Button
            asChild
            size="sm"
<<<<<<< HEAD
            className="relative z-10 mt-4 h-8 w-full rounded-lg bg-white text-[9px] font-black uppercase text-indigo-900 shadow-md transition-all hover:bg-indigo-400 hover:text-white"
          >
            <Link href="/factory/iot-monitoring">Мониторинг парка</Link>
          </Button>
        </Card>

        <Card className="group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 p-3 text-slate-900 shadow-sm">
          <div className="absolute -bottom-2 -right-2 opacity-10 transition-transform group-hover:scale-110">
            <Scissors className="h-24 w-24 text-slate-900" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 shadow-lg">
              <Scissors className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="mb-1 text-[13px] font-black uppercase italic leading-none tracking-tight text-slate-900">
                MTM Production Line
              </h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-70">
=======
            className="text-accent-primary hover:bg-accent-primary relative z-10 mt-4 h-8 w-full rounded-lg bg-white text-[9px] font-black uppercase shadow-md transition-all hover:text-white"
          >
            <Link href={ROUTES.factory.productionIotMonitoring}>Мониторинг парка</Link>
          </Button>
        </Card>

        <Card className="border-border-subtle bg-bg-surface2 text-text-primary group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl border p-3 shadow-sm">
          <div className="absolute -bottom-2 -right-2 opacity-10 transition-transform group-hover:scale-110">
            <Scissors className="text-text-primary h-24 w-24" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="bg-text-primary flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
              <Scissors className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-text-primary mb-1 text-[13px] font-black uppercase italic leading-none tracking-tight">
                MTM Production Line
              </h3>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest opacity-70">
>>>>>>> recover/cabinet-wip-from-stash
                Custom Orders Queue
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
<<<<<<< HEAD
            className="relative z-10 mt-4 h-8 w-full rounded-lg border-slate-200 text-[9px] font-black uppercase text-slate-900 transition-all hover:bg-slate-900 hover:text-white"
          >
            <Link href="/factory/customization">Очередь пошива</Link>
=======
            className="border-border-default text-text-primary hover:bg-text-primary/90 relative z-10 mt-4 h-8 w-full rounded-lg text-[9px] font-black uppercase transition-all hover:text-white"
          >
            <Link href={ROUTES.factory.productionCustomization}>Очередь пошива</Link>
>>>>>>> recover/cabinet-wip-from-stash
          </Button>
        </Card>

        <Card className="group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl border border-emerald-800 bg-emerald-900 p-3 text-white shadow-sm">
          <div className="absolute -bottom-2 -right-2 opacity-10 transition-transform group-hover:scale-110">
            <Leaf className="h-24 w-24 text-emerald-400" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-lg">
              <Leaf className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="mb-1 text-[13px] font-black uppercase italic leading-none tracking-tight text-white">
                Circular Economy
              </h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 opacity-70">
                Leftovers Marketplace
              </p>
            </div>
          </div>
          <Button
            asChild
            size="sm"
            className="relative z-10 mt-4 h-8 w-full rounded-lg bg-white text-[9px] font-black uppercase text-emerald-900 shadow-md transition-all hover:bg-emerald-400 hover:text-white"
          >
            <Link href="/brand/circular-hub">Перейти в Маркет</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
