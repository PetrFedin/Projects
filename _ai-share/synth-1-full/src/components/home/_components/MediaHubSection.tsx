"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Factory
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type B2BRole } from "../_fixtures/b2b-data";
import { useAuth } from "@/providers/auth-provider";
import { useUIState } from "@/providers/ui-state";
import { MediaRadarPreview } from "../../home/MediaRadarPreview";

const ROLE_CONFIG: Record<B2BRole, { label: string; icon: any; color: string }> = {
  admin: { label: "Администратор", icon: Shield, color: "text-indigo-500" },
  brand: { label: "Бренд", icon: Store, color: "text-emerald-500" },
  distributor: { label: "Дистрибьютор", icon: Briefcase, color: "text-blue-500" },
  manufacturer: { label: "Производство", icon: Factory, color: "text-orange-500" },
  supplier: { label: "Поставщик", icon: Warehouse, color: "text-amber-500" },
  shop: { label: "Магазин", icon: ShoppingCart, color: "text-rose-500" },
};

function RoleIcons({ roles }: { roles?: B2BRole[] }) {
  const displayRoles = roles || ["admin"];
  return (
    <div className="flex items-center gap-1.5">
      <TooltipProvider>
        {displayRoles.map((role) => {
          const config = ROLE_CONFIG[role as B2BRole];
          if (!config) return null;
          return (
            <Tooltip key={role}>
              <TooltipTrigger asChild>
                <div className={cn("p-1.5 rounded-lg bg-white/90 backdrop-blur-md shadow-sm border border-slate-100 transition-all hover:scale-110 cursor-help", config.color)}>
                  <config.icon className="h-3 w-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-900 text-white border-none p-2 rounded-lg shadow-2xl z-[100]">
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
      if (itemTitle.includes('Видео') || itemTitle.includes('Сторис') || itemTitle.includes('банк')) return '/admin/attributes';
      return '/admin/home';
    }

    if (role === 'brand') {
      return '/brand/media';
    }

    if (role === 'manufacturer' || role === 'supplier') {
      if (itemTitle.includes('Видео') || itemTitle.includes('банк')) return '/factory/production';
      return '/factory';
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

  const [activeTab, setActiveTab] = useState<"formats" | "tools">("formats");

  const mediaTools = [
    {
      id: "t1",
      icon: Tv,
      label: "Прямой эфир",
      title: "Прямые трансляции",
      desc: "Профессиональные стримы с возможностью интеграции товарных карточек и чата в реальном времени.",
      action: "Создать эфир",
      link: "/dashboard/media/live",
      roles: ["admin", "brand", "distributor", "shop"]
    },
    {
      id: "t2",
      icon: Mic,
      label: "Аудио-хаб",
      title: "Подкасты",
      desc: "Инструменты для записи и дистрибуции экспертных подкастов с автоматической транскрибацией.",
      action: "Записать выпуск",
      link: "/dashboard/media/podcasts",
      roles: ["admin", "brand", "distributor"]
    },
    {
      id: "t3",
      icon: MonitorPlay,
      label: "Видео-система",
      title: "Видео-контент",
      desc: "Хостинг и управление библиотекой видеоматериалов: от рекламных роликов до обучающих курсов.",
      action: "Загрузить видео",
      link: "/dashboard/media/video",
      roles: ["admin", "brand", "distributor", "manufacturer"]
    },
    {
      id: "t4",
      icon: Radio,
      label: "Лайв-продажи",
      title: "Лайв продажи",
      desc: "Специализированный формат интерактивной торговли с мгновенным оформлением заказа внутри стрима.",
      action: "Запустить продажи",
      link: "/dashboard/media/sales",
      roles: ["admin", "brand", "distributor", "shop"]
    },
    {
      id: "t5",
      icon: Smartphone,
      label: "Shorts & Stories",
      title: "Сторис",
      desc: "Создание и планирование вертикального контента для вовлечения аудитории и быстрых анонсов.",
      action: "Создать сторис",
      link: "/dashboard/media/stories",
      roles: ["admin", "brand", "distributor", "shop"]
    },
    {
      id: "t6",
      icon: CloudLightning,
      label: "Медиа-кит",
      title: "Медиа-банк",
      desc: "Централизованное хранилище всех медиа-материалов бренда для партнеров, ритейлеров и СМИ.",
      action: "Открыть банк",
      link: "/dashboard/media/assets",
      roles: ["admin", "brand", "distributor", "shop"]
    },
    {
      id: "t7",
      icon: Newspaper,
      label: "Цифровой PR",
      title: "Пресс-офис",
      desc: "Управление публикациями, рассылками и взаимодействием с ключевыми fashion-редакторами.",
      action: "Перейти в PR",
      link: "/dashboard/media/pr",
      roles: ["admin", "brand"]
    },
    {
      id: "t8",
      icon: Sparkles,
      label: "AI-студия",
      title: "AI-лаборатория",
      desc: "Автоматическое создание AI-описаний, генерация субтитров и адаптация контента под форматы.",
      action: "Запустить ИИ",
      link: "/dashboard/media/ai",
      roles: ["admin", "brand", "distributor"]
    },
    {
      id: "t9",
      icon: Share2,
      label: "Хаб инфлюенсеров",
      title: "Работа с блогерами",
      desc: "Инструменты для поиска, брифинга и управления совместными кампаниями с лидерами мнений.",
      action: "Найти инфлюенсера",
      link: "/dashboard/media/influencers",
      roles: ["admin", "brand", "distributor"]
    }
  ];

  return (
    <motion.section
      id="MEDIA_ECOSYSTEM_b2b"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="section-spacing bg-transparent relative"
    >
      <div className="container mx-auto px-4">
        <Card className="bg-white border-none rounded-xl shadow-2xl shadow-slate-200/50 relative border border-slate-100 min-h-[500px] flex flex-col">
          <CardContent className="p-3 flex-1 flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center">
                    <Video className="h-4 w-4 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-slate-200 text-slate-900 uppercase font-bold tracking-normal px-2 py-0.5"
                  >
                    MEDIA_ECOSYSTEM_b2b
                  </Badge>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-slate-900 leading-tight">
                  МЕДИА-ЭКОСИСТЕМА
                </h2>
                <p className="text-slate-400 font-medium text-xs max-w-md">
                  Все форматы взаимодействия в едином интерактивном пространстве.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <MediaRadarPreview />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const el = document.getElementById("media-scroll-b2b");
                      if (el) el.scrollBy({ left: -320, behavior: "smooth" });
                    }}
                    className="text-slate-400 hover:text-slate-900 transition-colors p-1"
                  >
                    <ArrowRight className="h-5 w-5 rotate-180" />
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById("media-scroll-b2b");
                      if (el) el.scrollBy({ left: 320, behavior: "smooth" });
                    }}
                    className="text-slate-400 hover:text-slate-900 transition-colors p-1"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs - MOVED BELOW DESCRIPTION */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-100 w-fit shrink-0 mb-8">
              <button
                onClick={() => setActiveTab("formats")}
                className={cn(
                  "btn-tab min-w-[140px] gap-2",
                  activeTab === "formats" ? "btn-tab-active" : "btn-tab-inactive"
                )}
              >
                <Layers className="h-3 w-3" />
                Форматы
              </button>
              <button
                onClick={() => setActiveTab("tools")}
                className={cn(
                  "btn-tab min-w-[140px] gap-2",
                  activeTab === "tools" ? "btn-tab-active" : "btn-tab-inactive"
                )}
              >
                <Zap className="h-3 w-3" />
                Инструменты
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "formats" ? (
                <motion.div
                  key="formats"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-4 gap-2 mb-6"
                >
                  {/* 1. STAGE - Прямой эфир */}
                  <div className="group/channel relative h-[300px] rounded-xl border border-slate-100 bg-slate-900 shadow-xl overflow-hidden">
                    <div className="absolute top-4 right-6 z-30">
                      <RoleIcons roles={["admin", "brand", "distributor", "shop"]} />
                    </div>
                    <div className="absolute inset-0">
                      <img
                        src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/channel:scale-110 transition-transform duration-700"
                        alt="Stage"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    
                    {/* Status Badge in Top Corner */}
                    <div className="absolute top-4 left-6 z-20 group-hover/channel:opacity-0 transition-opacity">
                      <Badge className="bg-emerald-500 text-white border-none text-[10px] font-bold px-2 py-0.5 inline-flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-white animate-pulse" />
                        LIVE
                      </Badge>
                    </div>

                    {/* Center Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      {(() => {
                        const isAccessGranted = ["admin", "brand", "distributor", "shop"].includes(effectiveRole);
                        return (
                          <Button 
                            asChild={isAccessGranted}
                            disabled={!isAccessGranted}
                            className={cn(
                              "border shadow-xl px-4 h-9 w-[180px] group/btn",
                              isAccessGranted
                                ? "bg-transparent border-white/40 text-white hover:bg-black hover:border-black hover:button-glimmer hover:button-professional"
                                : "bg-white/10 border-white/10 text-white/40 cursor-not-allowed"
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

                    <div className="absolute bottom-6 left-6 right-6 h-[180px] flex flex-col justify-end z-10">
                      <div className="h-5 w-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 shrink-0">
                        <Radio className="h-2.5 w-2.5 text-white" />
                      </div>
                      <h4 className="text-sm font-bold uppercase text-white mb-1">
                        ЭФИР
                      </h4>
                      <p className="text-[10px] text-slate-300 font-medium leading-tight mb-3">
                        Прямые эфиры и Live-шоппинг.
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-slate-400" />
                          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                            Интерактивная кнопка заказа
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-slate-400" />
                          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                            Синхронизация стоков LIVE
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. STUDIO - Подкасты */}
                  <div className="group/channel relative h-[300px] rounded-xl border border-slate-100 bg-slate-900 shadow-md hover:shadow-xl transition-all overflow-hidden">
                    <div className="absolute top-4 right-6 z-30">
                      <RoleIcons roles={["admin", "brand", "distributor"]} />
                    </div>
                    <div className="absolute inset-0">
                      <img
                        src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800"
                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover/channel:scale-110 transition-transform duration-700"
                        alt="Studio"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-900/40" />
                    
                    {/* Status Indicator in Top Corner */}
                    <div className="absolute top-4 left-6 z-20 group-hover/channel:opacity-0 transition-opacity flex items-center gap-1 h-4">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="w-1 bg-white/30 rounded-full animate-bounce"
                          style={{
                            height: `${Math.random() * 10 + 4}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Center Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      {(() => {
                        const isAccessGranted = ["admin", "brand", "distributor"].includes(effectiveRole);
                        return (
                          <Button 
                            asChild={isAccessGranted}
                            disabled={!isAccessGranted}
                            className={cn(
                              "border shadow-xl px-4 h-9 w-[180px] group/btn",
                              isAccessGranted
                                ? "bg-transparent border-white/40 text-white hover:bg-black hover:border-black hover:button-glimmer hover:button-professional"
                                : "bg-white/10 border-white/10 text-white/40 cursor-not-allowed"
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

                    <div className="absolute bottom-6 left-6 right-6 h-[180px] flex flex-col justify-end z-10">
                      <div className="h-5 w-5 rounded-full bg-slate-900 flex items-center justify-center mb-3 shrink-0">
                        <Mic className="h-2.5 w-2.5 text-white" />
                      </div>
                      <h4 className="text-sm font-bold uppercase text-white mb-1">
                        СТУДИЯ
                      </h4>
                      <p className="text-[10px] text-slate-300 font-medium leading-tight mb-3">
                        Экспертные подкасты и интервью.
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-slate-400" />
                          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                            AI-субтитры и перевод
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-slate-400" />
                          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                            Авто-аналитика и выжимка эфира
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. FUTURE - AI-генератор */}
                  <div className="group/channel relative h-[300px] rounded-xl border border-slate-100 bg-slate-900 shadow-md hover:shadow-xl transition-all overflow-hidden">
                    <div className="absolute top-4 right-6 z-30">
                      <RoleIcons roles={["admin", "brand"]} />
                    </div>
                    <div className="absolute inset-0">
                      <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800"
                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover/channel:scale-110 transition-transform duration-700"
                        alt="AI Lab"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/90 via-slate-900/40 to-transparent" />
                    
                    {/* Status Indicator in Top Corner */}
                    <div className="absolute top-4 left-6 z-20 group-hover/channel:opacity-0 transition-opacity flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      <span className="text-[10px] font-bold uppercase text-white">AI Engine</span>
                    </div>

                    {/* Center Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      {(() => {
                        const isAccessGranted = ["admin", "brand"].includes(effectiveRole);
                        return (
                          <Button 
                            asChild={isAccessGranted}
                            disabled={!isAccessGranted}
                            className={cn(
                              "border shadow-xl px-4 h-9 w-[180px] group/btn",
                              isAccessGranted
                                ? "bg-transparent border-white/40 text-white hover:bg-black hover:border-black hover:button-glimmer hover:button-professional"
                                : "bg-white/10 border-white/10 text-white/40 cursor-not-allowed"
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

                    <div className="absolute bottom-6 left-6 right-6 h-[180px] flex flex-col justify-end z-10">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center mb-3 shrink-0">
                        <Sparkles className="h-2.5 w-2.5 text-white" />
                      </div>
                      <h4 className="text-sm font-bold uppercase text-white mb-1">
                        БУДУЩЕЕ
                      </h4>
                      <p className="text-[10px] text-slate-300 font-medium leading-tight mb-3">
                        AI Lookbook & Media Generator.
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-slate-400" />
                          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                            3D-модели в фото-контент
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-slate-400" />
                          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                            Авто-генерация сторис
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. BACKSTAGE - 360 Showroom */}
                  <div className="group/channel relative h-[300px] rounded-xl border border-slate-100 bg-slate-900 shadow-md hover:shadow-xl transition-all overflow-hidden">
                    <div className="absolute top-4 right-6 z-30">
                      <RoleIcons roles={["admin", "brand", "distributor", "shop"]} />
                    </div>
                    <div className="absolute inset-0">
                      <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800"
                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover/channel:scale-110 transition-transform duration-700"
                        alt="Virtual"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    
                    {/* Status Indicator in Top Corner */}
                    <div className="absolute top-4 left-6 z-20 group-hover/channel:opacity-0 transition-opacity flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-white" />
                      <span className="text-[10px] font-bold uppercase text-white">360° View</span>
                    </div>

                    {/* Center Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      {(() => {
                        const isAccessGranted = ["admin", "brand", "distributor", "shop"].includes(effectiveRole);
                        return (
                          <Button 
                            asChild={isAccessGranted}
                            disabled={!isAccessGranted}
                            className={cn(
                              "border shadow-xl px-4 h-9 w-[180px] group/btn",
                              isAccessGranted
                                ? "bg-transparent border-white/40 text-white hover:bg-black hover:border-black hover:button-glimmer hover:button-professional"
                                : "bg-white/10 border-white/10 text-white/40 cursor-not-allowed"
                            )}
                          >
                            {isAccessGranted ? (
                              <Link href={getMediaLink('Showroom 360', '/dashboard/media/backstage')}>
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

                    <div className="absolute bottom-6 left-6 right-6 h-[180px] flex flex-col justify-end z-10">
                      <div className="h-5 w-5 rounded-full bg-rose-500 flex items-center justify-center mb-3 shrink-0">
                        <MonitorPlay className="h-2.5 w-2.5 text-white" />
                      </div>
                      <h4 className="text-sm font-bold uppercase text-white mb-1">
                        ВИРТУАЛЬНОСТЬ
                      </h4>
                      <p className="text-[10px] text-slate-300 font-medium leading-tight mb-3">
                        Immersive Showroom Experience.
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-slate-400" />
                          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                            Интерактивный отбор
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-slate-400" />
                          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
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
                  className="flex overflow-x-auto pb-6 gap-3 custom-scrollbar snap-x snap-mandatory scroll-smooth -mx-4 px-4"
                >
                  {mediaTools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex-shrink-0 w-[280px] md:w-[320px] p-4 pb-3 rounded-3xl bg-slate-50 border border-slate-100 snap-start transition-all hover:border-slate-900/30 hover:shadow-xl hover:shadow-slate-200/50 flex flex-col group/card relative"
                    >
                      <div className="absolute top-4 right-4 z-20">
                        <RoleIcons roles={tool.roles as B2BRole[]} />
                      </div>
                      <div className="h-4 w-4 rounded-lg bg-white shadow-sm flex items-center justify-center mb-4 group-hover/card:bg-black transition-colors">
                        <tool.icon className="h-2 w-2 text-slate-400 group-hover/card:text-white" />
                      </div>
                      <div className="space-y-1 mb-2">
                        <p className="text-[10px] font-bold uppercase text-indigo-600 tracking-wide">
                          {tool.label}
                        </p>
                        <h4 className="text-base font-bold uppercase text-slate-900 leading-tight group-hover/card:text-indigo-600 transition-colors">
                          {tool.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                        {tool.desc}
                      </p>
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-center">
                        {(() => {
                          const isAccessGranted = tool.roles?.includes(effectiveRole);
                          return (
                            <Button
                              asChild={isAccessGranted}
                              disabled={!isAccessGranted}
                              className={cn(
                                "w-[180px] mx-auto border h-9 group/btn",
                                isAccessGranted
                                  ? "bg-white text-slate-400 border-slate-200 group-hover/card:bg-black group-hover/card:text-white group-hover/card:border-black group-hover/card:button-glimmer group-hover/card:button-professional group-hover/card:shadow-xl"
                                  : "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-50"
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

            <Card className="bg-slate-900 border-none rounded-xl relative min-h-[300px] flex items-center shadow-2xl group/banner overflow-hidden mt-6">
              <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/banner:scale-105 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=2000"
                  className="w-full h-full object-cover"
                  alt="Media Ecosystem"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
              <CardContent className="relative z-10 p-4 space-y-6 max-w-4xl text-white">
                <div className="overflow-hidden whitespace-nowrap mb-4 py-2 border-y border-white/10 relative group/marquee">
                  <motion.div 
                    animate={{ x: ["0%", "-50%"] }} 
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }} 
                    className="flex items-center gap-3 w-fit"
                  >
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Прямые трансляции</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Fashion-стримы</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Экспертные подкасты</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Видео-обзоры</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Образовательный контент</span>
                      </div>
                    ))}
                  </motion.div>
                </div>
                <h2 className="text-xl md:text-3xl font-bold uppercase tracking-tight leading-tight">
                  МЕДИА-ЭКОСИСТЕМА
                </h2>
                <p className="text-slate-300 text-sm font-medium border-l-2 border-slate-900/50 pl-6 whitespace-nowrap">
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
