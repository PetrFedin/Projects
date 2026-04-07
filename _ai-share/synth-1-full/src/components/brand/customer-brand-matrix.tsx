'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
    Heart,
    Shirt,
    ShoppingCart,
    Undo2,
    Share2,
    Eye,
    TrendingUp,
    Star,
    AlertCircle,
    ArrowUpRight,
    Search,
    Users,
    Activity,
    Globe
} from 'lucide-react';

const matrixData = [
    { 
        action: 'Добавил в избранное', 
        icon: Heart, 
        metric: 'Awareness', 
        label: 'Осведомленность',
        value: '+15% SKU interest', 
        benefit: 'Бренд видит рост интереса к конкретным товарам (SKU) и может планировать запасы.',
        href: '/brand/products',
        color: 'text-indigo-600',
        bg: 'bg-indigo-50'
    },
    { 
        action: 'Создал look с товаром', 
        icon: Shirt, 
        metric: 'Engagement', 
        label: 'Вовлеченность',
        value: 'Insight into styling', 
        benefit: 'Понимание, с какими вещами других брендов сочетают ваши товары (UGC-аналитика).',
        href: '/brand/showroom',
        color: 'text-blue-600',
        bg: 'bg-blue-50'
    },
    { 
        action: 'Покупка', 
        icon: ShoppingCart, 
        metric: 'Conversion', 
        label: 'Конверсия',
        value: '+8.4M ₽ Revenue', 
        benefit: 'Прямая выручка и подтверждение эффективности маркетинга.',
        href: '/brand/finance',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
    },
    {
        action: 'Возврат',
        icon: Undo2,
        metric: 'Churn Risk',
        label: 'Риск оттока',
        value: '4.2% Return Rate',
        benefit: 'Сигнал о проблемах с качеством, размерной сеткой или несоответствием ожиданиям.',
        href: '/brand/customer-intelligence',
        color: 'text-rose-600',
        bg: 'bg-rose-50'
    },
    {
        action: 'Просмотр шоу бренда',
        icon: Eye,
        metric: 'Media Impact',
        label: 'Влияние медиа',
        value: '+30% product views',
        benefit: 'Измерение эффективности цифровых ивентов и их влияния на интерес к продукту.',
        href: '/brand/showroom',
        color: 'text-amber-600',
        bg: 'bg-amber-50'
    },
    {
        action: 'Поделился товаром',
        icon: Share2,
        metric: 'Virality',
        label: 'Виральность',
        value: '1.2x Reach',
        benefit: 'Органическое привлечение новых клиентов через рекомендации существующих.',
        href: '/brand/analytics-360',
        color: 'text-purple-600',
        bg: 'bg-purple-50'
    }
];

export function CustomerBrandMatrix() {
    return (
        <Card className="rounded-xl border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-4 pb-4">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Activity className="h-4 w-4 text-indigo-600" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Matrix v2.0</span>
                        </div>
                        <CardTitle className="text-base font-black uppercase tracking-tight">Матрица "Клиент-Бренд"</CardTitle>
                        <CardDescription className="text-xs font-medium italic text-slate-400">
                            Как действия клиентов влияют на ключевые метрики вашего бренда.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="w-full overflow-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="px-8 h-10 text-[9px] font-black uppercase tracking-widest text-slate-400">Действие клиента</TableHead>
                                <TableHead className="h-10 text-[9px] font-black uppercase tracking-widest text-slate-400">Метрика бренда</TableHead>
                                <TableHead className="h-10 text-[9px] font-black uppercase tracking-widest text-slate-400">Показатель</TableHead>
                                <TableHead className="px-8 h-10 text-[9px] font-black uppercase tracking-widest text-slate-400">Выгода и Логика</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {matrixData.map((row) => (
                                <TableRow key={row.action} className="group hover:bg-slate-50 transition-all border-slate-50">
                                    <TableCell className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-xl transition-all shadow-sm group-hover:scale-110", row.bg)}>
                                                <row.icon className={cn("h-4 w-4", row.color)} />
                                            </div>
                                            <span className="text-[11px] font-black uppercase text-slate-900 leading-tight">{row.action}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[9px] font-black text-slate-900 uppercase">{row.metric}</span>
                                            <span className="text-[8px] font-medium text-slate-400 uppercase tracking-widest">{row.label}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-[10px] font-black px-2 py-0.5 rounded-lg tabular-nums",
                                                row.metric === 'Churn Risk' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                                            )}>
                                                {row.value}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-[9px] font-medium text-slate-500 leading-relaxed italic max-w-sm">
                                                {row.benefit}
                                            </p>
                                            <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                                <Link href={row.href}>
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
