'use client';

import React, { useState, useMemo } from 'react';
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
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Search,
  Filter,
  RefreshCcw,
  Info,
  Zap,
  AlertCircle,
  CheckCircle2,
  Globe,
  ShoppingBag,
  DollarSign,
  BarChart3,
  LineChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { products as allProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from 'recharts';

/** Deterministic grouping (avoids Node vs browser toLocaleString / ICU hydration mismatches). */
function formatRubInt(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const MOCK_PRICING_DATA = [
  { name: 'Mon', current: 4200, suggested: 4500, comp: 4800 },
  { name: 'Tue', current: 4200, suggested: 4400, comp: 4700 },
  { name: 'Wed', current: 4200, suggested: 4600, comp: 4650 },
  { name: 'Thu', current: 4200, suggested: 4800, comp: 4600 },
  { name: 'Fri', current: 4200, suggested: 4900, comp: 4550 },
  { name: 'Sat', current: 4200, suggested: 5100, comp: 4900 },
  { name: 'Sun', current: 4200, suggested: 5200, comp: 5000 },
];

export default function DynamicPricingEngine() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  /** Fixed IDs so SSR and client always pick the same rows (avoids localeCompare / merged catalog order drift). */
  const priceSuggestions = useMemo(() => {
    const diffs = [5.2, -3.8, 8.1, -6.4, 2.7];
    const confidences = [89, 82, 94, 78, 91];
    const byId = new Map(allProducts.map((p) => [String(p.id), p]));
    const topFive: Product[] = [];
    for (const id of ['1', '2', '3', '4', '5'] as const) {
      const p = byId.get(id);
      if (p) topFive.push(p);
    }
    if (topFive.length < 5) {
      const rest = [...allProducts]
        .filter((p) => !topFive.some((t) => String(t.id) === String(p.id)))
        .sort((a, b) => {
          const na = parseInt(String(a.id), 10);
          const nb = parseInt(String(b.id), 10);
          if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return na - nb;
          return String(a.slug ?? a.id).localeCompare(String(b.slug ?? b.id), 'en-US');
        });
      for (const p of rest) {
        if (topFive.length >= 5) break;
        topFive.push(p);
      }
    }
    return topFive.map((p, i) => ({
      ...p,
      suggestedPrice: Math.round(p.price * (1 + diffs[i] / 100)),
      diff: diffs[i],
      reason: diffs[i] > 0 ? 'Высокий спрос + низкий сток' : 'Активность конкурентов ↑',
      confidence: confidences[i],
    }));
  }, []);

  const handleApplyAll = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: 'Цены обновлены',
        description: 'AI-рекомендации применены ко всем выбранным товарам.',
      });
    }, 1500);
  };

  return (
    <div className="space-y-4 duration-500 animate-in fade-in">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <Badge className="bg-accent-primary mb-3 border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            AI Revenue Management
          </Badge>
          <h1 className="text-text-primary text-sm font-black uppercase italic leading-none tracking-tight">
            Движок <span className="text-accent-primary">Динамического</span> Ценообразования
          </h1>
          <p className="text-text-secondary mt-4 max-w-xl font-medium">
            Автоматическая оптимизация маржинальности. ИИ анализирует эластичность спроса, остатки и
            цены конкурентов 24/7.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-border-default h-10 rounded-xl px-4 text-[9px] font-bold uppercase tracking-widest"
          >
            <RefreshCcw className="mr-2 h-3.5 w-3.5" /> Обновить данные
          </Button>
          <Button
            onClick={handleApplyAll}
            disabled={isUpdating}
            className="bg-text-primary hover:bg-accent-primary h-10 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-md transition-all"
          >
            {isUpdating ? (
              <RefreshCcw className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Zap className="mr-2 h-3.5 w-3.5 fill-white" />
            )}
            Применить все советы
          </Button>
        </div>
      </header>

      <div className="grid items-start gap-3 lg:grid-cols-12">
        {/* Left: Global Analytics */}
        <div className="space-y-4 lg:col-span-7">
          <Card className="overflow-hidden rounded-xl border-none bg-white p-4 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-accent-primary h-5 w-5" />
                <h3 className="text-base font-black uppercase tracking-tight">
                  Прогноз выручки (7 дней)
                </h3>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <div className="bg-border-subtle h-2 w-2 rounded-full" />
                  <span className="text-text-muted text-[9px] font-black uppercase">Текущая</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-accent-primary h-2 w-2 rounded-full" />
                  <span className="text-text-muted text-[9px] font-black uppercase">
                    Оптимизированная
                  </span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_PRICING_DATA}>
                  <defs>
                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#e2e8f0" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSuggested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="current"
                    stroke="#e2e8f0"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCurrent)"
                  />
                  <Area
                    type="monotone"
                    dataKey="suggested"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSuggested)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="border-border-subtle mt-8 grid grid-cols-3 gap-3 border-t pt-8">
              <div className="space-y-1">
                <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                  Прогноз роста выручки
                </p>
                <p className="text-sm font-black text-emerald-600">+14.2%</p>
              </div>
              <div className="space-y-1">
                <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                  Прирост валовой маржи
                </p>
                <p className="text-accent-primary text-sm font-black">+5.8%</p>
              </div>
              <div className="space-y-1">
                <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                  Эластичность цены
                </p>
                <p className="text-text-primary text-sm font-black">
                  0.82 <span className="text-text-muted text-[10px]">Высокая</span>
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-text-muted flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                <AlertCircle className="h-4 w-4" /> Топ рекомендаций
              </h3>
              <button className="text-accent-primary text-[10px] font-black uppercase hover:underline">
                View All SKU
              </button>
            </div>
            <div className="space-y-3">
              {priceSuggestions.map((item) => (
                <Card
                  key={item.id}
                  className="group rounded-2xl border-none bg-white p-4 shadow-md transition-all hover:shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-bg-surface2 relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.images[0].url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-text-muted mb-0.5 text-[8px] font-black uppercase">
                        {item.brand}
                      </p>
                      <h4 className="mb-1.5 truncate text-xs font-black uppercase leading-none tracking-tight">
                        {item.name}
                      </h4>
                      <Badge
                        variant="outline"
                        className="border-accent-primary/15 text-accent-primary bg-accent-primary/10 text-[8px] font-black"
                      >
                        {item.reason}
                      </Badge>
                    </div>
                    <div className="border-border-subtle flex flex-col items-end gap-1 border-x px-4 text-right">
                      <p className="text-text-muted text-[9px] font-black uppercase">
                        Текущая: {formatRubInt(item.price)} ₽
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-text-primary text-sm font-black">
                          {formatRubInt(item.suggestedPrice)} ₽
                        </p>
                        <div
                          className={cn(
                            'flex items-center text-[10px] font-black',
                            item.diff > 0 ? 'text-emerald-600' : 'text-rose-500'
                          )}
                        >
                          {item.diff > 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          {Math.abs(item.diff)}%
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-text-muted mb-1 text-[8px] font-black uppercase">
                        ИИ-Точность
                      </p>
                      <p className="text-accent-primary text-xs font-black italic">
                        {item.confidence}%
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-text-primary/90 ml-2 h-10 w-10 rounded-xl transition-all hover:text-white"
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Rules & Config */}
        <div className="space-y-4 lg:col-span-5">
          <Card className="bg-text-primary relative overflow-hidden rounded-xl border-none p-4 text-white shadow-xl">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <LineChart className="h-32 w-32 rotate-12" />
            </div>
            <div className="relative z-10 space-y-4">
              <header className="space-y-2">
                <Badge className="bg-accent-primary border-none px-2 py-0.5 text-[8px] font-black uppercase text-white">
                  Автоматизация активна
                </Badge>
                <h3 className="text-sm font-black uppercase italic leading-none tracking-tight">
                  Политики <br /> Защиты Цен
                </h3>
              </header>

              <div className="space-y-4">
                {[
                  { label: 'Макс. дневное колебание', value: '+/- 15%', icon: TrendingUp },
                  { label: 'Мин. чистая маржа', value: '35%', icon: DollarSign },
                  {
                    label: 'Режим распродажи стока',
                    value: 'ВЫКЛ',
                    icon: ShoppingBag,
                    color: 'text-text-secondary',
                  },
                  { label: 'Индекс цен конкурентов', value: 'Поддерживать 95%', icon: Globe },
                ].map((rule, i) => (
                  <div
                    key={i}
                    className="group flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-accent-primary flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-transform group-hover:scale-110">
                        <rule.icon className="h-4 w-4" />
                      </div>
                      <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                        {rule.label}
                      </span>
                    </div>
                    <span className={cn('text-xs font-black', rule.color || 'text-white')}>
                      {rule.value}
                    </span>
                  </div>
                ))}
              </div>

              <Button className="text-text-primary hover:bg-accent-primary h-10 w-full rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 transition-all hover:text-white">
                Настроить все правила <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <Globe className="text-accent-primary h-5 w-5" />
              <h3 className="text-sm font-black uppercase tracking-widest">Данные конкурентов</h3>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Marketplace A', status: 'Цена ниже', diff: '-8%', color: 'text-rose-500' },
                { name: 'Mytheresa', status: 'Совпадает', diff: '0%', color: 'text-emerald-500' },
                {
                  name: 'Локальные бренды',
                  status: 'Цена выше',
                  diff: '+12%',
                  color: 'text-emerald-500',
                },
              ].map((comp) => (
                <div
                  key={comp.name}
                  className="border-border-subtle flex items-center justify-between rounded-xl border p-4"
                >
                  <div>
                    <p className="text-text-primary text-[10px] font-black uppercase">
                      {comp.name}
                    </p>
                    <p className="text-text-muted text-[9px] font-bold uppercase tracking-tight">
                      {comp.status}
                    </p>
                  </div>
                  <div className={cn('text-xs font-black', comp.color)}>{comp.diff}</div>
                </div>
              ))}
            </div>
            <p className="text-text-muted text-center text-[9px] font-medium italic leading-relaxed">
              *Парсинг цен конкурентов выполняется каждые 15 минут через Syntha Proxy Grid.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-12 7" />
    </svg>
  );
}
