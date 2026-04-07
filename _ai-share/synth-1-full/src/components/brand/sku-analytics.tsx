'use client';

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line } from 'recharts';
import type { Product, Promotion } from '@/lib/types';
import { Eye, Heart, ShoppingCart as ShoppingCartIcon, Bot, TrendingUp, AlertCircle, Flame, BarChart2, Sparkles } from 'lucide-react';
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
    'Просмотры': { label: "Просмотры", icon: Eye, color: "hsl(var(--chart-1))" },
    'В избранное': { label: "В избранное", icon: Heart, color: "hsl(var(--chart-2))" },
    'Покупки': { label: "Покупки", icon: ShoppingCartIcon, color: "hsl(var(--chart-4))" },
};


const generateTrendData = (period: Period, baseMultiplier: number = 1) => {
    let length = 7;
    if (period === 'month') length = 30;
    if (period === 'year') length = 12;

    return Array.from({ length }).map((_, i) => {
        const date = period === 'year' ? new Date(new Date().getFullYear(), i, 1) : subDays(new Date(), length - 1 - i);
        const name = period === 'year' ? format(date, 'MMM', { locale: ru }) : `${format(date, 'd')}\n${format(date, 'EE', { locale: ru }).slice(0, 2)}`;
        
        const baseViews = (500 + Math.floor(Math.random() * 1500) + i * (period === 'year' ? 1000 : 50)) * baseMultiplier;
        const baseFavorites = (50 + Math.floor(Math.random() * 350) + i * (period === 'year' ? 50 : 10)) * baseMultiplier;
        const basePurchases = (10 + Math.floor(Math.random() * 40) + i * (period === 'year' ? 20 : 2)) * baseMultiplier;

        return {
            name,
            'Просмотры': baseViews,
            'В избранное': baseFavorites,
            'Покупки': basePurchases,
        };
    });
};

const generateSellThroughData = (totalStock: number) => {
    const data = [];
    let stock = totalStock;
    for (let i = 0; i < 8; i++) { // 8 weeks
        const date = addDays(new Date(), (i - 8) * 7);
        const sold = Math.floor(stock * (Math.random() * 0.2 + 0.1));
        stock -= sold;
        const sellThrough = ((totalStock - stock) / totalStock) * 100;
        data.push({
            week: `Неделя ${i+1}`,
            sellThrough: sellThrough.toFixed(1),
            sold: sold
        });
    }
    return data;
}

const funnelData = [
    { name: 'Просмотры в каталоге', value: 25000, fill: 'hsl(var(--chart-1))' },
    { name: 'Переходы на SKU', value: 8000, fill: 'hsl(var(--chart-2))' },
    { name: 'Добавления в корзину', value: 1200, fill: 'hsl(var(--chart-3))' },
    { name: 'Оформление заказа', value: 450, fill: 'hsl(var(--chart-4))' },
    { name: 'Покупки', value: 380, fill: 'hsl(var(--chart-5))' },
];


