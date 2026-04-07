"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Clock, 
  ShoppingBag, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  FileText,
  LineChart,
  Globe2,
  Package,
  Layers,
  Play,
  Info,
  Camera,
  Zap,
  Users,
  ShieldCheck,
  Target,
  BarChart3,
  Map,
  Store,
  Share2,
  Palette,
  Shield,
  Briefcase,
  Warehouse,
  ShoppingCart,
  Factory,
  Truck,
  CreditCard,
  Globe,
  Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Send, Activity } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type B2BRole } from "../_fixtures/b2b-data";
import { useAuth } from "@/providers/auth-provider";
import { useUIState } from "@/providers/ui-state";
import { useB2BState } from "@/providers/b2b-state";

const ROLE_CONFIG: Record<B2BRole, { label: string; icon: any; color: string; basePath: string }> = {
  admin: { label: "Администратор", icon: Shield, color: "text-indigo-500", basePath: "/admin" },
  brand: { label: "Бренд", icon: Store, color: "text-emerald-500", basePath: "/brand" },
  distributor: { label: "Дистрибьютор", icon: Briefcase, color: "text-blue-500", basePath: "/distributor" },
  manufacturer: { label: "Производство", icon: Factory, color: "text-orange-500", basePath: "/factory" },
  supplier: { label: "Поставщик", icon: Warehouse, color: "text-amber-500", basePath: "/factory" },
  shop: { label: "Магазин", icon: ShoppingCart, color: "text-rose-500", basePath: "/shop" },
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

interface ProcurementSectionProps {
  viewRole: string;
  router: any;
}

export function ProcurementSection({ viewRole, router }: ProcurementSectionProps) {
  // Access global state and auth context
  const { user } = useAuth();
  const { setIsFlowMapOpen } = useUIState();
  const { addB2bActivityLog, b2bNegotiations, addNegotiationMessage } = useB2BState();

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

  const getProcurementLink = (title: string, defaultLink: string) => {
    const role = effectiveRole;
    
    // Check if it's a collection (usually uppercase with year/season or specific titles)
    const isCollection = title === title.toUpperCase() || title.includes('FW') || title.includes('SS') || title.includes('CAPSULE');

    if (role === 'admin') {
      if (title.includes('Коллекци') || isCollection) return '/admin/brands';
      if (title.includes('Заказ')) return '/admin/billing';
      if (title.includes('Стратегия') || title.includes('Аналитик') || title.includes('Интеллект')) return '/admin/attributes';
      return '/admin/home';
    }

    if (role === 'brand') {
      if (title.includes('Коллекци') || isCollection) return '/brand/planning';
      if (title.includes('Заказ')) return '/brand/b2b-orders';
      if (title.includes('Инструмент') || title.includes('Аналитик')) return '/brand/analytics';
      return defaultLink;
    }

    if (role === 'manufacturer' || role === 'supplier') {
      if (title.includes('Заказ')) return '/factory/orders';
      return '/factory';
    }

    if (role === 'distributor') {
      if (title.includes('Заказ')) return '/distributor/orders';
      if (title.includes('Портфель') || title.includes('Анализ')) return '/distributor/analytics';
      return '/distributor/matrix';
    }

    if (role === 'shop') {
      if (title.includes('Заказ') || title.includes('Закупк')) return '/shop/b2b/orders';
      if (title.includes('Коллекци') || title.includes('Матриц') || isCollection) return defaultLink;
      return '/shop/b2b';
    }

    return defaultLink;
  };

  const [mainCategory, setMainCategory] = useState<"designers" | "retailers" | "distributor">("designers");
  const [activeTab, setActiveTab] = useState<string>("collections");

  if (viewRole !== "b2b" && viewRole !== "client") return null;

  const getTabs = () => {
    switch (mainCategory) {
      case "designers":
        return [
          { id: "collections", label: "Коллекции", icon: Layers },
          { id: "orders", label: "Заказы", icon: FileText },
          { id: "strategy", label: "Инструменты", icon: LineChart },
        ];
      case "retailers":
        return [
          { id: "collections", label: "Коллекции", icon: Layers },
          { id: "orders", label: "Заказы", icon: FileText },
          { id: "tools", label: "Инструменты", icon: Zap },
        ];
      case "distributor":
        return [
          { id: "strategy", label: "Стратегия", icon: Map },
          { id: "orders", label: "Заказы", icon: FileText },
          { id: "tools", label: "Инструменты", icon: Share2 },
        ];
      default:
        return [];
    }
  };

  const collections = [
    { 
      id: "c1", 
      title: "URBAN NOMAD FW26", 
      brand: "Syntha Lab", 
      brandId: "syntha-lab",
      count: 42, 
      status: "Pre-order Open", 
      delivery: "Июнь 2026", 
      match: 98, 
      matchReason: "Высокий спрос на технологичный минимализм в вашем регионе и идеальное попадание в ценовой сегмент вашей аудитории.",
      img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800",
      description: "Коллекция вдохновлена эстетикой современных мегаполисов и технологичным минимализмом. Мы используем мембранные ткани и адаптивный крой для максимального комфорта в движении.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      designer: "Алексей Соколов",
      founded: "2021, Москва",
      photoshoot: [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200",
        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200",
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200"
      ],
      roles: ["admin", "brand", "distributor", "shop"]
    },
    { 
      id: "c3", 
      title: "HERITAGE CAPSULE", 
      brand: "Nordic Wool", 
      brandId: "nordic-wool",
      count: 15, 
      status: "Pre-order Open", 
      delivery: "Май 2026", 
      match: 75, 
      matchReason: "Бренд соответствует вашему профилю устойчивого развития, однако средний чек выше ваших обычных показателей на 15%.",
      img: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=800",
      description: "Переосмысление традиционного скандинавского трикотажа через призму устойчивого развития. 100% переработанная шерсть и ручная вязка.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      designer: "Эрик Линдгрен",
      founded: "2018, Стокгольм",
      photoshoot: [
        "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=1200",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200",
        "https://images.unsplash.com/photo-1576871337622-98d48d1cf027?q=80&w=1200"
      ],
      roles: ["admin", "brand", "distributor", "shop"]
    },
  ];

  const orders = [
    { 
      id: "o1", 
      orderId: "#8821", 
      brand: "Syntha Lab", 
      brandId: "syntha-lab", 
      collectionName: "URBAN NOMAD",
      preliminaryTotal: "1,240,000 ₽", 
      finalTotal: "1,180,000 ₽",
      items: 24, 
      status: "В работе", 
      progress: 65, 
      lastEdit: "2 часа назад", 
      date: "12.01.2026",
      season: "FW26",
      placedBy: "Boutique Moscow",
      img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800",
      roles: ["admin", "brand", "distributor", "shop"]
    },
    { 
      id: "o2", 
      orderId: "#8822", 
      brand: "Nordic Wool", 
      brandId: "nordic-wool", 
      collectionName: "HERITAGE CAPSULE",
      preliminaryTotal: "850,000 ₽", 
      finalTotal: null,
      items: 12, 
      status: "Черновик", 
      progress: 40, 
      lastEdit: "5 часов назад", 
      date: "15.01.2026",
      season: "SS26",
      placedBy: "Nordic Concept Store",
      img: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=800",
      roles: ["admin", "brand", "distributor", "shop"]
    },
  ];

  const distributionTools = [
    {
      id: "dt1",
      label: "Портфель",
      title: "Портфель брендов",
      desc: "Аналитика доходности и потенциала текущих марок в портфеле дистрибьютора.",
      action: "Анализ портфеля",
      link: "/distributor/analytics",
      roles: ["admin", "distributor", "brand"]
    },
    {
      id: "dt2",
      label: "Рынок",
      title: "Анализ рынка",
      desc: "Глубокая аналитика регионального спроса, трендов и ценового позиционирования.",
      action: "Открыть отчет",
      link: "/distributor/retailers",
      roles: ["admin", "distributor", "brand"]
    },
    {
      id: "dt3",
      label: "Права",
      title: "Управление правами",
      desc: "Защита территориальной эксклюзивности и контроль прав на представительство брендов.",
      action: "Проверить статус",
      link: "/distributor/contracts",
      roles: ["admin", "distributor", "brand"]
    },
    {
      id: "dt4",
      label: "Интеллект",
      title: "Интеллект сети",
      desc: "Скоринг надежности дилерской сети, анализ потенциала и сегментация партнеров.",
      action: "Анализ дилеров",
      link: "/distributor/retailers",
      roles: ["admin", "distributor", "shop"]
    },
    {
      id: "dt5",
      label: "Риски",
      title: "Управление рисками",
      desc: "Автоматизированный контроль дебиторской задолженности и страхование сделок.",
      action: "Настроить лимиты",
      link: "/distributor/contracts",
      roles: ["admin", "distributor", "brand"]
    },
    {
      id: "dt6",
      label: "Территории",
      title: "Карта экспансии",
      desc: "Визуализация карты присутствия и планирование выхода в новые регионы.",
      action: "Открыть карту",
      link: "/distributor/territory",
      roles: ["admin", "distributor"]
    }
  ];

  const getInfoBlocks = () => {
    switch (mainCategory) {
      case "designers":
        return [
          {
            icon: Layers,
            title: "Assortment Builder",
            desc: "Визуальное планирование коллекций и автоматический расчет баланса матрицы по категориям.",
            link: "/brand/planning",
            roles: ["admin", "brand", "distributor"]
          },
          {
            icon: Box,
            title: "Digital Swatch Library",
            desc: "Оцифрованные свойства тканей для моментального импорта в 3D (CLO3D) и точных тех-пакетов.",
            link: "/brand/materials",
            roles: ["admin", "brand", "manufacturer", "supplier"]
          },
          {
            icon: Zap,
            title: "IoT Factory Sync",
            desc: "Прямое подключение к станкам для мониторинга выработки и качества в реальном времени.",
            link: "/brand/production",
            roles: ["admin", "brand", "manufacturer"]
          },
          {
            icon: Sparkles,
            title: "AI Lookbook Generator",
            desc: "Автоматическое создание рекламных имиджей и контента для соцсетей на базе 3D-моделей.",
            link: "/brand/media",
            roles: ["admin", "brand"]
          },
          {
            icon: Target,
            title: "Trend-to-Production",
            desc: "Синхронизация планов пошива с актуальными трендами из соцсетей через AI-анализ.",
            link: "/brand/analytics",
            roles: ["admin", "brand", "manufacturer"]
          },
          {
            icon: ShieldCheck,
            title: "ESG Scorecard",
            desc: "Автоматический расчет экологического следа и сертификация цепочки поставок (Transparency).",
            link: "/brand/quality",
            roles: ["admin", "brand", "manufacturer", "supplier"]
          }
        ];
      case "retailers":
        return [
          {
            icon: ShoppingBag,
            title: "Retail API & VMI",
            desc: "Автоматическое пополнение остатков в магазинах на основе данных о продажах в реальном времени.",
            link: "/brand/b2b-orders",
            roles: ["admin", "brand", "shop", "distributor"]
          },
          {
            icon: Globe,
            title: "Dropshipping Hub",
            desc: "Продажи без выкупа стока: магазин принимает заказ, бренд отгружает напрямую клиенту.",
            link: "/shop/b2b/orders",
            roles: ["admin", "brand", "shop"]
          },
          {
            icon: CreditCard,
            title: "B2B Wallet & Limits",
            desc: "Кредитные лимиты, отсрочка платежа и автоматический расчет комиссий внутри сети.",
            link: "/shop/finance",
            roles: ["admin", "brand", "distributor", "shop"]
          },
          {
            icon: Truck,
            title: "Logistics Optimizer",
            desc: "Алгоритм выбора лучшего перевозчика по скорости и цене для каждой посылки или партии.",
            link: "/shop/inventory",
            roles: ["admin", "brand", "distributor", "shop", "manufacturer"]
          },
          {
            icon: BarChart3,
            title: "Pre-order Heatmap",
            desc: "Карта регионального спроса на основе предзаказов для оптимизации распределения товара.",
            link: "/shop/b2b/analytics",
            roles: ["admin", "brand", "distributor"]
          },
          {
            icon: ShieldCheck,
            title: "Escrow Settlements",
            desc: "Безопасные расчеты с заморозкой средств до подтверждения приемки цифровым ОТК.",
            link: "/shop/b2b/contracts",
            roles: ["admin", "brand", "manufacturer", "supplier", "distributor", "shop"]
          }
        ];
      case "distributor":
        return [
          {
            icon: Package,
            title: "Агрегатор заказов",
            desc: "Консолидация мелких заказов от дилеров в крупные пулы для работы с фабриками.",
            link: "/distributor/orders",
            roles: ["admin", "distributor", "manufacturer"]
          },
          {
            icon: Store,
            title: "Цифровой шоурум",
            desc: "Виртуальное пространство для презентации коллекций и проведения отборок.",
            link: "/distributor/matrix",
            roles: ["admin", "distributor", "brand", "shop"]
          },
          {
            icon: Globe2,
            title: "Логистический центр",
            desc: "Управление региональными складами, маршрутизация поставок и контроль возвратов.",
            link: "/distributor/orders",
            roles: ["admin", "distributor", "manufacturer"]
          },
          {
            icon: ShieldCheck,
            title: "Локализация и контроль",
            desc: "Автоматизация сертификации, маркировки и таможенной очистки для всей сети.",
            link: "/distributor/contracts",
            roles: ["admin", "distributor", "manufacturer", "brand"]
          },
          {
            icon: Users,
            title: "Управление сетью (CRM)",
            desc: "Инструменты для мониторинга активности дилеров и распределения лимитов.",
            link: "/distributor/retailers",
            roles: ["admin", "distributor", "shop"]
          },
          {
            icon: BarChart3,
            title: "Финансовый модуль",
            desc: "Управление дебиторской задолженностью дилеров и автоматизация взаиморасчетов.",
            link: "/distributor/finance",
            roles: ["admin", "distributor", "shop"]
          },
          {
            icon: Map,
            title: "Шоурумы в регионах",
            desc: "Поиск и бронирование физических площадок для презентации коллекций.",
            link: "/distributor/showrooms",
            roles: ["admin", "distributor", "brand", "shop"]
          }
        ];
      default:
        return [];
    }
  };

  return (
    <motion.section
      id="PROCUREMENT_b2b"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="section-spacing bg-transparent relative"
    >
      <div className="container mx-auto px-4 relative">
        <Card className="bg-white border-none rounded-xl shadow-2xl shadow-slate-200/50 relative transition-all group min-h-[500px] flex flex-col border border-slate-100 overflow-hidden">
          <CardContent className="p-3 relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-white" />
                  </div>
                  <Badge 
                    variant="outline"
                    className="text-xs border-slate-200 text-slate-900 uppercase font-bold tracking-normal px-2 py-0.5"
                  >
                    PROCUREMENT_HUB_B2B
                  </Badge>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-slate-900 leading-tight">
                  ЗАКУПКИ <span className="text-indigo-600">&</span> ПРЕДЗАКАЗЫ
                </h2>
                <p className="text-slate-400 font-medium text-xs max-w-md">
                  Управление оптовыми заказами, планирование коллекций и прямая связь с производителями.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const el = document.getElementById("procurement-main-scroll");
                    if (el) el.scrollBy({ left: -320, behavior: "smooth" });
                  }}
                  className="text-slate-400 hover:text-slate-900 transition-colors p-1"
                >
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("procurement-main-scroll");
                    if (el) el.scrollBy({ left: 320, behavior: "smooth" });
                  }}
                  className="text-slate-400 hover:text-slate-900 transition-colors p-1"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-100 w-fit shrink-0">
                <button
                  onClick={() => { 
                    setMainCategory("designers"); 
                    setActiveTab("collections"); 
                  }}
                  className={cn(
                    "btn-tab min-w-[140px] gap-2",
                    mainCategory === "designers" ? "btn-tab-active" : "btn-tab-inactive"
                  )}
                >
                  <Palette className="h-3 w-3" />
                  Дизайнеры
                </button>
                <button
                  onClick={() => { 
                    setMainCategory("retailers"); 
                    setActiveTab("collections"); 
                  }}
                  className={cn(
                    "btn-tab min-w-[140px] gap-2",
                    mainCategory === "retailers" ? "btn-tab-active" : "btn-tab-inactive"
                  )}
                >
                  <ShoppingBag className="h-3 w-3" />
                  Ритейлеры
                </button>
                <button
                  onClick={() => {
                    setMainCategory("distributor");
                    setActiveTab("strategy");
                  }}
                  className={cn(
                    "btn-tab min-w-[140px] gap-2",
                    mainCategory === "distributor" ? "btn-tab-active" : "btn-tab-inactive"
                  )}
                >
                  <Share2 className="h-3 w-3" />
                  Дистрибуция
                </button>
              </div>

              {/* Thematic Tabs */}
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-50/50 rounded-2xl border border-slate-100/50 w-fit shrink-0">
                {getTabs().map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "btn-tab min-w-[120px] gap-2 px-5 py-2.5",
                      activeTab === tab.id ? "btn-tab-active" : "btn-tab-inactive"
                    )}
                  >
                    <tab.icon className="h-3 w-3" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Content */}
            <div className="relative -mx-4 px-4">
              <div 
                id="procurement-main-scroll"
                className="flex overflow-x-auto pb-6 gap-3 custom-scrollbar snap-x snap-mandatory scroll-smooth"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${mainCategory}-${activeTab}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-3 w-full"
                  >
                    {activeTab === "collections" ? (
                      collections.map((col) => (
                        <motion.div key={col.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-shrink-0 w-[320px] snap-start">
                          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xl group/col relative h-full flex flex-col hover:border-indigo-200 transition-colors">
                            <div className="absolute top-4 right-6 z-30">
                              <RoleIcons roles={col.roles as B2BRole[]} />
                            </div>
                            <div className="relative aspect-[4/3] mb-4 rounded-2xl overflow-hidden shadow-inner bg-slate-50">
                              <img src={col.img} className="w-full h-full object-cover transition-transform duration-700 group-hover/col:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
                                <Badge className="bg-indigo-600 text-white border-none font-bold text-[7px] uppercase px-2 py-0.5 shadow-lg">{col.status}</Badge>
                              </div>
                              
                              {mainCategory === "retailers" && (
                                <div className="absolute top-3 right-3 z-20">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-bold text-[10px] uppercase px-2 py-1 shadow-md cursor-help hover:bg-black hover:text-white transition-colors">
                                          {col.match}%
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-slate-900 text-white border-none p-3 rounded-xl max-w-[200px]">
                                        <div className="space-y-1.5">
                                          <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-400">Match Justification</p>
                                          <p className="text-[10px] leading-relaxed font-medium">{col.matchReason}</p>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 space-y-4">
                              <div>
                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide mb-1">{col.brand}</p>
                                <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight leading-none mb-1.5">{col.title}</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide flex items-center gap-2">
                                  <Clock className="h-2.5 w-2.5" /> Отгрузка: {col.delivery}
                                </p>
                              </div>

                              <div className="grid grid-cols-3 gap-1.5">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ctaOutline" size="ctaSm" className="w-full">
                                      <Info className="h-2.5 w-2.5" /> Brand
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[500px] bg-white border-none rounded-xl p-4">
                                    <DialogHeader>
                                      <div className="flex items-center gap-3 mb-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
                                          <ShoppingBag className="h-5 w-5 text-white" />
                                        </div>
                                        <DialogTitle className="text-sm font-semibold uppercase tracking-tight">{col.brand}</DialogTitle>
                                      </div>
                                    </DialogHeader>
                                    <div className="space-y-6">
                                      <div className="relative aspect-video rounded-2xl overflow-hidden">
                                        <img src={col.img} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20" />
                                      </div>
                                      <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-wide text-indigo-600">Философия и ДНК</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                          {col.description}
                                        </p>
                                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                                          <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Дизайнер</p>
                                            <p className="text-xs font-bold uppercase text-slate-900">{col.designer}</p>
                                          </div>
                                          <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Основан</p>
                                            <p className="text-xs font-bold uppercase text-slate-900">{col.founded}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ctaOutline" size="ctaSm" className="w-full">
                                      <Camera className="h-2.5 w-2.5" /> Lookbook
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-black border-none rounded-xl">
                                    <DialogHeader className="sr-only">
                                      <DialogTitle>Лукбук коллекции {col.title}</DialogTitle>
                                    </DialogHeader>
                                    <div className="relative w-full aspect-[16/10] group/modal">
                                      <Carousel className="w-full h-full" opts={{ loop: true }}>
                                        <CarouselContent className="h-full">
                                          {col.photoshoot.map((img, i) => (
                                            <CarouselItem key={i} className="h-full">
                                              <div className="relative w-full h-full">
                                                <img src={img} alt={`Lookbook ${i}`} className="w-full h-full object-cover" />
                                              </div>
                                            </CarouselItem>
                                          ))}
                                        </CarouselContent>
                                        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 pointer-events-none z-30">
                                          <CarouselPrevious className="static h-10 w-10 translate-x-0 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white pointer-events-auto transition-all shadow-2xl" />
                                          <CarouselNext className="static h-10 w-10 translate-x-0 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white pointer-events-auto transition-all shadow-2xl" />
                                        </div>
                                      </Carousel>
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ctaOutline" size="ctaSm" className="w-full">
                                      <Play className="h-2.5 w-2.5" /> Video
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black border-none rounded-xl">
                                    <DialogHeader className="sr-only">
                                      <DialogTitle>Видеопрезентация коллекции {col.title}</DialogTitle>
                                    </DialogHeader>
                                    <div className="relative aspect-video w-full">
                                      <iframe 
                                        className="absolute inset-0 w-full h-full" 
                                        src={col.videoUrl} 
                                        title="Brand Video" 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                      ></iframe>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>

                              <div className="pt-4 border-t border-slate-50 flex items-center justify-between gap-3">
                                <div className="flex flex-col">
                                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wide leading-none mb-1">Доступно</span>
                                  <span className="text-sm font-bold text-slate-900 tracking-tight">{col.count} SKU</span>
                                </div>
                                {(() => {
                                  const isAccessGranted = col.roles?.includes(effectiveRole);
                                  return (
                                    <Button 
                                      variant="outline"
                                      disabled={!isAccessGranted}
                                      onClick={() => {
                                        if (isAccessGranted) {
                                          if (viewRole === 'b2b') {
                                            addB2bActivityLog({
                                              type: 'linesheet_request',
                                              actor: { id: 'retailer-1', name: 'Premium Store', type: 'retailer' },
                                              target: { id: col.brandId, name: col.brand, type: 'brand' },
                                              details: `Accessed linesheet for ${col.title}.`
                                            });
                                          }
                                          router.push(getProcurementLink(col.title, mainCategory === "designers" ? `/dashboard/brand/analytics/${col.brandId}` : `/shop/b2b/collections/${col.id}`));
                                        }
                                      }}
                                      className={cn(
                                        "w-[160px] group/btn",
                                        !isAccessGranted && "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                      )}
                                    >
                                      {isAccessGranted ? (
                                        <>
                                          {mainCategory === "designers" ? "Настроить заказ" : "Открыть Line-list"} 
                                          <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                                        </>
                                      ) : (
                                        "Нет доступа"
                                      )}
                                    </Button>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : activeTab === "orders" ? (
                        <div className="w-full bg-white rounded-xl border border-slate-100 p-4 shadow-xl overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100">
                                <th className="pb-4 text-[10px] font-bold uppercase tracking-wide text-slate-400">ID / Дата</th>
                                <th className="pb-4 text-[10px] font-bold uppercase tracking-wide text-slate-400">Сезон</th>
                                <th className="pb-4 text-[10px] font-bold uppercase tracking-wide text-slate-400">Бренд / Коллекция</th>
                                <th className="pb-4 text-[10px] font-bold uppercase tracking-wide text-slate-400">Заказчик</th>
                                {mainCategory === "distributor" && (
                                  <th className="pb-4 text-[10px] font-bold uppercase tracking-wide text-slate-400">Узел дистрибуции</th>
                                )}
                                <th className="pb-4 text-[10px] font-bold uppercase tracking-wide text-slate-400">Сумма (Предв. / Финал)</th>
                                <th className="pb-4 text-[10px] font-bold uppercase tracking-wide text-slate-400">Статус</th>
                                <th className="pb-4 text-[10px] font-bold uppercase tracking-wide text-slate-400 text-right">Действие</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {orders.map((order) => (
                                <tr key={order.id} className={cn(
                                  "group/row transition-colors",
                                  mainCategory === "distributor" ? "hover:bg-indigo-50/30" : "hover:bg-slate-50/50"
                                )}>
                                  <td className="py-4">
                                    <div className="flex flex-col">
                                      <span className="font-bold text-slate-900 text-xs">{order.orderId}</span>
                                      <span className="text-[10px] text-slate-400 font-medium">{order.date}</span>
                                    </div>
                                  </td>
                                  <td className="py-4">
                                    <Badge variant="outline" className="text-[10px] font-bold border-slate-200 text-slate-600 rounded-lg">{order.season}</Badge>
                                  </td>
                                  <td className="py-4">
                                    <div className="flex flex-col relative">
                                      <div className="absolute -top-1 right-0">
                                        <RoleIcons roles={order.roles as B2BRole[]} />
                                      </div>
                                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide leading-none mb-1">{order.brand}</span>
                                      <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">{order.collectionName}</span>
                                    </div>
                                  </td>
                                  <td className="py-4">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{order.placedBy}</span>
                                  </td>
                                  {mainCategory === "distributor" && (
                                    <td className="py-4">
                                      <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                          <Globe2 className="h-3 w-3 text-indigo-600" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase text-indigo-600">HUB-Central</span>
                                      </div>
                                    </td>
                                  )}
                                  <td className="py-4">
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-slate-400 line-through decoration-slate-200">{order.preliminaryTotal}</span>
                                      <span className="text-sm font-bold text-indigo-600 tracking-tight">
                                        {order.finalTotal || "Ожидает финализации"}
                                      </span>
                                      {(() => {
                                        const neg = b2bNegotiations.find(n => n.orderId === order.orderId);
                                        if (neg && neg.messages.length > 0) {
                                          return (
                                            <div className="flex items-center gap-1 mt-1">
                                              <Activity className="h-2.5 w-2.5 text-amber-500 animate-pulse" />
                                              <span className="text-[7px] font-bold uppercase text-amber-600">Переговоры: {neg.messages.length}</span>
                                            </div>
                                          );
                                        }
                                        return null;
                                      })()}
                                    </div>
                                  </td>
                                  <td className="py-4">
                                    <Badge className={cn(
                                      "border-none font-bold text-[10px] uppercase px-2 py-0.5",
                                      order.status === "В работе" ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"
                                    )}>
                                      {order.status}
                                    </Badge>
                                  </td>
                                  <td className="py-4 text-right">
                                    {(() => {
                                      const isAccessGranted = order.roles?.includes(effectiveRole);
                                      const negotiation = b2bNegotiations.find(n => n.orderId === order.orderId);
                                      
                                      return (
                                        <div className="flex items-center justify-end gap-2">
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button variant="outline" size="icon" className="h-8 w-8">
                                                <Activity className="h-3.5 w-3.5" />
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[450px] bg-white border-none rounded-xl p-0 overflow-hidden shadow-2xl">
                                              <DialogHeader className="p-4 pb-4 bg-slate-50 border-b border-slate-100">
                                                <div className="flex items-center gap-3">
                                                  <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                                                    <Activity className="h-5 w-5 text-white" />
                                                  </div>
                                                  <div>
                                                    <DialogTitle className="text-base font-semibold uppercase tracking-tight">Переговоры по заказу</DialogTitle>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Order ID: {order.orderId} • {order.brand}</p>
                                                  </div>
                                                </div>
                                              </DialogHeader>
                                              
                                              <div className="p-4 h-[300px] overflow-y-auto space-y-4 bg-white custom-scrollbar">
                                                {negotiation?.messages.map((msg) => (
                                                  <div key={msg.id} className={cn(
                                                    "flex flex-col gap-1 max-w-[80%]",
                                                    msg.sender.id === user?.uid ? "ml-auto items-end" : "items-start"
                                                  )}>
                                                    <div className={cn(
                                                      "p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm",
                                                      msg.sender.id === user?.uid 
                                                        ? "bg-indigo-600 text-white rounded-tr-none" 
                                                        : "bg-slate-100 text-slate-700 rounded-tl-none"
                                                    )}>
                                                      {msg.text}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide px-1">
                                                      {msg.sender.name} • {new Date(msg.timestamp).toLocaleTimeString()}
                                                    </span>
                                                  </div>
                                                ))}
                                                {(!negotiation || negotiation.messages.length === 0) && (
                                                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                                                    <Activity className="h-8 w-8 text-slate-300" />
                                                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">История сообщений пуста</p>
                                                  </div>
                                                )}
                                              </div>

                                              <div className="p-4 bg-slate-50 border-t border-slate-100">
                                                <div className="flex gap-2">
                                                  <Input 
                                                    placeholder="Введите сообщение..." 
                                                    className="h-10 rounded-xl border-slate-200 bg-white text-xs font-medium focus-visible:ring-indigo-500"
                                                    onKeyDown={(e) => {
                                                      if (e.key === 'Enter') {
                                                        const target = e.target as HTMLInputElement;
                                                        if (target.value.trim()) {
                                                          addNegotiationMessage(order.orderId, {
                                                            type: 'message',
                                                            sender: { id: user?.uid || 'user-1', name: user?.displayName || 'User', role: effectiveRole },
                                                            text: target.value.trim()
                                                          });
                                                          target.value = '';
                                                        }
                                                      }
                                                    }}
                                                  />
                                                  <Button size="icon" className="h-10 w-10 shrink-0">
                                                    <Send className="h-4 w-4" />
                                                  </Button>
                                                </div>
                                              </div>
                                            </DialogContent>
                                          </Dialog>

                                          <Button 
                                            variant="outline"
                                            size="sm"
                                            disabled={!isAccessGranted}
                                            onClick={() => {
                                              if (isAccessGranted) {
                                                if (viewRole === 'b2b') {
                                                  addB2bActivityLog({
                                                    type: 'order_draft',
                                                    actor: { id: 'retailer-1', name: 'Premium Store', type: 'retailer' },
                                                    target: { id: order.orderId, name: `Order ${order.orderId}`, type: 'brand' },
                                                    details: `Viewed order details for ${order.orderId}.`
                                                  });
                                                }
                                                router.push(getProcurementLink('Заказ', mainCategory === "retailers" ? `/shop/b2b/orders/${order.id}` : `/dashboard/brand/${order.brandId}/orders/${order.id}`));
                                              }
                                            }}
                                            className={cn(
                                              "w-[120px] group/btn",
                                              !isAccessGranted && "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                            )}
                                          >
                                            {isAccessGranted ? (
                                              <>
                                                {mainCategory === "retailers" ? "Продолжить" : "Детализация"}
                                                <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover/btn:translate-x-1" />
                                              </>
                                            ) : (
                                              "Нет доступа"
                                            )}
                                          </Button>
                                        </div>
                                      );
                                    })()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                    ) : activeTab === "strategy" && mainCategory === "distributor" ? (
                      distributionTools.map((tool) => (
                        <motion.div
                          key={tool.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex-shrink-0 w-[280px] md:w-[320px] p-4 pb-3 rounded-3xl bg-slate-50 border border-slate-100 snap-start transition-all hover:border-slate-900/30 hover:shadow-xl hover:shadow-slate-200/50 flex flex-col group/card relative"
                        >
                          <div className="absolute top-4 right-4 z-20">
                            <RoleIcons roles={tool.roles as B2BRole[]} />
                          </div>
                          <p className="text-[10px] font-bold uppercase text-slate-900 mb-2">
                            {tool.label}
                          </p>
                          <h4 className="text-sm font-bold uppercase text-slate-900 mb-2 leading-tight">
                            {tool.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-1">
                            {tool.desc}
                          </p>
                          <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-center">
                            {(() => {
                              const isAccessGranted = tool.roles?.includes(effectiveRole);
                              return (
                                <Button
                                  variant="outline"
                                  disabled={!isAccessGranted}
                                  onClick={() => isAccessGranted && router.push(getProcurementLink(tool.title, tool.link))}
                                  className={cn(
                                    "w-[180px] mx-auto group/btn",
                                    !isAccessGranted && "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                  )}
                                >
                                  {isAccessGranted ? (
                                    <>
                                      {tool.action}
                                      <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                                    </>
                                  ) : (
                                    "Нет доступа"
                                  )}
                                </Button>
                              );
                            })()}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      /* Strategy / Tools cards (Old Info Blocks) */
                      getInfoBlocks().map((item, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex-shrink-0 w-[280px] md:w-[320px] bg-slate-50 rounded-xl p-4 border border-slate-100 snap-start transition-all hover:border-slate-900/30 hover:shadow-xl hover:shadow-slate-200/50 flex flex-col group/info relative"
                        >
                          <div className="absolute top-4 right-4 z-20">
                            <RoleIcons roles={item.roles as B2BRole[]} />
                          </div>
                          <div className="h-4 w-4 rounded-lg bg-white shadow-sm flex items-center justify-center mb-4 group-hover/info:bg-black transition-colors">
                            <item.icon className="h-2 w-2 text-slate-400 group-hover/info:text-white" />
                          </div>
                          <h4 className="text-sm font-bold uppercase text-slate-900 mb-2 leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                            {item.desc}
                          </p>
                          <div className="mt-auto pt-4 border-t border-slate-100 flex justify-center">
                             {(() => {
                               const isAccessGranted = item.roles?.includes(effectiveRole);
                               return (
                                 <Button 
                                   variant="outline"
                                   disabled={!isAccessGranted}
                                   onClick={() => isAccessGranted && router.push(getProcurementLink(item.title, item.link || "#"))}
                                   className={cn(
                                     "w-[160px] group/btn",
                                     !isAccessGranted && "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                   )}
                                 >
                                    {isAccessGranted ? (
                                      <>
                                        Подробнее
                                        <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                                      </>
                                    ) : (
                                      "Нет доступа"
                                    )}
                                 </Button>
                               );
                             })()}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <Card className="bg-slate-900 border-none rounded-xl relative min-h-[300px] flex items-center shadow-2xl group/banner overflow-hidden mt-6">
              <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/banner:scale-105 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556740734-7f1a02d7350c?q=80&w=2000"
                  className="w-full h-full object-cover"
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
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Автоматизация закупок</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Прямые поставки</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Глобальный сорсинг</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Контроль качества</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Смарт-логистика</span>
                      </div>
                    ))}
                  </motion.div>
                </div>
                <h2 className="text-xl md:text-3xl font-bold uppercase tracking-tight leading-tight">
                  МАСШТАБИРУЙТЕ ВАШ БИЗНЕС
                </h2>
                <p className="text-slate-300 text-sm font-medium border-l-2 border-indigo-500/50 pl-6 whitespace-nowrap">
                  "Автоматизация закупок и прямой доступ к производствам."
                </p>
              </CardContent>
            </Card>
          </CardContent>
          
          <div className="absolute bottom-8 right-10 flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity cursor-default z-20">
            <div className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              PROCUREMENT_SYSTEM_v2.4
            </span>
          </div>
        </Card>
      </div>
    </motion.section>
  );
}
