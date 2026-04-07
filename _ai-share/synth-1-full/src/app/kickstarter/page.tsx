
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { kickstarterProjects } from '@/lib/kickstarter';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Users, Filter, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Combobox } from '@/components/ui/combobox';
import { products } from '@/lib/products';
import { useUIState } from '@/providers/ui-state';
import { TrendingUp, ShieldCheck, Zap, Globe, BarChart3, Clock as ClockIcon } from 'lucide-react';

export default function KickstarterPage() {
    const { viewRole } = useUIState();
    const [brandFilter, setBrandFilter] = useState<string[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    const [seasonFilter, setSeasonFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>(['live']);
    const [sortOrder, setSortOrder] = useState('progress');

    const brandOptions = useMemo(() => [...new Set(kickstarterProjects.map(p => p.creator))].map(b => ({ value: b, label: b })), []);
    const categoryOptions = useMemo(() => [...new Set(products.map(p => p.category))].map(c => ({ value: c, label: c })), []);
    const seasonOptions = useMemo(() => [...new Set(kickstarterProjects.map(p => p.season || ''))].filter(Boolean).map(s => ({ value: s, label: s })), []);
    const statusOptions = [
        { value: 'live', label: 'Активные' },
        { value: 'upcoming', label: 'Скоро' },
        { value: 'successful', label: 'Успешные' },
        { value: 'production', label: 'В производстве' },
    ];

    const filteredProjects = useMemo(() => {
        return kickstarterProjects
            .filter(p => {
                const brandMatch = brandFilter.length === 0 || brandFilter.includes(p.creator);
                const categoryMatch = categoryFilter.length === 0 || categoryFilter.includes(products.find(prod => prod.id === p.productId)?.category || '');
                const seasonMatch = seasonFilter.length === 0 || seasonFilter.includes(p.season || '');
                const statusMatch = statusFilter.length === 0 || statusFilter.includes(p.status);
                return brandMatch && categoryMatch && seasonMatch && statusMatch;
            })
            .sort((a, b) => {
                if (sortOrder === 'progress') return (b.currentRevenue / b.goal) - (a.currentRevenue / a.goal);
                if (sortOrder === 'time') return a.daysLeft - b.daysLeft;
                if (sortOrder === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                return 0;
            });
    }, [brandFilter, categoryFilter, seasonFilter, statusFilter, sortOrder]);
    
    const resetFilters = () => {
        setBrandFilter([]);
        setCategoryFilter([]);
        setSeasonFilter([]);
        setStatusFilter(['live']);
    };

    const hasActiveFilters = brandFilter.length > 0 || categoryFilter.length > 0 || seasonFilter.length > 0 || (statusFilter.length > 0 && !(statusFilter.length === 1 && statusFilter[0] === 'live'));

    return (
        <div className="container mx-auto px-4 py-12 space-y-6">
            {viewRole === 'b2b' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in duration-300">
                    <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white p-4 space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp className="h-24 w-24" /></div>
                        <Badge className="bg-indigo-600 border-none text-[8px] font-black uppercase">Wholesale Intelligence</Badge>
                        <h3 className="text-base font-black uppercase tracking-tight">Анализ спроса B2B</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            «Сегмент "Techwear" забронирован на 84% от целевой мощности производства. Рекомендуем фиксировать квоты».
                        </p>
                    </Card>
                    <Card className="rounded-xl border-none shadow-xl bg-white p-4 space-y-4 border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><ShieldCheck className="h-5 w-5" /></div>
                            <span className="text-[10px] font-black uppercase text-slate-400">Гарантия пошива</span>
                        </div>
                        <h3 className="text-base font-black uppercase tracking-tight">Smart Contracts</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">Все предзаказы защищены эскроу-счетами. Фабрика приступает к работе сразу после достижения 60% лимита.</p>
                    </Card>
                    <Card className="rounded-xl border-none shadow-xl bg-emerald-50 p-4 space-y-4 border border-emerald-100">
                        <div className="flex items-center justify-between">
                            <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200"><Zap className="h-5 w-5" /></div>
                            <Badge className="bg-white text-emerald-600 border-none font-black text-[10px]">Active</Badge>
                        </div>
                        <h3 className="text-base font-black uppercase tracking-tight text-emerald-900">Priority Allocation</h3>
                        <p className="text-xs text-emerald-700/70 leading-relaxed">Ваш магазин имеет приоритетный доступ к отгрузке первой партии (Early Bird B2B).</p>
                    </Card>
                </div>
            )}

            <header className="text-center">
                <h1 className="text-sm md:text-sm font-bold font-headline">Syntha Kickstarter</h1>
                <p className="mt-4 text-sm text-muted-foreground max-w-3xl mx-auto">
                    Поддержите будущее моды. Получите эксклюзивные вещи раньше всех и помогите брендам воплотить их лучшие идеи в жизнь.
                </p>
            </header>

            <div className="flex flex-col sm:flex-row gap-2 mb-8 items-center border p-4 rounded-lg bg-card">
                <div className="flex items-center gap-2 flex-wrap">
                     <Filter className="h-4 w-4 text-muted-foreground" />
                     <Combobox options={brandOptions} multiple value={brandFilter} onChange={(v) => setBrandFilter(v as string[])} placeholder="Бренд" className="w-[150px] h-9" />
                     <Combobox options={categoryOptions} multiple value={categoryFilter} onChange={(v) => setCategoryFilter(v as string[])} placeholder="Категория" className="w-[150px] h-9" />
                     <Combobox options={seasonOptions} multiple value={seasonFilter} onChange={(v) => setSeasonFilter(v as string[])} placeholder="Сезон" className="w-[150px] h-9" />
                     <Combobox options={statusOptions} multiple value={statusFilter} onChange={(v) => setStatusFilter(v as string[])} placeholder="Статус" className="w-[150px] h-9" />
                     {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                            <X className="mr-1 h-4 w-4" /> Сбросить
                        </Button>
                    )}
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-[180px] h-9">
                            <SelectValue placeholder="Сортировка" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="progress">% финансирования</SelectItem>
                            <SelectItem value="time">По времени до конца</SelectItem>
                            <SelectItem value="newest">По новизне</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProjects.map(project => {
                    const progress = (project.pledged / project.goal) * 100;
                    // Stable mock B2B data based on ID to avoid hydration errors
                    const idNum = parseInt(project.id.replace(/\D/g, '') || '0', 10) || 1;
                    const b2bRetailers = (idNum % 5) + 2;
                    const b2bReserved = (idNum % 50) + 25;
                    
                    return (
                        <Card key={project.id} className="flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 z-20 pointer-events-none">
                                <div className="bg-indigo-600 text-white text-[8px] font-black uppercase py-1 px-8 rotate-45 translate-x-6 translate-y-2 shadow-lg">
                                    B2B Ready
                                </div>
                            </div>
                            <CardHeader className="p-0">
                                <Link href={`/kickstarter/${project.id}`}>
                                    <div className="relative aspect-video">
                                        <Image 
                                            src={project.imageUrl || 'https://placehold.co/600x400/f0f0f0/333333?text=Syntha'}
                                            alt={project.title}
                                            fill
                                            className="object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
                                            data-ai-hint={project.imageHint}
                                        />
                                        {project.isFunded && (
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">ЦЕЛЬ ДОСТИГНУТА</div>
                                        )}
                                    </div>
                                </Link>
                            </CardHeader>
                            <CardContent className="p-4 flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-xs font-semibold text-primary">{project.creator}</p>
                                    <div className="flex items-center gap-1 bg-indigo-50 px-1.5 py-0.5 rounded">
                                        <Users className="h-3 w-3 text-indigo-600" />
                                        <span className="text-[9px] font-black text-indigo-600 uppercase">{b2bRetailers} ритейлеров</span>
                                    </div>
                                </div>
                                <Link href={`/kickstarter/${project.id}`}><CardTitle className="mt-1 text-base hover:text-primary transition-colors leading-tight font-black uppercase tracking-tight">{project.title}</CardTitle></Link>
                                <CardDescription className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.description}</CardDescription>
                                
                                <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase">B2B Оптовая бронь</p>
                                        <span className="text-[10px] font-black text-emerald-600">-{project.b2bDiscount || '35'}%</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <p className="text-xs font-bold text-slate-700">{b2bReserved} ед. забронировано</p>
                                        <Link href={`/shop/b2b/kickstarter/${project.id}`} className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Условия закупки</Link>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex-col items-start gap-3">
                                <div className="w-full">
                                    <Progress value={progress} className="h-2 bg-slate-100"/>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-sm font-black text-slate-900 tabular-nums">{project.pledged.toLocaleString('ru-RU')} ₽</p>
                                        <p className="text-sm font-bold text-slate-400">
                                            {progress.toFixed(0)}%
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5"><Users className="h-4 w-4 text-slate-300"/> {project.backers} спонсоров</div>
                                    <div>{project.daysLeft} дней</div>
                                </div>
                                 <Button asChild className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-widest h-11 rounded-xl shadow-lg">
                                    <Link href={`/kickstarter/${project.id}`}>Поддержать проект</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}
