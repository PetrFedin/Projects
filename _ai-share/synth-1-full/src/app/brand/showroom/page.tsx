'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
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
  Monitor,
} from 'lucide-react';
import { RegistryPageShell } from '@/components/design-system';
import Image from 'next/image';
import { VirtualShowroom } from '@/components/brand/virtual-showroom';
const TradeShowsContent = dynamic(
  () => import('@/app/brand/b2b/trade-shows/page').then((m) => m.default),
<<<<<<< HEAD
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const PassportContent = dynamic(
  () => import('@/app/brand/b2b/passport/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const BuyerAppsContent = dynamic(
  () => import('@/app/brand/b2b/buyer-applications/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const PrivateInvitesContent = dynamic(
  () => import('@/app/brand/b2b/private-invites/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const MerchandisingContent = dynamic(
  () => import('@/app/brand/merchandising/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const VideoConsultationContent = dynamic(
  () => import('@/app/brand/showroom/video-consultation/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const ShowroomBannersContent = dynamic(
  () => import('@/app/brand/showroom/banners/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const ShowroomAiSearchContent = dynamic(
  () => import('@/app/brand/showroom/ai-search/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
=======
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const PassportContent = dynamic(
  () => import('@/app/brand/b2b/passport/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const BuyerAppsContent = dynamic(
  () => import('@/app/brand/b2b/buyer-applications/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const PrivateInvitesContent = dynamic(
  () => import('@/app/brand/b2b/private-invites/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const MerchandisingContent = dynamic(
  () => import('@/app/brand/merchandising/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const VideoConsultationContent = dynamic(
  () => import('@/app/brand/showroom/video-consultation/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const ShowroomBannersContent = dynamic(
  () => import('@/app/brand/showroom/banners/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const ShowroomAiSearchContent = dynamic(
  () => import('@/app/brand/showroom/ai-search/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
>>>>>>> recover/cabinet-wip-from-stash
);

export default function BrandShowroomPage() {
  const [tab, setTab] = useState('showroom');
  const showroomFeatures = [
    {
      title: 'Phygital Presentation',
      desc: 'Интерактивный просмотр коллекций с возможностью 3D-вращения изделий и зумом деталей.',
      icon: Eye,
      status: 'Active',
    },
    {
      title: 'Interactive Order Sheets',
      desc: 'Байеры могут формировать заказ прямо внутри виртуального пространства.',
      icon: ShoppingBag,
      status: 'Active',
    },
    {
      title: 'Live Sessions',
      desc: 'Проведение закрытых презентаций для VIP-байеров с голосовой связью.',
      icon: Camera,
      status: 'Beta',
    },
    {
      title: 'Heatmap Analytics',
      desc: 'Отслеживание наиболее популярных зон и рейлов шоурума среди посетителей.',
      icon: Layers,
      status: 'Active',
    },
    {
      title: 'Virtual Try-On',
      desc: 'Примерка коллекции на 3D-аватары с разными типами фигур (XS-XXL) для байеров.',
      icon: Box,
      status: 'New',
    },
    {
      title: 'Collaborative Board',
      desc: 'Совместное формирование капсул дизайнером и байером в реальном времени.',
      icon: Layout,
      status: 'New',
    },
    {
      title: 'Сезон в 3D',
      desc: 'Сцена коллекции: стойки, свет, навигация по линейкам — рядом с trade shows и виртуальным шоурумом.',
      icon: Globe,
      status: 'Roadmap',
    },
  ];

  return (
    <Tabs value={tab} onValueChange={setTab}>
<<<<<<< HEAD
      <TabsList className="h-9 flex-wrap gap-0.5 border border-slate-200 bg-slate-100/80 px-1">
        <TabsTrigger
          value="showroom"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
=======
      <TabsList className={cn(cabinetSurface.tabsList, 'h-auto min-h-9 w-full shadow-inner')}>
        <TabsTrigger
          value="showroom"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-7 gap-1.5'
          )}
>>>>>>> recover/cabinet-wip-from-stash
        >
          Шоурум
        </TabsTrigger>
        <TabsTrigger
          value="trade-shows"
<<<<<<< HEAD
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
=======
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-7 gap-1.5'
          )}
>>>>>>> recover/cabinet-wip-from-stash
        >
          Выставки
        </TabsTrigger>
        <TabsTrigger
          value="passport"
<<<<<<< HEAD
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
=======
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-7 gap-1.5'
          )}
>>>>>>> recover/cabinet-wip-from-stash
        >
          Passport
        </TabsTrigger>
        <TabsTrigger
          value="buyers"
<<<<<<< HEAD
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
=======
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-7 gap-1.5'
          )}
>>>>>>> recover/cabinet-wip-from-stash
        >
          Заявки байеров
        </TabsTrigger>
        <TabsTrigger
          value="invites"
<<<<<<< HEAD
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
=======
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-7 gap-1.5'
          )}
>>>>>>> recover/cabinet-wip-from-stash
        >
          Private Invites
        </TabsTrigger>
        <TabsTrigger
          value="merchandising"
<<<<<<< HEAD
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
=======
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-7 gap-1.5'
          )}
>>>>>>> recover/cabinet-wip-from-stash
        >
          Курирование
        </TabsTrigger>
        <TabsTrigger
          value="video-consultation"
<<<<<<< HEAD
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
=======
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-7 gap-1.5'
          )}
>>>>>>> recover/cabinet-wip-from-stash
        >
          Видео
        </TabsTrigger>
        <TabsTrigger
          value="banners"
<<<<<<< HEAD
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
=======
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-7 gap-1.5'
          )}
>>>>>>> recover/cabinet-wip-from-stash
        >
          Баннеры
        </TabsTrigger>
        <TabsTrigger
          value="ai-search"
<<<<<<< HEAD
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
=======
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-7 gap-1.5'
          )}
