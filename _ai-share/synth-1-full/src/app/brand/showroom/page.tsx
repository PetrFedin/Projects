'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { 
  Eye, 
  Box, 
  Layers, 
  Layout, 
  Share2, 
  ArrowUpRight, 
  ShoppingBag,
  Package,
  Users,
  Camera,
  Play,
  Settings,
  Globe,
  Monitor
} from 'lucide-react';
import Image from 'next/image';
import { VirtualShowroom } from '@/components/brand/virtual-showroom';
const TradeShowsContent = dynamic(() => import('@/app/brand/b2b/trade-shows/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const PassportContent = dynamic(() => import('@/app/brand/b2b/passport/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const BuyerAppsContent = dynamic(() => import('@/app/brand/b2b/buyer-applications/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const PrivateInvitesContent = dynamic(() => import('@/app/brand/b2b/private-invites/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const MerchandisingContent = dynamic(() => import('@/app/brand/merchandising/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const VideoConsultationContent = dynamic(() => import('@/app/brand/showroom/video-consultation/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const ShowroomBannersContent = dynamic(() => import('@/app/brand/showroom/banners/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const ShowroomAiSearchContent = dynamic(() => import('@/app/brand/showroom/ai-search/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });

export default function BrandShowroomPage() {
  const [tab, setTab] = useState('showroom');
  const showroomFeatures = [
    {
      title: "Phygital Presentation",
      desc: "Интерактивный просмотр коллекций с возможностью 3D-вращения изделий и зумом деталей.",
      icon: Eye,
      status: "Active"
    },
    {
      title: "Interactive Order Sheets",
      desc: "Байеры могут формировать заказ прямо внутри виртуального пространства.",
      icon: ShoppingBag,
      status: "Active"
    },
    {
      title: "Live Sessions",
      desc: "Проведение закрытых презентаций для VIP-байеров с голосовой связью.",
      icon: Camera,
      status: "Beta"
    },
    {
      title: "Heatmap Analytics",
      desc: "Отслеживание наиболее популярных зон и рейлов шоурума среди посетителей.",
      icon: Layers,
      status: "Active"
    },
    {
      title: "Virtual Try-On",
      desc: "Примерка коллекции на 3D-аватары с разными типами фигур (XS-XXL) для байеров.",
      icon: Box,
      status: "New"
    },
    {
      title: "Collaborative Board",
      desc: "Совместное формирование капсул дизайнером и байером в реальном времени.",
      icon: Layout,
      status: "New"
    },
    {
      title: "Сезон в 3D",
      desc: "Сцена коллекции: стойки, свет, навигация по линейкам — рядом с trade shows и виртуальным шоурумом.",
      icon: Globe,
      status: "Roadmap"
    }
  ];

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="bg-slate-100/80 border border-slate-200 h-9 px-1 gap-0.5 flex-wrap">
        <TabsTrigger value="showroom" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">Шоурум</TabsTrigger>
        <TabsTrigger value="trade-shows" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">Выставки</TabsTrigger>
        <TabsTrigger value="passport" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">Passport</TabsTrigger>
        <TabsTrigger value="buyers" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">Заявки байеров</TabsTrigger>
        <TabsTrigger value="invites" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">Private Invites</TabsTrigger>
        <TabsTrigger value="merchandising" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">Курирование</TabsTrigger>
        <TabsTrigger value="video-consultation" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">Видео</TabsTrigger>
        <TabsTrigger value="banners" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">Баннеры</TabsTrigger>
        <TabsTrigger value="ai-search" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">AI-поиск</TabsTrigger>
      </TabsList>
      <TabsContent value="showroom" className="mt-4">
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl animate-in fade-in duration-700">
      {/* Control Panel: Executive Style */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex items-center gap-3">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Now: 12 байеров
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner ml-auto md:ml-0">
            <Button variant="ghost" className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 hover:bg-white hover:shadow-sm transition-all">
              Освещение
            </Button>
            <Button variant="ghost" className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 hover:bg-white hover:shadow-sm transition-all">
              Аналитика кликов
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden bg-white p-1">
        <VirtualShowroom />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2 overflow-hidden border-slate-100 shadow-sm relative group rounded-xl">
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <Badge className="bg-black/60 backdrop-blur-md text-white border-none text-[10px] font-bold uppercase px-3 h-6 flex items-center gap-2 shadow-lg">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Now: 12 Buyers
            </Badge>
            <Badge className="bg-indigo-600/80 backdrop-blur-md text-white border-none text-[10px] font-bold uppercase px-3 h-6 shadow-lg">
              3D High-Fidelity
            </Badge>
          </div>
          <div className="aspect-video relative bg-slate-100">
            <Image 
              src="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1200"
              alt="Virtual Showroom"
              fill
              className="object-cover transition-transform group-hover:scale-105 duration-[2000ms]"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">
              <div className="space-y-4 text-center">
                <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-2xl">
                  <Play className="h-6 w-6 text-white fill-current ml-1" />
                </div>
                <h3 className="text-white font-bold uppercase text-sm tracking-tight">Enter Immersive Space</h3>
                <p className="text-white/70 text-sm font-medium max-w-xs mx-auto">Полное погружение в коллекцию SS26. Доступно для VR и Desktop.</p>
                <Button className="bg-white text-slate-900 hover:bg-slate-50 font-bold uppercase text-[11px] h-11 px-8 rounded-lg mt-4 shadow-xl tracking-widest transition-all">
                  Запустить 360° Сессию
                </Button>
              </div>
            </div>
          </div>
          <CardFooter className="p-4 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center border-t border-slate-100 gap-3">
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"><Users className="h-3.5 w-3.5 text-indigo-500" /> 1,240 Visits</span>
              <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"><ShoppingBag className="h-3.5 w-3.5 text-emerald-500" /> 42 Orders</span>
              <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"><Monitor className="h-3.5 w-3.5 text-amber-500" /> 18 Slots</span>
            </div>
            <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase gap-2 h-8 px-4 rounded-lg border-slate-200 bg-white hover:bg-slate-50 shadow-sm">
              Настроить сцену <Settings className="h-3.5 w-3.5" />
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-100 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/30">
              <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Статистика сессий</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-4">
              <div className="flex justify-between items-end p-3 rounded-lg bg-slate-50/50 border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Просмотры</p>
                  <p className="text-sm font-bold text-slate-900 tracking-tight">1,482</p>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 text-[10px] font-bold border-none px-2 h-5 shadow-sm">+12%</Badge>
              </div>
              <div className="flex justify-between items-end p-3 rounded-lg bg-slate-50/50 border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ср. время</p>
                  <p className="text-sm font-bold text-slate-900 tracking-tight">08:45</p>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 text-[10px] font-bold border-none px-2 h-5 shadow-sm">+5%</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 shadow-lg bg-slate-900 text-white rounded-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700"><Share2 className="h-24 w-24 text-emerald-400" /></div>
            <CardContent className="p-4 flex flex-col items-center text-center space-y-4 relative z-10">
              <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner group-hover:bg-white/20 transition-all duration-300">
                <Share2 className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-bold uppercase tracking-wider">Пригласить байеров</p>
                <p className="text-[11px] text-white/50 font-medium leading-relaxed">Персональные ссылки для доступа к закрытому показу.</p>
              </div>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 text-[10px] font-bold uppercase h-10 rounded-lg shadow-xl tracking-widest transition-all">
                Сгенерировать ссылки
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {showroomFeatures.map((feature, i) => (
          <Card key={i} className="border-slate-100 shadow-sm hover:border-indigo-200 transition-all rounded-xl group hover:shadow-md bg-white overflow-hidden">
            <CardContent className="p-3 space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all duration-300">
                  <feature.icon className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <Badge variant="outline" className={cn(
                  "text-[9px] font-bold uppercase px-2 h-5 shadow-sm border-none",
                  feature.status === "Active" ? "bg-emerald-50 text-emerald-600" :
                  feature.status === "Beta" ? "bg-amber-50 text-amber-600" :
                  "bg-slate-100 text-slate-500"
                )}>
                  {feature.status}
                </Badge>
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{feature.title}</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1.5 line-clamp-2">
                  {feature.desc}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-between h-8 text-[10px] font-bold uppercase p-0 hover:bg-transparent hover:text-indigo-600 group/btn tracking-wider">
                Управление <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
      </TabsContent>
      <TabsContent value="trade-shows" className="mt-4">{tab === 'trade-shows' && <TradeShowsContent />}</TabsContent>
      <TabsContent value="passport" className="mt-4">{tab === 'passport' && <PassportContent />}</TabsContent>
      <TabsContent value="buyers" className="mt-4">{tab === 'buyers' && <BuyerAppsContent />}</TabsContent>
      <TabsContent value="invites" className="mt-4">{tab === 'invites' && <PrivateInvitesContent />}</TabsContent>
      <TabsContent value="merchandising" className="mt-4">{tab === 'merchandising' && <MerchandisingContent />}</TabsContent>
      <TabsContent value="video-consultation" className="mt-4">{tab === 'video-consultation' && <VideoConsultationContent />}</TabsContent>
      <TabsContent value="banners" className="mt-4">{tab === 'banners' && <ShowroomBannersContent />}</TabsContent>
      <TabsContent value="ai-search" className="mt-4">{tab === 'ai-search' && <ShowroomAiSearchContent />}</TabsContent>
    </Tabs>
  );
}
