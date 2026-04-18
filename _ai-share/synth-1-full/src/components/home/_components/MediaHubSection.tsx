'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Video,
  ArrowRight,
  Radio,
  Mic,
  Database,
  Film,
  PlayCircle,
  Zap,
  Layers,
  MonitorPlay,
  Share2,
  Tv,
  Smartphone,
  CloudLightning,
  Newspaper,
  Sparkles,
  Shield,
  Store,
  Briefcase,
  Warehouse,
  ShoppingCart,
  Factory,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type B2BRole } from '../_fixtures/b2b-data';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { MediaRadarPreview } from '../../home/MediaRadarPreview';

const ROLE_CONFIG: Record<B2BRole, { label: string; icon: any; color: string }> = {
  admin: { label: 'Администратор', icon: Shield, color: 'text-accent-primary' },
  brand: { label: 'Бренд', icon: Store, color: 'text-emerald-500' },
  distributor: { label: 'Дистрибьютор', icon: Briefcase, color: 'text-blue-500' },
  manufacturer: { label: 'Производство', icon: Factory, color: 'text-orange-500' },
  supplier: { label: 'Поставщик', icon: Warehouse, color: 'text-amber-500' },
  shop: { label: 'Магазин', icon: ShoppingCart, color: 'text-rose-500' },
};

