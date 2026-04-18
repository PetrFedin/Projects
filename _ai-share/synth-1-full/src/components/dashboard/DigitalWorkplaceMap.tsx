'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Map as MapIcon,
  Zap,
  ArrowUpRight,
  Info,
  ArrowDownLeft,
  Eye,
  HelpCircle,
  Share2,
  ChevronRight,
  MessageSquare,
  Database,
  ShieldAlert,
  FolderOpen,
  BarChart3,
  Target,
  Scan,
  Users,
  Cloud,
  BookOpen,
  Landmark,
  ShoppingBag,
  PieChart,
  Activity,
  Truck,
  Calculator,
  PenTool,
  Settings2,
  Shield,
  Store,
  Briefcase,
  Tag,
<<<<<<< HEAD
=======
  PackageCheck,
  FileSearch,
  Gavel,
  Search,
  Trophy,
  Rss,
>>>>>>> recover/cabinet-wip-from-stash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  WORKSPACE_ITEMS,
  WORKSPACE_TABS,
  DIGITAL_WORKSPACE_CONNECTIONS,
  FLOW_CONFIG,
  ROLE_CONFIG,
  type DigitalFlowId,
  type B2BUserRole,
  type WorkspaceTabId,
} from '@/lib/data/b2b-workspace-matrix';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

const ICON_MAP: Record<string, any> = {
  MessageSquare,
  Database,
  ShieldAlert,
  FolderOpen,
  BarChart3,
  Target,
  Scan,
  Users,
  Cloud,
  BookOpen,
  Landmark,
  ShoppingBag,
  PieChart,
  Activity,
  Truck,
  Calculator,
  PenTool,
  Settings2,
<<<<<<< HEAD
};

const B2B_ROLE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  admin: { label: 'Администратор', icon: Shield, color: 'text-indigo-500' },
=======
  PackageCheck,
  FileSearch,
  Gavel,
  Search,
  Trophy,
  Rss,
  Zap,
};

const B2B_ROLE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  admin: { label: 'Администратор', icon: Shield, color: 'text-accent-primary' },
>>>>>>> recover/cabinet-wip-from-stash
  brand: { label: 'Бренд', icon: Tag, color: 'text-emerald-500' },
  distributor: { label: 'Дистрибьютор', icon: Briefcase, color: 'text-blue-500' },
  retailer: { label: 'Ретейлер', icon: Store, color: 'text-rose-500' },
  buyer: { label: 'Байер', icon: ShoppingBag, color: 'text-amber-500' },
};

interface DigitalWorkplaceMapProps {
  onClose: () => void;
  primaryRole: B2BUserRole;
}

