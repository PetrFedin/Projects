'use client';

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from 'recharts';
import type { Product, Promotion } from '@/lib/types';
import {
  Eye,
  Heart,
  ShoppingCart as ShoppingCartIcon,
  Bot,
  TrendingUp,
  AlertCircle,
  Flame,
  BarChart2,
  Sparkles,
} from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ProductFunnelChart } from './product-funnel-chart';
import { StatCard } from '../stat-card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

interface SkuAnalyticsProps {
  brandProducts: Product[];
  initialSku?: string;
  isDialogMode?: boolean;
  promotion?: Promotion;
  onSkuChange?: (skuId: string) => void;
}

type Period = 'week' | 'month' | 'year';

const metricConfig = {
  Просмотры: { label: 'Просмотры', icon: Eye, color: 'hsl(var(--chart-1))' },
  'В избранное': { label: 'В избранное', icon: Heart, color: 'hsl(var(--chart-2))' },
  Покупки: { label: 'Покупки', icon: ShoppingCartIcon, color: 'hsl(var(--chart-4))' },
};

const generateTrendData = (period: Period, baseMultiplier: number = 1) => {
  let length = 7;
  if (period === 'month') length = 30;
  if (period === 'year') length = 12;

  return Array.from({ length }).map((_, i) => {
    const date =
      period === 'year'
        ? new Date(new Date().getFullYear(), i, 1)
        : subDays(new Date(), length - 1 - i);
    const name =
      period === 'year'
        ? format(date, 'MMM', { locale: ru })
        : `${format(date, 'd')}\n${format(date, 'EE', { locale: ru }).slice(0, 2)}`;

    const baseViews =
      (500 + Math.floor(Math.random() * 1500) + i * (period === 'year' ? 1000 : 50)) *
      baseMultiplier;
    const baseFavorites =
      (50 + Math.floor(Math.random() * 350) + i * (period === 'year' ? 50 : 10)) * baseMultiplier;
    const basePurchases =
      (10 + Math.floor(Math.random() * 40) + i * (period === 'year' ? 20 : 2)) * baseMultiplier;

    return {
      name,
      Просмотры: baseViews,
      'В избранное': baseFavorites,
      Покупки: basePurchases,
    };
  });
};

const generateSellThroughData = (totalStock: number) => {
  const data = [];
  let stock = totalStock;
  for (let i = 0; i < 8; i++) {
    // 8 weeks
    const date = addDays(new Date(), (i - 8) * 7);
    const sold = Math.floor(stock * (Math.random() * 0.2 + 0.1));
    stock -= sold;
    const sellThrough = ((totalStock - stock) / totalStock) * 100;
    data.push({
      week: `Неделя ${i + 1}`,
      sellThrough: sellThrough.toFixed(1),
      sold: sold,
    });
  }
  return data;
};

const funnelData = [
  { name: 'Просмотры в каталоге', value: 25000, fill: 'hsl(var(--chart-1))' },
  { name: 'Переходы на SKU', value: 8000, fill: 'hsl(var(--chart-2))' },
  { name: 'Добавления в корзину', value: 1200, fill: 'hsl(var(--chart-3))' },
  { name: 'Оформление заказа', value: 450, fill: 'hsl(var(--chart-4))' },
  { name: 'Покупки', value: 380, fill: 'hsl(var(--chart-5))' },
];

