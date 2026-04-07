'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  BarChart3, 
  Users, 
  ArrowRight, 
  LayoutDashboard,
  Zap,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Globe,
  ShoppingCart,
  PackageCheck,
  Gift,
  FileEdit,
  Rocket,
  ChevronRight,
  ArrowUpRight,
  Info,
  Building2,
  Truck,
  Box,
  Factory,
  Megaphone,
  DollarSign,
  Gavel,
  MessageSquare,
  FileText,
  GraduationCap,
  Sparkles,
  Share2,
  Clock,
  Star,
  CheckCircle2,
  Calendar,
  Package,
  Layers,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TokenEconomyWidget } from "@/components/brand/TokenEconomyWidget";
import { MODULE_HUBS } from "@/lib/data/entity-links";
import { ROUTES } from "@/lib/routes";
import { useBrandCenter } from "@/providers/brand-center-state";

const MODULE_ICONS: Record<string, React.ElementType> = {
  Building2, Truck, ShieldCheck, LayoutDashboard, Box, ShoppingCart, Factory,
  Megaphone, BarChart3, DollarSign, Gavel, Globe, MessageSquare,
  Users, GraduationCap, Sparkles, Share2, TrendingUp,
  Package, Layers, ShieldAlert,
  Zap, FileText, Settings, Rocket,
};

const NAVIGATION_CARDS = [
  {
    id: "ops-pulse",
    title: "Операционный пульс",
    description: "Что происходит сейчас? Мониторинг заказов, производства и критических алертов в реальном времени.",
    icon: Activity,
    href: "/brand/dashboard",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    badge: "Live Status",
    features: ["Live KPIs", "Critical Alerts", "Channel Performance"]
  },
  {
    id: "analytics-360",
    title: "Аналитика 360",
    description: "Что было и куда мы идем? Стратегическое планирование, анализ рынка и глубокое финансовое прогнозирование.",
    icon: BarChart3,
    href: "/brand/analytics-360",
    color: "text-blue-600",
    bg: "bg-blue-50",
    badge: "Strategy",
    features: ["Market Share", "ROI/P&L", "SKU Efficiency"]
  },
  {
    id: "customer-intel",
    title: "Клиентский интеллект",
    description: "Кто наши клиенты? Поведенческий анализ, сегментация аудитории и управление жизненным циклом (LTV).",
    icon: Users,
    href: "/brand/customer-intelligence",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    badge: "Intelligence",
    features: ["RFM Segments", "Churn Analysis", "Cohort Retention"]
  }
];