export function DigitalWorkplaceMap({ onClose, primaryRole }: DigitalWorkplaceMapProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>('ops');
  const [activeFlowRole, setActiveFlowRole] = useState<string | 'all'>('all');
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgConnections, setSvgConnections] = useState<any[]>([]);
  const [activeTeaser, setActiveTeaser] = useState<any | null>(null);
  const [activeGuideStep, setActiveGuideStep] = useState<number | null>(null);

  const flows: DigitalFlowId[] = ['ops', 'commercial', 'supply', 'intelligence'];

  const getRolePath = (role: B2BUserRole, item: any) => {
    const paths: Record<string, string> = {
<<<<<<< HEAD
      'video-consultation': '/shop/b2b/video-consultation',
      'vip-room-booking': '/shop/b2b/vip-room-booking',
      'store-locator': '/shop/store-locator',
      'margin-calculator': '/shop/b2b/margin-calculator',
      'multi-currency': '/shop/b2b/multi-currency',
      'order-modes': '/shop/b2b/order-modes',
      'shopify-sync': '/shop/b2b/shopify-sync',
      'partner-onboarding': '/shop/b2b/partner-onboarding',
      'social-feed': '/shop/b2b/social-feed',
      gamification: '/shop/b2b/gamification',
      'flash-deals': '/brand/last-call',
=======
      'video-consultation': ROUTES.shop.b2bVideoConsultation,
      'vip-room-booking': ROUTES.shop.b2bVipRoomBooking,
      'store-locator': ROUTES.storeLocator,
      'margin-calculator': ROUTES.shop.b2bMarginCalculator,
      'multi-currency': ROUTES.shop.b2bMultiCurrency,
      'order-modes': ROUTES.shop.b2bOrderModes,
      'shopify-sync': ROUTES.shop.b2bShopifySync,
      'partner-onboarding': ROUTES.shop.b2bPartnerOnboarding,
      'social-feed': ROUTES.shop.b2bSocialFeed,
      gamification: ROUTES.shop.b2bGamification,
      'flash-deals': ROUTES.brand.lastCall,
      'fulfillment-dashboard': ROUTES.shop.b2bFulfillmentDashboard,
      'b2b-rfq': ROUTES.shop.b2bRfq,
      'b2b-tenders': ROUTES.shop.b2bTenders,
      'supplier-discovery': ROUTES.shop.b2bSupplierDiscovery,
>>>>>>> recover/cabinet-wip-from-stash
    };
    if (paths[item.id]) return paths[item.id];
    const basePath = role === 'admin' ? ROUTES.admin.home : ROUTES.brand.home;
    if (item.id === 'leads') return `${basePath}/customers`;
    if (item.id === 'pim') return `${basePath}/inventory`;
    if (item.id === 'collab') return `${basePath}/team`;
    if (item.id === 'logistics') return `${basePath}/inventory`;
    if (item.id === 'showroom-360') return `${basePath}/showroom`;
    if (item.id === 'merch') return ROUTES.shop.b2bMatrix;
    if (item.id === 'planning') return `${basePath}/planning`;
    return basePath;
  };

  const groupedItems = useMemo(() => {
    const groups: Record<DigitalFlowId, any[]> = {
      ops: [],
      commercial: [],
      supply: [],
      intelligence: [],
    };
    WORKSPACE_ITEMS.forEach((item, idx) => {
      if (groups[item.flow]) groups[item.flow].push({ ...item, originalIdx: idx });
    });
    return groups;
  }, []);

  useEffect(() => {
    if (!containerRef.current || !hoveredItemId) {
      setSvgConnections([]);
      return;
    }

    const updateLines = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const items = Array.from(container.querySelectorAll('[data-item-id]'));

      const hoveredEl = items.find((el) => el.getAttribute('data-item-id') === hoveredItemId);
      if (!hoveredEl) return;

      const hRect = hoveredEl.getBoundingClientRect();

      const connections = DIGITAL_WORKSPACE_CONNECTIONS.filter(
        (c) => c.from === hoveredItemId || c.to === hoveredItemId
      )
        .map((conn) => {
          const isSourceHovered = hoveredItemId === conn.from;
          const otherId = isSourceHovered ? conn.to : conn.from;
          const otherEl = items.find((el) => el.getAttribute('data-item-id') === otherId);
          if (!otherEl) return null;

          const oRect = otherEl.getBoundingClientRect();

          const hX_mid = hRect.left + hRect.width / 2 - containerRect.left;
          const hY_mid = hRect.top + hRect.height / 2 - containerRect.top;
          const oX_mid = oRect.left + oRect.width / 2 - containerRect.left;
          const oY_mid = oRect.top + oRect.height / 2 - containerRect.top;

          let x1, y1, x2, y2, d, midLabelX, midLabelY;

          x1 = hX_mid;
          x2 = oX_mid;

          if (hY_mid < oY_mid) {
            y1 = hRect.bottom - containerRect.top;
            y2 = oRect.top - containerRect.top;
            midLabelY = y2 - 25;
          } else {
            y1 = hRect.top - containerRect.top;
            y2 = oRect.bottom - containerRect.top;
            midLabelY = y2 + 25;
          }

          const midY = y1 + (y2 - y1) * 0.5;
          d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
          midLabelX = x2;

          return {
            d,
            midLabelX,
            midLabelY,
            label: conn.label,
            desc: conn.desc,
            isIncoming: !isSourceHovered,
            targetId: otherId,
          };
        })
        .filter(Boolean);

      setSvgConnections(connections);
    };

    const rafId = requestAnimationFrame(updateLines);
    window.addEventListener('resize', updateLines);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateLines);
    };
  }, [hoveredItemId]);

  return (
<<<<<<< HEAD
    <div className="flex h-full flex-col overflow-hidden bg-slate-50">
      {/* Header - Styled like Production Matrix */}
      <DialogHeader className="shrink-0 border-b border-slate-200/50 bg-white p-3 pb-3">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-2.5 text-indigo-600 shadow-sm">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-black uppercase leading-none tracking-tighter text-slate-900">
                  Карта Процессов Пространства
                </DialogTitle>
                <div className="mt-1.5 flex items-center gap-3">
                  <p className="text-[9px] font-bold uppercase leading-none tracking-widest text-slate-400">
=======
    <div className="bg-bg-surface2 flex h-full flex-col overflow-hidden">
      {/* Header - Styled like Production Matrix */}
      <DialogHeader className="border-border-default/50 shrink-0 border-b bg-white p-3 pb-3">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 rounded-2xl border p-2.5 shadow-sm">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-text-primary text-base font-black uppercase leading-none tracking-tighter">
                  Карта Процессов Пространства
                </DialogTitle>
                <div className="mt-1.5 flex items-center gap-3">
                  <p className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Визуализация сквозного взаимодействия модулей Рабочего Пространства
                  </p>
                  <button
                    onClick={() => setActiveGuideStep(0)}
<<<<<<< HEAD
                    className="group/guide flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-indigo-600 shadow-sm transition-all hover:bg-indigo-600 hover:text-white"
=======
                    className="bg-accent-primary/10 text-accent-primary hover:bg-accent-primary border-accent-primary/20 group/guide flex items-center gap-1.5 rounded-full border px-2 py-0.5 shadow-sm transition-all hover:text-white"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    <HelpCircle className="h-2.5 w-2.5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">
                      Обучение
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-text-muted hover:bg-bg-surface2 h-10 w-10 rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-2">
<<<<<<< HEAD
            <div className="flex w-fit items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100 p-1">
=======
            <div className="bg-bg-surface2 border-border-default flex w-fit items-center gap-1.5 rounded-2xl border p-1">
>>>>>>> recover/cabinet-wip-from-stash
              <button
                onClick={() => setActiveFlowRole('all')}
                className={cn(
                  'rounded-xl border px-4 py-1.5 text-[10px] font-bold uppercase tracking-normal transition-all',
                  activeFlowRole === 'all'
<<<<<<< HEAD
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg'
                    : 'border-transparent text-slate-400 hover:bg-white hover:text-slate-600'
=======
                    ? 'bg-accent-primary border-accent-primary text-white shadow-lg'
                    : 'text-text-muted hover:text-text-secondary border-transparent hover:bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                )}
              >
                Все роли
              </button>
              {Object.entries(B2B_ROLE_CONFIG).map(([role, config]) => (
                <button
                  key={role}
                  onClick={() => setActiveFlowRole(role)}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[10px] font-bold uppercase tracking-normal transition-all',
                    activeFlowRole === role
<<<<<<< HEAD
                      ? cn('border-slate-200 bg-white shadow-md', config.color)
                      : 'border-transparent text-slate-400 hover:bg-white hover:text-slate-600'
=======
                      ? cn('border-border-default bg-white shadow-md', config.color)
                      : 'text-text-muted hover:text-text-secondary border-transparent hover:bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                >
                  <config.icon className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">{config.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogHeader>

      {/* Main Map Area */}
      <div
<<<<<<< HEAD
        className="no-scrollbar relative flex-1 space-y-4 overflow-y-auto bg-slate-50/50 px-8 pb-10 pt-10"
=======
        className="bg-bg-surface2/80 no-scrollbar relative flex-1 space-y-4 overflow-y-auto px-8 pb-10 pt-10"
>>>>>>> recover/cabinet-wip-from-stash
        ref={containerRef}
      >
        <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full">
          <defs>
            <filter id="glow-workplace" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <AnimatePresence>
            {svgConnections.map((line, i) => (
              <g key={i}>
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  d={line.d}
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  fill="none"
                  filter="url(#glow-workplace)"
                />
                <motion.circle r="2" fill="#6366f1" filter="url(#glow-workplace)">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path={line.d} />
                </motion.circle>
              </g>
            ))}
          </AnimatePresence>
        </svg>

        {/* Floating Labels */}
        <div className="pointer-events-none absolute inset-0 z-[60] h-full w-full">
          <AnimatePresence>
            {svgConnections.map((conn, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute flex items-center justify-center"
                style={{ left: conn.midLabelX, top: conn.midLabelY, width: 0, height: 0 }}
              >
<<<<<<< HEAD
                <div className="whitespace-nowrap rounded-full border border-white/20 bg-indigo-600 px-2.5 py-1 text-[5.5px] font-black uppercase text-white shadow-2xl">
=======
                <div className="bg-accent-primary whitespace-nowrap rounded-full border border-white/20 px-2.5 py-1 text-[5.5px] font-black uppercase text-white shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
                  {conn.label}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {flows.map((flowId) => {
          const flow = FLOW_CONFIG[flowId];
          const items = groupedItems[flowId] || [];
          if (items.length === 0) return null;

          return (
            <div key={flowId} className="relative transition-all duration-500">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={cn(
<<<<<<< HEAD
                    'flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 shadow-sm',
=======
                    'border-border-default flex items-center gap-2 rounded-lg border bg-white px-2.5 py-1 shadow-sm',
>>>>>>> recover/cabinet-wip-from-stash
                    flow.color
                  )}
                >
                  {(() => {
                    const FlowIcon =
                      flowId === 'ops' ? Settings2 : flowId === 'commercial' ? ShoppingBag : Truck;
                    return <FlowIcon className="h-3 w-3" />;
                  })()}
                  <span className="text-[8px] font-black uppercase tracking-wider">
                    {flow.label}
                  </span>
                </div>
                <div className="bg-border-subtle h-px flex-1" />
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-6">
                {items.map((item) => {
                  const isRoleActive =
                    activeFlowRole === 'all' || (item.roles && item.roles.includes(activeFlowRole));
                  const isHovered = hoveredItemId === item.id;
                  const isRelated = svgConnections.some((c) => c.targetId === item.id);

                  return (
                    <motion.div
                      key={item.id}
                      data-item-id={item.id}
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      onClick={() => setActiveTeaser(item)}
                      className={cn(
                        'relative flex items-center transition-all duration-500',
                        !isRoleActive && !isRelated && 'scale-[0.98] opacity-20 grayscale',
                        isRelated && 'scale-[1.02] opacity-100 grayscale-0'
                      )}
                    >
                      <div
                        className={cn(
<<<<<<< HEAD
                          'relative w-[180px] cursor-pointer rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-indigo-400 hover:shadow-md',
                          isHovered
                            ? 'z-40 border-indigo-600 shadow-xl'
                            : isRelated
                              ? 'z-20 border-indigo-400 shadow-lg'
=======
                          'border-border-default hover:border-accent-primary/40 relative w-[180px] cursor-pointer rounded-2xl border bg-white p-3 shadow-sm transition-all hover:shadow-md',
                          isHovered
                            ? 'border-accent-primary z-40 shadow-xl'
                            : isRelated
                              ? 'border-accent-primary/40 z-20 shadow-lg'
>>>>>>> recover/cabinet-wip-from-stash
                              : 'z-10'
                        )}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <div
                            className={cn(
                              'flex h-4 w-4 items-center justify-center rounded-md border border-current bg-white text-[8px] font-black',
<<<<<<< HEAD
                              isRoleActive ? flow.color : 'text-slate-300'
=======
                              isRoleActive ? flow.color : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                            )}
                          >
                            {item.originalIdx + 1}
                          </div>
                          <span
                            className={cn(
                              'line-clamp-1 text-[5.5px] font-black uppercase tracking-widest opacity-60',
<<<<<<< HEAD
                              isRoleActive ? flow.color : 'text-slate-300'
=======
                              isRoleActive ? flow.color : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                            )}
                          >
                            {item.category}
                          </span>
                        </div>

                        <div className="mb-3 flex items-start gap-2.5">
                          <div
                            className={cn(
<<<<<<< HEAD
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-100 shadow-sm',
                              isHovered
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'bg-slate-50 text-slate-400'
=======
                              'border-border-subtle flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border shadow-sm',
                              isHovered
                                ? 'bg-accent-primary/10 text-accent-primary'
                                : 'bg-bg-surface2 text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                            )}
                          >
                            {(() => {
                              const Icon = ICON_MAP[item.icon] || Zap;
                              return <Icon className="h-4 w-4" />;
                            })()}
                          </div>
                          <div className="space-y-1">
                            <h4
                              className={cn(
                                'line-clamp-2 text-[10px] font-black uppercase leading-none tracking-widest',
<<<<<<< HEAD
                                isRoleActive ? 'text-slate-900' : 'text-slate-300'
=======
                                isRoleActive ? 'text-text-primary' : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                              )}
                            >
                              {item.title}
                            </h4>
                            <div className="flex gap-1">
                              {item.priority === 'critical' && (
                                <div className="h-1 w-4 rounded-full bg-rose-500" />
                              )}
                              <div className="h-1 w-4 rounded-full bg-emerald-500" />
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto flex flex-wrap gap-1">
                          {item.roles.map((role: string) => {
                            const config = B2B_ROLE_CONFIG[role];
                            if (!config) return null;
                            const isTargetRole = role === primaryRole;
                            return (
                              <TooltipProvider key={role}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn(
<<<<<<< HEAD
                                        'rounded border border-slate-100 bg-slate-50 p-1 transition-all',
=======
                                        'bg-bg-surface2 border-border-subtle rounded border p-1 transition-all',
>>>>>>> recover/cabinet-wip-from-stash
                                        config.color,
                                        !isTargetRole && 'opacity-20 grayscale'
                                      )}
                                    >
                                      <config.icon className="h-2.5 w-2.5" />
                                    </div>
                                  </TooltipTrigger>
<<<<<<< HEAD
                                  <TooltipContent className="z-[15000] rounded-lg border-none bg-slate-900 p-2 text-white shadow-2xl">
=======
                                  <TooltipContent className="bg-text-primary z-[15000] rounded-lg border-none p-2 text-white shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
                                    <p className="text-[9px] font-black uppercase tracking-widest">
                                      {config.label}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })}
                        </div>

                        {isHovered && (
                          <div className="absolute right-2 top-2">
<<<<<<< HEAD
                            <button className="rounded-xl border border-slate-100 bg-slate-50 p-1 text-slate-400 shadow-sm transition-all hover:bg-indigo-600 hover:text-white">
=======
                            <button className="bg-bg-surface2 text-text-muted hover:bg-accent-primary border-border-subtle rounded-xl border p-1 shadow-sm transition-all hover:text-white">
>>>>>>> recover/cabinet-wip-from-stash
                              <Eye className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend & Monitoring Panel */}
<<<<<<< HEAD
      <div className="shrink-0 border-t border-slate-200 bg-white">
        <div className="flex items-center justify-center gap-3 p-3">
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-1 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.3)]" />
            <span className="text-[5.5px] font-black uppercase leading-none tracking-widest text-slate-400">
=======
      <div className="border-border-default shrink-0 border-t bg-white">
        <div className="flex items-center justify-center gap-3 p-3">
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-1 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.3)]" />
            <span className="text-text-muted text-[5.5px] font-black uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Операции и Коллаборация
            </span>
          </div>
          <div className="flex items-center gap-1.5">
<<<<<<< HEAD
            <div className="h-1 w-1 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.3)]" />
            <span className="text-[5.5px] font-black uppercase leading-none tracking-widest text-slate-400">
=======
            <div className="bg-accent-primary h-1 w-1 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.3)]" />
            <span className="text-text-muted text-[5.5px] font-black uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Коммерция и Продажи
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-1 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
<<<<<<< HEAD
            <span className="text-[5.5px] font-black uppercase leading-none tracking-widest text-slate-400">
=======
            <span className="text-text-muted text-[5.5px] font-black uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Цепочки Поставок
            </span>
          </div>
        </div>

<<<<<<< HEAD
        <div className="min-h-[100px] border-t border-white/10 bg-slate-900 p-4 transition-all duration-500">
=======
        <div className="bg-text-primary min-h-[100px] border-t border-white/10 p-4 transition-all duration-500">
>>>>>>> recover/cabinet-wip-from-stash
          <AnimatePresence mode="wait">
            {hoveredItemId ? (
              <motion.div
                key={hoveredItemId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
<<<<<<< HEAD
                  <div className="flex items-center gap-1.5 rounded border border-indigo-500/30 bg-indigo-500/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-indigo-400">
=======
                  <div className="bg-accent-primary/20 border-accent-primary/30 text-accent-primary flex items-center gap-1.5 rounded border px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    <Info className="h-2.5 w-2.5" /> Анализ узла:{' '}
                    {WORKSPACE_ITEMS.find((it) => it.id === hoveredItemId)?.title}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {svgConnections.length > 0 ? (
                    svgConnections.map((c, i) => (
                      <div
                        key={i}
<<<<<<< HEAD
                        className="group flex gap-3 border-l border-white/5 pl-3 transition-colors hover:border-indigo-500/50"
=======
                        className="hover:border-accent-primary/50 group flex gap-3 border-l border-white/5 pl-3 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        <div className="mt-1 shrink-0">
                          {c.isIncoming ? (
                            <ArrowDownLeft className="h-3 w-3 text-emerald-400" />
                          ) : (
<<<<<<< HEAD
                            <ArrowUpRight className="h-3 w-3 text-indigo-400" />
=======
                            <ArrowUpRight className="text-accent-primary h-3 w-3" />
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black uppercase tracking-tight text-white">
                              {c.label}
                            </span>
                            <span className="text-[7px] font-bold uppercase tracking-widest text-white/30">
                              {c.isIncoming ? '← от ' : '→ к '}{' '}
                              {WORKSPACE_ITEMS.find((it) => it.id === c.targetId)?.title}
                            </span>
                          </div>
<<<<<<< HEAD
                          <p className="max-w-xl text-[10px] font-medium leading-tight text-slate-400">
=======
                          <p className="text-text-muted max-w-xl text-[10px] font-medium leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                            {c.desc}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
<<<<<<< HEAD
                    <div className="col-span-2 py-1 text-[7px] font-black uppercase italic tracking-[0.2em] text-slate-500 opacity-50">
=======
                    <div className="text-text-secondary col-span-2 py-1 text-[7px] font-black uppercase italic tracking-[0.2em] opacity-50">
>>>>>>> recover/cabinet-wip-from-stash
                      Активные кросс-функциональные связи для данного узла не обнаружены...
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
<<<<<<< HEAD
                className="flex h-full items-center justify-center py-2 text-[8px] font-black uppercase tracking-[0.3em] text-slate-500"
=======
                className="text-text-secondary flex h-full items-center justify-center py-2 text-[8px] font-black uppercase tracking-[0.3em]"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Ожидание выбора процесса для детального мониторинга...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Teaser Dialog */}
      <AnimatePresence>
        {activeTeaser && (
          <Dialog open={!!activeTeaser} onOpenChange={(open) => !open && setActiveTeaser(null)}>
            <DialogContent className="z-[30000] max-w-2xl overflow-hidden rounded-xl border-none bg-white p-0 shadow-2xl">
              <DialogHeader className="sr-only">
                <DialogTitle>{activeTeaser.title}</DialogTitle>
              </DialogHeader>
              <div className="flex h-full max-h-[70vh] flex-col md:flex-row">
<<<<<<< HEAD
                <div className="relative h-48 overflow-hidden bg-slate-900 md:h-auto md:w-1/2">
=======
                <div className="bg-text-primary relative h-48 overflow-hidden md:h-auto md:w-1/2">
>>>>>>> recover/cabinet-wip-from-stash
                  <img
                    src={activeTeaser.teaser.image}
                    alt={activeTeaser.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-overlay"
                  />
<<<<<<< HEAD
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent" />
=======
                  <div className="from-accent-primary/20 absolute inset-0 bg-gradient-to-br to-transparent" />
>>>>>>> recover/cabinet-wip-from-stash
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
                    <div className="flex items-start justify-between">
                      <div className="rounded-xl border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-md">
                        <div className="mb-1.5 flex items-center gap-2">
                          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                          <div className="h-1 w-10 rounded-full bg-white/30" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-0.5 w-12 rounded-full bg-white/20" />
                          <div className="h-0.5 w-12 rounded-full bg-white/10" />
                        </div>
                      </div>
<<<<<<< HEAD
                      <div className="rounded border border-indigo-400/50 bg-indigo-500/40 px-2 py-1 text-[6px] font-black uppercase tracking-widest text-white backdrop-blur-md">
=======
                      <div className="bg-accent-primary/40 border-accent-primary/40 rounded border px-2 py-1 text-[6px] font-black uppercase tracking-widest text-white backdrop-blur-md">
>>>>>>> recover/cabinet-wip-from-stash
                        Модуль: ACTIVE
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="mb-1 text-[8px] font-black uppercase tracking-[0.2em] opacity-80">
                      {activeTeaser.category}
                    </p>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = ICON_MAP[activeTeaser.icon] || Zap;
                        return <Icon className="h-4 w-4" />;
                      })()}
                      <h3 className="text-base font-black uppercase leading-none tracking-tighter">
                        {activeTeaser.title}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-4 md:w-1/2 md:p-4">
<<<<<<< HEAD
                  <p className="mb-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">
                    {activeTeaser.category}
                  </p>
                  <h3 className="mb-1.5 text-sm font-black uppercase leading-none tracking-tighter text-slate-900">
                    {activeTeaser.title}
                  </h3>
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
                  <p className="text-accent-primary mb-1.5 text-[9px] font-black uppercase tracking-[0.2em]">
                    {activeTeaser.category}
                  </p>
                  <h3 className="text-text-primary mb-1.5 text-sm font-black uppercase leading-none tracking-tighter">
                    {activeTeaser.title}
                  </h3>
                  <p className="text-text-muted mb-4 text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    {activeTeaser.teaser.subtitle}
                  </p>
                  <div className="mb-6 space-y-3">
                    {activeTeaser.teaser.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="mt-1 flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                          <div className="h-1 w-1 rounded-full bg-emerald-500" />
                        </div>
<<<<<<< HEAD
                        <p className="text-[11px] font-medium leading-snug text-slate-600">
=======
                        <p className="text-text-secondary text-[11px] font-medium leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center gap-2">
                    <Button
                      asChild
<<<<<<< HEAD
                      className="h-9 flex-1 rounded-lg bg-black text-[9px] font-black uppercase text-white hover:bg-slate-800"
=======
                      className="hover:bg-text-primary/90 h-9 flex-1 rounded-lg bg-black text-[9px] font-black uppercase text-white"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      <Link
                        href={getRolePath(primaryRole, activeTeaser)}
                        onClick={() => {
                          setActiveTeaser(null);
                          onClose();
                        }}
                      >
                        Попробовать в кабинете <ArrowUpRight className="ml-1.5 h-3 w-3" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTeaser(null)}
                      className="h-9 rounded-lg px-4 text-[9px] font-black uppercase"
                    >
                      Закрыть
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Guide Dialog - Styled like Production Matrix */}
      <AnimatePresence>
        {activeGuideStep !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-[20000] overflow-hidden"
          >
<<<<<<< HEAD
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
=======
            <div className="bg-text-primary/40 absolute inset-0 backdrop-blur-[2px]" />
>>>>>>> recover/cabinet-wip-from-stash
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
<<<<<<< HEAD
                className="pointer-events-auto relative w-full max-w-md rounded-xl border border-slate-100 bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              >
                <button
                  onClick={() => setActiveGuideStep(null)}
                  className="absolute right-6 top-4 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50"
=======
                className="border-border-subtle pointer-events-auto relative w-full max-w-md rounded-xl border bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              >
                <button
                  onClick={() => setActiveGuideStep(null)}
                  className="hover:bg-bg-surface2 text-text-muted absolute right-6 top-4 rounded-full p-2 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="mb-6 flex items-center gap-3">
<<<<<<< HEAD
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="mb-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
                      Обучение: Шаг {activeGuideStep + 1}
                    </p>
                    <h4 className="text-base font-black uppercase leading-none tracking-tighter text-slate-900">
=======
                  <div className="bg-accent-primary shadow-accent-primary/15 flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg">
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-accent-primary mb-0.5 text-[10px] font-black uppercase tracking-[0.2em]">
                      Обучение: Шаг {activeGuideStep + 1}
                    </p>
                    <h4 className="text-text-primary text-base font-black uppercase leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                      Навигация по процессам
                    </h4>
                  </div>
                </div>
<<<<<<< HEAD
                <p className="mb-8 text-sm font-medium leading-relaxed text-slate-500">
=======
                <p className="text-text-secondary mb-8 text-sm font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                  Интерактивная карта визуализирует потоки данных между вашими инструментами.
                  Выбирайте узлы для анализа связей.
                </p>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-1.5">
<<<<<<< HEAD
                    <div className="h-1 w-6 rounded-full bg-indigo-600" />
                  </div>
                  <Button
                    onClick={() => setActiveGuideStep(null)}
                    className="h-10 rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-black"
=======
                    <div className="bg-accent-primary h-1 w-6 rounded-full" />
                  </div>
                  <Button
                    onClick={() => setActiveGuideStep(null)}
                    className="bg-text-primary h-10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-black"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    Понятно
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