export function SkuAnalytics({
  brandProducts,
  initialSku,
  isDialogMode = false,
  promotion,
  onSkuChange,
}: SkuAnalyticsProps) {
  const [selectedSkuId, setSelectedSkuId] = useState<string | undefined>(initialSku);
  const [randomStats, setRandomStats] = useState({ views: 0, wishlist: 0, cart: 0, returns: 0 });
  const [sellThroughChartData, setSellThroughChartData] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && selectedSkuId) {
      setRandomStats({
        views: Math.floor(Math.random() * 20000) + 5000,
        wishlist: Math.floor(Math.random() * 2000) + 500,
        cart: Math.floor(Math.random() * 500) + 100,
        returns: Math.random() * 5 + 2,
      });
      const selectedProduct = brandProducts.find((p) => p.id === selectedSkuId);
      if (!selectedProduct) return;
      const totalStock = (selectedProduct.sizes || []).length * 100; // Mock total stock
      setSellThroughChartData(generateSellThroughData(totalStock));
    }
  }, [isClient, selectedSkuId, brandProducts]);

  useEffect(() => {
    if (initialSku) {
      setSelectedSkuId(initialSku);
    }
  }, [initialSku]);

  const selectedProduct = brandProducts.find((p) => p.id === selectedSkuId);

  if (!isClient) {
    return (
      <Card className="flex min-h-[300px] items-center justify-center">
        <CardContent>
          <p className="p-4 text-muted-foreground">Загрузка аналитики...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100">
      <CardHeader className="border-b border-slate-50 bg-slate-50/50 p-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="space-y-0.5">
            <div className="mb-1 flex items-center gap-2">
              <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-1.5 text-indigo-600 shadow-inner">
                <BarChart2 className="h-3.5 w-3.5" />
              </div>
              <CardTitle className="text-sm font-bold uppercase leading-none tracking-widest text-slate-900">
                Deep SKU Analysis: {selectedProduct?.name || ''}
              </CardTitle>
            </div>
            <CardDescription className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              {selectedProduct
                ? 'Detailed funnel, trends and AI-driven recommendations.'
                : 'Select a product from the table to view analytics.'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {!selectedProduct ? (
        <CardContent className="flex h-96 items-center justify-center text-muted-foreground">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
            Select a product to analyze
          </p>
        </CardContent>
      ) : (
        <CardContent className="space-y-6 p-4">
          {promotion && (
            <Alert
              variant="default"
              className="rounded-xl border-indigo-100 bg-indigo-50/50 py-2.5"
            >
              <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
              <AlertTitle className="mb-1 text-[10px] font-bold uppercase leading-none tracking-widest text-indigo-900">
                Active Promotion
              </AlertTitle>
              <AlertDescription className="text-[11px] font-medium tracking-tight text-slate-600">
                Campaign "{promotion.type}" active until{' '}
                {format(new Date(promotion.endDate), 'd MMM yyyy', { locale: ru })}. Metrics may be
                higher than average baseline.
              </AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              title="VIEWS (30D)"
              value={randomStats.views.toLocaleString('ru-RU')}
              description="+20.1% vs prev. month"
              icon={Eye}
            />
            <StatCard
              title="WISHLIST ADDS"
              value={randomStats.wishlist.toLocaleString('ru-RU')}
              description="+18% vs prev. month"
              icon={Heart}
            />
            <StatCard
              title="CART CONVERSION"
              value={randomStats.cart.toLocaleString('ru-RU')}
              description="+12% vs prev. month"
              icon={ShoppingCartIcon}
            />
            <StatCard
              title="RETURN RATE"
              value={`${randomStats.returns.toFixed(1)}%`}
              description="-1.1 p.p. vs prev. month"
              icon={BarChart2}
            />
          </div>

          <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
            <ProductFunnelChart data={funnelData} />
            <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
              <CardHeader className="border-b border-slate-50 bg-slate-50/50 p-3.5">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-700">
                  Sell-Through Dynamics
                </CardTitle>
                <CardDescription className="text-[9px] font-bold uppercase tracking-tight text-slate-400">
                  Weekly percentage sold vs stock levels.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3.5">
                <ResponsiveContainer width="100%" height={220}>
                  <ComposedChart data={sellThroughChartData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      unit="%"
                      domain={[0, 100]}
                      tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px',
                      }}
                      labelStyle={{
                        color: '#94a3b8',
                        fontSize: '9px',
                        fontWeight: 700,
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                      }}
                      itemStyle={{
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 0',
                      }}
                      formatter={(value, name) => [
                        `${value}${name === 'sellThrough' ? '%' : ''}`,
                        name === 'sellThrough' ? 'Sell-Through' : 'Sold Units',
                      ]}
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: '9px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        paddingTop: '10px',
                      }}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="sold"
                      name="Units Sold"
                      fill="hsla(var(--chart-1), 0.1)"
                      stroke="hsl(var(--chart-1))"
                      barSize={16}
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="sellThrough"
                      name="Sell-Through %"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: 'hsl(var(--chart-2))', strokeWidth: 2, stroke: '#fff' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50 p-3.5">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-700">
                Variant Efficiency
              </CardTitle>
              <CardDescription className="text-[9px] font-bold uppercase tracking-tight text-slate-400">
                Size & Color level performance analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow className="h-9 border-none">
                    <TableHead className="h-9 py-0 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Variant
                    </TableHead>
                    <TableHead className="h-9 py-0 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Sell-Through
                    </TableHead>
                    <TableHead className="h-9 py-0 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Inventory
                    </TableHead>
                    <TableHead className="h-9 py-0 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Forecast
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedProduct.availableColors?.map((color) => (
                    <React.Fragment key={color.id}>
                      <TableRow className="h-9 bg-slate-50/30 transition-colors hover:bg-slate-50/50">
                        <TableCell
                          colSpan={4}
                          className="pl-4 text-[10px] font-bold uppercase tracking-widest text-slate-900"
                        >
                          {color.name}
                        </TableCell>
                      </TableRow>
                      {selectedProduct.sizes?.map((size) => {
                        const sellThrough = Math.floor(Math.random() * 50) + 40;
                        const stock = Math.floor(Math.random() * 20);
                        const forecast = stock > 5 ? 'Stable' : 'OOS RISK';
                        return (
                          <TableRow
                            key={`${color.id}-${size.name}`}
                            className="h-10 border-slate-50 transition-colors hover:bg-slate-50/50"
                          >
                            <TableCell className="pl-8 text-[11px] font-bold uppercase leading-none tracking-tight text-slate-900">
                              {size.name}
                            </TableCell>
                            <TableCell className="text-[11px] font-bold tabular-nums text-slate-900">
                              {sellThrough}%
                            </TableCell>
                            <TableCell className="text-[11px] font-bold tabular-nums text-slate-900">
                              {stock} units
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={forecast === 'Stable' ? 'outline' : 'destructive'}
                                className="h-3.5 px-1.5 text-[7px] font-bold uppercase tracking-widest"
                              >
                                {forecast}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden rounded-xl border border-indigo-500 bg-slate-900 p-4 text-white shadow-xl shadow-indigo-100/50">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg border border-indigo-500 bg-indigo-600 p-2 shadow-lg transition-transform group-hover:scale-105">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold uppercase leading-none tracking-[0.2em] text-indigo-300">
                    Intelligence
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-tight">
                    AI Insights & Strategic Recommendations
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-colors hover:bg-white/10">
                  <p className="mb-1 text-[8px] font-bold uppercase leading-none tracking-widest text-indigo-300">
                    Funnel Analysis
                  </p>
                  <p className="text-[10px] font-bold uppercase leading-relaxed tracking-tight text-slate-300">
                    High cart additions (15%) but low conversion (32%). Shipping costs or checkout
                    complexity suspected.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-colors hover:bg-white/10">
                  <p className="mb-1 text-[8px] font-bold uppercase leading-none tracking-widest text-emerald-300">
                    Trend Forecast
                  </p>
                  <p className="text-[10px] font-bold uppercase leading-relaxed tracking-tight text-slate-300">
                    Seasonal peak expected in FW period. Launch promo late August to maximize
                    velocity.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-colors hover:bg-white/10">
                  <p className="mb-1 text-[8px] font-bold uppercase leading-none tracking-widest text-amber-300">
                    Action Item
                  </p>
                  <p className="text-[10px] font-bold uppercase leading-relaxed tracking-tight text-slate-300">
                    Enable free shipping for this SKU to increase final stage conversion velocity.
                  </p>
                </div>
              </div>
            </div>
            <Sparkles className="absolute -right-6 -top-4 h-24 w-24 text-indigo-600 opacity-10 transition-all duration-700 group-hover:scale-110 group-hover:opacity-20" />
          </Card>
        </CardContent>
      )}
    </Card>
  );
}