function RoleIcons({ roles }: { roles?: B2BRole[] }) {
  const displayRoles = roles || ['admin'];
  return (
    <div className="flex items-center gap-1.5">
      <TooltipProvider>
        {displayRoles.map((role) => {
          const config = ROLE_CONFIG[role as B2BRole];
          if (!config) return null;
          return (
            <Tooltip key={role}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'border-border-subtle cursor-help rounded-lg border bg-white/90 p-1.5 shadow-sm backdrop-blur-md transition-all hover:scale-110',
                    config.color
                  )}
                >
                  <config.icon className="h-3 w-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-text-primary z-[100] rounded-lg border-none p-2 text-white shadow-2xl">
                <p className="text-[10px] font-bold uppercase tracking-wide">{config.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
}

export function MediaHubSection() {
  const { user } = useAuth();
  const { setIsFlowMapOpen } = useUIState();

  const effectiveRole = useMemo(() => {
    if (!user?.roles) return 'brand';
    const roles = user.roles as string[];
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('brand')) return 'brand';
    if (roles.includes('manufacturer')) return 'manufacturer';
    if (roles.includes('supplier')) return 'supplier';
    if (roles.includes('distributor')) return 'distributor';
    if (roles.includes('shop')) return 'shop';
    return 'brand';
  }, [user]);

  const getMediaLink = (itemTitle: string, defaultLink: string) => {
    const role = effectiveRole;

    if (role === 'admin') {
      if (itemTitle.includes('эфир') || itemTitle.includes('продажи')) return '/admin/promotions';
      if (itemTitle.includes('Видео') || itemTitle.includes('Сторис') || itemTitle.includes('банк'))
        return '/admin/attributes';
      return '/admin/home';
    }

    if (role === 'brand') {
      return '/brand/media';
    }

    if (role === 'manufacturer' || role === 'supplier') {
      if (itemTitle.includes('Видео') || itemTitle.includes('банк')) return '/factory/production';
      return '/factory/production';
    }

    if (role === 'distributor') {
      return '/distributor/messages';
    }

    if (role === 'shop') {
      if (itemTitle.includes('эфир') || itemTitle.includes('продажи')) return '/shop/promotions';
      return '/shop';
    }

    return defaultLink;
  };

  const [activeTab, setActiveTab] = useState<'formats' | 'tools'>('formats');

  const mediaTools = [
    {
      id: 't1',
      icon: Tv,
      label: 'Прямой эфир',
      title: 'Прямые трансляции',
      desc: 'Профессиональные стримы с возможностью интеграции товарных карточек и чата в реальном времени.',
      action: 'Создать эфир',
      link: '/dashboard/media/live',
      roles: ['admin', 'brand', 'distributor', 'shop'],
    },
    {
      id: 't2',
      icon: Mic,
      label: 'Аудио-хаб',
      title: 'Подкасты',
      desc: 'Инструменты для записи и дистрибуции экспертных подкастов с автоматической транскрибацией.',
      action: 'Записать выпуск',
      link: '/dashboard/media/podcasts',
      roles: ['admin', 'brand', 'distributor'],
    },
    {
      id: 't3',
      icon: MonitorPlay,
      label: 'Видео-система',
      title: 'Видео-контент',
      desc: 'Хостинг и управление библиотекой видеоматериалов: от рекламных роликов до обучающих курсов.',
      action: 'Загрузить видео',
      link: '/dashboard/media/video',
      roles: ['admin', 'brand', 'distributor', 'manufacturer'],
    },
    {
      id: 't4',
      icon: Radio,
      label: 'Лайв-продажи',
      title: 'Лайв продажи',
      desc: 'Специализированный формат интерактивной торговли с мгновенным оформлением заказа внутри стрима.',
      action: 'Запустить продажи',
      link: '/dashboard/media/sales',
      roles: ['admin', 'brand', 'distributor', 'shop'],
    },
    {
      id: 't5',
      icon: Smartphone,
      label: 'Shorts & Stories',
      title: 'Сторис',
      desc: 'Создание и планирование вертикального контента для вовлечения аудитории и быстрых анонсов.',
      action: 'Создать сторис',
      link: '/dashboard/media/stories',
      roles: ['admin', 'brand', 'distributor', 'shop'],
    },
    {
      id: 't6',
      icon: CloudLightning,
      label: 'Медиа-кит',
      title: 'Медиа-банк',
      desc: 'Централизованное хранилище всех медиа-материалов бренда для партнеров, ритейлеров и СМИ.',
      action: 'Открыть банк',
      link: '/dashboard/media/assets',
      roles: ['admin', 'brand', 'distributor', 'shop'],
    },
    {
      id: 't7',
      icon: Newspaper,
      label: 'Цифровой PR',
      title: 'Пресс-офис',
      desc: 'Управление публикациями, рассылками и взаимодействием с ключевыми fashion-редакторами.',
      action: 'Перейти в PR',
      link: '/dashboard/media/pr',
      roles: ['admin', 'brand'],
    },
    {
      id: 't8',
      icon: Sparkles,
      label: 'AI-студия',
      title: 'AI-лаборатория',
      desc: 'Автоматическое создание AI-описаний, генерация субтитров и адаптация контента под форматы.',
      action: 'Запустить ИИ',
      link: '/dashboard/media/ai',
      roles: ['admin', 'brand', 'distributor'],
    },
    {
      id: 't9',
      icon: Share2,
      label: 'Хаб инфлюенсеров',
      title: 'Работа с блогерами',
      desc: 'Инструменты для поиска, брифинга и управления совместными кампаниями с лидерами мнений.',
      action: 'Найти инфлюенсера',
      link: '/dashboard/media/influencers',
      roles: ['admin', 'brand', 'distributor'],
    },
  ];

  return (
    <motion.section
      id="MEDIA_ECOSYSTEM_b2b"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="section-spacing relative bg-transparent"
    >
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <Card className="border-border-subtle relative flex min-h-[500px] flex-col rounded-xl border border-none bg-white shadow-2xl shadow-md">
          <CardContent className="flex flex-1 flex-col p-3">
            <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="bg-text-primary flex h-8 w-8 items-center justify-center rounded-xl">
                    <Video className="h-4 w-4 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-border-default text-text-primary px-2 py-0.5 text-xs font-bold uppercase tracking-normal"
                  >
                    MEDIA_ECOSYSTEM_b2b
                  </Badge>
                </div>
                <h2 className="text-text-primary text-2xl font-bold uppercase leading-tight tracking-tight md:text-4xl">
                  МЕДИА-ЭКОСИСТЕМА
                </h2>
                <p className="text-text-muted max-w-md text-xs font-medium">
                  Все форматы взаимодействия в едином интерактивном пространстве.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <MediaRadarPreview />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const el = document.getElementById('media-scroll-b2b');
                      if (el) el.scrollBy({ left: -320, behavior: 'smooth' });
                    }}
                    className="text-text-muted hover:text-text-primary p-1 transition-colors"
                  >
                    <ArrowRight className="h-5 w-5 rotate-180" />
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('media-scroll-b2b');
                      if (el) el.scrollBy({ left: 320, behavior: 'smooth' });
                    }}
                    className="text-text-muted hover:text-text-primary p-1 transition-colors"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs - MOVED BELOW DESCRIPTION */}
            <div className="bg-bg-surface2 border-border-subtle mb-8 flex w-fit shrink-0 items-center gap-1.5 rounded-2xl border p-1">
              <button
                onClick={() => setActiveTab('formats')}
                className={cn(
                  'btn-tab min-w-[140px] gap-2',
                  activeTab === 'formats' ? 'btn-tab-active' : 'btn-tab-inactive'
                )}
              >
                <Layers className="h-3 w-3" />
                Форматы
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={cn(
                  'btn-tab min-w-[140px] gap-2',
                  activeTab === 'tools' ? 'btn-tab-active' : 'btn-tab-inactive'
                )}
              >
                <Zap className="h-3 w-3" />
                Инструменты
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'formats' ? (
                <motion.div
                  key="formats"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="mb-6 grid grid-cols-4 gap-2"
                >
                  {/* 1. STAGE - Прямой эфир */}
                  <div className="group/channel border-border-subtle bg-text-primary relative h-[300px] overflow-hidden rounded-xl border shadow-xl">
                    <div className="absolute right-6 top-4 z-30">
                      <RoleIcons roles={['admin', 'brand', 'distributor', 'shop']} />
                    </div>
                    <div className="absolute inset-0">
                      <img
                        src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800"
                        className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover/channel:scale-110"
                        alt="Stage"
                      />
                    </div>
                    <div className="from-text-primary via-text-primary/40 absolute inset-0 bg-gradient-to-t to-transparent" />

                    {/* Status Badge in Top Corner */}
                    <div className="absolute left-6 top-4 z-20 transition-opacity group-hover/channel:opacity-0">
                      <Badge className="inline-flex items-center gap-1.5 border-none bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        <div className="h-1 w-1 animate-pulse rounded-full bg-white" />
                        LIVE
                      </Badge>
                    </div>

                    {/* Center Button */}
                    <div className="absolute inset-0 z-30 flex items-center justify-center">
                      {(() => {
                        const isAccessGranted = ['admin', 'brand', 'distributor', 'shop'].includes(
                          effectiveRole
                        );
                        return (
                          <Button
                            asChild={isAccessGranted}
                            disabled={!isAccessGranted}
                            className={cn(
                              'group/btn h-9 w-[180px] border px-4 shadow-xl',
                              isAccessGranted
                                ? 'hover:button-glimmer hover:button-professional border-white/40 bg-transparent text-white hover:border-black hover:bg-black'
                                : 'cursor-not-allowed border-white/10 bg-white/10 text-white/40'
                            )}
                          >
                            {isAccessGranted ? (
                              <Link href={getMediaLink('Прямой эфир', '/dashboard/media/stage')}>
                                Смотреть эфир
                                <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                              </Link>
                            ) : (
                              <span>Нет доступа</span>
                            )}
                          </Button>
                        );
                      })()}
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 z-10 flex h-[180px] flex-col justify-end">
                      <div className="mb-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                        <Radio className="h-2.5 w-2.5 text-white" />
                      </div>
                      <h4 className="mb-1 text-sm font-bold uppercase text-white">ЭФИР</h4>
                      <p className="text-text-muted mb-3 text-[10px] font-medium leading-tight">
                        Прямые эфиры и Live-шоппинг.
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="bg-text-muted h-1 w-1 rounded-full" />
                          <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                            Интерактивная кнопка заказа
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-text-muted h-1 w-1 rounded-full" />
                          <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                            Синхронизация стоков LIVE
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. STUDIO - Подкасты */}
                  <div className="group/channel border-border-subtle bg-text-primary relative h-[300px] overflow-hidden rounded-xl border shadow-md transition-all hover:shadow-xl">
                    <div className="absolute right-6 top-4 z-30">
                      <RoleIcons roles={['admin', 'brand', 'distributor']} />
                    </div>
                    <div className="absolute inset-0">
                      <img
                        src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800"
                        className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover/channel:scale-110"
                        alt="Studio"
                      />
                    </div>
                    <div className="from-text-primary/80 to-text-primary/40 absolute inset-0 bg-gradient-to-br" />

                    {/* Status Indicator in Top Corner */}
                    <div className="absolute left-6 top-4 z-20 flex h-4 items-center gap-1 transition-opacity group-hover/channel:opacity-0">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="w-1 animate-bounce rounded-full bg-white/30"
                          style={{
                            height: `${Math.random() * 10 + 4}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Center Button */}
                    <div className="absolute inset-0 z-30 flex items-center justify-center">
                      {(() => {
                        const isAccessGranted = ['admin', 'brand', 'distributor'].includes(
                          effectiveRole
                        );
                        return (
                          <Button
                            asChild={isAccessGranted}
                            disabled={!isAccessGranted}
                            className={cn(
                              'group/btn h-9 w-[180px] border px-4 shadow-xl',
                              isAccessGranted
                                ? 'hover:button-glimmer hover:button-professional border-white/40 bg-transparent text-white hover:border-black hover:bg-black'
                                : 'cursor-not-allowed border-white/10 bg-white/10 text-white/40'
                            )}
                          >
                            {isAccessGranted ? (
                              <Link href={getMediaLink('Подкасты', '/dashboard/media/studio')}>
                                Открыть Studio
                                <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                              </Link>
                            ) : (
                              <span>Нет доступа</span>
                            )}
                          </Button>
                        );
                      })()}
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 z-10 flex h-[180px] flex-col justify-end">
                      <div className="bg-text-primary mb-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                        <Mic className="h-2.5 w-2.5 text-white" />
                      </div>
                      <h4 className="mb-1 text-sm font-bold uppercase text-white">СТУДИЯ</h4>
                      <p className="text-text-muted mb-3 text-[10px] font-medium leading-tight">
                        Экспертные подкасты и интервью.
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="bg-text-muted h-1 w-1 rounded-full" />
                          <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                            AI-субтитры и перевод
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-text-muted h-1 w-1 rounded-full" />
                          <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                            Авто-аналитика и выжимка эфира
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. FUTURE - AI-генератор */}
                  <div className="group/channel border-border-subtle bg-text-primary relative h-[300px] overflow-hidden rounded-xl border shadow-md transition-all hover:shadow-xl">
                    <div className="absolute right-6 top-4 z-30">
                      <RoleIcons roles={['admin', 'brand']} />
                    </div>
                    <div className="absolute inset-0">
                      <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800"
                        className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover/channel:scale-110"
                        alt="AI Lab"
                      />
                    </div>
                    <div className="from-text-primary/90 via-text-primary/40 absolute inset-0 bg-gradient-to-tr to-transparent" />

                    {/* Status Indicator in Top Corner */}
                    <div className="absolute left-6 top-4 z-20 flex items-center gap-2 transition-opacity group-hover/channel:opacity-0">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      <span className="text-[10px] font-bold uppercase text-white">AI Engine</span>
                    </div>

                    {/* Center Button */}
                    <div className="absolute inset-0 z-30 flex items-center justify-center">
                      {(() => {
                        const isAccessGranted = ['admin', 'brand'].includes(effectiveRole);
                        return (
                          <Button
                            asChild={isAccessGranted}
                            disabled={!isAccessGranted}
                            className={cn(
                              'group/btn h-9 w-[180px] border px-4 shadow-xl',
                              isAccessGranted
                                ? 'hover:button-glimmer hover:button-professional border-white/40 bg-transparent text-white hover:border-black hover:bg-black'
                                : 'cursor-not-allowed border-white/10 bg-white/10 text-white/40'
                            )}
                          >
                            {isAccessGranted ? (
                              <Link href={getMediaLink('AI Generator', '/dashboard/media/ai')}>
                                Запустить ИИ
                                <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                              </Link>
                            ) : (
                              <span>Нет доступа</span>
                            )}
                          </Button>
                        );
                      })()}
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 z-10 flex h-[180px] flex-col justify-end">
                      <div className="mb-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                        <Sparkles className="h-2.5 w-2.5 text-white" />
                      </div>
                      <h4 className="mb-1 text-sm font-bold uppercase text-white">БУДУЩЕЕ</h4>
                      <p className="text-text-muted mb-3 text-[10px] font-medium leading-tight">
                        AI Lookbook & Media Generator.
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="bg-text-muted h-1 w-1 rounded-full" />
                          <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                            3D-модели в фото-контент
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-text-muted h-1 w-1 rounded-full" />
                          <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                            Авто-генерация сторис
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. BACKSTAGE - 360 Showroom */}
                  <div className="group/channel border-border-subtle bg-text-primary relative h-[300px] overflow-hidden rounded-xl border shadow-md transition-all hover:shadow-xl">
                    <div className="absolute right-6 top-4 z-30">
                      <RoleIcons roles={['admin', 'brand', 'distributor', 'shop']} />
                    </div>
                    <div className="absolute inset-0">
                      <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800"
                        className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover/channel:scale-110"
                        alt="Virtual"
                      />
                    </div>
                    <div className="from-text-primary via-text-primary/40 absolute inset-0 bg-gradient-to-t to-transparent" />

                    {/* Status Indicator in Top Corner */}
                    <div className="absolute left-6 top-4 z-20 flex items-center gap-2 transition-opacity group-hover/channel:opacity-0">
                      <PlayCircle className="h-4 w-4 text-white" />
                      <span className="text-[10px] font-bold uppercase text-white">360° View</span>
                    </div>

                    {/* Center Button */}
                    <div className="absolute inset-0 z-30 flex items-center justify-center">
                      {(() => {
                        const isAccessGranted = ['admin', 'brand', 'distributor', 'shop'].includes(
                          effectiveRole
                        );
                        return (
                          <Button
                            asChild={isAccessGranted}
                            disabled={!isAccessGranted}
                            className={cn(
                              'group/btn h-9 w-[180px] border px-4 shadow-xl',
                              isAccessGranted
                                ? 'hover:button-glimmer hover:button-professional border-white/40 bg-transparent text-white hover:border-black hover:bg-black'
                                : 'cursor-not-allowed border-white/10 bg-white/10 text-white/40'
                            )}
                          >
                            {isAccessGranted ? (
                              <Link
                                href={getMediaLink('Showroom 360', '/dashboard/media/backstage')}
                              >
                                В Showroom 360°
                                <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                              </Link>
                            ) : (
                              <span>Нет доступа</span>
                            )}
                          </Button>
                        );
                      })()}
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 z-10 flex h-[180px] flex-col justify-end">
                      <div className="mb-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500">
                        <MonitorPlay className="h-2.5 w-2.5 text-white" />
                      </div>
                      <h4 className="mb-1 text-sm font-bold uppercase text-white">ВИРТУАЛЬНОСТЬ</h4>
                      <p className="text-text-muted mb-3 text-[10px] font-medium leading-tight">
                        Immersive Showroom Experience.
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="bg-text-muted h-1 w-1 rounded-full" />
                          <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                            Интерактивный отбор
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-text-muted h-1 w-1 rounded-full" />
                          <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                            Phygital-презентации
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="tools"
                  id="media-scroll-b2b"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="custom-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-6"
                >
                  {mediaTools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-bg-surface2 border-border-subtle hover:border-text-primary/30 group/card relative flex w-[280px] flex-shrink-0 snap-start flex-col rounded-3xl border p-4 pb-3 transition-all hover:shadow-md hover:shadow-xl md:w-[320px]"
                    >
                      <div className="absolute right-4 top-4 z-20">
                        <RoleIcons roles={tool.roles as B2BRole[]} />
                      </div>
                      <div className="mb-4 flex h-4 w-4 items-center justify-center rounded-lg bg-white shadow-sm transition-colors group-hover/card:bg-black">
                        <tool.icon className="text-text-muted h-2 w-2 group-hover/card:text-white" />
                      </div>
                      <div className="mb-2 space-y-1">
                        <p className="text-accent-primary text-[10px] font-bold uppercase tracking-wide">
                          {tool.label}
                        </p>
                        <h4 className="text-text-primary group-hover/card:text-accent-primary text-base font-bold uppercase leading-tight transition-colors">
                          {tool.title}
                        </h4>
                      </div>
                      <p className="text-text-secondary mb-6 text-xs font-medium leading-relaxed">
                        {tool.desc}
                      </p>
                      <div className="border-border-subtle mt-auto flex items-center justify-center border-t pt-4">
                        {(() => {
                          const isAccessGranted = tool.roles?.includes(effectiveRole);
                          return (
                            <Button
                              asChild={isAccessGranted}
                              disabled={!isAccessGranted}
                              className={cn(
                                'group/btn mx-auto h-9 w-[180px] border',
                                isAccessGranted
                                  ? 'text-text-muted border-border-default group-hover/card:button-glimmer group-hover/card:button-professional bg-white group-hover/card:border-black group-hover/card:bg-black group-hover/card:text-white group-hover/card:shadow-xl'
                                  : 'bg-bg-surface2 text-text-muted border-border-default cursor-not-allowed opacity-50'
                              )}
                            >
                              {isAccessGranted ? (
                                <Link href={getMediaLink(tool.title, tool.link)}>
                                  {tool.action}
                                  <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                                </Link>
                              ) : (
                                <span>Нет доступа</span>
                              )}
                            </Button>
                          );
                        })()}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <Card className="bg-text-primary group/banner relative mt-6 flex min-h-[300px] items-center overflow-hidden rounded-xl border-none shadow-2xl">
              <div className="absolute inset-0 overflow-hidden rounded-xl opacity-40 transition-transform duration-1000 group-hover/banner:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=2000"
                  className="h-full w-full object-cover"
                  alt="Media Ecosystem"
                />
              </div>
              <div className="from-text-primary via-text-primary/80 absolute inset-0 bg-gradient-to-r to-transparent" />
              <CardContent className="relative z-10 max-w-4xl space-y-6 p-4 text-white">
                <div className="group/marquee relative mb-4 overflow-hidden whitespace-nowrap border-y border-white/10 py-2">
                  <motion.div
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                    className="flex w-fit items-center gap-3"
                  >
                    {[1, 2].map((i) => (
                      <div key={i} className="flex shrink-0 items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Прямые трансляции
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Fashion-стримы
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Экспертные подкасты
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Видео-обзоры
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Образовательный контент
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </div>
                <h2 className="text-xl font-bold uppercase leading-tight tracking-tight md:text-3xl">
                  МЕДИА-ЭКОСИСТЕМА
                </h2>
                <p className="text-text-muted border-text-primary/50 whitespace-nowrap border-l-2 pl-6 text-sm font-medium">
                  "Все форматы взаимодействия в едином интерактивном пространстве."
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
