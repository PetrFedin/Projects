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
  Tag
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
  type WorkspaceTabId
} from '@/lib/data/b2b-workspace-matrix';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from 'next/link';

const ICON_MAP: Record<string, any> = {
  MessageSquare, Database, ShieldAlert, FolderOpen, BarChart3,
  Target, Scan, Users, Cloud, BookOpen, Landmark, ShoppingBag, PieChart,
  Activity, Truck, Calculator, PenTool, Settings2
};

const B2B_ROLE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  admin: { label: "Администратор", icon: Shield, color: "text-indigo-500" },
  brand: { label: "Бренд", icon: Tag, color: "text-emerald-500" },
  distributor: { label: "Дистрибьютор", icon: Briefcase, color: "text-blue-500" },
  retailer: { label: "Ретейлер", icon: Store, color: "text-rose-500" },
  buyer: { label: "Байер", icon: ShoppingBag, color: "text-amber-500" },
};

interface DigitalWorkplaceMapProps {
  onClose: () => void;
  primaryRole: B2BUserRole;
}

export function DigitalWorkplaceMap({ onClose, primaryRole }: DigitalWorkplaceMapProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>('ops');
  const [activeFlowRole, setActiveFlowRole] = useState<string | "all">("all");
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgConnections, setSvgConnections] = useState<any[]>([]);
  const [activeTeaser, setActiveTeaser] = useState<any | null>(null);
  const [activeGuideStep, setActiveGuideStep] = useState<number | null>(null);

  const flows: DigitalFlowId[] = ['ops', 'commercial', 'supply'];

  const getRolePath = (role: B2BUserRole, item: any) => {
    const paths: Record<string, string> = {
      'video-consultation': '/shop/b2b/video-consultation',
      'vip-room-booking': '/shop/b2b/vip-room-booking',
      'store-locator': '/shop/store-locator',
      'margin-calculator': '/shop/b2b/margin-calculator',
      'multi-currency': '/shop/b2b/multi-currency',
      'order-modes': '/shop/b2b/order-modes',
      'shopify-sync': '/shop/b2b/shopify-sync',
      'partner-onboarding': '/shop/b2b/partner-onboarding',
      'social-feed': '/shop/b2b/social-feed',
      'gamification': '/shop/b2b/gamification',
      'flash-deals': '/brand/last-call',
    };
    if (paths[item.id]) return paths[item.id];
    const basePath = role === 'admin' ? '/admin' : '/brand';
    if (item.id === 'leads') return `${basePath}/customers`;
    if (item.id === 'pim') return `${basePath}/inventory`;
    if (item.id === 'collab') return `${basePath}/team`;
    if (item.id === 'logistics') return `${basePath}/inventory`;
    if (item.id === 'showroom-360') return `${basePath}/showroom`;
    if (item.id === 'merch') return `/shop/b2b/matrix`;
    if (item.id === 'planning') return `${basePath}/planning`;
    return basePath;
  };

  const groupedItems = useMemo(() => {
    const groups: Record<DigitalFlowId, any[]> = { ops: [], commercial: [], supply: [] };
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
      
      const hoveredEl = items.find(el => el.getAttribute('data-item-id') === hoveredItemId);
      if (!hoveredEl) return;
      
      const hRect = hoveredEl.getBoundingClientRect();
      
      const connections = DIGITAL_WORKSPACE_CONNECTIONS.filter(
        c => c.from === hoveredItemId || c.to === hoveredItemId
      ).map(conn => {
        const isSourceHovered = hoveredItemId === conn.from;
        const otherId = isSourceHovered ? conn.to : conn.from;
        const otherEl = items.find(el => el.getAttribute('data-item-id') === otherId);
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
          targetId: otherId
        };
      }).filter(Boolean);
      
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
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header - Styled like Production Matrix */}
      <DialogHeader className="p-3 pb-3 border-b border-slate-200/50 bg-white shrink-0">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-black uppercase tracking-tighter text-slate-900 leading-none">Карта Процессов Пространства</DialogTitle>
                <div className="flex items-center gap-3 mt-1.5">
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest leading-none">Визуализация сквозного взаимодействия модулей Рабочего Пространства</p>
                  <button onClick={() => setActiveGuideStep(0)} className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 shadow-sm group/guide">
                    <HelpCircle className="h-2.5 w-2.5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Обучение</span>
                  </button>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="h-10 w-10 rounded-xl text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 w-fit">
              <button 
                onClick={() => setActiveFlowRole("all")} 
                className={cn(
                  "px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-normal transition-all border",
                  activeFlowRole === "all" ? "bg-indigo-600 text-white border-indigo-600 shadow-lg" : "text-slate-400 hover:text-slate-600 border-transparent hover:bg-white"
                )}
              >
                Все роли
              </button>
              {(Object.entries(B2B_ROLE_CONFIG)).map(([role, config]) => (
                <button 
                  key={role} 
                  onClick={() => setActiveFlowRole(role)} 
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-normal transition-all flex items-center gap-2 border",
                    activeFlowRole === role ? cn("bg-white shadow-md border-slate-200", config.color) : "text-slate-400 hover:text-slate-600 border-transparent hover:bg-white"
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
      <div className="flex-1 relative overflow-y-auto pt-10 px-8 pb-10 space-y-4 bg-slate-50/50 no-scrollbar" ref={containerRef}>
        <svg className="absolute inset-0 pointer-events-none z-0 w-full h-full">
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
        <div className="absolute inset-0 pointer-events-none z-[60] w-full h-full">
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
                <div className="bg-indigo-600 text-white text-[5.5px] font-black uppercase px-2.5 py-1 rounded-full shadow-2xl border border-white/20 whitespace-nowrap">
                  {conn.label}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {flows.map(flowId => {
          const flow = FLOW_CONFIG[flowId];
          const items = groupedItems[flowId] || [];
          if (items.length === 0) return null;
          
          return (
            <div key={flowId} className="relative transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-sm", flow.color)}>
                  {(() => {
                    const FlowIcon = flowId === 'ops' ? Settings2 : flowId === 'commercial' ? ShoppingBag : Truck;
                    return <FlowIcon className="h-3 w-3" />;
                  })()}
                  <span className="text-[8px] font-black uppercase tracking-wider">{flow.label}</span>
                </div>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              
              <div className="flex flex-wrap gap-x-3 gap-y-6">
                {items.map((item) => {
                  const isRoleActive = activeFlowRole === "all" || (item.roles && item.roles.includes(activeFlowRole));
                  const isHovered = hoveredItemId === item.id;
                  const isRelated = svgConnections.some(c => c.targetId === item.id);
                  
                  return (
                    <motion.div
                      key={item.id}
                      data-item-id={item.id}
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      onClick={() => setActiveTeaser(item)}
                      className={cn(
                        "relative flex items-center transition-all duration-500",
                        !isRoleActive && !isRelated && "opacity-20 grayscale scale-[0.98]",
                        isRelated && "opacity-100 grayscale-0 scale-[1.02]"
                      )}
                    >
                      <div className={cn(
                        "w-[180px] bg-white p-3 rounded-2xl border border-slate-200 shadow-sm transition-all relative cursor-pointer hover:border-indigo-400 hover:shadow-md",
                        isHovered ? "border-indigo-600 shadow-xl z-40" : isRelated ? "border-indigo-400 shadow-lg z-20" : "z-10"
                      )}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={cn(
                            "h-4 w-4 rounded-md border flex items-center justify-center font-black text-[8px] bg-white border-current",
                            isRoleActive ? flow.color : "text-slate-300"
                          )}>
                            {item.originalIdx + 1}
                          </div>
                          <span className={cn(
                            "text-[5.5px] font-black uppercase tracking-widest line-clamp-1 opacity-60",
                            isRoleActive ? flow.color : "text-slate-300"
                          )}>
                            {item.category}
                          </span>
                        </div>

                        <div className="flex items-start gap-2.5 mb-3">
                          <div className={cn(
                            "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100",
                            isHovered ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-400"
                          )}>
                            {(() => {
                              const Icon = ICON_MAP[item.icon] || Zap;
                              return <Icon className="h-4 w-4" />;
                            })()}
                          </div>
                          <div className="space-y-1">
                            <h4 className={cn(
                              "text-[10px] font-black uppercase tracking-widest leading-none line-clamp-2",
                              isRoleActive ? "text-slate-900" : "text-slate-300"
                            )}>
                              {item.title}
                            </h4>
                            <div className="flex gap-1">
                              {item.priority === 'critical' && <div className="h-1 w-4 rounded-full bg-rose-500" />}
                              <div className="h-1 w-4 rounded-full bg-emerald-500" />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-auto">
                          {item.roles.map((role: string) => {
                            const config = B2B_ROLE_CONFIG[role];
                            if (!config) return null;
                            const isTargetRole = role === primaryRole;
                            return (
                              <TooltipProvider key={role}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className={cn(
                                      "p-1 rounded bg-slate-50 border border-slate-100 transition-all",
                                      config.color,
                                      !isTargetRole && "opacity-20 grayscale"
                                    )}>
                                      <config.icon className="h-2.5 w-2.5" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-slate-900 text-white border-none p-2 rounded-lg shadow-2xl z-[15000]">
                                    <p className="text-[9px] font-black uppercase tracking-widest">{config.label}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })}
                        </div>

                        {isHovered && (
                          <div className="absolute top-2 right-2">
                            <button className="p-1 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-slate-100">
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
      <div className="shrink-0 bg-white border-t border-slate-200">
        <div className="p-3 flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-1 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.3)]" />
            <span className="text-[5.5px] font-black text-slate-400 uppercase tracking-widest leading-none">Операции и Коллаборация</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-1 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.3)]" />
            <span className="text-[5.5px] font-black text-slate-400 uppercase tracking-widest leading-none">Коммерция и Продажи</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-1 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
            <span className="text-[5.5px] font-black text-slate-400 uppercase tracking-widest leading-none">Цепочки Поставок</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-white/10 min-h-[100px] transition-all duration-500">
          <AnimatePresence mode="wait">
            {hoveredItemId ? (
              <motion.div key={hoveredItemId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Info className="h-2.5 w-2.5" /> Анализ узла: {WORKSPACE_ITEMS.find(it => it.id === hoveredItemId)?.title}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {svgConnections.length > 0 ? (
                    svgConnections.map((c, i) => (
                      <div key={i} className="flex gap-3 group border-l border-white/5 pl-3 hover:border-indigo-500/50 transition-colors">
                        <div className="shrink-0 mt-1">
                          {c.isIncoming ? <ArrowDownLeft className="h-3 w-3 text-emerald-400" /> : <ArrowUpRight className="h-3 w-3 text-indigo-400" />}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-white uppercase tracking-tight">{c.label}</span>
                            <span className="text-[7px] text-white/30 uppercase font-bold tracking-widest">{c.isIncoming ? '← от ' : '→ к '} {WORKSPACE_ITEMS.find(it => it.id === c.targetId)?.title}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight font-medium max-w-xl">{c.desc}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-[7px] text-slate-500 uppercase font-black tracking-[0.2em] py-1 italic opacity-50">
                      Активные кросс-функциональные связи для данного узла не обнаружены...
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} className="flex items-center justify-center h-full text-slate-500 text-[8px] font-black uppercase tracking-[0.3em] py-2">
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
            <DialogContent className="max-w-2xl bg-white border-none rounded-xl p-0 overflow-hidden shadow-2xl z-[30000]">
              <DialogHeader className="sr-only">
                <DialogTitle>{activeTeaser.title}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col md:flex-row h-full max-h-[70vh]">
                <div className="md:w-1/2 relative h-48 md:h-auto overflow-hidden bg-slate-900">
                  <img src={activeTeaser.teaser.image} alt={activeTeaser.title} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-between items-start">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 shadow-2xl">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <div className="h-1 w-10 bg-white/30 rounded-full" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-0.5 w-12 bg-white/20 rounded-full" />
                          <div className="h-0.5 w-12 bg-white/10 rounded-full" />
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded bg-indigo-500/40 backdrop-blur-md border border-indigo-400/50 text-[6px] font-black text-white uppercase tracking-widest">Модуль: ACTIVE</div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">{activeTeaser.category}</p>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = ICON_MAP[activeTeaser.icon] || Zap;
                        return <Icon className="h-4 w-4" />;
                      })()}
                      <h3 className="text-base font-black uppercase tracking-tighter leading-none">{activeTeaser.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 p-4 md:p-4 flex flex-col justify-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-1.5">{activeTeaser.category}</p>
                  <h3 className="text-sm font-black uppercase tracking-tighter text-slate-900 leading-none mb-1.5">{activeTeaser.title}</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">{activeTeaser.teaser.subtitle}</p>
                  <div className="space-y-3 mb-6">
                    {activeTeaser.teaser.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="mt-1 h-3 w-3 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                          <div className="h-1 w-1 rounded-full bg-emerald-500" />
                        </div>
                        <p className="text-slate-600 text-[11px] font-medium leading-snug">{feature}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    <Button asChild className="flex-1 bg-black text-white hover:bg-slate-800 rounded-lg h-9 text-[9px] font-black uppercase">
                      <Link href={getRolePath(primaryRole, activeTeaser)} onClick={() => { setActiveTeaser(null); onClose(); }}>
                        Попробовать в кабинете <ArrowUpRight className="h-3 w-3 ml-1.5" />
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTeaser(null)} className="px-4 rounded-lg h-9 text-[9px] font-black uppercase">Закрыть</Button>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[20000] pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-4 pointer-events-auto border border-slate-100 relative">
                <button onClick={() => setActiveGuideStep(null)} className="absolute top-4 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-400 transition-colors"><X className="h-5 w-5" /></button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-0.5">Обучение: Шаг {activeGuideStep + 1}</p>
                    <h4 className="text-base font-black uppercase tracking-tighter text-slate-900 leading-none">Навигация по процессам</h4>
                  </div>
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">Интерактивная карта визуализирует потоки данных между вашими инструментами. Выбирайте узлы для анализа связей.</p>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-1.5"><div className="h-1 w-6 bg-indigo-600 rounded-full" /></div>
                  <Button onClick={() => setActiveGuideStep(null)} className="bg-slate-900 text-white hover:bg-black px-6 rounded-xl text-[10px] font-black uppercase tracking-widest h-10 shadow-xl">Понятно</Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
