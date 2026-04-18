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
  ShoppingBag,
  Users,
  Package,
  Percent,
  Calendar as CalendarIcon,
  X,
  Warehouse,
  Truck,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ArrowRight,
  Leaf,
} from 'lucide-react';
import { StatCard } from '../stat-card';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { fastApiService } from '@/lib/fastapi-service';
import { useEffect } from 'react';

const salesData = [
  { day: 'Пн', volume: 1200 },
  { day: 'Вт', volume: 1900 },
  { day: 'Ср', volume: 1500 },
  { day: 'Чт', volume: 2100 },
  { day: 'Пт', volume: 2400 },
  { day: 'Сб', volume: 1800 },
  { day: 'Вс', volume: 1100 },
];

const topMaterials = [
  {
    id: 'm1',
    name: 'Кашемир 100%',
    sku: 'IT-CASH-01',
    stock: '450м',
    reserved: '120м',
    price: '4500 ₽',
    trend: '+12%',
  },
  {
    id: 'm2',
    name: 'Шелк натуральный',
    sku: 'IT-SILK-05',
    stock: '280м',
    reserved: '200м',
    price: '3200 ₽',
    trend: '+5%',
  },
  {
    id: 'm3',
    name: 'Хлопок Органик',
    sku: 'IT-COT-12',
    stock: '1200м',
    reserved: '0м',
    price: '1100 ₽',
    trend: '-2%',
  },
];

export function SupplierDashboard() {
  const [period, setPeriod] = useState('week');
  const [serverKpis, setServerKpis] = useState<any>(null);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const response = await fastApiService.getDashboardKpis();
        if (response.data && response.data.kpis) {
          setServerKpis(response.data.kpis);
        }
      } catch (err) {
        console.warn('Failed to fetch supplier KPIs:', err);
      }
    };
    fetchKpis();
  }, [period]);

  return (
    <div className="space-y-4">
      {/* Supplier Header Stats */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Выручка (мес)',
            value: '4.2M ₽',
            sub: '+15% к прошлому',
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            label: 'Активных заказов',
            value: '28',
            sub: '12 на отгрузке',
            icon: ShoppingBag,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
          },
          {
            label: 'SKU в каталоге',
            value: '142',
            sub: '5 новых позиций',
            icon: Package,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          },
          {
            label: 'Складской запас',
            value: '82%',
            sub: 'Оптимально',
            icon: Warehouse,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
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
                  className="border-slate-100 text-[8px] font-black uppercase"
                >
                  Marketplace
                </Badge>
              </div>
              <div className="mt-4">
                <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-sm font-black tracking-tighter text-slate-900">
                    {stat.value}
                  </h4>
                  <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                    {stat.sub}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="overflow-hidden rounded-xl border-slate-100 shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-tight">
                  Динамика продаж сырья
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Объем отгрузок за неделю
                </CardDescription>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white">
                <Truck className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <ResponsiveContainer width="100%" height={320}>
              <RechartsBarChart data={salesData} margin={{ left: -20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="day"
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
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar
                  dataKey="volume"
                  name="Объем (м/кг)"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-black uppercase tracking-tight">
              Топ материалов
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Ликвидность и остатки
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div className="divide-y divide-slate-100">
              {topMaterials.map((mat, i) => (
                <div key={i} className="group p-3 transition-colors hover:bg-slate-50">
                  <div className="mb-1 flex items-start justify-between">
                    <div>
                      <h5 className="text-sm font-black uppercase tracking-tighter text-slate-900">
                        {mat.name}
                      </h5>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        SKU: {mat.sku}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black',
                        mat.trend.startsWith('+')
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600'
                      )}
                    >
                      {mat.trend}
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                        Склад
                      </p>
                      <p className="text-[11px] font-black text-slate-900">{mat.stock}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                        Цена
                      </p>
                      <p className="text-[11px] font-black text-indigo-600">{mat.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto space-y-2 p-4">
              <Button
                asChild
                className="h-11 w-full gap-2 rounded-xl bg-emerald-600 text-[10px] font-black uppercase text-white shadow-lg transition-all hover:bg-emerald-700"
              >
                <Link href="/supplier/circular-hub">
                  <Leaf className="h-4 w-4" />
                  Circular Economy Hub
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50"
                asChild
              >
                <Link href="/factory/catalog">
                  Весь каталог <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