>>>>>>> recover/cabinet-wip-from-stash
        >
          AI-поиск
        </TabsTrigger>
      </TabsList>
      <TabsContent value="showroom" className="mt-4">
        <RegistryPageShell className="space-y-6 duration-700 animate-in fade-in">
          {/* Control Panel: Executive Style */}
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
<<<<<<< HEAD
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">
=======
              <p className="text-text-secondary flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live Now:
                12 байеров
              </p>
            </div>
            <div className="flex w-full items-center gap-2 md:w-auto">
<<<<<<< HEAD
              <div className="ml-auto flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner md:ml-0">
                <Button
                  variant="ghost"
                  className="h-8 rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm"
=======
              {/* cabinetSurface v1 */}
              <div
                className={cn(
                  cabinetSurface.groupTabList,
                  'ml-auto flex h-auto min-h-9 flex-wrap items-center md:ml-0'
                )}
              >
                <Button
                  variant="ghost"
                  className="text-text-secondary hover:text-accent-primary h-8 rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-white hover:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  Освещение
                </Button>
                <Button
                  variant="ghost"
<<<<<<< HEAD
                  className="h-8 rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm"
=======
                  className="text-text-secondary hover:text-accent-primary h-8 rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-white hover:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  Аналитика кликов
                </Button>
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-1 shadow-sm">
=======
          <div className="border-border-subtle overflow-hidden rounded-2xl border bg-white p-1 shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
            <VirtualShowroom />
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
<<<<<<< HEAD
            <Card className="group relative overflow-hidden rounded-xl border-slate-100 shadow-sm lg:col-span-2">
=======
            <Card className="border-border-subtle group relative overflow-hidden rounded-xl shadow-sm lg:col-span-2">
>>>>>>> recover/cabinet-wip-from-stash
              <div className="absolute left-4 top-4 z-20 flex gap-2">
                <Badge className="flex h-6 items-center gap-2 border-none bg-black/60 px-3 text-[10px] font-bold uppercase text-white shadow-lg backdrop-blur-md">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live Now: 12 Buyers
                </Badge>
<<<<<<< HEAD
                <Badge className="h-6 border-none bg-indigo-600/80 px-3 text-[10px] font-bold uppercase text-white shadow-lg backdrop-blur-md">
                  3D High-Fidelity
                </Badge>
              </div>
              <div className="relative aspect-video bg-slate-100">
=======
                <Badge className="bg-accent-primary/80 h-6 border-none px-3 text-[10px] font-bold uppercase text-white shadow-lg backdrop-blur-md">
                  3D High-Fidelity
                </Badge>
              </div>
              <div className="bg-bg-surface2 relative aspect-video">
