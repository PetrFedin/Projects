'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Leaf,
  Heart,
  Zap,
  Check,
  Sparkles,
  Star,
  Handshake,
  Clock,
  MessageSquare,
  Info,
  TrendingUp,
  AlertCircle,
  Trophy,
  BarChart2,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IpGuardAi } from "@/components/brand/ip-guard-ai";
import { SectionInfoCard } from "@/components/brand/production/ProductionSectionEnhancements";

const brandQualityMetrics = [
    { 
        id: 'reputation', 
        name: 'Репутация', 
        icon: <ShieldCheck className="h-5 w-5" />, 
        color: 'text-yellow-500', 
        bg: 'bg-yellow-500/10',
        score: 98, 
        status: 'active',
        description: 'Топ-1% в категории Luxury Heritage',
        details: 'Основано на отсутствии критических жалоб, высоком проценте успешных заказов и рейтинге 4.9+ за последние 12 месяцев.',
        thresholds: [
            { label: 'Золотой стандарт', value: 95, current: true },
            { label: 'Серебро', value: 85, current: false },
            { label: 'Минимум', value: 70, current: false }
        ]
    },
    { 
        id: 'eco', 
        name: 'Экологичность', 
        icon: <Leaf className="h-5 w-5" />, 
        color: 'text-emerald-500', 
        bg: 'bg-emerald-500/10',
        score: 92, 
        status: 'active',
        description: 'Zero Waste & Bio Materials',
        details: 'Использование сертифицированной органики (GOTS, OCS) и 100% перерабатываемой упаковки.',
        thresholds: [
            { label: 'Лидер', value: 90, current: true },
            { label: 'Участник', value: 50, current: false }
        ]
    },
    { 
        id: 'loyalty', 
        name: 'Лояльность', 
        icon: <Heart className="h-5 w-5" />, 
        color: 'text-red-500', 
        bg: 'bg-red-500/10',
        score: 95, 
        status: 'active',
        description: '98% возвратных клиентов',
        details: 'Рассчитано как процент клиентов, совершивших 2 и более покупки в течение года.',
        thresholds: [
            { label: 'Премиум', value: 90, current: true },
            { label: 'Стандарт', value: 60, current: false }
        ]
    },
    { 
        id: 'quality', 
        name: 'Качество', 
        icon: <Check className="h-5 w-5" />, 
        color: 'text-indigo-500', 
        bg: 'bg-indigo-500/10',
        score: 97, 
        status: 'active',
        description: 'Ручная работа & Контроль',
        details: 'Прохождение 5-этапного контроля ОТК. Процент брака < 0.1% за квартал.',
        thresholds: [
            { label: 'Эталон', value: 98, current: false },
            { label: 'Мастер', value: 90, current: true }
        ]
    },
    { 
        id: 'delivery', 
        name: 'Логистика', 
        icon: <Clock className="h-5 w-5" />, 
        color: 'text-orange-500', 
        bg: 'bg-orange-500/10',
        score: 88, 
        status: 'active',
        description: 'Доставка за 24 часа',
        details: 'Среднее время от подтверждения заказа до передачи курьеру составляет 18 часов.',
        thresholds: [
            { label: 'Экспресс', value: 95, current: false },
            { label: 'Оптимум', value: 85, current: true }
        ]
    },
    { 
        id: 'service', 
        name: 'Сервис', 
        icon: <MessageSquare className="h-5 w-5" />, 
        color: 'text-pink-500', 
        bg: 'bg-pink-500/10',
        score: 94, 
        status: 'active',
        description: 'Персональный консьерж',
        details: 'Время ответа поддержки < 5 минут. Удовлетворенность сервисом (CSAT) 4.8/5.',
        thresholds: [
            { label: 'Люкс', value: 95, current: false },
            { label: 'Премиум', value: 90, current: true }
        ]
    },
    { 
        id: 'trend', 
        name: 'Тренды', 
        icon: <Sparkles className="h-5 w-5" />, 
        color: 'text-purple-500', 
        bg: 'bg-purple-500/10',
        score: 75, 
        status: 'potential',
        description: 'Задает вектор моды',
        details: 'Частота упоминаний бренда в подборках ведущих стилистов и Fashion-изданий.',
        thresholds: [
            { label: 'Трендсеттер', value: 85, current: false },
            { label: 'Инфлюенсер', value: 60, current: true }
        ]
    },
    { 
        id: 'innovation', 
        name: 'Инновации', 
        icon: <Zap className="h-5 w-5" />, 
        color: 'text-blue-500', 
        bg: 'bg-blue-500/10',
        score: 82, 
        status: 'potential',
        description: 'AI-дизайн и Smart Fit',
        details: 'Внедрение 3D-моделирования лекал и AI-систем подбора размера для клиентов.',
        thresholds: [
            { label: 'Пионер', value: 90, current: false },
            { label: 'Инноватор', value: 75, current: true }
        ]
    },
    { 
        id: 'experts', 
        name: 'Выбор экспертов', 
        icon: <Star className="h-5 w-5" />, 
        color: 'text-amber-500', 
        bg: 'bg-amber-500/10',
        score: 68, 
        status: 'potential',
        description: 'Рекомендовано Syntha',
        details: 'Прохождение независимого аудита экспертного совета платформы.',
        thresholds: [
            { label: 'Золото', value: 90, current: false },
            { label: 'Одобрено', value: 70, current: false }
        ]
    },
    { 
        id: 'social', 
        name: 'Социальный вклад', 
        icon: <Handshake className="h-5 w-5" />, 
        color: 'text-cyan-500', 
        bg: 'bg-cyan-500/10',
        score: 45, 
        status: 'potential',
        description: 'Поддержка ремесел',
        details: 'Наличие программ поддержки локальных мастеров и благотворительных отчислений.',
        thresholds: [
            { label: 'Меценат', value: 80, current: false },
            { label: 'Волонтер', value: 40, current: true }
        ]
    }
];

