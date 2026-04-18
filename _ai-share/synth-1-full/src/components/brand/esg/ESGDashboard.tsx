'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Leaf,
  Wind,
  Droplets,
  Factory,
  TrendingDown,
  BarChart3,
  ShieldCheck,
  Globe,
  AlertCircle,
  Info,
  FileText,
  ArrowUpRight,
  Download,
  Share2,
  Zap,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { Progress } from '@/components/ui/progress';

const EMISSIONS_DATA = [
  { name: 'Raw Materials', value: 45, color: '#10b981' },
  { name: 'Manufacturing', value: 25, color: '#3b82f6' },
  { name: 'Logistics', value: 15, color: '#f59e0b' },
  { name: 'Packaging', value: 10, color: '#6366f1' },
  { name: 'Usage', value: 5, color: '#ec4899' },
];

const IMPACT_HISTORY = [
  { month: 'Jan', co2: 120, water: 450 },
  { month: 'Feb', co2: 115, water: 430 },
  { month: 'Mar', co2: 105, water: 410 },
  { month: 'Apr', co2: 98, water: 390 },
  { month: 'May', co2: 92, water: 370 },
  { month: 'Jun', co2: 85, water: 350 },
];

export default function ESGDashboard() {
  return (
    <div className="space-y-10 duration-700 animate-in fade-in">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-4">
          <Badge className="border-none bg-emerald-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            Corporate Sustainability
          </Badge>
          <h1 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900">
            ESG <span className="italic text-emerald-600">Impact</span> Dashboard
          </h1>
          <p className="max-w-2xl text-sm font-medium text-slate-500">
            Мониторинг экологического следа в реальном времени. Соответствие стандартам CSRD и
            прозрачность цепочки поставок.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-12 rounded-xl border-slate-200 px-6 text-[10px] font-black uppercase tracking-widest"
          >
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button className="h-12 rounded-xl bg-slate-900 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all hover:bg-emerald-600">
            Update Data
          </Button>
        </div>
      </header>

      <div className="grid gap-3 lg:grid-cols-12">
        {/* Global Metrics */}
        <div className="space-y-4 lg:col-span-8">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                label: 'Total Carbon Footprint',
                value: '852 tCO2e',
                diff: '-12.4%',
                icon: Wind,
                color: 'emerald',
              },
              {
                label: 'Water Intensity',
                value: '42L / unit',
                diff: '-8.2%',
                icon: Droplets,
                color: 'blue',
              },
              {
                label: 'Supply Chain Traceability',
                value: '94%',
                diff: '+5.1%',
                icon: Globe,
                color: 'indigo',
              },
            ].map((stat, i) => (
              <Card
                key={i}
                className="group relative space-y-4 overflow-hidden rounded-xl border-none bg-white p-4 shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div
                  className={cn(
                    'absolute -right-4 -top-4 h-24 w-24 opacity-[0.03] transition-transform duration-700 group-hover:scale-110',
                    `text-${stat.color}-600`
                  )}
                >
                  <stat.icon className="h-full w-full" />
                </div>
                <div className="relative z-10 space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {stat.label}
                  </p>
                  <h3 className="text-base font-black leading-none text-slate-900">{stat.value}</h3>
                </div>
                <div className="relative z-10 flex items-center gap-2">
                  <Badge
                    className={cn(
                      'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                      stat.diff.startsWith('-')
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-indigo-50 text-indigo-600'
                    )}
                  >
                    {stat.diff} vs Last Year
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          <Card className="rounded-xl border-none bg-white p-4 shadow-xl">
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-6 w-6 text-emerald-600" />
                <h3 className="text-base font-black uppercase italic tracking-tight">
                  Emission Reduction Progress
                </h3>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-black uppercase text-slate-400">
                    CO2 Emissions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-[9px] font-black uppercase text-slate-400">
                    Water Usage
                  </span>
                </div>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={IMPACT_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '1rem',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="co2"
                    stroke="#10b981"
                    strokeWidth={4}
                    dot={{ r: 6, fill: '#10b981', strokeWidth: 0 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="water"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    dot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Side Panels */}
        <div className="space-y-4 lg:col-span-4">
          <Card className="group relative overflow-hidden rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl">
            <Leaf className="absolute -right-4 -top-4 h-32 w-32 text-emerald-500 opacity-10 transition-transform duration-700 group-hover:rotate-12" />
            <div className="relative z-10 space-y-4">
              <header className="space-y-2">
                <Badge className="border-none bg-emerald-500 px-2 py-0.5 text-[8px] font-black uppercase text-white">
                  CSRD Ready
                </Badge>
                <h3 className="text-sm font-black uppercase italic leading-none tracking-tight">
                  Sustainability <br /> Score
                </h3>
              </header>

              <div className="flex items-center justify-center py-6">
                <div className="relative flex h-48 w-48 items-center justify-center">
                  <svg className="h-full w-full -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-white/10"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeDasharray={552.92}
                      strokeDashoffset={552.92 * (1 - 0.88)}
                      className="text-emerald-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-sm font-black text-white">88</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Excellent
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                {[
                  { label: 'Materials', value: 92 },
                  { label: 'Social Ethics', value: 85 },
                  { label: 'Energy Efficiency', value: 88 },
                ].map((row, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">{row.label}</span>
                      <span className="text-emerald-400">{row.value}%</span>
                    </div>
                    <Progress value={row.value} className="h-1 rounded-full bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <PieChart className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-black uppercase tracking-widest">Emissions Breakdown</h3>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={EMISSIONS_DATA}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {EMISSIONS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {EMISSIONS_DATA.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between text-[9px] font-black uppercase tracking-tight"
                >
                  <div className="flex items-center gap-2 text-slate-400">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    {entry.name}
                  </div>
                  <span className="text-slate-900">{entry.value}%</span>
                </div>
              ))}
            </div>
            <p className="border-t border-slate-50 pt-4 text-center text-[9px] font-medium italic leading-relaxed text-slate-400">
              *Расчеты основаны на методологии GHG Protocol и данных первичных поставщиков.
            </p>
          </Card>
        </div>
      </div>

      {/* Sustainability Live Audit (IoT) */}
      <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50 p-3">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-100">
                <Activity className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm font-black uppercase tracking-tight">
                Sustainability <span className="italic text-emerald-600">Live Audit</span>
              </CardTitle>
            </div>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Прямые IoT-данные с производственных площадок (Real-time monitoring)
            </CardDescription>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[9px] font-black uppercase text-slate-600">
                IoT Active: 14 Nodes
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid gap-3 md:grid-cols-4">
            {[
              {
                label: 'Energy Mix',
                value: '74% Renewable',
                sub: 'Wind/Solar at Factory B',
                icon: Zap,
                color: 'text-amber-500',
              },
              {
                label: 'Water Recycling',
                value: '88.2%',
                sub: 'Closed loop system active',
                icon: Droplets,
                color: 'text-blue-500',
              },
              {
                label: 'Waste Recovery',
                value: '92%',
                sub: 'Zero-waste to landfill goal',
                icon: Leaf,
                color: 'text-emerald-500',
              },
              {
                label: 'Chemical Safety',
                value: '100%',
                sub: 'ZDHC MRSL Compliance',
                icon: ShieldCheck,
                color: 'text-indigo-500',
              },
            ].map((node, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center gap-3">
                  <node.icon className={cn('h-5 w-5', node.color)} />
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    {node.label}
                  </p>
                </div>
                <div>
                  <p className="text-base font-black leading-none text-slate-900">{node.value}</p>
                  <p className="mt-2 text-[10px] font-bold uppercase italic text-slate-400">
                    {node.sub}
                  </p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-50">
                  <div
                    className={cn('h-full', node.color.replace('text', 'bg'))}
                    style={{ width: node.value.split('%')[0] + '%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t border-slate-100 bg-slate-50 p-3">
          <div className="flex w-full flex-col items-center justify-between gap-3 md:flex-row">
            <div className="flex items-center gap-3 text-slate-500">
              <Info className="h-5 w-5" />
              <p className="max-w-xl text-[11px] font-medium italic leading-relaxed">
                Данные передаются в реальном времени через систему{' '}
                <span className="font-black text-slate-900">Syntha IoT-Bridge</span>. Каждая единица
                продукции получает ESG-паспорт при отгрузке.
              </p>
            </div>
            <Button className="h-10 rounded-2xl bg-slate-900 px-8 text-[11px] font-black uppercase tracking-widest text-white shadow-2xl">
              Проверить сертификацию <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