>>>>>>> recover/cabinet-wip-from-stash
                <Image
                  src="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1200"
                  alt="Virtual Showroom"
                  fill
                  className="object-cover transition-transform [transition-duration:2000ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-all duration-500 group-hover:opacity-100">
                  <div className="space-y-4 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/20 shadow-2xl backdrop-blur-xl">
                      <Play className="ml-1 h-6 w-6 fill-current text-white" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-tight text-white">
                      Enter Immersive Space
                    </h3>
                    <p className="mx-auto max-w-xs text-sm font-medium text-white/70">
                      Полное погружение в коллекцию SS26. Доступно для VR и Desktop.
                    </p>
<<<<<<< HEAD
                    <Button className="mt-4 h-11 rounded-lg bg-white px-8 text-[11px] font-bold uppercase tracking-widest text-slate-900 shadow-xl transition-all hover:bg-slate-50">
=======
                    <Button className="text-text-primary hover:bg-bg-surface2 mt-4 h-11 rounded-lg bg-white px-8 text-[11px] font-bold uppercase tracking-widest shadow-xl transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                      Запустить 360° Сессию
                    </Button>
                  </div>
                </div>
              </div>
<<<<<<< HEAD
              <CardFooter className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 p-4 md:flex-row">
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <span className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                    <Users className="h-3.5 w-3.5 text-indigo-500" /> 1,240 Visits
                  </span>
                  <span className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                    <ShoppingBag className="h-3.5 w-3.5 text-emerald-500" /> 42 Orders
                  </span>
                  <span className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
=======
              <CardFooter className="bg-bg-surface2/80 border-border-subtle flex flex-col items-center justify-between gap-3 border-t p-4 md:flex-row">
                <div className="text-text-secondary flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
                  <span className="border-border-default flex items-center gap-2 rounded-lg border bg-white px-3 py-1.5 shadow-sm">
                    <Users className="text-accent-primary h-3.5 w-3.5" /> 1,240 Visits
                  </span>
                  <span className="border-border-default flex items-center gap-2 rounded-lg border bg-white px-3 py-1.5 shadow-sm">
                    <ShoppingBag className="h-3.5 w-3.5 text-emerald-500" /> 42 Orders
                  </span>
                  <span className="border-border-default flex items-center gap-2 rounded-lg border bg-white px-3 py-1.5 shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
                    <Monitor className="h-3.5 w-3.5 text-amber-500" /> 18 Slots
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
<<<<<<< HEAD
                  className="h-8 gap-2 rounded-lg border-slate-200 bg-white px-4 text-[10px] font-bold uppercase shadow-sm hover:bg-slate-50"
=======
                  className="border-border-default hover:bg-bg-surface2 h-8 gap-2 rounded-lg bg-white px-4 text-[10px] font-bold uppercase shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  Настроить сцену <Settings className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-6">
<<<<<<< HEAD
              <Card className="overflow-hidden rounded-xl border-slate-100 shadow-sm">
                <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-4">
                  <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
=======
              <Card className="border-border-subtle overflow-hidden rounded-xl shadow-sm">
                <CardHeader className="border-border-subtle bg-bg-surface2/30 border-b p-4">
                  <CardTitle className="text-text-muted text-[11px] font-bold uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                    Статистика сессий
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-3">
<<<<<<< HEAD
                  <div className="flex items-end justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Просмотры
                      </p>
                      <p className="text-sm font-bold tracking-tight text-slate-900">1,482</p>
=======
                  <div className="bg-bg-surface2/80 border-border-subtle flex items-end justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                        Просмотры
                      </p>
                      <p className="text-text-primary text-sm font-bold tracking-tight">1,482</p>
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                    <Badge className="h-5 border-none bg-emerald-50 px-2 text-[10px] font-bold text-emerald-600 shadow-sm">
                      +12%
                    </Badge>
                  </div>
<<<<<<< HEAD
                  <div className="flex items-end justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Ср. время
                      </p>
                      <p className="text-sm font-bold tracking-tight text-slate-900">08:45</p>
=======
                  <div className="bg-bg-surface2/80 border-border-subtle flex items-end justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                        Ср. время
                      </p>
                      <p className="text-text-primary text-sm font-bold tracking-tight">08:45</p>
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                    <Badge className="h-5 border-none bg-emerald-50 px-2 text-[10px] font-bold text-emerald-600 shadow-sm">
                      +5%
                    </Badge>
                  </div>
                </CardContent>
              </Card>