export default function ControlCenterOverviewPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgConnections, setSvgConnections] = useState<any[]>([]);
  const { recentPages, favorites, addFavorite, removeFavorite, isFavorite } = useBrandCenter();

  // Логика построения связей
  useEffect(() => {
    const updateLines = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const findRect = (id: string) => {
        const el = container.querySelector(`[data-id="${id}"]`);
        if (!el) return null;
        return el.getBoundingClientRect();
      };

      const connections = [
        { from: "brand-hero", to: "ops-pulse", label: "Entry" },
        { from: "ops-pulse", to: "live-widgets", label: "Live" },
        { from: "live-widgets", to: "health-index", label: "Data Flow" },
        { from: "analytics-360", to: "token-economy", label: "Quota Sync" },
        { from: "customer-intel", to: "quick-actions", label: "Command Bus" },
        { from: "health-index", to: "token-economy", label: "Cost Opt" },
        { from: "token-economy", to: "quick-actions", label: "AI Control" },
        { from: "modules-grid", to: "quick-actions", label: "Nav" }
      ];

      const newSvgConnections = connections.map(conn => {
        const r1 = findRect(conn.from);
        const r2 = findRect(conn.to);
        if (!r1 || !r2) return null;

        const x1 = r1.left + r1.width / 2 - containerRect.left;
        const y1 = r1.top + r1.height / 2 - containerRect.top;
        const x2 = r2.left + r2.width / 2 - containerRect.left;
        const y2 = r2.top + r2.height / 2 - containerRect.top;

        const isHorizontal = Math.abs(y1 - y2) < 50;
        let d;

        if (isHorizontal) {
          // Строго горизонтальная связь
          const midX = (x1 + x2) / 2;
          const startX = x1 < x2 ? r1.right - containerRect.left : r1.left - containerRect.left;
          const endX = x1 < x2 ? r2.left - containerRect.left : r2.right - containerRect.left;
          d = `M ${startX} ${y1} L ${endX} ${y2}`;
          return { d, label: conn.label, midX: (startX + endX) / 2, midY: y1 };
        } else {
          // Вертикальная связь V-H-V
          const startY = y1 < y2 ? r1.bottom - containerRect.top : r1.top - containerRect.top;
          const endY = y1 < y2 ? r2.top - containerRect.top : r2.bottom - containerRect.top;
          const midY = (startY + endY) / 2;
          d = `M ${x1} ${startY} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${endY}`;
          return { d, label: conn.label, midX: x2, midY: midY };
        }
      }).filter(Boolean);

      setSvgConnections(newSvgConnections);
    };

    const rafId = requestAnimationFrame(updateLines);
    window.addEventListener('resize', updateLines);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateLines);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50/30" ref={containerRef}>
      {/* SVG Connection Layer */}
      <svg className="absolute inset-0 pointer-events-none z-0 w-full h-full overflow-visible">
        <defs>
          <filter id="glow-connections" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="grad-indigo" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <AnimatePresence>
          {svgConnections.map((line, i) => (
            <g key={i}>
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                d={line.d}
                stroke="#6366f1"
                strokeWidth="1"
                fill="none"
                filter="url(#glow-connections)"
              />
              <motion.circle r="1.5" fill="#6366f1">
                <animateMotion dur="4s" repeatCount="indefinite" path={line.d} />
              </motion.circle>
              <foreignObject x={line.midX - 25} y={line.midY - 8} width="50" height="16">
                <div className="flex items-center justify-center h-full">
                  <span className="text-[5px] font-black uppercase tracking-widest text-indigo-400 bg-white/80 px-1 py-0.5 rounded-full border border-indigo-100 backdrop-blur-sm">
                    {line.label}
                  </span>
                </div>
              </foreignObject>
            </g>
          ))}
        </AnimatePresence>
      </svg>

      <div className="relative z-10 space-y-5 max-w-7xl mx-auto pb-20 px-4 md:px-0">
        {/* Brand Center Hero — единый вход */}
        <Card data-id="brand-hero" className="rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 overflow-hidden shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">Brand Center</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Единый хаб управления брендом: производство, B2B, аналитика, финансы, команда</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/brand/dashboard" className="gap-2">
                    <Activity className="h-4 w-4" /> Операционный пульс
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/brand/analytics-bi" className="gap-2">
                    <BarChart3 className="h-4 w-4" /> Аналитика
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/brand/production" className="gap-2">
                    <Factory className="h-4 w-4" /> Production
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-slate-400 py-4">
            <Link href="/brand" className="hover:text-indigo-600 transition-colors">Организация</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-900">Центр управления</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-indigo-600">Обзор</span>
        </div>

        {/* Control Panel: Hub Tools */}
        <div className="flex justify-end items-center mb-4 gap-3">
            <div className="flex items-center gap-1.5">
                <Button asChild variant="outline" size="sm" className="h-7 px-3 rounded-lg text-[7px] font-black uppercase tracking-widest bg-white border-slate-200 text-slate-400 shadow-sm hover:bg-slate-50">
                    <Link href="/brand/settings">Настройки хаба</Link>
                </Button>
                <div className="h-4 w-px bg-slate-200 mx-0.5" />
                <Button asChild variant="outline" size="sm" className="h-7 px-3 rounded-lg text-[7px] font-black uppercase tracking-widest bg-white border-slate-200 text-slate-400 shadow-sm hover:bg-slate-50">
                    <Link href="/api/export/dashboard?format=csv">Экспорт</Link>
                </Button>
            </div>

            <Button asChild variant="default" size="sm" className="h-7 px-4 rounded-lg text-[7px] font-black uppercase tracking-widest bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                <Link href="/brand/dashboard">Открыть Пульс</Link>
            </Button>
        </div>

        {/* Мини-виджеты: живой статус заказов, задач, дедлайны, алерты */}
        <div data-id="live-widgets" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Production', msg: '2 сэмпла на проверке', severity: 'warning', href: '/brand/production', icon: Factory },
            { label: 'B2B', msg: 'ORD-4521 требует подтверждения', severity: 'info', href: '/brand/b2b-orders/4521', icon: Package },
            { label: 'Finance', msg: 'P&L обновлён', severity: 'ok', href: '/brand/finance', icon: DollarSign },
            { label: 'Задачи', msg: '3 задачи с дедлайном сегодня', severity: 'warning', href: '/brand/calendar?layers=tasks', icon: CheckCircle2 },
            { label: 'Календарь', msg: 'Презентация SS26 — завтра 14:00', severity: 'info', href: '/brand/calendar', icon: Calendar },
          ].map((a, i) => (
            <Link key={i} href={a.href}>
              <Card className={cn("p-3 border rounded-xl hover:shadow-md transition-all group", a.severity === 'warning' && "border-amber-200 bg-amber-50/50", a.severity === 'info' && "border-indigo-200 bg-indigo-50/50", a.severity === 'ok' && "border-emerald-200 bg-emerald-50/50")}>
                <div className="flex items-start gap-2">
                  <a.icon className={cn("h-4 w-4 shrink-0 mt-0.5", a.severity === 'warning' && "text-amber-600", a.severity === 'info' && "text-indigo-600", a.severity === 'ok' && "text-emerald-600")} />
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400">{a.label}</p>
                    <p className="text-[11px] font-bold text-slate-900 mt-0.5">{a.msg}</p>
                  </div>
                  <ArrowUpRight className="h-3 w-3 text-slate-300 group-hover:text-indigo-500 ml-auto shrink-0" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Персонализация: недавние и избранное */}
        {(recentPages.length > 0 || favorites.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {recentPages.length > 0 && (
              <Card className="rounded-xl border border-slate-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" /> Недавние страницы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recentPages.slice(0, 6).map((p, i) => (
                      <Button key={i} asChild variant="outline" size="sm" className="h-8 text-[10px]">
                        <Link href={p.href}>{p.label}</Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {favorites.length > 0 && (
              <Card className="rounded-xl border border-slate-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> Избранные модули
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {favorites.slice(0, 6).map((f) => (
                      <div key={f.id} className="flex items-center gap-1">
                        <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                          <Link href={f.href}>{f.label}</Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-amber-500" onClick={() => removeFavorite(f.id)}>
                          <Star className="h-3.5 w-3.5 fill-amber-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Сетка всех модулей — Организация → Коммуникации */}
        <div data-id="modules-grid" className="space-y-3 mb-8">
            <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-slate-900 rounded-full" />
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Все модули</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {MODULE_HUBS.map((m) => {
                const Icon = MODULE_ICONS[m.icon] ?? Box;
                const fav = isFavorite(m.id);
                return (
                  <Card key={m.id} className="h-full rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-3 group relative">
                    <Link href={m.href} className="block">
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-indigo-50 transition-colors">
                          <Icon className="h-3.5 w-3.5 text-slate-600 group-hover:text-indigo-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-slate-900 truncate group-hover:text-indigo-600">{m.label}</p>
                          <p className="text-[8px] text-slate-400 line-clamp-2">{m.desc}</p>
                        </div>
                        <ArrowUpRight className="h-3 w-3 text-slate-300 group-hover:text-indigo-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); fav ? removeFavorite(m.id) : addFavorite({ id: m.id, href: m.href, label: m.label, group: m.desc }); }}
                      className={cn("absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-amber-50 transition-all", fav && "opacity-100")}
                    >
                      <Star className={cn("h-3.5 w-3.5", fav ? "fill-amber-500 text-amber-500" : "text-slate-300 hover:text-amber-500")} />
                    </button>
                  </Card>
                );
              })}
            </div>

            {/* Заказы: BOPIS, Gift Registry, Order Approval, Amendments */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-8 bg-slate-900 rounded-full" />
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Заказы</h2>
              </div>
              <Card className="rounded-xl border border-slate-100 p-4">
                <p className="text-[10px] text-slate-500 mb-3">B2B заказы, самовывоз (BOPIS), списки подарков, согласование и заявки на изменение.</p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm" className="text-[10px] h-8"><Link href={ROUTES.brand.b2bOrders}>B2B Заказы</Link></Button>
                  <Button asChild variant="outline" size="sm" className="text-[10px] h-8"><Link href={ROUTES.brand.bopis}>BOPIS Hub</Link></Button>
                  <Button asChild variant="outline" size="sm" className="text-[10px] h-8"><Link href={ROUTES.brand.giftRegistry}>Gift Registry</Link></Button>
                  <Button asChild variant="outline" size="sm" className="text-[10px] h-8"><Link href={ROUTES.brand.orderApprovalWorkflow}>Order Approval</Link></Button>
                  <Button asChild variant="outline" size="sm" className="text-[10px] h-8"><Link href={ROUTES.brand.orderAmendments}>Order Amendments</Link></Button>
                </div>
              </Card>
            </div>

            {/* Маркетрум: Shop-the-Look, AI Trend Radar */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-8 bg-slate-900 rounded-full" />
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Маркетрум</h2>
              </div>
              <Card className="rounded-xl border border-slate-100 p-4">
                <p className="text-[10px] text-slate-500 mb-3">Публичный каталог, луки (Shop-the-Look), AI Trend Radar. Импорт контента из 1С/Excel.</p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm" className="text-[10px] h-8"><Link href={ROUTES.marketroom}>Маркетрум</Link></Button>
                  <Button asChild variant="outline" size="sm" className="text-[10px] h-8"><Link href={ROUTES.marketroomShopTheLook}>Shop-the-Look</Link></Button>
                  <Button asChild variant="outline" size="sm" className="text-[10px] h-8"><Link href={ROUTES.marketroomTrendRadar}>AI Trend Radar</Link></Button>
                  <Button asChild variant="outline" size="sm" className="text-[10px] h-8"><Link href={ROUTES.brand.analyticsPlatformSales}>Статистика Маркетрум</Link></Button>
                </div>
              </Card>
            </div>
        </div>

        {/* Hero Section Alignment */}
        <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Hub Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {NAVIGATION_CARDS.map((card, i) => (
                <motion.div
                  key={card.href}
                  data-id={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full rounded-xl border-none shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white border border-slate-100 relative p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn("p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110", card.bg)}>
                        <card.icon className={cn("h-5 w-5", card.color)} />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className="bg-slate-50 text-slate-600 border-none font-black text-[7px] uppercase px-1.5 h-4 tracking-widest">{card.badge}</Badge>
                        <Button asChild variant="ghost" size="icon" className="h-7 w-7 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                          <Link href={card.href}><ArrowUpRight className="h-3.5 w-3.5" /></Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                          {card.title}
                        </h3>
                        <p className="text-[10px] font-medium text-slate-500 leading-relaxed line-clamp-2">
                          {card.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {card.features.map(f => (
                          <Badge key={f} variant="outline" className="rounded-md border-slate-100 text-[6px] font-black uppercase text-slate-400 py-0.5 px-1.5 h-3.5">
                            {f}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="pt-4 border-t border-slate-50">
                        <Button asChild variant="link" className="p-0 h-auto text-[8px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 decoration-indigo-600/30">
                          <Link href={card.href} className="flex items-center gap-1.5">
                            Перейти в раздел <ArrowRight className="h-2.5 w-2.5 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
        </div>

        {/* Secondary Tools Styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Brand Health Score Widget Style */}
          <div className="space-y-3" data-id="health-index">
            <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-emerald-600 rounded-full" />
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Здоровье Бренда</h2>
            </div>
            <Card className="rounded-xl border-none shadow-sm bg-white p-4 border border-slate-100 h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Health Index</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Composite Performance Score</p>
                </div>
                <div className="h-12 w-12 rounded-full border-4 border-indigo-50 flex items-center justify-center bg-indigo-50/30 shadow-inner">
                  <span className="text-sm font-black text-indigo-600">87</span>
                </div>
              </div>
              
              <div className="space-y-5">
                {[
                  { label: 'Маржинальность', score: 92, color: 'bg-emerald-500' },
                  { label: 'Лояльность клиентов', score: 84, color: 'bg-blue-500' },
                  { label: 'Эффективность стока', score: 76, color: 'bg-amber-500' },
                ].map(item => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-900 tabular-nums">{item.score}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                      <div className={cn("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Token Economy Widget */}
          <div className="space-y-3" data-id="token-economy">
            <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Экономика Токенов</h2>
            </div>
            <TokenEconomyWidget />
          </div>

          {/* Quick Actions Widget Style */}
          <div className="space-y-3" data-id="quick-actions">
            <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-slate-900 rounded-full" />
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Быстрые действия</h2>
            </div>
            <Card className="rounded-xl border-none shadow-sm bg-slate-900 text-white p-4 overflow-hidden relative group h-full">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Zap className="h-32 w-32 text-indigo-400" />
              </div>
              <div className="relative z-10 space-y-6 flex flex-col h-full">
                <div className="space-y-1">
                  <h3 className="text-base font-black uppercase tracking-tight">Intelligence Commands</h3>
                  <p className="text-xs font-medium text-slate-400">Часто используемые команды хаба.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Button asChild variant="ghost" className="justify-start h-12 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest px-4 border border-white/5 transition-all">
                    <Link href="/brand/b2b-orders">Создать заказ B2B</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start h-12 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest px-4 border border-white/5 transition-all">
                    <Link href="/brand/showroom">Открыть шоурум</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start h-12 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest px-4 border border-white/5 transition-all">
                    <Link href="/brand/documents">Документы</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start h-12 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest px-4 border border-white/5 transition-all">
                    <Link href="/brand/live">Live / Пульс</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start h-12 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest px-4 border border-white/5 transition-all">
                    <Link href="/brand/events">События</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start h-12 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest px-4 border border-white/5 transition-all">
                    <Link href="/brand/team">Управление командой</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start h-12 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest px-4 border border-white/5 transition-all">
                    <Link href="/api/export/dashboard?format=csv">Экспорт данных</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
