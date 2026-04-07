"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Settings, Upload, Link as LinkIcon, PlusCircle, Trash2, GripVertical, FileText, ChevronRight, BarChart2, Mic, Radio, BookCopy, MessageSquare, Hand, ThumbsUp, Calendar as CalendarIcon, CheckCircle, AlertCircle, Clock, PlayCircle, Eye, ShoppingCart, Users, Tv, Share2, Instagram, Send as SendIcon, MapPin, File, Shield, MicOff, Image as ImageIcon, TrendingUp, Zap, Globe, Layers, ArrowRight } from 'lucide-react';
import { products } from '@/lib/products';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import LivePlayer from '@/components/live-player';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { LiveStreamAnalyticsDialog, AudienceRetentionDialog, PromotionDialog } from '@/components/brand';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrandDAM } from "@/components/brand/BrandDAM";
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ContentHubContent = dynamic(() => import('@/app/brand/content-hub/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const CmsContent = dynamic(() => import('@/app/brand/cms/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const BlogContent = dynamic(() => import('@/app/brand/blog/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const LiveContent = dynamic(() => import('@/app/brand/live/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });

export default function BrandMediaPage() {
    const [streamType, setStreamType] = useState<string>('show');
    const [isCommentsEnabled, setIsCommentsEnabled] = useState(true);
    const [publicationDate, setPublicationDate] = useState<Date>();
    const [tab, setTab] = useState('media');
    const [activeTab, setActiveTab] = useState('dam');
    const [isPreviewPlayerOpen, setIsPreviewPlayerOpen] = useState(false);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const [isRetentionAnalyticsOpen, setIsRetentionAnalyticsOpen] = useState(false);
    const [initialMetric, setInitialMetric] = useState<'views' | 'reactions' | 'comments' | 'cart'>('views');
    const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);

    const { toast } = useToast();
    const mockLiveEvent = PlaceHolderImages.find(img => img.id.startsWith("live-"));

    const handleStartStream = () => {
        toast({
            title: "Трансляция запущена (симуляция)",
            description: "Ваш прямой эфир начался и виден пользователям.",
        });
    }

    return (
        <TooltipProvider>
            <div className="space-y-4 animate-in fade-in duration-700">
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <TabsList className="bg-slate-100/80 border border-slate-200 h-9 px-1 gap-0.5 flex-wrap">
                        <TabsTrigger value="media" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">Медиа и DAM</TabsTrigger>
                        <TabsTrigger value="content-hub" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">Контент-хаб</TabsTrigger>
                        <TabsTrigger value="cms" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">CMS</TabsTrigger>
                        <TabsTrigger value="blog" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">Блог</TabsTrigger>
                        <TabsTrigger value="live" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">Live</TabsTrigger>
                    </TabsList>
                    <TabsContent value="media" className="mt-4">
                <Tabs defaultValue="dam" onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-fit grid-cols-5 bg-slate-100 p-1 rounded-2xl mb-8">
                        <TabsTrigger value="dam" className="rounded-xl font-bold text-[10px] uppercase px-6">Brand DAM</TabsTrigger>
                        <TabsTrigger value="streams" className="rounded-xl font-bold text-[10px] uppercase px-6">Трансляции</TabsTrigger>
                        <TabsTrigger value="videos" className="rounded-xl font-bold text-[10px] uppercase px-6">AI-Видео</TabsTrigger>
                        <TabsTrigger value="digital_hub" className="rounded-xl font-bold text-[10px] uppercase px-6">Digital Hub</TabsTrigger>
                        <TabsTrigger value="archive" className="rounded-xl font-bold text-[10px] uppercase px-6">Архив</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dam">
                        <BrandDAM />
                    </TabsContent>

                    <TabsContent value="streams" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
                            <div className="lg:col-span-2">
                                <Card className="rounded-xl border-slate-100 shadow-sm overflow-hidden">
                                    <CardHeader className="p-4 pb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-base font-black uppercase tracking-tight">Настройки прямого эфира</CardTitle>
                                                <CardDescription className="text-xs font-medium mt-1">Подключитесь к нашему стриминговому сервису или используйте внешний RTMP-сервер.</CardDescription>
                                            </div>
                                            <Button onClick={() => setIsPromotionDialogOpen(true)} variant="outline" className="rounded-xl font-black uppercase text-[10px] border-slate-200">
                                                <TrendingUp className="mr-2 h-3.5 w-3.5"/> Продвигать эфир
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Название трансляции</Label>
                                                <Input className="h-12 text-sm font-bold rounded-xl" placeholder="Презентация новой коллекции SS26" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Описание</Label>
                                                <Textarea className="min-h-[100px] text-sm font-medium rounded-xl resize-none" placeholder="Краткое описание вашего эфира..." />
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Дата и время начала</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                    <Button variant={"outline"} className="w-full h-12 justify-start text-left font-bold rounded-xl border-slate-200">
                                                        <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
                                                        {publicationDate ? format(publicationDate, "d MMMM yyyy, HH:mm", {locale: ru}) : <span>Выберите дату и время</span>}
                                                    </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={publicationDate} onSelect={setPublicationDate} initialFocus /></PopoverContent>
                                                </Popover>
                                            </div>
                                             <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Место проведения</Label>
                                                <Input className="h-12 text-sm font-bold rounded-xl" placeholder="Напр., Студия Syntha, Москва" />
                                            </div>
                                        </div>
                                        
                                        <Button onClick={handleStartStream} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[11px] rounded-xl shadow-lg shadow-indigo-100">
                                            Начать трансляцию <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-1 space-y-4">
                                <Card className="rounded-xl border-slate-100 shadow-sm overflow-hidden">
                                    <CardHeader className="p-4 pb-4">
                                        <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-tight">
                                            <div className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </div>
                                            Live Studio
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 space-y-6">
                                        <div className="aspect-[9/16] bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200 group hover:bg-slate-50 transition-colors cursor-pointer overflow-hidden relative">
                                            <div className="text-center space-y-2">
                                                <Video className="h-10 w-10 text-slate-300 mx-auto group-hover:text-indigo-400 transition-colors" />
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Превью камеры</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-slate-100">
                                                        <Mic className="h-4 w-4 text-slate-600" />
                                                    </div>
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Микрофон</Label>
                                                </div>
                                                <Switch />
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-slate-100">
                                                        <MessageSquare className="h-4 w-4 text-slate-600" />
                                                    </div>
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Чат</Label>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                        </div>

                                        <Button className="w-full h-12 bg-slate-900 hover:bg-black text-white font-black uppercase text-[10px] rounded-xl">
                                            <Tv className="mr-2 h-4 w-4" /> Предпросмотр
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="videos" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Card className="rounded-xl border-slate-100 shadow-sm bg-indigo-600 text-white overflow-hidden relative group cursor-pointer">
                                <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                                    <Zap className="h-32 w-32" />
                                </div>
                                <CardContent className="p-4 space-y-4">
                                    <Badge className="bg-white/20 text-white border-none text-[9px] font-black uppercase">New AI Feature</Badge>
                                    <h3 className="text-sm font-black uppercase tracking-tighter">AI Lookbook (Video)</h3>
                                    <p className="text-indigo-100 text-xs font-medium leading-relaxed">Генерация 15-секундных Reels и TikTok проходок с цифровыми моделями на основе ваших 3D-лекал.</p>
                                    <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-black uppercase text-[10px] h-10 rounded-xl">
                                        Сгенерировать видео
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="rounded-xl border-slate-100 shadow-sm bg-slate-50 overflow-hidden relative group cursor-pointer hover:border-indigo-200 transition-colors">
                                <CardContent className="p-4 space-y-4">
                                    <Badge variant="outline" className="border-slate-300 text-slate-500 text-[9px] font-black uppercase">Static Content</Badge>
                                    <h3 className="text-sm font-black uppercase tracking-tighter text-slate-900">Standard Lookbook</h3>
                                    <p className="text-slate-500 text-xs font-medium leading-relaxed">Генерация высококачественных студийных фото на различных фонах для E-commerce.</p>
                                    <Button variant="outline" className="w-full border-slate-200 bg-white text-slate-900 font-black uppercase text-[10px] h-10 rounded-xl">
                                        Создать фотосет
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="digital_hub" className="space-y-6">
                        <div className="space-y-6">
                            <Card className="rounded-xl border-slate-100 shadow-sm bg-white overflow-hidden">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="h-20 w-20 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Globe className="h-10 w-10" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge className="bg-indigo-100 text-indigo-700 border-none text-[8px] font-black uppercase">Enterprise Sync</Badge>
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Universal API</span>
                                        </div>
                                        <h3 className="text-base font-black uppercase tracking-tight">Universal Retail API</h3>
                                        <p className="text-xs text-slate-500 font-medium mt-1">Мгновенная синхронизация с Shopify, SAP, NetSuite и 1C ритейлеров.</p>
                                    </div>
                                    <Button variant="outline" className="rounded-xl font-black uppercase text-[10px] h-12 px-6 border-slate-200">
                                        Управление ключами
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="rounded-xl border-slate-100 shadow-sm bg-slate-900 text-white overflow-hidden">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="h-20 w-20 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10">
                                        <Layers className="h-10 w-10" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge className="bg-emerald-50 text-white border-none text-[8px] font-black uppercase">Scale Up</Badge>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform-as-a-Service</span>
                                        </div>
                                        <h3 className="text-base font-black uppercase tracking-tight">White-label Client Portals</h3>
                                        <p className="text-xs text-slate-400 font-medium mt-1">Запуск собственной версии Syntha для ваших суб-брендов или закрытых групп за 5 минут.</p>
                                    </div>
                                    <Button className="bg-white text-black hover:bg-slate-100 rounded-xl font-black uppercase text-[10px] h-12 px-6">
                                        Создать портал
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
                    </TabsContent>
                    <TabsContent value="content-hub" className="mt-4">
                        {tab === 'content-hub' && <ContentHubContent />}
                    </TabsContent>
                    <TabsContent value="cms" className="mt-4">
                        {tab === 'cms' && <CmsContent />}
                    </TabsContent>
                    <TabsContent value="blog" className="mt-4">
                        {tab === 'blog' && <BlogContent />}
                    </TabsContent>
                    <TabsContent value="live" className="mt-4">
                        {tab === 'live' && <LiveContent />}
                    </TabsContent>
                </Tabs>
            </div>

            <LiveStreamAnalyticsDialog
                isOpen={isAnalyticsOpen}
                onOpenChange={setIsAnalyticsOpen}
                initialMetric={initialMetric}
            />
            
            <AudienceRetentionDialog 
                open={isRetentionAnalyticsOpen}
                onOpenChange={setIsRetentionAnalyticsOpen}
            />

            {mockLiveEvent && (
                <LivePlayer 
                    event={mockLiveEvent} 
                    isOpen={isPreviewPlayerOpen} 
                    onOpenChange={setIsPreviewPlayerOpen}
                    isLive={true}
                />
            )}
             <PromotionDialog 
                isOpen={isPromotionDialogOpen}
                onOpenChange={setIsPromotionDialogOpen}
                initialType="live_shopping_event"
                initialName="Продвижение прямого эфира"
            />
        </TooltipProvider>
    );
}