<<<<<<< HEAD
              <Card className="group relative overflow-hidden rounded-xl border-slate-800 bg-slate-900 text-white shadow-lg">
=======
              <Card className="border-text-primary/30 bg-text-primary group relative overflow-hidden rounded-xl text-white shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
                <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform duration-700 group-hover:scale-110">
                  <Share2 className="h-24 w-24 text-emerald-400" />
                </div>
                <CardContent className="relative z-10 flex flex-col items-center space-y-4 p-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-inner transition-all duration-300 group-hover:bg-white/20">
                    <Share2 className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-bold uppercase tracking-wider">
                      Пригласить байеров
                    </p>
                    <p className="text-[11px] font-medium leading-relaxed text-white/50">
                      Персональные ссылки для доступа к закрытому показу.
                    </p>
                  </div>
<<<<<<< HEAD
                  <Button className="h-10 w-full rounded-lg bg-white text-[10px] font-bold uppercase tracking-widest text-slate-900 shadow-xl transition-all hover:bg-slate-100">
=======
                  <Button className="text-text-primary hover:bg-bg-surface2 h-10 w-full rounded-lg bg-white text-[10px] font-bold uppercase tracking-widest shadow-xl transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                    Сгенерировать ссылки
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {showroomFeatures.map((feature, i) => (
              <Card
                key={i}
<<<<<<< HEAD
                className="group overflow-hidden rounded-xl border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
              >
                <CardContent className="space-y-4 p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 shadow-sm transition-all duration-300 group-hover:border-indigo-100 group-hover:bg-indigo-50">
                      <feature.icon className="h-5 w-5 text-slate-400 transition-colors group-hover:text-indigo-600" />
=======
                className="border-border-subtle hover:border-accent-primary/30 group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
              >
                <CardContent className="space-y-4 p-3">
                  <div className="flex items-start justify-between">
                    <div className="bg-bg-surface2 border-border-subtle group-hover:bg-accent-primary/10 group-hover:border-accent-primary/20 flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm transition-all duration-300">
                      <feature.icon className="text-text-muted group-hover:text-accent-primary h-5 w-5 transition-colors" />
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'h-5 border-none px-2 text-[9px] font-bold uppercase shadow-sm',
                        feature.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600'
                          : feature.status === 'Beta'
                            ? 'bg-amber-50 text-amber-600'
<<<<<<< HEAD
                            : 'bg-slate-100 text-slate-500'
=======
                            : 'bg-bg-surface2 text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <div>
<<<<<<< HEAD
                    <h3 className="text-[13px] font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[11px] font-medium leading-relaxed text-slate-500">
=======
                    <h3 className="text-text-primary group-hover:text-accent-primary text-[13px] font-bold transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary mt-1.5 line-clamp-2 text-[11px] font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                      {feature.desc}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
<<<<<<< HEAD
                    className="group/btn h-8 w-full justify-between p-0 text-[10px] font-bold uppercase tracking-wider hover:bg-transparent hover:text-indigo-600"
=======
                    className="hover:text-accent-primary group/btn h-8 w-full justify-between p-0 text-[10px] font-bold uppercase tracking-wider hover:bg-transparent"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    Управление{' '}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </RegistryPageShell>
      </TabsContent>
      <TabsContent value="trade-shows" className="mt-4">
        {tab === 'trade-shows' && <TradeShowsContent />}
      </TabsContent>
      <TabsContent value="passport" className="mt-4">
        {tab === 'passport' && <PassportContent />}
      </TabsContent>
      <TabsContent value="buyers" className="mt-4">
        {tab === 'buyers' && <BuyerAppsContent />}
      </TabsContent>
      <TabsContent value="invites" className="mt-4">
        {tab === 'invites' && <PrivateInvitesContent />}
      </TabsContent>
      <TabsContent value="merchandising" className="mt-4">
        {tab === 'merchandising' && <MerchandisingContent />}
      </TabsContent>
      <TabsContent value="video-consultation" className="mt-4">
        {tab === 'video-consultation' && <VideoConsultationContent />}
      </TabsContent>
      <TabsContent value="banners" className="mt-4">
        {tab === 'banners' && <ShowroomBannersContent />}
      </TabsContent>
      <TabsContent value="ai-search" className="mt-4">
        {tab === 'ai-search' && <ShowroomAiSearchContent />}
      </TabsContent>
    </Tabs>
  );
}