/** Тело экрана «Качество» — встраивается в цех и доступно как маршрут `/brand/quality`. */
export function BrandQualityDeskBody() {
    const [selectedMetric, setSelectedMetric] = useState(brandQualityMetrics[0]);

    const activeCount = brandQualityMetrics.filter(m => m.status === 'active').length;

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <SectionInfoCard
                title="Система качества и привилегий"
                description="Метрики качества (репутация, ОТК, ESG). Связь с Production (QC-отчёты), отзывами и Compliance."
                icon={ShieldCheck}
                iconBg="bg-emerald-100"
                iconColor="text-emerald-600"
                badges={<><Badge variant="outline" className="text-[9px]">QC</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/products">Products</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/production">Production</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/reviews">Отзывы</Link></Button></>}
            />
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-black uppercase tracking-tighter flex items-center gap-3">
                        Система Привилегий и Качества
                        <Badge className="bg-yellow-500 text-white border-none font-black">PRO</Badge>
                    </h2>
                    <p className="text-muted-foreground mt-1">Детальная аналитика достижений и статусов вашего бренда на платформе.</p>
                </div>
                <div className="flex gap-2">
                    <Card className="px-4 py-2 border-accent/10 bg-accent/5 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white">
                            <Trophy className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-muted-foreground leading-none">Активных знаков</p>
                            <p className="text-base font-black">{activeCount} / 10</p>
                        </div>
                    </Card>
                </div>
            </header>

            <IpGuardAi />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                {/* Left: Metrics List */}
                <div className="lg:col-span-5 space-y-3">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Текущие показатели</p>
                    {brandQualityMetrics.map((metric) => (
                        <button
                            key={metric.id}
                            onClick={() => setSelectedMetric(metric)}
                            className={cn(
                                "w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group relative overflow-hidden",
                                selectedMetric.id === metric.id 
                                    ? "border-black bg-white shadow-xl scale-[1.02] z-10" 
                                    : "border-muted/20 bg-muted/5 hover:border-muted/50 hover:bg-white"
                            )}
                        >
                            <div className="flex items-center gap-3 relative z-10">
                                <div className={cn("p-2.5 rounded-xl transition-colors", metric.bg, metric.color)}>
                                    {metric.icon}
                                </div>
                                <div>
                                    <h4 className="font-black uppercase text-xs tracking-tight">{metric.name}</h4>
                                    <p className="text-[10px] text-muted-foreground font-bold">{metric.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="text-right">
                                    <p className={cn("text-sm font-black leading-none", metric.color)}>{metric.score}%</p>
                                    <Badge variant="outline" className={cn(
                                        "text-[8px] h-4 font-black mt-1",
                                        metric.status === 'active' ? "border-green-500/20 text-green-600 bg-green-50" : "border-slate-300 text-slate-400"
                                    )}>
                                        {metric.status === 'active' ? 'АКТИВЕН' : 'В ПРОЦЕССЕ'}
                                    </Badge>
                                </div>
                                <ChevronRight className={cn(
                                    "h-4 w-4 transition-transform",
                                    selectedMetric.id === metric.id ? "rotate-90" : "text-muted-foreground opacity-20"
                                )} />
                            </div>
                            {selectedMetric.id === metric.id && (
                                <div className={cn("absolute bottom-0 left-0 h-1 bg-black", metric.color.replace('text-', 'bg-'))} style={{ width: `${metric.score}%` }} />
                            )}
                        </button>
                    ))}
                </div>

                {/* Right: Detail View */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="rounded-xl border-accent/10 shadow-2xl overflow-hidden sticky top-4">
                        <CardHeader className={cn("pb-8 text-white", selectedMetric.bg.replace('/10', ''))}>
                            <div className="flex justify-between items-start">
                                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
                                    {selectedMetric.icon}
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase opacity-60">Текущий балл</p>
                                    <h3 className="text-sm font-black">{selectedMetric.score}%</h3>
                                </div>
                            </div>
                            <div className="mt-8">
                                <h3 className="text-base font-black uppercase tracking-tighter">{selectedMetric.name}</h3>
                                <p className="text-white/80 font-bold uppercase text-xs tracking-widest mt-1">{selectedMetric.description}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <Info className="h-3 w-3" /> Обоснование статуса
                                </h4>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed bg-muted/20 p-4 rounded-2xl">
                                    {selectedMetric.details}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <TrendingUp className="h-3 w-3" /> Пороги достижений
                                </h4>
                                <div className="space-y-6">
                                    {selectedMetric.thresholds.map((threshold, idx) => (
                                        <div key={idx} className="relative">
                                            <div className="flex justify-between items-end mb-2">
                                                <div>
                                                    <span className={cn(
                                                        "text-[10px] font-black uppercase tracking-wider",
                                                        threshold.current ? "text-black" : "text-muted-foreground/40"
                                                    )}>
                                                        {threshold.label}
                                                    </span>
                                                    {threshold.current && (
                                                        <Badge className="ml-2 bg-green-500 text-white text-[8px] h-4">ДОСТИГНУТО</Badge>
                                                    )}
                                                </div>
                                                <span className="text-xs font-black">{threshold.value}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <div 
                                                    className={cn(
                                                        "h-full transition-all duration-1000", 
                                                        threshold.current ? selectedMetric.bg.replace('/10', '') : "bg-muted-foreground/10"
                                                    )} 
                                                    style={{ width: `${(selectedMetric.score / threshold.value) * 100 > 100 ? 100 : (selectedMetric.score / threshold.value) * 100}%` }} 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <Card className="p-4 bg-slate-900 text-white border-none rounded-3xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="h-3 w-3 text-yellow-400" />
                                        <p className="text-[9px] font-black uppercase text-white/40">Как повысить?</p>
                                    </div>
                                    <p className="text-[10px] font-bold leading-relaxed">
                                        Поддерживайте текущий уровень еще 3 месяца для получения статуса «Эталон».
                                    </p>
                                </Card>
                                <Card className="p-4 bg-accent/5 border-accent/10 rounded-3xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BarChart2 className="h-3 w-3 text-accent" />
                                        <p className="text-[9px] font-black uppercase text-slate-400">Динамика</p>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-700 leading-relaxed">
                                        +5% за последний месяц благодаря оптимизации логистики.
                                    </p>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="rounded-xl border-accent/10 p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="space-y-4 max-w-xl">
                        <Badge className="bg-accent text-white border-none font-black text-[10px] px-3">АКЦИЯ</Badge>
                        <h3 className="text-sm font-black uppercase tracking-tighter leading-none">Получите статус «Экспертный выбор»</h3>
                        <p className="text-white/60 text-sm font-medium leading-relaxed">
                            Бренды со статусом «Экспертный выбор» получают в 2.4 раза больше охватов в ленте рекомендаций и приоритетную поддержку 24/7. Подайте заявку на аудит сегодня.
                        </p>
                    </div>
                    <Button className="h-10 px-8 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-all shrink-0">
                        Подать заявку на аудит
                    </Button>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Star className="h-64 w-64 rotate-12" />
                </div>
            </Card>
        </div>
    );
}
