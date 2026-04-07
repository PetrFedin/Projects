'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Scan
} from "lucide-react";
import { StatCard } from '../stat-card';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from 'recharts';
import Link from 'next/link';
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
    { order: 'PO-001', brand: 'Syntha', item: 'Кашемировый свитер', quantity: 500, cost: 3500000, deadline: '2024-08-15', status: 'В производстве', scfAvailable: true },
    { order: 'PO-002', brand: 'A.P.C.', item: 'Классические брюки', quantity: 750, cost: 4200000, deadline: '2024-08-20', status: 'Контроль качества', scfAvailable: true },
    { order: 'PO-003', brand: 'Acne Studios', item: 'Джинсовая куртка', quantity: 300, cost: 1800000, deadline: '2024-09-01', status: 'Запланировано', scfAvailable: false },
];

const statusConfig: {[key: string]: string} = {
    'В производстве': 'bg-blue-500',
    'Контроль качества': 'bg-yellow-500',
    'Запланировано': 'bg-gray-400',
}

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
      <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12">
          <DollarSign className="h-32 w-32" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg border border-indigo-500">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1 leading-none">Industrial Fintech Hub</p>
              <h3 className="text-base font-black uppercase tracking-tight italic leading-none">Supply Chain Financing</h3>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none">Available for factoring:</p>
                <span className="text-[11px] font-black text-indigo-400 tabular-nums">7,700,000 ₽</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="text-right hidden xl:block mr-2">
                <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Industrial Score</p>
                <p className="text-sm font-black italic text-white leading-none">850 <span className="text-[9px] text-white/20 not-italic">/ 1000</span></p>
             </div>
             <div className="h-8 w-px bg-white/10 hidden xl:block mx-2" />
             <Button size="sm" className="w-full md:w-auto bg-white text-black hover:bg-indigo-400 hover:text-white rounded-lg h-9 px-6 text-[9px] font-black uppercase tracking-widest transition-all shadow-md" asChild>
                <Link href="/wallet">Open Wallet</Link>
             </Button>
          </div>
        </div>
      </div>

      {/* Production Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Цех пошива", value: "92%", sub: "Загрузка Drop 1", icon: FactoryIcon, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Контроль качества", value: "99.8%", sub: "0.2% брака", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Активные потоки", value: "14", sub: "Линий в работе", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Дедлайны", value: "3", sub: "Ближайшие 48ч", icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white rounded-3xl overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-100">Live</Badge>
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-sm font-black text-slate-900 tracking-tighter">{stat.value}</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{stat.sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2 border-slate-100 rounded-xl shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-sm font-black uppercase tracking-tight">Загруженность мощностей</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">План vs Факт (единиц продукции)</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
                            <TabsList className="bg-slate-100 border-none">
                                <TabsTrigger value="week" className="text-[9px] uppercase font-black px-3">Неделя</TabsTrigger>
                                <TabsTrigger value="month" className="text-[9px] uppercase font-black px-3">Месяц</TabsTrigger>
                                <TabsTrigger value="year" className="text-[9px] uppercase font-black px-3">Год</TabsTrigger>
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
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          formatter={(value, name) => [typeof value === 'number' ? value.toLocaleString('ru-RU') + ' ед.' : value, name === 'plan' ? 'План' : 'Факт']}
                          cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar dataKey="fact" name="Факт" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={24} />
                        <Bar dataKey="plan" name="План" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={24} />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

        <Card className="border-slate-100 rounded-xl shadow-sm flex flex-col">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-sm font-black uppercase tracking-tight">Потоки в работе</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Текущий статус по заказам</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <div className="divide-y divide-slate-100">
                    {recentOrders.map((order, i) => (
                        <div key={i} className="p-3 hover:bg-slate-50 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{order.brand}</p>
                                    <h5 className="text-sm font-black text-slate-900 uppercase tracking-tighter">{order.item}</h5>
                                </div>
                                <Badge className={cn("text-[8px] font-black uppercase border-none", statusConfig[order.status].replace('bg-', 'bg-').replace('500', '100').replace('400', '100'), statusConfig[order.status].replace('bg-', 'text-'))}>
                                    {order.status}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                                <span className="flex items-center gap-1.5"><ListOrdered className="h-3 w-3" /> {order.quantity} шт.</span>
                                <span className="flex items-center gap-1.5"><CalendarIcon className="h-3 w-3" /> {order.deadline}</span>
                            </div>
                            {order.scfAvailable && (
                                <div className="mt-4 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between group/scf cursor-pointer hover:bg-indigo-600 hover:text-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-3 w-3 text-indigo-600 group-hover/scf:text-white" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Доступен SCF Факторинг</span>
                                    </div>
                                    <span className="text-[10px] font-black tabular-nums italic">{(order.cost * 0.95).toLocaleString('ru-RU')} ₽</span>
                                </div>
                            )}
                            <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: order.status === 'В производстве' ? '65%' : order.status === 'Контроль качества' ? '95%' : '10%' }}
                                    className={cn("h-full rounded-full", statusConfig[order.status])}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 mt-auto">
                    <Button variant="outline" className="w-full rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50" asChild>
                        <Link href="/factory/orders">Все заказы <ArrowRight className="ml-2 h-3 w-3" /></Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Integrated Industrial Modules Grid — Compact & Actionable */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-8 pb-12">
        <Card className="rounded-2xl border border-slate-800 shadow-sm bg-slate-900 text-white p-3 flex flex-col justify-between relative overflow-hidden group min-h-[180px]">
            <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform">
                <Scan className="w-24 h-24 text-indigo-400" />
            </div>
            <div className="space-y-4 relative z-10">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
                    <FactoryIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h3 className="text-[13px] font-black uppercase tracking-tight italic text-white leading-none mb-1">RFID Warehouse Gates</h3>
                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest opacity-70">Industrial Automation P3</p>
                </div>
            </div>
            <Button asChild size="sm" className="w-full mt-4 rounded-lg bg-white text-indigo-900 hover:bg-indigo-400 hover:text-white font-black uppercase text-[9px] h-8 relative z-10 transition-all shadow-md">
                <Link href="/factory/inventory/rfid-gates">Управление воротами</Link>
            </Button>
        </Card>

        <Card className="rounded-2xl border border-slate-100 shadow-sm bg-white p-3 flex flex-col justify-between relative overflow-hidden group min-h-[180px]">
            <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-24 h-24 text-slate-900" />
            </div>
            <div className="space-y-4 relative z-10">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shadow-sm">
                    <ShieldCheck className="h-5 w-5 text-slate-900" />
                </div>
                <div>
                    <h3 className="text-[13px] font-black uppercase tracking-tight italic text-slate-900 leading-none mb-1">Quality Control Hub</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-70">Compliance & Standards</p>
                </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full mt-4 rounded-lg border-slate-200 text-slate-900 hover:bg-slate-50 font-black uppercase text-[9px] h-8 relative z-10 transition-all">
                <Link href="/factory/qc">Открыть инспекции</Link>
            </Button>
        </Card>

        <Card className="rounded-2xl border border-indigo-800 shadow-sm bg-indigo-900 text-white p-3 flex flex-col justify-between relative overflow-hidden group min-h-[180px]">
            <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform">
                <Cpu className="w-24 h-24 text-indigo-400" />
            </div>
            <div className="space-y-4 relative z-10">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shadow-lg">
                    <Activity className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-[13px] font-black uppercase tracking-tight italic text-white leading-none mb-1">IoT Machine Monitoring</h3>
                    <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest opacity-70">Real-time Telemetry (OEE)</p>
                </div>
            </div>
            <Button asChild size="sm" className="w-full mt-4 rounded-lg bg-white text-indigo-900 hover:bg-indigo-400 hover:text-white font-black uppercase text-[9px] h-8 relative z-10 transition-all shadow-md">
                <Link href="/factory/iot-monitoring">Мониторинг парка</Link>
            </Button>
        </Card>

        <Card className="rounded-2xl border border-slate-100 shadow-sm bg-slate-100 text-slate-900 p-3 flex flex-col justify-between relative overflow-hidden group min-h-[180px]">
            <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform">
                <Scissors className="w-24 h-24 text-slate-900" />
            </div>
            <div className="space-y-4 relative z-10">
                <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                    <Scissors className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h3 className="text-[13px] font-black uppercase tracking-tight italic text-slate-900 leading-none mb-1">MTM Production Line</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-70">Custom Orders Queue</p>
                </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full mt-4 rounded-lg border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white font-black uppercase text-[9px] h-8 relative z-10 transition-all">
                <Link href="/factory/customization">Очередь пошива</Link>
            </Button>
        </Card>

        <Card className="rounded-2xl border border-emerald-800 shadow-sm bg-emerald-900 text-white p-3 flex flex-col justify-between relative overflow-hidden group min-h-[180px]">
            <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform">
                <Leaf className="w-24 h-24 text-emerald-400" />
            </div>
            <div className="space-y-4 relative z-10">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shadow-lg">
                    <Leaf className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                    <h3 className="text-[13px] font-black uppercase tracking-tight italic text-white leading-none mb-1">Circular Economy</h3>
                    <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest opacity-70">Leftovers Marketplace</p>
                </div>
            </div>
            <Button asChild size="sm" className="w-full mt-4 rounded-lg bg-white text-emerald-900 hover:bg-emerald-400 hover:text-white font-black uppercase text-[9px] h-8 relative z-10 transition-all shadow-md">
                <Link href="/brand/circular-hub">Перейти в Маркет</Link>
            </Button>
        </Card>
      </div>
    </div>
  )
}
