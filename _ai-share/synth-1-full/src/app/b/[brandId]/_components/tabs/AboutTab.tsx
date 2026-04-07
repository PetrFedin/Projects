'use client';

import React from 'react';
import Image from 'next/image';
import { 
    Quote, Layers, Leaf, Palette, ShieldCheck, Brain, 
    Globe, Heart, MessageSquare, BookText, History, 
    Map, Check, Award, Timer, MapPin, Building, Phone, 
    Mail, ChevronLeft, ChevronRight, X, Instagram, Send, 
    ArrowRight, Camera, Star, Sparkles, Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AboutTabProps {
    brand: any;
    storefrontSettings: any;
    isTeamOpen: boolean;
    setIsTeamOpen: (open: boolean) => void;
    currentTeamIdx: number;
    setCurrentTeamIdx: (idx: number | ((prev: number) => number)) => void;
    setIsRetailerMapOpen: (open: boolean) => void;
    setIsRetailerOpen: (open: boolean) => void;
    setIsShareLookOpen: (open: boolean) => void;
}

export function AboutTab({
    brand,
    storefrontSettings,
    isTeamOpen,
    setIsTeamOpen,
    currentTeamIdx,
    setCurrentTeamIdx,
    setIsRetailerMapOpen,
    setIsRetailerOpen,
    setIsShareLookOpen
}: AboutTabProps) {
    return (
        <TabsContent value="about" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Main Header for the tab */}
            <div className="space-y-2">
                <h2 className="text-base font-black tracking-tighter uppercase">ДНК и ценности</h2>
                <p className="text-muted-foreground font-medium">История, команда и принципы, которые делают бренд уникальным</p>
            </div>

            {/* 1. Philosophy & DNA Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                <div className="lg:col-span-8 space-y-6">
                    {storefrontSettings.showPhilosophy && (
                        <Card className="relative bg-white/80 backdrop-blur-sm border-none shadow-xl rounded-xl overflow-hidden group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-purple-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                            <CardContent className="p-4">
                                <div className="relative">
                                    <Quote className="h-12 w-12 text-accent/5 absolute -top-4 -left-6" />
                                    <p className="text-base leading-relaxed text-foreground/80 font-medium italic relative z-10">
                                        Мы верим, что одежда должна быть не только красивой, но и умной, экологичной и долговечной. Каждый стежок — это результат кропотливого труда, вдохновленного эстетикой и технологиями.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* 2x2 Grid for DNA blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <DNABlock icon={<Layers className="h-3.5 w-3.5 text-accent" />} title="Материалы" text="70% наших тканей — это премиальный меринос и кашемир. Мы предоставляем полную карту происхождения сырья для каждого изделия." />
                        <DNABlock icon={<Leaf className="h-3.5 w-3.5 text-emerald-500" />} title="Устойчивость" text="100% материалов сертифицированы. Мы компенсируем углеродный след каждой доставки и поддерживаем локальные производства." />
                        <DNABlock icon={<Palette className="h-3.5 w-3.5 text-accent" />} title="Идентичность и наследие" text="Визуальный язык, вдохновленный эстетикой Севера и функционализмом. Сохранение традиционных техник в цифровом контексте." />
                        <DNABlock icon={<ShieldCheck className="h-3.5 w-3.5 text-accent" />} title="Контроль качества" text="Пятиступенчатая система проверки от анализа нити до финишной обработки. Гарантия соответствия премиум-стандартам." />
                        <DNABlock icon={<Brain className="h-3.5 w-3.5 text-accent" />} title="Цифровая экспертиза" text="Использование AI для оптимизации лекал и минимизации остатков ткани. Виртуальные примерки для идеальной посадки." />
                        <DNABlock icon={<Globe className="h-3.5 w-3.5 text-accent" />} title="Глобальное видение" text="Сочетание локальных традиций с международными трендами. Представленность в концепт-сторах Европы и Азии." />
                        <DNABlock icon={<Heart className="h-3.5 w-3.5 text-red-500" />} title="Социальная ответственность" text="Поддержка локальных мастеров и честные условия труда. Мы инвестируем в развитие ремесленных сообществ и образовательные программы." />
                        <DNABlock icon={<MessageSquare className="h-3.5 w-3.5 text-accent" />} title="Сообщество и связь" text="Создание пространства для диалога между творцом и клиентом. Регулярные воркшопы и закрытые превью для друзей бренда." />
                    </div>
                    
                    <div className="flex justify-center pt-4">
                        <Button 
                            variant="ghost" 
                            className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent gap-2 border-b border-transparent hover:border-accent transition-all rounded-none px-0 h-auto pb-1"
                        >
                            <BookText className="h-3 w-3" /> Скачать ESG-отчет бренда (2023)
                        </Button>
                    </div>

                    {/* Timeline & Maps */}
                    <div className="pt-6 space-y-4">
                        <div className="space-y-6">
                            <h3 className="text-base font-black tracking-tighter uppercase flex items-center gap-2">
                                <History className="h-5 w-5 text-accent" /> Путь бренда
                            </h3>
                            <div className="relative border-l-2 border-accent/20 ml-3 space-y-4 pb-4">
                                {[
                                    { year: '2018', title: 'Основание', desc: 'Первая мастерская в Архангельске, вдохновленная культурой Севера.' },
                                    { year: '2020', title: 'Признание', desc: 'Победа на Fashion Future Awards в номинации "Sustainable Tech".' },
                                    { year: '2022', title: 'Инновации', desc: 'Запуск линии из переработанного кашемира и внедрение цифровых лекал.' },
                                    { year: '2024', title: 'Экспансия', desc: 'Открытие флагманского пространства и выход на рынки Азии.' }
                                ].map((item, idx) => (
                                    <div key={idx} className="relative pl-8">
                                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-accent border-4 border-white shadow-sm" />
                                        <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                                            <span className="text-sm font-black text-accent">{item.year}</span>
                                            <h4 className="text-sm font-black uppercase tracking-tight">{item.title}</h4>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground font-medium mt-1 leading-relaxed max-w-lg">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-6">
                                <h3 className="text-base font-black tracking-tighter uppercase flex items-center gap-2">
                                    <Map className="h-5 w-5 text-accent" /> Происхождение сырья
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { material: 'Меринос', origin: 'Австралия', detail: 'Фермы с гуманным отношением к животным' },
                                        { material: 'Кашемир', origin: 'Внутренняя Монголия', detail: 'Бережное традиционное производство' },
                                        { material: 'Лён', origin: 'Север России', detail: 'Локальные органические поля' },
                                        { material: 'Фурнитура', origin: 'Италия', detail: 'Биоразлагаемые материалы' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-muted/5 rounded-2xl border border-muted/10 group hover:border-accent/30 transition-all">
                                            <div className="h-8 w-8 rounded-full bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                                                <Globe className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-tight">{item.material}</span>
                                                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                                    <span className="text-[10px] font-bold text-accent">{item.origin}</span>
                                                </div>
                                                <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">{item.detail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-base font-black tracking-tighter uppercase flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-accent" /> Гид по уходу
                                </h3>
                                <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <ShieldCheck className="h-24 w-24" />
                                    </div>
                                    <div className="relative space-y-4">
                                        {[
                                            'Стирать вручную при температуре не выше 30°C',
                                            'Использовать специальные средства для деликатных тканей',
                                            'Сушить горизонтально в расправленном виде',
                                            'Хранить в сложенном виде для сохранения формы'
                                        ].map((text, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <div className="h-5 w-5 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                                                    <Check className="h-3 w-3 text-accent" />
                                                </div>
                                                <p className="text-[11px] font-medium leading-tight text-foreground/80">{text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-base font-black tracking-tighter uppercase flex items-center gap-2">
                                <Award className="h-5 w-5 text-accent" /> Сертификаты и признание
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { label: 'GOTS', desc: 'Organic Textile Standard' },
                                    { label: 'LWG', desc: 'Gold Rated Leather' },
                                    { label: 'OEKO-TEX', desc: 'Standard 100 Safe' },
                                    { label: 'CLIMATE', desc: 'Neutral Certified' }
                                ].map((cert, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl border border-muted/20 flex flex-col items-center text-center gap-1 group hover:bg-muted/5 transition-all">
                                        <div className="h-10 w-10 rounded-full bg-muted/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <Award className="h-5 w-5 text-muted-foreground group-hover:text-accent" />
                                        </div>
                                        <span className="text-[10px] font-black tracking-widest uppercase">{cert.label}</span>
                                        <span className="text-[8px] font-bold text-muted-foreground uppercase leading-tight">{cert.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <Card className="rounded-xl border-accent/10 shadow-lg bg-white overflow-hidden">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between items-center py-1.5 border-b border-border/50">
                                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Основан</span>
                                <span className="text-xs font-black">{brand.foundedYear}</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-border/50">
                                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Локация</span>
                                <span className="text-xs font-black uppercase tracking-tighter flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-accent" /> {brand.city || 'Москва'}, РФ
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-1.5">
                                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Сегмент</span>
                                <Badge variant="outline" className="text-[9px] font-black border-accent/30 text-accent uppercase">{brand.segment}</Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2">
                                <Button 
                                    variant="ghost" 
                                    className="h-8 text-[9px] font-black uppercase tracking-wider rounded-xl bg-muted/5 hover:bg-accent/5 hover:text-accent transition-all"
                                    onClick={() => setIsRetailerMapOpen(true)}
                                >
                                    <MapPin className="h-3 w-3 mr-1.5" /> АССОРТИМЕНТ
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    className="h-8 text-[9px] font-black uppercase tracking-wider rounded-xl bg-muted/5 hover:bg-accent/5 hover:text-accent transition-all"
                                    onClick={() => setIsRetailerOpen(true)}
                                >
                                    <Building className="h-3 w-3 mr-1.5" /> Розница
                                </Button>
                            </div>
                            
                            <div className="pt-2 space-y-2">
                                <div className="flex items-center gap-3">
                                    {[
                                        { icon: <Globe className="h-4 w-4" />, link: brand.website },
                                        { icon: <Instagram className="h-4 w-4" />, link: brand.socials?.instagram },
                                        { icon: <Send className="h-4 w-4" />, link: brand.socials?.telegram }
                                    ].filter(s => s.link).map((social, i) => (
                                        <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors">
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                                <div className="text-[10px] font-bold text-muted-foreground flex flex-col gap-1">
                                    <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {brand.contact?.phone}</span>
                                    <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {brand.contact?.publicEmail}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Team Section */}
            <div className="space-y-10 pt-16 border-t mt-16">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-accent/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-accent" />
                        </div>
                        <h3 className="text-base font-black uppercase tracking-tighter">Команда и создание</h3>
                    </div>
                    <Button 
                        variant="ghost" 
                        onClick={() => setIsTeamOpen(true)}
                        className="text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-accent/5 hover:text-accent transition-all group"
                    >
                        Познакомиться лично <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div 
                        className="md:col-span-5 relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl cursor-pointer group"
                        onClick={() => setIsTeamOpen(true)}
                    >
                        <Image 
                            src={brand.team?.[0]?.imageUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80"} 
                            alt={brand.team?.[0]?.name || "Founder"} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8">
                            <p className="text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-2">Основатель</p>
                            <p className="text-white text-base font-black uppercase tracking-tighter">{brand.team?.[0]?.name || "Анна Сергеева"}</p>
                            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-1">{brand.team?.[0]?.role || "Креативный директор"}</p>
                        </div>
                    </div>

                    <div className="md:col-span-7 flex flex-col justify-center space-y-6">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                            <ProductionStat icon={<Users className="h-6 w-6" />} count="15+" label="Мастеров своего дела" text="Лучшие портные и технологи с опытом работы от 10 лет." />
                            <ProductionStat icon={<Award className="h-6 w-6" />} count="100%" label="Ручная работа" text="Каждое изделие проходит ручной контроль качества на всех этапах." />
                            <ProductionStat icon={<Timer className="h-6 w-6" />} count="7-10 дн." label="На пошив изделия" text="Бережное создание вашего заказа по индивидуальным параметрам." />
                            <ProductionStat icon={<Shield className="h-6 w-6" />} count="1 год" label="Гарантии качества" text="Бесплатный ремонт и обслуживание трикотажных изделий." />
                        </div>

                        <Card className="bg-muted/30 border-none rounded-3xl overflow-hidden p-4 relative">
                            <Quote className="h-12 w-12 text-accent/5 absolute top-4 right-4" />
                            <div className="space-y-2 relative z-10">
                                <h4 className="text-sm font-black uppercase tracking-widest">Прозрачность производства</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
                                    Мы гордимся тем, что наши цеха расположены в России. Вы всегда можете записаться на экскурсию в наше производство в Санкт-Петербурге, чтобы увидеть, как создаются ваши любимые вещи.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Community Section */}
            {storefrontSettings.showReviews && (
                <div className="space-y-10 pt-16 border-t mt-16 pb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-accent/10 flex items-center justify-center">
                                    <Star className="h-5 w-5 text-accent" />
                                </div>
                                <h3 className="text-base font-black uppercase tracking-tighter text-foreground">Комьюнити и отзывы</h3>
                            </div>
                            <p className="text-muted-foreground text-sm font-medium max-w-2xl leading-relaxed">
                                Образы и рекомендации от наших клиентов, амбассадоров и звездных друзей. 
                                Мы ценим каждое упоминание и честный отзыв о качестве и стиле.
                            </p>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={() => setIsShareLookOpen(true)}
                            className="rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 h-11 px-8 border-accent/20 hover:bg-accent/5 hover:text-accent transition-all"
                        >
                            <Camera className="h-4 w-4" /> Поделиться образом
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4">
                        {[
                            {
                                user: "Ксения Собчак",
                                role: "Журналист и инфлюенсер",
                                type: "star",
                                text: "Nordic Wool — это мой личный фаворит в этом сезоне. Качество трикотажа на уровне лучших мировых домов моды. Рекомендую!",
                                image: "https://images.unsplash.com/photo-1509631179647-01773331693ae?w=600&q=80",
                                badge: "Звездный выбор"
                            },
                            {
                                user: "Александр Р.",
                                role: "Постоянный клиент",
                                type: "client",
                                text: "Заказывал предзаказом. Пришло вовремя, упаковка — отдельное удовольствие. Сидит идеально по моим меркам.",
                                image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
                                badge: "Куплено на платформе"
                            },
                            {
                                user: "@maria_fashion",
                                role: "Fashion-блогер",
                                type: "influencer",
                                text: "Посмотрите, как этот кардиган меняет весь образ! Сделала обзор в сторис. Материал очень приятный к телу.",
                                image: "https://images.unsplash.com/photo-1539109132271-411a9ee2d4c1?w=600&q=80",
                                badge: "Коллаборация"
                            }
                        ].map((review, i) => (
                            <ReviewCard key={i} review={review} />
                        ))}
                    </div>
                </div>
            )}

            {/* Team Dialog */}
            <Dialog open={isTeamOpen} onOpenChange={setIsTeamOpen}>
            <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none">
                <DialogTitle className="sr-only">Команда бренда</DialogTitle>
                <DialogDescription className="sr-only">Информация о команде и создателях бренда</DialogDescription>
                <div className="relative w-full aspect-video md:aspect-[16/9] bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                        <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentTeamIdx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0"
                                >
                                    <Image 
                                        src={brand.team?.[currentTeamIdx]?.imageUrl || ""} 
                                        alt={brand.team?.[currentTeamIdx]?.name || ""} 
                                        fill 
                                        className="object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                </motion.div>
                            </AnimatePresence>
                            
                            {(brand.team?.length || 0) > 1 && (
                                <div className="absolute bottom-8 left-8 flex gap-2 z-20">
                                    <button 
                                        onClick={() => setCurrentTeamIdx(prev => (prev > 0 ? (prev as number) - 1 : (brand.team?.length || 1) - 1))}
                                        className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/10"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button 
                                        onClick={() => setCurrentTeamIdx(prev => (prev < (brand.team?.length || 1) - 1 ? (prev as number) + 1 : 0))}
                                        className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/10"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 p-4 md:p-4 flex flex-col justify-center bg-white relative">
                            <DialogPrimitive.Close asChild>
                                <Button variant="ghost" size="icon" className="absolute top-4 right-6 rounded-full hover:bg-muted">
                                    <X className="h-5 w-5" />
                                </Button>
                            </DialogPrimitive.Close>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentTeamIdx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <p className="text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-2">Команда</p>
                                        <h3 className="text-base font-black uppercase tracking-tighter leading-none">
                                            {brand.team?.[currentTeamIdx]?.name}
                                        </h3>
                                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-3">
                                            {brand.team?.[currentTeamIdx]?.role}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Quote className="h-8 w-8 text-accent/10 absolute -top-4 -left-4" />
                                            <p className="text-sm font-medium text-foreground/80 leading-relaxed italic relative z-10 pl-2">
                                                «{brand.team?.[currentTeamIdx]?.quote}»
                                            </p>
                                        </div>
                                        <div className="h-px w-12 bg-accent/20" />
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {brand.team?.[currentTeamIdx]?.bio}
                                        </p>
                                    </div>

                                    <div className="pt-6 flex items-center gap-3">
                                        <Button variant="outline" size="sm" className="rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10 flex items-center gap-2 group/btn">
                                            <MessageSquare className="h-3.5 w-3.5 text-accent transition-transform group-hover/btn:-rotate-12" />
                                            Написать
                                        </Button>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-accent/5 hover:text-accent transition-all border border-transparent hover:border-accent/10">
                                                <Instagram className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-accent/5 hover:text-accent transition-all border border-transparent hover:border-accent/10">
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {(brand.team?.length || 0) > 1 && (
                                <div className="absolute bottom-8 right-12 flex gap-1.5">
                                    {brand.team?.map((_: any, i: number) => (
                                        <div 
                                            key={i} 
                                            className={cn(
                                                "h-1 w-4 rounded-full transition-all duration-300",
                                                i === currentTeamIdx ? "bg-accent w-8" : "bg-muted"
                                            )} 
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </TabsContent>
    );
}

// --- Internal Helper Components ---

function DNABlock({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
    return (
        <Card className="rounded-2xl border-muted/20 shadow-sm hover:shadow-md transition-all group bg-muted/5 border-dashed h-full">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="flex items-center gap-2 text-[13px] uppercase tracking-tighter font-black">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-[10px] text-muted-foreground leading-snug">
                {text}
            </CardContent>
        </Card>
    );
}

function ProductionStat({ icon, count, label, text }: { icon: React.ReactNode, count: string, label: string, text: string }) {
    return (
        <div className="flex flex-col space-y-2 border-l-2 border-accent/20 pl-6">
            <div className="flex items-center gap-3 text-accent">
                {icon}
                <span className="text-base font-black tracking-tighter leading-none">{count}</span>
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-tight">{label}</p>
            <p className="text-[10px] text-muted-foreground/60 leading-tight">{text}</p>
        </div>
    );
}

function ReviewCard({ review }: { review: any }) {
    return (
        <Card className="rounded-xl border-muted/20 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
            <CardContent className="p-0">
                <div className="relative aspect-[3/4] overflow-hidden">
                    <Image 
                        src={review.image} 
                        alt={review.user} 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                    
                    <div className="absolute top-4 left-6">
                        <Badge className={cn(
                            "border-none text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full",
                            review.type === 'star' ? "bg-amber-500 text-white" :
                            review.type === 'influencer' ? "bg-purple-500 text-white" :
                            "bg-[#22c55e] text-white"
                        )}>
                            {review.badge}
                        </Badge>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 text-white space-y-4">
                        <div className="space-y-1">
                            <p className="text-sm font-black uppercase tracking-tighter leading-none">{review.user}</p>
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{review.role}</p>
                        </div>
                        
                        <div className="h-px w-full bg-white/20" />
                        
                        <div className="relative">
                            <Quote className="h-6 w-6 text-white/10 absolute -top-3 -left-3" />
                            <p className="text-xs font-medium leading-relaxed italic text-white/90 relative z-10 pl-2 line-clamp-3">
                                «{review.text}»
                            </p>
                        </div>

                        <div className="pt-2">
                            <div className="flex items-center text-white text-[9px] font-black uppercase p-0 h-auto hover:text-accent transition-colors gap-1.5 group/link cursor-pointer">
                                Смотреть товары <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
function Shield(props: any) {
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
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </svg>
    )
}