export function SkuAnalytics({ brandProducts, initialSku, isDialogMode = false, promotion, onSkuChange }: SkuAnalyticsProps) {
    const [selectedSkuId, setSelectedSkuId] = useState<string | undefined>(initialSku);
    const [randomStats, setRandomStats] = useState({ views: 0, wishlist: 0, cart: 0, returns: 0 });
    const [sellThroughChartData, setSellThroughChartData] = useState<any[]>([]);
     const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if(isClient && selectedSkuId){
             setRandomStats({
                views: Math.floor(Math.random() * 20000) + 5000,
                wishlist: Math.floor(Math.random() * 2000) + 500,
                cart: Math.floor(Math.random() * 500) + 100,
                returns: Math.random() * 5 + 2,
            });
             const selectedProduct = brandProducts.find(p => p.id === selectedSkuId);
            if (!selectedProduct) return;
            const totalStock = (selectedProduct.sizes || []).length * 100; // Mock total stock
            setSellThroughChartData(generateSellThroughData(totalStock));
        }
    }, [isClient, selectedSkuId, brandProducts]);

    useEffect(() => {
        if(initialSku) {
            setSelectedSkuId(initialSku);
        }
    }, [initialSku])
    
    const selectedProduct = brandProducts.find(p => p.id === selectedSkuId);

    if (!isClient) {
        return <Card className="flex items-center justify-center min-h-[300px]"><CardContent><p className="p-4 text-muted-foreground">Загрузка аналитики...</p></CardContent></Card>;
    }
    
    return (
        <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden hover:border-indigo-100 transition-all">
            <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/50">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100 shadow-inner"><BarChart2 className="h-3.5 w-3.5" /></div>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900 leading-none">
                                Deep SKU Analysis: {selectedProduct?.name || ''}
                            </CardTitle>
                        </div>
                        <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {selectedProduct 
                            ? "Detailed funnel, trends and AI-driven recommendations."
                            : "Select a product from the table to view analytics."
                          }
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            {!selectedProduct ? (
                <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Select a product to analyze</p>
                </CardContent>
            ) : (
                <CardContent className="space-y-6 p-4">
                    {promotion && (
                        <Alert variant="default" className="bg-indigo-50/50 border-indigo-100 rounded-xl py-2.5">
                            <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
                            <AlertTitle className="text-[10px] font-bold uppercase tracking-widest text-indigo-900 leading-none mb-1">Active Promotion</AlertTitle>
                            <AlertDescription className="text-[11px] text-slate-600 font-medium tracking-tight">
                                Campaign "{promotion.type}" active until {format(new Date(promotion.endDate), 'd MMM yyyy', {locale: ru})}. 
                                Metrics may be higher than average baseline.
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <StatCard title="VIEWS (30D)" value={randomStats.views.toLocaleString('ru-RU')} description="+20.1% vs prev. month" icon={Eye} />
                        <StatCard title="WISHLIST ADDS" value={randomStats.wishlist.toLocaleString('ru-RU')} description="+18% vs prev. month" icon={Heart} />
                        <StatCard title="CART CONVERSION" value={randomStats.cart.toLocaleString('ru-RU')} description="+12% vs prev. month" icon={ShoppingCartIcon} />
                        <StatCard title="RETURN RATE" value={`${randomStats.returns.toFixed(1)}%`} description="-1.1 p.p. vs prev. month" icon={BarChart2} />
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
                        <ProductFunnelChart data={funnelData} />
                        <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden">
                            <CardHeader className="p-3.5 border-b border-slate-50 bg-slate-50/50">
                                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Sell-Through Dynamics</CardTitle>
                                <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Weekly percentage sold vs stock levels.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-3.5">
                            <ResponsiveContainer width="100%" height={220}>
                                <ComposedChart data={sellThroughChartData}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="week" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="left" unit="%" domain={[0, 100]} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', padding: '12px' }}
                                        labelStyle={{ color: '#94a3b8', fontSize: '9px', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}
                                        itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 0' }}
                                        formatter={(value, name) => [`${value}${name === 'sellThrough' ? '%' : ''}`, name === 'sellThrough' ? 'Sell-Through' : 'Sold Units']} 
                                    />
                                    <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', paddingTop: '10px' }} />
                                    <Bar yAxisId="right" dataKey="sold" name="Units Sold" fill="hsla(var(--chart-1), 0.1)" stroke="hsl(var(--chart-1))" barSize={16} radius={[4, 4, 0, 0]} />
                                    <Line yAxisId="left" type="monotone" dataKey="sellThrough" name="Sell-Through %" stroke="hsl(var(--chart-2))" strokeWidth={2.5} dot={{r: 3, fill: 'hsl(var(--chart-2))', strokeWidth: 2, stroke: '#fff'}} />
                                </ComposedChart>
                            </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="p-3.5 border-b border-slate-50 bg-slate-50/50">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Variant Efficiency</CardTitle>
                            <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Size & Color level performance analysis.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/30">
                                    <TableRow className="border-none h-9">
                                        <TableHead className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 py-0 h-9">Variant</TableHead>
                                        <TableHead className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 py-0 h-9">Sell-Through</TableHead>
                                        <TableHead className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 py-0 h-9">Inventory</TableHead>
                                        <TableHead className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 py-0 h-9">Forecast</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedProduct.availableColors?.map(color => (
                                        <React.Fragment key={color.id}>
                                            <TableRow className="bg-slate-50/30 hover:bg-slate-50/50 transition-colors h-9">
                                                <TableCell colSpan={4} className="text-[10px] font-bold text-slate-900 uppercase tracking-widest pl-4">{color.name}</TableCell>
                                            </TableRow>
                                            {selectedProduct.sizes?.map(size => {
                                                const sellThrough = Math.floor(Math.random() * 50) + 40;
                                                const stock = Math.floor(Math.random() * 20);
                                                const forecast = stock > 5 ? 'Stable' : 'OOS RISK';
                                                return (
                                                <TableRow key={`${color.id}-${size.name}`} className="hover:bg-slate-50/50 border-slate-50 transition-colors h-10">
                                                    <TableCell className="pl-8 text-[11px] font-bold text-slate-900 uppercase tracking-tight leading-none">{size.name}</TableCell>
                                                    <TableCell className="text-[11px] font-bold text-slate-900 tabular-nums">{sellThrough}%</TableCell>
                                                    <TableCell className="text-[11px] font-bold text-slate-900 tabular-nums">{stock} units</TableCell>
                                                    <TableCell><Badge variant={forecast === 'Stable' ? 'outline' : 'destructive'} className="text-[7px] font-bold uppercase px-1.5 h-3.5 tracking-widest">{forecast}</Badge></TableCell>
                                                </TableRow>
                                            )})}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>


                    <Card className="rounded-xl border border-indigo-500 shadow-xl shadow-indigo-100/50 bg-slate-900 text-white p-4 relative overflow-hidden group">
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-indigo-600 rounded-lg shadow-lg border border-indigo-500 group-hover:scale-105 transition-transform">
                                    <Bot className="h-3.5 w-3.5 text-white" />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300 leading-none">Intelligence</span>
                                    <p className="text-[11px] font-bold uppercase tracking-tight">AI Insights & Strategic Recommendations</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                                    <p className="text-[8px] font-bold text-indigo-300 uppercase tracking-widest mb-1 leading-none">Funnel Analysis</p>
                                    <p className="text-[10px] text-slate-300 font-bold uppercase leading-relaxed tracking-tight">
                                        High cart additions (15%) but low conversion (32%). Shipping costs or checkout complexity suspected.
                                    </p>
                                </div>
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                                    <p className="text-[8px] font-bold text-emerald-300 uppercase tracking-widest mb-1 leading-none">Trend Forecast</p>
                                    <p className="text-[10px] text-slate-300 font-bold uppercase leading-relaxed tracking-tight">
                                        Seasonal peak expected in FW period. Launch promo late August to maximize velocity.
                                    </p>
                                </div>
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                                    <p className="text-[8px] font-bold text-amber-300 uppercase tracking-widest mb-1 leading-none">Action Item</p>
                                    <p className="text-[10px] text-slate-300 font-bold uppercase leading-relaxed tracking-tight">
                                        Enable free shipping for this SKU to increase final stage conversion velocity.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Sparkles className="absolute -right-6 -top-4 h-24 w-24 text-indigo-600 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700" />
                    </Card>
                </CardContent>
            )}
        </Card>
    );
}
