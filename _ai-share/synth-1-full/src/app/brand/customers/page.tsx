'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
    Users, Search, Filter, ArrowUpRight,
    Mail, ShoppingBag, TrendingUp, 
    Star, ChevronRight, Download,
    Zap, Brain, Target, Layers,
    Calendar, Clock, Sparkles,
    Building2, CreditCard, FileText, CheckCircle2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// --- Advanced CRM Mock Data ---
const extendedCustomers = [
    {
        id: 'usr_001',
        name: 'Анна Новикова',
        email: 'anna.n@example.com',
        phone: '+7 900 123-45-67',
        avatar: 'https://picsum.photos/seed/anna/100/100',
        brandStatus: 'Золотой клиент',
        brandLevel: 2,
        brandLtv: 154800,
        brandLastPurchase: '2026-01-12',
        evolutionStatus: 'Shifting to Premium',
        lastSync: '2 часа назад',
        loyaltyType: 'Мультибрендовый энтузиаст',
        audienceFocus: ['Женская одежда'],
        purchaseDays: ['Сб', 'Вс'],
        purchasePattern: 'Покупает образами (Total Look)',
        styleDNA: 'Минимализм / Наследие',
        materialPref: ['Кашемир', 'Мериносовая шерсть'],
        returnRate: 5,
        frequency: 'Часто',
        aovTrend: 'Растущий',
        seasonality: ['Зима', 'Осень'],
        categoryConcentration: 'Широкая',
        mixesBrands: ['Nordic Wool', 'Syntha Lab', 'Studio 29'],
        totalEcosystemLtv: 450000,
        activeInBrands: 5,
        engagementScore: 92,
        potentialFor: ['Нижнее белье', 'Декор для дома'],
        aiRecommendation: "Предложить капсулу 'Nordic Home'. Высокая синергия с текущими покупками изделий из кашемира."
    },
    {
        id: 'usr_002',
        name: 'Михаил Петров',
        email: 'm.petrov@tech.ru',
        phone: '+7 911 222-33-44',
        avatar: 'https://picsum.photos/seed/mikhail/100/100',
        brandStatus: 'VIP клиент',
        brandLevel: 3,
        brandLtv: 342000,
        brandLastPurchase: '2026-01-13',
        evolutionStatus: 'Loyalty Consolidating',
        lastSync: '15 минут назад',
        loyaltyType: 'Лоялист бренда',
        audienceFocus: ['Мужская одежда', 'Унисекс'],
        purchaseDays: ['Пн', 'Вт'],
        purchasePattern: 'Коллекционер дропов',
        styleDNA: 'Технологичный / Урбан',
        materialPref: ['Мембрана', 'Нейлон'],
        returnRate: 15,
        frequency: 'VIP регулярный',
        aovTrend: 'Стабильный',
        seasonality: ['Всесезонно'],
        categoryConcentration: 'Фокусная (Верхняя одежда)',
        mixesBrands: ['Syntha Lab'],
        totalEcosystemLtv: 380000,
        activeInBrands: 2,
        engagementScore: 85,
        potentialFor: ['Обувь', 'Гаджеты'],
        aiRecommendation: "Ранний доступ к дропу Cyber-Sneaker. Вероятность покупки 88% на основе коллекции верхней одежды."
    }
];

const b2bPartners = [
    {
        id: 'org_001',
        name: 'PODIUM Market',
        type: 'Department Store',
        location: 'Москва, РФ',
        logo: 'https://picsum.photos/seed/podium/100/100',
        tier: 'Strategic Partner',
        ltv: 12450000,
        ordersCount: 42,
        lastOrder: '2026-01-20',
        creditLimit: 5000000,
        creditUsed: 1200000,
        performance: 94,
        returns: 3.2,
        contacts: ['Елена В. (Байер)', 'Алексей М. (Фин.дир)'],
        status: 'Active'
    },
    {
        id: 'org_002',
        name: 'Selfridges',
        type: 'Luxury Retailer',
        location: 'London, UK',
        logo: 'https://picsum.photos/seed/selfridges/100/100',
        tier: 'Global VIP',
        ltv: 45800000,
        ordersCount: 18,
        lastOrder: '2026-01-15',
        creditLimit: 15000000,
        creditUsed: 0,
        performance: 98,
        returns: 1.5,
        contacts: ['Mark Reed (Lead Buyer)'],
        status: 'Active'
    },
    {
        id: 'org_003',
        name: 'Concept Store #1',
        type: 'Boutique',
        location: 'Berlin, DE',
        logo: 'https://picsum.photos/seed/concept/100/100',
        tier: 'Growth Partner',
        ltv: 2100000,
        ordersCount: 5,
        lastOrder: '2025-12-10',
        creditLimit: 500000,
        creditUsed: 450000,
        performance: 72,
        returns: 8.4,
        contacts: ['Hans Klein'],
        status: 'Risk'
    }
];

