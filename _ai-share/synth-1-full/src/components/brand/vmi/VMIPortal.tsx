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
  Layers,
  ShoppingBag,
  Truck,
  RefreshCcw,
  TrendingUp,
  ShieldCheck,
  Factory,
  Store,
  ArrowUpRight,
  BarChart3,
  Users,
  Settings,
  CheckCircle2,
  AlertCircle,
  Info,
  Zap,
  Globe,
  Box,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import Image from 'next/image';
import { products as allProducts } from '@/lib/products';

const SHARED_STOCK_DATA = [
  { name: 'Stockmann', brand: 450, store: 120, target: 600 },
  { name: 'Tsvetnoy', brand: 300, store: 80, target: 450 },
  { name: 'DLT', brand: 600, store: 210, target: 900 },
  { name: 'KM20', brand: 150, store: 45, target: 200 },
];

export default function VMIPortal() {
  return (
    <div className="space-y-10 duration-700 animate-in fade-in">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-4">
          <Badge className="border-none bg-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            Brand-Retailer Collaboration
          </Badge>
          <h1 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900">
            VMI <span className="italic text-indigo-600">Collaborative</span> Portal
          </h1>
          <p className="max-w-2xl text-sm font-medium text-slate-500">
            Vendor Managed Inventory: бренд берет на себя управление остатками в точках продаж
            ритейлера для минимизации out-of-stock.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-12 rounded-xl border-slate-200 px-6 text-[10px] font-black uppercase tracking-widest"
          >
            <Settings className="mr-2 h-4 w-4" /> VMI Policies
          </Button>
          <Button className="h-12 rounded-xl bg-slate-900 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all hover:bg-indigo-600">
            Sync Global Stock
          </Button>
        </div>
      </header>

      <div className="grid gap-3 lg:grid-cols-12">
        {/* Main Shared Stock View */}
        <div className="space-y-4 lg:col-span-8">
          <Card className="rounded-xl border-none bg-white p-4 shadow-xl">
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className="h-6 w-6 text-indigo-600" />
                <h3 className="text-base font-black uppercase italic tracking-tight">
                  Shared Inventory (Retailer Points)
                </h3>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-slate-200" />
                  <span className="text-[9px] font-black uppercase text-slate-400">
                    Brand Hub Stock
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-600" />
                  <span className="text-[9px] font-black uppercase text-slate-400">
                    In-Store Stock
                  </span>
                </div>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SHARED_STOCK_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <RechartsTooltip />
                  <Bar dataKey="brand" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="store" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 px-2 text-sm font-black uppercase tracking-widest text-slate-400">
              <Zap className="h-4 w-4 text-amber-500" /> VMI Auto-Replenishment SKU
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {allProducts.slice(0, 4).map((item) => (
                <Card
                  key={item.id}
                  className="group flex items-center gap-3 rounded-xl border-none bg-white p-4 shadow-lg transition-all hover:shadow-xl"
                >
                  <div className="relative h-20 w-12 shrink-0 overflow-hidden rounded-xl">
                    <Image src={item.images[0].url} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 text-[8px] font-black uppercase text-slate-400">
                      {item.brand}
                    </p>
                    <h4 className="mb-1.5 truncate text-xs font-black uppercase leading-none tracking-tight">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge className="border-none bg-emerald-50 px-2 py-0.5 text-[8px] font-black uppercase text-emerald-600">
                        Auto-Refill: ON
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="mb-0.5 text-[8px] font-black uppercase text-slate-400">
                      Threshold
                    </p>
                    <p className="text-sm font-black text-slate-900">15 ед.</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Collaboration & Policies */}
        <div className="space-y-4 lg:col-span-4">
          <Card className="group relative overflow-hidden rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl">
            <Users className="absolute -right-4 -top-4 h-32 w-32 text-indigo-500 opacity-10 transition-transform duration-700 group-hover:scale-110" />
            <div className="relative z-10 space-y-4">
              <header className="space-y-2">
                <Badge className="border-none bg-indigo-500 px-2 py-0.5 text-[8px] font-black uppercase text-white">
                  Global Partnership
                </Badge>
                <h3 className="text-sm font-black uppercase italic leading-none tracking-tight">
                  Active Retailer <br /> Connections
                </h3>
              </header>

              <div className="space-y-4">
                {[
                  { name: 'Stockmann', share: '45%', status: 'Balanced' },
                  { name: 'Tsvetnoy', share: '30%', status: 'Low Stock' },
                  { name: 'DLT (Mercury)', share: '25%', status: 'Optimal' },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                  >
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight">{p.name}</p>
                      <p className="text-[8px] font-black uppercase text-slate-500">
                        Portfolio Share: {p.share}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'rounded-md px-2 py-1 text-[8px] font-black uppercase',
                        p.status === 'Low Stock'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      )}
                    >
                      {p.status}
                    </div>
                  </div>
                ))}
              </div>

              <Button className="h-10 w-full rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl shadow-black/20 transition-all hover:bg-indigo-400 hover:text-white">
                Connect New Retailer <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-black uppercase tracking-widest">
                VMI Service Level (SLA)
              </h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Inventory Turnover</span>
                  <span>8.2x / yr</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-50">
                  <div className="h-full w-[82%] rounded-full bg-indigo-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="mb-1 text-[8px] font-black uppercase text-slate-400">
                    Stock Accuracy
                  </p>
                  <p className="text-sm font-black text-slate-900">99.8%</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="mb-1 text-[8px] font-black uppercase text-slate-400">
                    Refill Speed
                  </p>
                  <p className="text-sm font-black text-emerald-600">24h</p>
                </div>
              </div>
            </div>
            <p className="border-t border-slate-50 pt-4 text-center text-[9px] font-medium italic leading-relaxed text-slate-400">
              *SLA контролируется Syntha Smart Contracts. Штрафы за out-of-stock начисляются
              автоматически.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
