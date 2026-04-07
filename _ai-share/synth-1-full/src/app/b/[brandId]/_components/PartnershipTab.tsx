'use client';

import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    Handshake, Check, MessageSquare, FileText, Briefcase, 
    Sparkles, Factory, Newspaper, Mail, Phone, BookText 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PartnershipTabProps {
    displayName: string;
    setMessageCategory: (category: string) => void;
    setIsMessageDialogOpen: (open: boolean) => void;
    handleB2bRequest: (type: string) => void;
    sentB2bRequests: string[];
    b2bPartnerStatus: 'none' | 'pending' | 'friend' | 'active' | 'spot';
    setB2bPartnerStatus: (status: 'none' | 'pending' | 'friend' | 'active' | 'spot') => void;
    handleB2bRegistration: () => void;
    toast: any;
}

export function PartnershipTab({
    displayName,
    setMessageCategory,
    setIsMessageDialogOpen,
    handleB2bRequest,
    sentB2bRequests,
    b2bPartnerStatus,
    setB2bPartnerStatus,
    handleB2bRegistration,
    toast
}: PartnershipTabProps) {
    return (
        <TabsContent value="partnership" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-4">
            <div className="space-y-2">
                <h2 className="text-sm font-black tracking-tighter uppercase">Сотрудничество</h2>
                <p className="text-muted-foreground font-medium">B2B решения, партнерство и возможности для роста вместе с {displayName}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* 1. Retail & Distribution */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="rounded-xl border-none shadow-xl bg-white overflow-hidden">
                        <CardHeader className="p-4 pb-4 bg-accent/5">
                            <div className="flex items-center gap-3 mb-2">
                                <Handshake className="h-6 w-6 text-accent" />
                                <CardTitle className="text-sm font-black uppercase tracking-tight">Магазинам и дистрибьюторам</CardTitle>
                            </div>
                            <CardDescription className="text-sm font-medium">
                                Мы предлагаем гибкие условия оптовых закупок и эксклюзивные права на дистрибуцию в регионах.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Условия B2B</h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Минимальный заказ (MOQ)', value: 'от 50 ед. / 150к ₽' },
                                            { label: 'Срок отгрузки', value: '7-14 рабочих дней' },
                                            { label: 'Валюта расчетов', value: 'RUB (только ₽)' },
                                            { label: 'Условия оплаты', value: '50% предоплата (запуск в производство), 50% перед отгрузкой (готовность на складе)' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center py-2 border-b border-muted/10">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</span>
                                                <span className="text-[11px] font-black">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Логистика и поддержка</h4>
                                    <div className="space-y-2">
                                        {[
                                            'Доставка по всей РФ и СНГ',
                                            'Предоставление маркетинговых материалов',
                                            'Обучение персонала торговых точек',
                                            'Приоритетный доступ к новым коллекциям'
                                        ].map((text, i) => (
                                            <div key={i} className="flex items-center gap-2 text-[11px] font-medium">
                                                <Check className="h-3.5 w-3.5 text-accent stroke-[3px]" />
                                                {text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button 
                                    onClick={() => {
                                        setMessageCategory('Оптовый заказ / Дистрибуция');
                                        setIsMessageDialogOpen(true);
                                    }}
                                    className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg bg-black text-white hover:bg-black/90 shadow-black/20"
                                >
                                    <MessageSquare className="mr-2 h-4 w-4" /> Написать и прикрепить файлы
                                </Button>
                                <Button 
                                    onClick={() => handleB2bRequest('terms')}
                                    variant="outline"
                                    className={cn(
                                        "flex-1 h-12 rounded-2xl font-black uppercase tracking-widest transition-all",
                                        sentB2bRequests.includes('terms')
                                            ? "bg-green-50 text-green-600 border-green-200" 
                                            : "border-muted/20 hover:bg-accent/5 hover:text-accent"
                                    )}
                                >
                                    {sentB2bRequests.includes('terms') ? (
                                        <><Check className="mr-2 h-4 w-4" /> Запрос отправлен</>
                                    ) : (
                                        <><FileText className="mr-2 h-4 w-4" /> Получить прайс-лист</>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Suppliers Section */}
                        <Card className="rounded-xl border-muted/20 bg-muted/5 shadow-sm hover:shadow-md transition-all">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <Briefcase className="h-4 w-4 text-accent" />
                                    <CardTitle className="text-sm font-black uppercase tracking-widest">Поставщикам сырья</CardTitle>
                                </div>
                                <CardDescription className="text-[10px] font-medium leading-tight">
                                    Мы всегда в поиске лучших материалов: от кашемира до фурнитуры.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <ul className="space-y-2 mb-6">
                                    {['Сертифицированное сырье (GOTS, LWG)', 'Инновационные составы', 'Стабильность поставок'].map((t, i) => (
                                        <li key={i} className="flex items-center gap-2 text-[10px] font-bold">
                                            <div className="h-1 w-1 rounded-full bg-accent" /> {t}
                                        </li>
                                    ))}
                                </ul>
                                <Button 
                                    variant="outline"
                                    className="w-full h-9 rounded-xl text-[9px] font-black uppercase tracking-widest border-accent/20 text-accent hover:bg-accent hover:text-white"
                                    onClick={() => {
                                        setMessageCategory('Предложение от поставщика');
                                        setIsMessageDialogOpen(true);
                                    }}
                                >
                                    <MessageSquare className="mr-2 h-3.5 w-3.5" /> Написать предложение
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Influencers & Collabs */}
                        <Card className="rounded-xl border-muted/20 bg-muted/5 shadow-sm hover:shadow-md transition-all">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="h-4 w-4 text-accent" />
                                    <CardTitle className="text-sm font-black uppercase tracking-widest">Инфлюенсеры и Коллабы</CardTitle>
                                </div>
                                <CardDescription className="text-[10px] font-medium leading-tight">
                                    Создаем совместные истории с теми, кто разделяет наши ценности.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <ul className="space-y-2 mb-6">
                                    {['Амбассадорство бренда', 'Капсульные коллаборации', 'UGC-партнерство'].map((t, i) => (
                                        <li key={i} className="flex items-center gap-2 text-[10px] font-bold">
                                            <div className="h-1 w-1 rounded-full bg-accent" /> {t}
                                        </li>
                                    ))}
                                </ul>
                                <Button 
                                    variant="outline"
                                    className="w-full h-9 rounded-xl text-[9px] font-black uppercase tracking-widest border-accent/20 text-accent hover:bg-accent hover:text-white"
                                    onClick={() => {
                                        setMessageCategory('Инфлюенсер / Коллаборация');
                                        setIsMessageDialogOpen(true);
                                    }}
                                >
                                    <MessageSquare className="mr-2 h-3.5 w-3.5" /> Обсудить проект
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Manufacturers Section - NEW */}
                        <Card className="rounded-xl border-muted/20 bg-muted/5 shadow-sm hover:shadow-md transition-all">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <Factory className="h-4 w-4 text-accent" />
                                    <CardTitle className="text-sm font-black uppercase tracking-widest">Производителям</CardTitle>
                                </div>
                                <CardDescription className="text-[10px] font-medium leading-tight">
                                    Предложите свои производственные мощности для наших коллекций.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <ul className="space-y-2 mb-6">
                                    {['Пошив трикотажа и текстиля', 'Высокие стандарты качества', 'Масштабируемость'].map((t, i) => (
                                        <li key={i} className="flex items-center gap-2 text-[10px] font-bold">
                                            <div className="h-1 w-1 rounded-full bg-accent" /> {t}
                                        </li>
                                    ))}
                                </ul>
                                <Button 
                                    variant="outline"
                                    className="w-full h-9 rounded-xl text-[9px] font-black uppercase tracking-widest border-accent/20 text-accent hover:bg-accent hover:text-white"
                                    onClick={() => {
                                        setMessageCategory('Предложение от производства');
                                        setIsMessageDialogOpen(true);
                                    }}
                                >
                                    <MessageSquare className="mr-2 h-3.5 w-3.5" /> Предложить услуги
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Media & Advertising - NEW */}
                        <Card className="rounded-xl border-muted/20 bg-muted/5 shadow-sm hover:shadow-md transition-all">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <Newspaper className="h-4 w-4 text-accent" />
                                    <CardTitle className="text-sm font-black uppercase tracking-widest">Медиа и Реклама</CardTitle>
                                </div>
                                <CardDescription className="text-[10px] font-medium leading-tight">
                                    Вопросы выставок, рекламных показов и PR-сотрудничества.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <ul className="space-y-2 mb-6">
                                    {['Участие в выставках', 'Рекламные интеграции', 'Интервью и пресс-релизы'].map((t, i) => (
                                        <li key={i} className="flex items-center gap-2 text-[10px] font-bold">
                                            <div className="h-1 w-1 rounded-full bg-accent" /> {t}
                                        </li>
                                    ))}
                                </ul>
                                <Button 
                                    variant="outline"
                                    className="w-full h-9 rounded-xl text-[9px] font-black uppercase tracking-widest border-accent/20 text-accent hover:bg-accent hover:text-white"
                                    onClick={() => {
                                        setMessageCategory('Медиа / Реклама / Выставки');
                                        setIsMessageDialogOpen(true);
                                    }}
                                >
                                    <MessageSquare className="mr-2 h-3.5 w-3.5" /> Написать по PR
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* 2. B2B Sidebar / Contact info */}
                <div className="space-y-6">
                    <Card className="rounded-xl bg-black text-white overflow-hidden shadow-2xl">
                        <div className="p-4 space-y-6">
                            <div className="space-y-2">
                                <p className="text-accent text-[10px] font-black uppercase tracking-[0.2em]">B2B Контакты</p>
                                <h3 className="text-sm font-black uppercase tracking-tighter leading-none">По вопросам сотрудничества</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 group cursor-pointer">
                                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-accent transition-all">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-white/40 uppercase">Email для предложений</p>
                                        <p className="text-sm font-bold tracking-tight">b2b@synthalab.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 group cursor-pointer">
                                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-accent transition-all">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-white/40 uppercase">Горячая линия B2B</p>
                                        <p className="text-sm font-bold tracking-tight">+7 (495) 900-00-00</p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-white/10" />

                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">B2B Документация</p>
                                <div className="grid grid-cols-1 gap-2">
                                    <Button variant="ghost" className="justify-start h-10 px-0 text-white/80 hover:text-white hover:bg-transparent group">
                                        <BookText className="h-4 w-4 mr-3 text-accent group-hover:scale-110 transition-transform" />
                                        <span className="text-[11px] font-black uppercase tracking-tight">Презентация бренда (PDF)</span>
                                    </Button>
                                    <Button variant="ghost" className="justify-start h-10 px-0 text-white/80 hover:text-white hover:bg-transparent group">
                                        <FileText className="h-4 w-4 mr-3 text-accent group-hover:scale-110 transition-transform" />
                                        <span className="text-[11px] font-black uppercase tracking-tight">Договор поставки (Образец)</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-accent/20 p-4 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                Мы рассматриваем заявки в течение 48 часов
                            </p>
                        </div>
                    </Card>

                    <Card className="rounded-xl border border-muted/20 p-4 space-y-4 relative overflow-hidden">
                        {b2bPartnerStatus !== 'none' && (
                            <div className="absolute top-4 right-4">
                                <Badge className={cn(
                                    "text-[8px] font-black uppercase px-2 py-0.5 border-none",
                                    b2bPartnerStatus === 'pending' ? "bg-orange-500" : 
                                    b2bPartnerStatus === 'active' ? "bg-green-500" : "bg-blue-500"
                                )}>
                                    {b2bPartnerStatus === 'pending' && 'Ожидает подтверждения'}
                                    {b2bPartnerStatus === 'friend' && 'Партнер-друг'}
                                    {b2bPartnerStatus === 'active' && 'Действующий партнер'}
                                    {b2bPartnerStatus === 'spot' && 'Точечное взаимодействие'}
                                </Badge>
                            </div>
                        )}
                        <h4 className="text-sm font-black uppercase tracking-widest">Портал для партнеров</h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {b2bPartnerStatus === 'none' 
                                ? `Если вы — поставщик, производитель, магазин или дистрибьютор, подайте заявку на партнерство. Вы станете партнером ${displayName}, а бренд получит рейтинговые баллы.`
                                : `Ваш текущий статус взаимодействия с брендом: ${
                                    b2bPartnerStatus === 'pending' ? 'Заявка на рассмотрении' : 
                                    b2bPartnerStatus === 'friend' ? 'Дружественное сотрудничество' :
                                    b2bPartnerStatus === 'active' ? 'Активный контракт' : 'Точечные проекты'
                                  }`
                            }
                        </p>
                        <div className="space-y-3">
                            <Button 
                                variant={b2bPartnerStatus === 'none' ? 'outline' : 'default'}
                                className={cn(
                                    "w-full h-11 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2 transition-all",
                                    b2bPartnerStatus === 'pending' ? "bg-muted text-muted-foreground border-transparent cursor-not-allowed" :
                                    b2bPartnerStatus === 'none' ? "hover:bg-accent hover:text-white" : "bg-black text-white"
                                )}
                                onClick={handleB2bRegistration}
                                disabled={b2bPartnerStatus === 'pending'}
                            >
                                {b2bPartnerStatus === 'none' ? 'Стать партнером бренда' : 'Войти в B2B Кабинет'}
                            </Button>
                            
                            {b2bPartnerStatus === 'pending' && (
                                <div className="grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-2">
                                    <Button 
                                        variant="ghost" 
                                        className="h-8 text-[7px] font-black uppercase bg-green-50 text-green-700 rounded-lg border border-green-100"
                                        onClick={() => { setB2bPartnerStatus('active'); toast({title: "Партнерство подтверждено", description: "Статус: Действующий партнер"}); }}
                                    >Принять (Активный)</Button>
                                    <Button 
                                        variant="ghost" 
                                        className="h-8 text-[7px] font-black uppercase bg-blue-50 text-blue-700 rounded-lg border border-blue-100"
                                        onClick={() => { setB2bPartnerStatus('friend'); toast({title: "Партнерство подтверждено", description: "Статус: Друг бренда"}); }}
                                    >Принять (Друг)</Button>
                                    <Button 
                                        variant="ghost" 
                                        className="h-8 text-[7px] font-black uppercase bg-slate-50 text-slate-700 rounded-lg border border-slate-100"
                                        onClick={() => { setB2bPartnerStatus('spot'); toast({title: "Партнерство подтверждено", description: "Статус: Точечно"}); }}
                                    >Принять (Точечно)</Button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </TabsContent>
    );
}