const crmSegments = [
    { name: 'Покупают луками', count: 124, ltv: '2.4M ₽', growth: '+12%', icon: <Layers className="h-4 w-4" /> },
    { name: 'Фанаты эко-материалов', count: 85, ltv: '1.1M ₽', growth: '+5%', icon: <Target className="h-4 w-4" /> },
    { name: 'Риск возврата', count: 42, ltv: '0.4M ₽', growth: '-8%', icon: <TrendingUp className="h-4 w-4" /> },
    { name: 'Шопинг по выходным', count: 210, ltv: '3.8M ₽', growth: '+18%', icon: <Calendar className="h-4 w-4" /> },
];

export default function BrandCustomersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('list');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const filteredCustomers = useMemo(() => extendedCustomers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]);

    const filteredPartners = useMemo(() => b2bPartners.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]);

    if (!isClient) return null;

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-700">
            {/* Control Panel: Executive Style */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <Badge className="bg-indigo-600 text-white border-none font-black text-[8px] uppercase h-7 px-3 shadow-lg">
                        <Users className="h-3 w-3 mr-2 fill-white" /> Клиентский хаб (CRM)
                    </Badge>
                    <div className="h-4 w-px bg-slate-100 mx-1" />
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Ecosystem Sync: OK
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="h-7 text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">
                        Обновить сегменты
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 px-3 rounded-xl text-[7px] font-black uppercase tracking-widest bg-white border-slate-100 text-slate-400 shadow-sm">
                        Экспорт базы
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="list" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-white/50 p-1 rounded-2xl border border-slate-200/60 shadow-sm h-10 w-fit mb-8">
                    <TabsTrigger value="list" className="rounded-xl px-6 h-12 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                        <Users className="h-3.5 w-3.5 mr-2" /> B2C Клиенты
                    </TabsTrigger>
                    <TabsTrigger value="wholesale" className="rounded-xl px-6 h-12 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                        <Building2 className="h-3.5 w-3.5 mr-2" /> B2B Партнеры
                    </TabsTrigger>
                    <TabsTrigger value="segments" className="rounded-xl px-6 h-12 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                        <Target className="h-3.5 w-3.5 mr-2" /> Сегменты
                    </TabsTrigger>
                    <TabsTrigger value="growth" className="rounded-xl px-6 h-12 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                        <TrendingUp className="h-3.5 w-3.5 mr-2" /> Потенциал
                    </TabsTrigger>
                </TabsList>

                {/* B2C List Content */}
                <TabsContent value="list" className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                placeholder="Поиск: имя, email, статус, стиль..." 
                                className="pl-12 h-12 rounded-2xl border-none bg-white shadow-sm font-bold text-xs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white gap-2 px-6 font-black uppercase tracking-widest text-[10px]">
                            <Filter className="h-4 w-4" /> Фильтры CRM
                        </Button>
                    </div>

                    <Card className="rounded-xl border-none shadow-xl bg-white overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 py-6">Клиент / Экосистема</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Тип лояльности</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Стиль / Паттерн</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">LTV (Бренд)</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Вовлеченность</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest pr-8 text-right">Детали</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCustomers.map((customer) => (
                                    <TableRow key={customer.id} className="group hover:bg-slate-50 border-slate-50 transition-colors">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                                    <AvatarImage src={customer.avatar} />
                                                    <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black uppercase leading-none tracking-tight">{customer.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[8px] font-black border-slate-100 bg-slate-50">
                                                            {customer.activeInBrands} брендов
                                                        </Badge>
                                                        <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-tighter flex items-center gap-1">
                                                            <TrendingUp className="h-2.5 w-2.5" /> {customer.evolutionStatus}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <Badge className={cn(
                                                    "text-[8px] font-black uppercase px-2 py-0.5 border-none",
                                                    customer.loyaltyType === 'Лоялист бренда' ? "bg-rose-500 text-white" : 
                                                    customer.loyaltyType === 'Мультибрендовый энтузиаст' ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                                                )}>
                                                    {customer.loyaltyType}
                                                </Badge>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{customer.frequency}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-900">{customer.styleDNA}</p>
                                                <p className="text-[9px] font-medium text-slate-400 italic">{customer.purchasePattern}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black uppercase">{customer.brandLtv.toLocaleString('ru-RU')} ₽</p>
                                                <p className={cn(
                                                    "text-[9px] font-black uppercase",
                                                    customer.aovTrend === 'Растущий' ? "text-emerald-600" : "text-slate-400"
                                                )}>
                                                    Тренд: {customer.aovTrend}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex flex-col items-end gap-1.5">
                                                <p className="text-[10px] font-black tabular-nums">{customer.engagementScore}%</p>
                                                <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-600" style={{ width: `${customer.engagementScore}%` }} />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="pr-8 text-right">
                                            <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                                <ChevronRight className="h-5 w-5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* B2B / Wholesale Content */}
                <TabsContent value="wholesale" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                            { label: 'Active Wholesale Portfolio', val: '42.8M ₽', icon: Building2, color: 'text-indigo-600' },
                            { label: 'Total Credit Exposure', val: '18.2M ₽', icon: CreditCard, color: 'text-rose-500' },
                            { label: 'Avg Partner Score', val: '92/100', icon: Star, color: 'text-amber-500' }
                        ].map((m, i) => (
                            <Card key={i} className="rounded-3xl border-none shadow-xl bg-white p-4 flex items-center gap-3">
                                <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center bg-slate-50", m.color)}>
                                    <m.icon className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{m.label}</p>
                                    <p className="text-sm font-black italic uppercase text-slate-900 leading-none">{m.val}</p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card className="rounded-xl border-none shadow-2xl bg-white overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-900 text-white">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 py-6 text-white/60">Партнер / Тип</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/60">Локация / Тир</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/60">Кредитный лимит</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/60 text-right">Performance</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/60 text-right">LTV</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest pr-8 text-right text-white/60">Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPartners.map((partner) => (
                                    <TableRow key={partner.id} className="group hover:bg-slate-50 border-slate-50 transition-colors">
                                        <TableCell className="pl-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm relative">
                                                    <Image src={partner.logo} alt={partner.name} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black uppercase tracking-tight text-slate-900 leading-none mb-1.5">{partner.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={cn(
                                                            "text-[8px] font-black uppercase px-2 py-0.5 border-none",
                                                            partner.status === 'Active' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                                                        )}>
                                                            {partner.status}
                                                        </Badge>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase">{partner.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-900">{partner.location}</p>
                                                <Badge variant="outline" className="text-[8px] font-black border-indigo-100 text-indigo-600 bg-indigo-50/50">{partner.tier}</Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-2 max-w-[150px]">
                                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                                    <span className="text-slate-400">Лимит: {partner.creditLimit.toLocaleString('ru-RU')} ₽</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={cn(
                                                        "h-full transition-all",
                                                        (partner.creditUsed / partner.creditLimit) > 0.8 ? "bg-rose-500" : "bg-indigo-600"
                                                    )} style={{ width: `${(partner.creditUsed / partner.creditLimit) * 100}%` }} />
                                                </div>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase">Использовано: {partner.creditUsed.toLocaleString('ru-RU')} ₽</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="inline-flex flex-col items-end">
                                                <p className={cn("text-sm font-black italic uppercase", partner.performance > 90 ? "text-emerald-600" : "text-amber-500")}>
                                                    {partner.performance}%
                                                </p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Efficiency Index</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <p className="text-sm font-black tabular-nums">{(partner.ltv / 1000000).toFixed(1)}M ₽</p>
                                            <p className="text-[8px] font-black text-slate-400 uppercase">{partner.ordersCount} заказов</p>
                                        </TableCell>
                                        <TableCell className="pr-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-100 shadow-sm"><Mail className="h-4 w-4" /></Button>
                                                <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-100 shadow-sm"><FileText className="h-4 w-4" /></Button>
                                                <Button size="icon" className="h-9 w-9 rounded-xl bg-slate-900 text-white shadow-lg"><ChevronRight className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="segments" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {crmSegments.map((segment, i) => (
                            <Card key={i} className="rounded-xl border-none shadow-sm hover:shadow-xl transition-all cursor-pointer group bg-white overflow-hidden">
                                <CardHeader className="p-4 pb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            {segment.icon}
                                        </div>
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-2">{segment.growth}</Badge>
                                    </div>
                                    <CardTitle className="text-base font-black uppercase tracking-tight group-hover:text-indigo-600 transition-colors italic">{segment.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 flex items-end justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Клиентов</p>
                                        <p className="text-sm font-black">{segment.count}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">LTV Segment</p>
                                        <p className="text-sm font-black italic">{segment.ltv}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/30 p-16 text-center space-y-6 group hover:border-indigo-100 transition-all">
                        <div className="max-w-md mx-auto space-y-6">
                            <div className="h-20 w-20 rounded-xl bg-white flex items-center justify-center mx-auto shadow-xl border border-slate-50 group-hover:scale-110 transition-transform">
                                <Sparkles className="h-10 w-10 text-indigo-600 animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-base font-black uppercase tracking-tight text-slate-900 leading-none">Custom Segment <br /> <span className="text-indigo-600 italic">Constructor</span></h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    Используйте AI для поиска сложных связей: "Покупатели кашемира, которые любят авангард и активны в Telegram по выходным".
                                </p>
                            </div>
                            <Button className="rounded-2xl px-10 h-10 bg-slate-900 text-white font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all shadow-2xl">
                                Запустить AI-сканирование <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="growth" className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="bg-slate-900 rounded-[3.5rem] p-16 text-white relative overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)]">
                        <div className="absolute top-0 right-0 p-16 opacity-[0.03]">
                            <Brain className="h-[400px] w-[400px] rotate-12" />
                        </div>
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <Badge className="bg-indigo-600 text-white uppercase text-[10px] font-black border-none px-4 py-1 tracking-[0.2em]">Syntha Intelligence 360°</Badge>
                                    <h3 className="text-base font-black uppercase tracking-tighter leading-[0.85] italic">Ecosystem <br /> Cross-Brand <br /> <span className="text-indigo-400">Expansion</span></h3>
                                    <p className="text-base text-slate-400 font-medium leading-relaxed max-w-lg">
                                        Мы проанализировали поведение 2М+ клиентов и выделили <b>1,450 идеальных профилей</b> для вашего бренда.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-4">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] leading-none">Revenue Forecast</p>
                                        <p className="text-sm font-black italic">+4.2M ₽</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] leading-none">AI Confidence</p>
                                        <p className="text-sm font-black text-indigo-400 italic">82%</p>
                                    </div>
                                </div>
                                <Button className="h-12 px-12 rounded-2xl bg-white text-slate-900 font-black uppercase text-sm tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-[0_20px_40px_-5px_rgba(255,255,255,0.2)]">
                                    Unlock Audience Leads <Zap className="ml-3 h-5 w-5 fill-current" />
                                </Button>
                            </div>
                            <div className="hidden lg:block bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-3 space-y-10">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-4">Synergy Insights</h4>
                                    <div className="space-y-6">
                                        {[
                                            { cat: 'Techwear Accessory Fans', match: 94, color: 'bg-indigo-500' },
                                            { cat: 'Heritage Knitwear Enthusiasts', match: 88, color: 'bg-blue-500' },
                                            { cat: 'Minimalist Interior Designers', match: 76, color: 'bg-emerald-500' }
                                        ].map((item, i) => (
                                            <div key={i} className="space-y-3">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                    <span className="text-white/80">{item.cat}</span>
                                                    <span className="text-indigo-400">{item.match}% Match</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.match}%` }} transition={{ delay: i * 0.2, duration: 1.5 }} className={cn("h-full", item.color)} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-indigo-600/20 border border-indigo-500/30 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-45 group-hover:scale-125 transition-transform">
                                        <Sparkles className="h-12 w-12 text-white" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase text-indigo-400 mb-3 flex items-center gap-2 tracking-[0.2em] relative z-10"><Brain className="h-3.5 w-3.5" /> High Synergistic Opportunity</p>
                                    <p className="text-xs text-white/90 font-medium leading-relaxed italic relative z-10">
                                        "Клиенты бренда <b>Syntha Lab</b> на 45% чаще покупают ваши пальто в первый месяц после запуска. Рекомендуем запустить совместную рекламную кампанию (Collaboration Ad)."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
