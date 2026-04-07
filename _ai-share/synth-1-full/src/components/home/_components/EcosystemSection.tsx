"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, ArrowRight, Shield, Store, Briefcase, Warehouse, ShoppingCart, Factory, Share2, Info, ArrowUpRight, ArrowDownLeft, Activity, Settings2, Truck, Eye } from "lucide-react";
import { ECOSYSTEM_TABS, ECOSYSTEM_ITEMS, ECOSYSTEM_FLOW_CONNECTIONS, SYNERGY_CONNECTIONS, ECOSYSTEM_GUIDE, type EcosystemTabId, type B2BRole } from "../_fixtures/b2b-data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUIState } from "@/providers/ui-state";
import { useAuth } from "@/providers/auth-provider";
import { Zap, HelpCircle, ChevronRight, X } from "lucide-react";

const ROLE_CONFIG: Record<B2BRole, { label: string; icon: any; color: string; basePath: string }> = {
  admin: { label: "Администратор", icon: Shield, color: "text-indigo-500", basePath: "/admin" },
  brand: { label: "Бренд", icon: Store, color: "text-emerald-500", basePath: "/brand" },
  distributor: { label: "Дистрибьютор", icon: Briefcase, color: "text-blue-500", basePath: "/distributor" },
  manufacturer: { label: "Производство", icon: Factory, color: "text-orange-500", basePath: "/factory" },
  supplier: { label: "Поставщик", icon: Warehouse, color: "text-amber-500", basePath: "/factory" },
  shop: { label: "Магазин", icon: ShoppingCart, color: "text-rose-500", basePath: "/shop" },
};

export function EcosystemSection() {
  const { isFlowMapOpen, setIsFlowMapOpen, viewRole: globalRole } = useUIState();
  const { user } = useAuth();
  const [activeEcosystemTab, setActiveEcosystemTab] = useState<EcosystemTabId>("commerce");

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

  const [activeFlowRole, setActiveFlowRole] = useState<B2BRole | "all">("all");
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [activeGuideStep, setActiveGuideStep] = useState<number | null>(null);
  const [activeTeaser, setActiveTeaser] = useState<any | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getRolePath = (role: B2BRole, item: any) => {
    const config = ROLE_CONFIG[role];
    const tab = activeEcosystemTab;
    const title = item.title;
    
    if (role === 'brand') {
      if (title.includes('Assortment')) return '/brand/planning';
      if (title.includes('Re-orders')) return '/brand/b2b-orders';
      if (title.includes('Wallet')) return '/brand/finance';
      if (title.includes('QR-Ordering')) return '/brand/promotions';
      if (title.includes('Heatmap')) return '/brand/analytics';
      if (title.includes('Generator')) return '/brand/media';
      if (title.includes('Showroom 360')) return '/brand/showroom';
      if (title.includes('Boutiques')) return '/brand/media';
      if (title.includes('Trend-to-Production')) return '/brand/analytics';
      if (title.includes('VMI')) return '/brand/b2b-orders';
      if (title.includes('Dropshipping')) return '/brand/inventory';
      if (title.includes('Escrow')) return '/brand/finance';
      if (title.includes('Sustainability')) return '/brand/quality';
      if (title.includes('Customs Gateway')) return '/brand/inventory';
      if (tab === 'commerce') return '/brand/b2b-orders';
      if (tab === 'strategy') return '/brand/analytics-360';
      if (tab === 'marketing') return '/brand/media';
      if (tab === 'law') return '/brand/finance';
      return '/brand';
    }

    if (role === 'distributor') {
      if (title.includes('Assortment')) return '/distributor/matrix';
      if (title.includes('Wallet')) return '/distributor/orders';
      if (title.includes('Showroom 360')) return '/distributor/showrooms';
      if (title.includes('Heatmap')) return '/distributor/analytics';
      if (title.includes('VMI')) return '/distributor/orders';
      if (title.includes('Escrow')) return '/distributor/orders';
      if (title.includes('Customs Gateway')) return '/distributor/matrix';
      if (tab === 'commerce') return '/distributor/orders';
      if (tab === 'strategy') return '/distributor/analytics';
      return '/distributor';
    }

    if (role === 'shop') {
      if (title.includes('Assortment')) return '/shop/b2b/matrix';
      if (title.includes('Re-orders')) return '/shop/b2b/orders';
      if (title.includes('Wallet')) return '/shop/finance';
      if (title.includes('QR-Ordering')) return '/shop/promotions';
      if (title.includes('Generator')) return '/shop/promotions';
      if (title.includes('Showroom 360')) return '/shop/b2b/collections';
      if (title.includes('VMI')) return '/shop/inventory';
      if (title.includes('Dropshipping')) return '/shop/b2b/orders';
      if (title.includes('Escrow')) return '/shop/b2b/orders';
      if (tab === 'commerce') return '/shop/b2b/orders';
      return '/shop/b2b';
    }

    if (role === 'manufacturer' || role === 'supplier') {
      if (title.includes('Wallet')) return '/factory/finance';
      if (title.includes('Escrow')) return '/factory/finance';
      if (title.includes('Trend-to-Production')) return '/factory/production';
      if (title.includes('Sustainability')) return '/factory/production';
      if (title.includes('Customs Gateway')) return '/factory/inventory';
      if (tab === 'commerce') return '/factory/orders';
      return '/factory';
    }

    if (role === 'admin') {
      if (title.includes('Assortment')) return '/admin/brands';
      if (title.includes('Re-orders')) return '/admin/billing';
      if (title.includes('Wallet')) return '/admin/billing';
      if (title.includes('QR-Ordering')) return '/admin/promotions';
      if (title.includes('Heatmap')) return '/admin/activity';
      if (title.includes('Generator')) return '/admin/media-library';
      if (title.includes('Showroom 360')) return '/admin/showroom';
      if (title.includes('Boutiques')) return '/admin/media-library';
      if (title.includes('Trend-to-Production')) return '/admin/activity';
      if (title.includes('VMI')) return '/admin/billing';
      if (title.includes('Dropshipping')) return '/admin/billing';
      if (title.includes('Escrow')) return '/admin/billing';
      if (title.includes('Sustainability')) return '/admin/quality';
      if (title.includes('Customs Gateway')) return '/admin/activity';
      if (tab === 'commerce') return '/admin/billing';
      if (tab === 'strategy') return '/admin/activity';
      if (tab === 'marketing') return '/admin/media-library';
      if (tab === 'law') return '/admin/billing';
      return '/admin/home';
    }
    
    return config.basePath || "/";
  };

  const groupedItems = useMemo(() => {
    const items = ECOSYSTEM_ITEMS[activeEcosystemTab] || [];
    const groups: Record<string, any[]> = { commerce: [], strategy: [], marketing: [], law: [] };
    
    items.forEach((item, idx) => {
      let flow = (item as any).flow;
      if (!flow) {
        if (idx < 5) flow = "commerce";
        else if (idx < 10) flow = "strategy";
        else if (idx < 15) flow = "marketing";
        else flow = "law";
      }
      if (groups[flow]) groups[flow].push({ ...item, originalIdx: idx });
    });
    return groups;
  }, [activeEcosystemTab]);

  const activeTabConnections = useMemo(() => {
    const items = ECOSYSTEM_ITEMS[activeEcosystemTab] || [];
    const itemsMap = new Map(items.map((it, idx) => {
      let flow = (it as any).flow;
      if (!flow) {
        if (idx < 5) flow = "commerce";
        else if (idx < 10) flow = "strategy";
        else if (idx < 15) flow = "marketing";
        else flow = "law";
      }
      return [it.title, { ...it, idx, flow }];
    }));
    
    const conns: any[] = [];
    Object.entries(ECOSYSTEM_FLOW_CONNECTIONS).forEach(([sourceTitle, targets]) => {
      const source = itemsMap.get(sourceTitle);
      if (!source) return;
      
      targets.forEach(t => {
        const target = itemsMap.get(t.target);
        if (!target) return;
        
        if (activeFlowRole === "all") {
          if (t.roles && t.roles.length > 0) return;
        } else {
          if (t.roles) {
            if (!t.roles.includes(activeFlowRole)) return;
          } else {
            const sourceItem = items.find(it => it.title === sourceTitle);
            const targetItem = items.find(it => it.title === t.target);
            if (!sourceItem?.roles?.includes(activeFlowRole) || !targetItem?.roles?.includes(activeFlowRole)) return;
          }
        }

        conns.push({
          source: sourceTitle,
          target: t.target,
          label: t.label,
          desc: (t as any).desc,
          roles: t.roles,
          sourceFlow: source.flow,
          targetFlow: target.flow,
          sourceIdx: source.idx,
          targetIdx: target.idx
        });
      });
    });
    return conns;
  }, [activeEcosystemTab, activeFlowRole]);

  useEffect(() => {
    let rafId: number;
    
    const updateConnections = () => {
      if (!containerRef.current || !hoveredItemId) {
        setConnections([]);
        return;
      }

      const containerEl = containerRef.current;
      const allElements = Array.from(containerEl.querySelectorAll('[data-item-title]'));
      const containerRect = containerEl.getBoundingClientRect();

      const hoveredEl = allElements.find(el => el.getAttribute('data-item-title') === hoveredItemId);
      if (!hoveredEl) return;
      const hRect = hoveredEl.getBoundingClientRect();

      const newConnections = activeTabConnections
        .map(conn => {
          const isSourceHovered = hoveredItemId === conn.source;
          const isTargetHovered = hoveredItemId === conn.target;
          
          if (!isSourceHovered && !isTargetHovered) return null;

          const relatedTitle = isSourceHovered ? conn.target : conn.source;
          const relatedEl = allElements.find(el => el.getAttribute('data-item-title') === relatedTitle);
          
          if (!relatedEl) return null;

          const rRect = relatedEl.getBoundingClientRect();
          
          const hX_mid = hRect.left + hRect.width / 2 - containerRect.left;
          const hY_mid = hRect.top + hRect.height / 2 - containerRect.top;
          const rX_mid = rRect.left + rRect.width / 2 - containerRect.left;
          const rY_mid = rRect.top + rRect.height / 2 - containerRect.top;

          let x1, y1, x2, y2, d, midLabelX, midLabelY;
          
          // Горизонтальная связь: тот же поток и на одной визуальной линии
          const isHorizontal = conn.sourceFlow === conn.targetFlow && Math.abs(hY_mid - rY_mid) < 50;

          if (isHorizontal) {
            const midY = (hY_mid + rY_mid) / 2;
            y1 = midY;
            y2 = midY; // Строго горизонтально по центру обоих блоков
            if (hX_mid < rX_mid) {
              x1 = hRect.right - containerRect.left;
              x2 = rRect.left - containerRect.left;
            } else {
              x1 = hRect.left - containerRect.left;
              x2 = rRect.right - containerRect.left;
            }
            const midX = x1 + (x2 - x1) * 0.5;
            d = `M ${x1} ${y1} L ${x2} ${y2}`;
            midLabelX = midX;
            midLabelY = midY;
          } else {
            // Вертикальная связь: V-H-V путь
            x1 = hX_mid;
            x2 = rX_mid;
            
            if (hY_mid < rY_mid) {
              // Источник выше цели -> входит в ВЕРХНЮЮ стенку
              y1 = hRect.bottom - containerRect.top;
              y2 = rRect.top - containerRect.top;
              midLabelY = y2 - 25; // Увеличен отступ, чтобы не наезжать на блок
            } else {
              // Источник ниже цели -> входит в НИЖНЮЮ стенку
              y1 = hRect.top - containerRect.top;
              y2 = rRect.bottom - containerRect.top;
              midLabelY = y2 + 25; // Увеличен отступ
            }
            
            const midY = y1 + (y2 - y1) * 0.5;
            d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
            midLabelX = x2;
          }
          
          return { 
            d,
            x1, y1, x2, y2,
            midLabelX, midLabelY,
            label: conn.label,
            desc: conn.desc,
            sourceTitle: conn.source,
            targetTitle: relatedTitle,
            isHighlighted: true,
            isIncoming: isTargetHovered
          };
        })
        .filter(Boolean);

      setConnections(newConnections);
    };

    rafId = requestAnimationFrame(updateConnections);
    return () => cancelAnimationFrame(rafId);
  }, [hoveredItemId, activeEcosystemTab, activeTabConnections, isFlowMapOpen]);

  const flowConfig: Record<string, { title: string; icon: any; color: string; desc: string }> = {
    commerce: { title: "Коммерция", icon: ShoppingCart, color: "text-rose-500", desc: "Управление продажами и стоком." },
    strategy: { title: "Стратегия", icon: Activity, color: "text-indigo-500", desc: "Интеллектуальное планирование." },
    marketing: { title: "Маркетинг", icon: Globe, color: "text-emerald-500", desc: "Продвижение и лояльность." },
    law: { title: "Безопасность", icon: Shield, color: "text-amber-500", desc: "Правовая защита и комплаенс." }
  };

  return (
    <motion.section
      id="ECOSYSTEM_b2b"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="section-spacing bg-transparent relative"
    >
      <div className="container mx-auto px-4">
        <Card className="bg-white border-none rounded-xl shadow-2xl shadow-slate-200/50 relative border border-slate-100">
          <CardContent className="p-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs border-slate-200 text-slate-900 uppercase font-bold tracking-normal px-2 py-0.5">ECOSYSTEM_b2b</Badge>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-slate-900 leading-tight">ЦИФРОВАЯ ЭКОСИСТЕМА</h2>
                <p className="text-slate-400 font-medium text-xs max-w-md">Инструменты для масштабирования и управления бизнесом.</p>
              </div>
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setIsFlowMapOpen("ecosystem")} className="h-9 w-9 rounded-xl border-slate-200 hover:border-slate-900 transition-all bg-white shadow-sm">
                        <Share2 className="h-4 w-4 text-indigo-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 text-white border-none p-2 rounded-lg shadow-2xl"><p className="text-[10px] font-bold uppercase tracking-wide">Карта процессов</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex items-center gap-2 ml-1 border-l border-slate-100 pl-3">
                  <button onClick={() => { const el = document.getElementById("ecosystem-scroll"); if (el) el.scrollBy({ left: -320, behavior: "smooth" }); }} className="text-slate-400 hover:text-slate-900 transition-colors p-1"><ArrowRight className="h-5 w-5 rotate-180" /></button>
                  <button onClick={() => { const el = document.getElementById("ecosystem-scroll"); if (el) el.scrollBy({ left: 320, behavior: "smooth" }); }} className="text-slate-400 hover:text-slate-900 transition-colors p-1"><ArrowRight className="h-5 w-5" /></button>
                </div>
              </div>
            </div>

            <div className="flex overflow-x-auto pb-2 mb-6 gap-2 custom-scrollbar no-scrollbar snap-x">
              <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-100 w-fit shrink-0">
                {ECOSYSTEM_TABS.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveEcosystemTab(tab.id)} className={cn("btn-tab snap-start min-w-[140px]", activeEcosystemTab === tab.id ? "btn-tab-active" : "btn-tab-inactive")}>{tab.title}</button>
                ))}
              </div>
            </div>

            <div className="relative group/ecosystem -mx-4 px-4 mb-6">
              <div id="ecosystem-scroll" className="flex overflow-x-auto pb-3 gap-3 custom-scrollbar snap-x snap-mandatory scroll-smooth">
                <AnimatePresence mode="wait">
                  <motion.div key={activeEcosystemTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex gap-3">
                    {ECOSYSTEM_ITEMS[activeEcosystemTab].map((item, idx) => (
                      <div key={idx} className="flex-shrink-0 w-[280px] md:w-[320px] p-4 pb-3 rounded-3xl bg-slate-50 border border-slate-100 snap-start transition-all hover:border-slate-900/30 hover:shadow-xl hover:shadow-slate-200/50 flex flex-col group/card relative">
                        <div className="absolute top-4 right-4 z-20">
                          <div className="flex items-center gap-1.5">
                            {item.badge && <Badge className={cn("text-[7px] font-bold uppercase tracking-wide border-none px-1.5 h-5 flex items-center shadow-lg", item.badge === 'AI' ? "bg-indigo-600 text-white" : "bg-rose-500 text-white")}>{item.badge}</Badge>}
                            {(item.roles || ["admin"]).map((role) => {
                              const config = ROLE_CONFIG[role as B2BRole];
                              if (!config) return null;
                              return (
                                  <TooltipProvider key={role}>
                                    <Tooltip>
                                      <TooltipTrigger asChild><div className={cn("p-1.5 rounded-lg bg-white shadow-sm border border-slate-100", config.color)}><config.icon className="h-3 w-3" /></div></TooltipTrigger>
                                      <TooltipContent className="bg-slate-900 text-white border-none p-2 rounded-lg shadow-2xl"><p className="text-[10px] font-bold uppercase tracking-wide">{config.label}</p></TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                              );
                            })}
                          </div>
                        </div>
                        <div className="space-y-1 mb-2">
                          <p className="text-[5.5px] font-bold uppercase text-indigo-600 tracking-wide opacity-60">
                            {item.label}
                          </p>
                          <h4 className="text-[10px] font-bold uppercase text-slate-900 tracking-wide leading-none group-hover/card:text-indigo-600 transition-colors">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{item.desc}</p>
                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-center">
                          <Button asChild variant="ctaOutline" size="ctaSm" className="w-[180px] mx-auto group/btn">
                            <Link href={item.link}>{item.action}<ArrowRight className="h-3 w-3 ml-2 transition-transform group-hover/btn:translate-x-1" /></Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <Dialog open={isFlowMapOpen === "ecosystem"} onOpenChange={(open) => setIsFlowMapOpen(open ? "ecosystem" : null)}>
              <DialogContent className="max-w-[98vw] max-h-[96vh] bg-slate-50 border-none rounded-xl p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.1)] z-[10000] flex flex-col">
                <DialogHeader className="p-4 pb-2 border-b border-slate-200/50 bg-white shrink-0">
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"><Share2 className="h-5 w-5" /></div>
                      <div>
                        <DialogTitle className="text-sm font-semibold uppercase tracking-tight text-slate-900 leading-none">Карта сквозных процессов экосистемы</DialogTitle>
                        <div className="flex items-center gap-3 mt-1.5">
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide leading-none">Визуализация взаимодействия цифровых инструментов</p>
                          <button onClick={() => setActiveGuideStep(0)} className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 shadow-sm group/guide"><HelpCircle className="h-2.5 w-2.5" /><span className="text-[10px] font-bold uppercase tracking-wide">Обучение</span></button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex overflow-x-auto pb-1 gap-2 no-scrollbar">
                        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 w-fit shrink-0">
                          {ECOSYSTEM_TABS.map((tab) => (
                            <button key={tab.id} onClick={() => setActiveEcosystemTab(tab.id)} className={cn("btn-tab px-4 py-1.5", activeEcosystemTab === tab.id ? "btn-tab-active" : "btn-tab-inactive")}>{tab.title}</button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 w-fit">
                        <button onClick={() => setActiveFlowRole("all")} className={cn("btn-tab px-4 py-1.5", activeFlowRole === "all" ? "btn-tab-active" : "btn-tab-inactive")}>Все роли</button>
                        {(Object.entries(ROLE_CONFIG) as [B2BRole, any][]).map(([role, config]) => (
                          <button key={role} onClick={() => setActiveFlowRole(role)} className={cn("px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-normal transition-all flex items-center gap-2 border", activeFlowRole === role ? cn("bg-white shadow-md border-slate-200", config.color) : "text-slate-400 hover:text-slate-600 border-transparent hover:bg-white")}><config.icon className="h-3.5 w-3.5" /><span className="hidden lg:inline">{config.label}</span></button>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto pt-10 px-8 pb-10 space-y-6 bg-slate-50/50 relative no-scrollbar" ref={containerRef}>
                  <svg className="absolute inset-0 pointer-events-none z-0 w-full h-full">
                    <defs><filter id="glow-eco" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter></defs>
                    <AnimatePresence>
                      {connections.filter(conn => conn.isHighlighted).map((conn, idx) => (
                        <g key={`${conn.sourceTitle}-${conn.targetTitle}-${idx}`}>
                          <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1, stroke: "#6366f1" }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }} d={conn.d} stroke="#6366f1" strokeWidth="2.5" fill="none" />
                          <motion.circle r="3" fill="#6366f1" filter="url(#glow-eco)"><animateMotion dur="2s" repeatCount="indefinite" path={conn.d} /></motion.circle>
                        </g>
                      ))}
                    </AnimatePresence>
                  </svg>

                  <div className="absolute inset-0 pointer-events-none z-[60] w-full h-full">
                    <AnimatePresence>
                      {connections.filter(c => c.isHighlighted).map((conn, idx) => (
                        <motion.div key={`label-${conn.sourceTitle}-${conn.targetTitle}-${idx}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute flex items-center justify-center" style={{ left: conn.midLabelX, top: conn.midLabelY, width: 0, height: 0 }}>
                          <div className="bg-indigo-600 text-white text-[5.5px] font-bold uppercase px-2.5 py-1 rounded-full shadow-2xl border border-white/20 whitespace-nowrap">{conn.label}</div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {(Object.entries(flowConfig) as [string, any][]).map(([flowKey, config]) => {
                    const displayItems = groupedItems[flowKey] || [];
                    if (displayItems.length === 0) return null;
                    return (
                      <div key={flowKey} className={cn("relative transition-all duration-500", activeGuideStep !== null && ECOSYSTEM_GUIDE[activeGuideStep]?.target !== `flow-${flowKey}` && "opacity-30 blur-[2px]")} id={`flow-${flowKey}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={cn("flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-sm", config.color)}><config.icon className="h-3 w-3" /><span className="text-[5.5px] font-bold uppercase tracking-wide">{config.title}</span></div>
                          <div className="h-px flex-1 bg-slate-200" />
                        </div>
                        <div className="flex flex-wrap gap-x-1.5 gap-y-6">
                          {displayItems.map((item, idx, array) => {
                            const isRoleActive = activeFlowRole === "all" || (item.roles && item.roles.includes(activeFlowRole));
                            const isHovered = hoveredItemId === item.title;
                            const itemConnections = activeTabConnections.filter(c => c.source === item.title || c.target === item.title);
                            const activeConnection = hoveredItemId ? itemConnections.find(c => c.source === hoveredItemId || c.target === hoveredItemId) : null;
                            const isRelated = !!activeConnection;
                            
                            return (
                              <div key={idx} className="contents">
                                {item.breakBefore && <div className="basis-full h-0" />}
                                <div className={cn("relative flex items-center transition-all duration-500", !isRoleActive && !isRelated && "opacity-20 grayscale scale-[0.98]", isRelated && "opacity-100 grayscale-0 scale-[1.02]")}>
                                  <div 
                                    className={cn("w-[170px] bg-white p-2 rounded-2xl border border-slate-200 shadow-sm transition-all group/card-inner relative cursor-pointer hover:border-indigo-400 hover:shadow-md", isHovered ? "border-indigo-600 shadow-xl z-40" : isRelated ? "animate-pulse-subtle border-indigo-400 shadow-lg z-20" : "z-10")}
                                    onMouseEnter={() => setHoveredItemId(item.title)} onMouseLeave={() => setHoveredItemId(null)} onClick={() => item.teaser ? setActiveTeaser(item) : null} data-item-title={item.title}
                                  >
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                      <div className={cn("h-3.5 w-3.5 rounded-md border flex items-center justify-center font-bold text-[5.5px] bg-white border-current", isRoleActive ? config.color : "text-slate-300")}>{item.originalIdx + 1}</div>
                                      <span className={cn("text-[5.5px] font-bold uppercase tracking-wide opacity-60 line-clamp-1", isRoleActive ? config.color : "text-slate-300")}>{item.label}</span>
                                      {isRoleActive && activeFlowRole !== "all" && <div className="ml-auto opacity-40">{(() => { const RoleIcon = ROLE_CONFIG[activeFlowRole].icon; return <RoleIcon className={cn("h-2.5 w-2.5", ROLE_CONFIG[activeFlowRole].color)} />; })()}</div>}
                                    </div>
                                    {isRoleActive && (
                                      <TooltipProvider><Tooltip><TooltipTrigger asChild><button onClick={(e) => { e.stopPropagation(); setActiveTeaser(item); }} className="absolute top-2 right-2 p-1.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-slate-100 z-50 group/teaser"><Eye className="h-2.5 w-2.5" /></button></TooltipTrigger><TooltipContent className="bg-slate-900 text-white border-none p-2 rounded-lg shadow-2xl z-[15000]"><p className="text-[10px] font-bold uppercase tracking-wide">Подробнее</p></TooltipContent></Tooltip></TooltipProvider>
                                    )}
                                    <TooltipProvider><Tooltip><TooltipTrigger asChild><h3 className={cn("text-[10px] font-bold uppercase tracking-wide mb-2 pr-6 line-clamp-2 leading-none min-h-[20px] cursor-help", isRoleActive ? "text-slate-900" : "text-slate-300")}>{item.title}</h3></TooltipTrigger><TooltipContent className="bg-slate-900 text-white border-none p-3 rounded-xl shadow-2xl max-w-[240px] z-[15000]"><p className="text-[10px] font-bold uppercase tracking-wide text-indigo-400 mb-1">{item.label}</p><p className="text-xs leading-relaxed font-medium">{item.desc}</p></TooltipContent></Tooltip></TooltipProvider>
                                    <div className="flex flex-wrap gap-1 mt-auto">
                                      {(item.roles || ["admin"]).map((role) => { const config = ROLE_CONFIG[role as B2BRole]; if (!config) return null; const isTargetRole = role === effectiveRole; return <div key={role} className={cn("p-1 rounded bg-slate-50 border border-slate-100", config.color, !isTargetRole && "opacity-20 grayscale")}><config.icon className="h-2.5 w-2.5" /></div>; })}
                                    </div>
                                  </div>
                                  {idx < array.length - 1 && (() => {
                                    const nextItem = array[idx + 1];
                                    const horizontalConn = activeTabConnections.find(c => 
                                      ((item.title === c.source && nextItem.title === c.target) || (item.title === c.target && nextItem.title === c.source))
                                    );
                                    const isExpansionActive = hoveredItemId && horizontalConn && (hoveredItemId === item.title || hoveredItemId === nextItem.title);
                                    return (
                                      <div className={cn("flex items-center justify-center transition-all duration-500 relative shrink-0", isExpansionActive ? "w-[140px]" : "w-4 mx-0")}>
                                        {!isExpansionActive && <ArrowRight className="h-2 w-2 text-slate-300" />}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="shrink-0 bg-white border-t border-slate-200">
                  <div className="p-3 flex items-center justify-center gap-3">
                    <div className="flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]" /><span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wide">Цифровой ритейл</span></div>
                    <div className="flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.3)]" /><span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wide">BI-аналитика</span></div>
                    <div className="flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" /><span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wide">Медиа-активы</span></div>
                  </div>
                  <div className="p-4 bg-slate-900 border-t border-white/10 min-h-[100px] transition-all duration-500">
                    <AnimatePresence mode="wait">
                      {hoveredItemId ? (
                        <motion.div key={hoveredItemId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3">
                          <div className="flex items-center gap-3" id="synergy-info"><div className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5"><Info className="h-2.5 w-2.5" /> Экосистема: {hoveredItemId}</div>{SYNERGY_CONNECTIONS[hoveredItemId] && <div className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 animate-pulse"><Zap className="h-2.5 w-2.5" /> Эффект Синергии</div>}</div>
                          <div className="grid grid-cols-2 gap-3">
                            {connections.some(c => c.isHighlighted) || SYNERGY_CONNECTIONS[hoveredItemId] ? (
                              <>
                                {connections.filter(c => c.isHighlighted).map((c, i) => (
                                  <div key={i} className="flex gap-3 group/mon-item border-l border-white/5 pl-3 hover:border-indigo-500/50 transition-colors"><div className="shrink-0 mt-1">{c.isIncoming ? <ArrowDownLeft className="h-3 w-3 text-emerald-400" /> : <ArrowUpRight className="h-3 w-3 text-indigo-400" />}</div><div className="space-y-1"><div className="flex items-center gap-2"><span className="text-[7px] font-bold text-white uppercase tracking-tighter">{c.label}</span><span className="text-[6px] text-white/30 uppercase font-bold tracking-wide">{c.isIncoming ? '← от ' : '→ к '} {c.targetTitle}</span></div><p className="text-[10px] text-slate-400 leading-tight font-medium max-w-sm">{c.desc || "Интеграция цифрового сервиса в общую архитектуру экосистемы."}</p></div></div>
                                ))}
                                {SYNERGY_CONNECTIONS[hoveredItemId] && <div className="flex gap-3 group/mon-item border-l border-amber-500/30 pl-3 bg-amber-500/5 rounded-r-lg py-1 transition-colors col-span-2"><div className="shrink-0 mt-1"><Zap className="h-3 w-3 text-amber-400" /></div><div className="space-y-1"><div className="flex items-center gap-2"><span className="text-[7px] font-bold text-amber-400 uppercase tracking-tighter">⚡ {SYNERGY_CONNECTIONS[hoveredItemId].label} (Кросс-системная связь)</span><span className="text-[6px] text-amber-400/40 uppercase font-bold tracking-wide">→ в Производственную Матрицу: {SYNERGY_CONNECTIONS[hoveredItemId].target}</span></div><p className="text-[10px] text-amber-200/70 leading-tight font-medium max-w-2xl">{SYNERGY_CONNECTIONS[hoveredItemId].desc}</p></div></div>}
                              </>
                            ) : (<div className="col-span-2 text-[10px] text-slate-500 uppercase font-bold tracking-wider py-2 italic opacity-50">Внешние кросс-потоковые связи для данного узла не обнаружены...</div>)}
                          </div>
                        </motion.div>
                      ) : (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} className="flex items-center justify-center h-full text-slate-500 text-[10px] font-medium uppercase tracking-wide py-4">Ожидание выбора узла экосистемы для анализа...</motion.div>)}
                    </AnimatePresence>
                  </div>
                </div>

                <AnimatePresence>
                  {activeGuideStep !== null && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[20000] pointer-events-none overflow-hidden">
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-4 pointer-events-auto border border-slate-100 relative">
                          <button onClick={() => setActiveGuideStep(null)} className="absolute top-4 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-400 transition-colors"><X className="h-5 w-5" /></button>
                          <div className="flex items-center gap-3 mb-6"><div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200"><HelpCircle className="h-5 w-5 text-white" /></div><div><p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-0.5">Шаг {activeGuideStep + 1} из {ECOSYSTEM_GUIDE.length}</p><h4 className="text-base font-semibold uppercase tracking-tight text-slate-900 leading-none">{ECOSYSTEM_GUIDE[activeGuideStep].title}</h4></div></div>
                          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{ECOSYSTEM_GUIDE[activeGuideStep].desc}</p>
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex gap-1.5">{ECOSYSTEM_GUIDE.map((_, i) => (<div key={i} className={cn("h-1 rounded-full transition-all duration-500", i === activeGuideStep ? "w-6 bg-indigo-600" : "w-1 bg-slate-200")} />))}</div>
                            <div className="flex items-center gap-3">{activeGuideStep > 0 && (<Button variant="ghost" size="sm" onClick={() => setActiveGuideStep(prev => prev !== null ? prev - 1 : null)}>Назад</Button>)}<Button variant="cta" size="ctaSm" onClick={() => { if (activeGuideStep < ECOSYSTEM_GUIDE.length - 1) { setActiveGuideStep(prev => prev !== null ? prev + 1 : null); } else { setActiveGuideStep(null); } }}>{activeGuideStep === ECOSYSTEM_GUIDE.length - 1 ? "Завершить" : "Далее"}<ChevronRight className="h-3 w-3 ml-2" /></Button></div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Dialog open={!!activeTeaser} onOpenChange={(open) => !open && setActiveTeaser(null)}>
                  <DialogContent className="max-w-3xl bg-white border-none rounded-xl p-0 overflow-hidden shadow-2xl z-[30000]">
                    {activeTeaser && (
                      <>
                        <DialogHeader className="sr-only"><DialogTitle>{activeTeaser.title}</DialogTitle></DialogHeader>
                        <div className="flex flex-col md:flex-row h-full max-h-[80vh]">
                          <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden bg-slate-900">
                            <img src={activeTeaser.teaser.image} alt={activeTeaser.title} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent" />
                            <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                              <div className="flex justify-between items-start">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-2xl"><div className="flex items-center gap-2 mb-2"><div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /><div className="h-1.5 w-12 bg-white/30 rounded-full" /></div><div className="space-y-1.5"><div className="h-1 w-20 bg-white/20 rounded-full" /><div className="h-1 w-12 bg-white/10 rounded-full" /></div></div>
                                <div className="px-2 py-1 rounded bg-indigo-500/40 backdrop-blur-md border border-indigo-400/50 text-[7px] font-bold text-white uppercase tracking-wide">Модуль: ACTIVE</div>
                              </div>
                              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"><div className="flex items-end gap-1 mb-3">{[40, 70, 45, 90, 65, 80, 50].map((h, i) => (<motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.1, duration: 1 }} className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-sm" style={{ height: `${h}%`, minHeight: '4px' }} />))}</div><div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 2, delay: 0.5 }} className="h-full bg-indigo-400" /></div></div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-white" />
                            <div className="absolute bottom-6 left-6 text-white md:hidden"><p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">{activeTeaser.label}</p><h3 className="text-sm font-semibold uppercase tracking-tight leading-none">{activeTeaser.title}</h3></div>
                          </div>
                          <div className="md:w-1/2 p-4 md:p-3 flex flex-col justify-center">
                            <div className="hidden md:block mb-6"><p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-2">{activeTeaser.label}</p><h3 className="text-base font-semibold uppercase tracking-tight text-slate-900 leading-none mb-2">{activeTeaser.title}</h3><p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{activeTeaser.teaser.subtitle}</p></div>
                            <div className="space-y-4 mb-8">{activeTeaser.teaser.features.map((feature: string, i: number) => (<div key={i} className="flex items-start gap-3"><div className="mt-1 h-4 w-4 rounded-full bg-emerald flex items-center justify-center shrink-0"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /></div><p className="text-slate-600 text-sm font-medium leading-snug">{feature}</p></div>))}</div>
                            <div className="flex items-center gap-2 mt-auto">{(() => { const isAccessGranted = activeTeaser.roles?.includes(effectiveRole); return (<Button asChild={isAccessGranted} disabled={!isAccessGranted} variant="cta" size="ctaSm" className={cn("flex-1", !isAccessGranted && "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50")}>{isAccessGranted ? (<Link href={getRolePath(effectiveRole as B2BRole, activeTeaser)} onClick={() => setIsFlowMapOpen(null)}>Попробовать в кабинете<ArrowUpRight className="h-3 w-3 ml-2" /></Link>) : (<div className="flex items-center justify-center gap-2">Команда не в доступе<Shield className="h-3 w-3" /></div>)}</Button>); })()}<Button variant="ctaOutline" size="ctaSm" onClick={() => setActiveTeaser(null)}>Закрыть</Button></div>
                          </div>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </DialogContent>
            </Dialog>

            <Card className="bg-slate-900 border-none rounded-xl relative min-h-[300px] flex items-center shadow-2xl group/banner overflow-hidden mt-6">
              <div className="absolute inset-0 opacity-50 transition-transform duration-1000 group-hover/banner:scale-105 rounded-xl overflow-hidden"><img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000" className="w-full h-full object-cover" /></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
              <CardContent className="relative z-10 p-4 space-y-6 max-w-4xl text-white">
                <div className="overflow-hidden whitespace-nowrap mb-4 py-2 border-y border-white/10 relative group/marquee"><motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 180, repeat: Infinity, ease: "linear" }} className="flex items-center gap-3 w-fit">{[1, 2].map((i) => (<div key={i} className="flex items-center gap-3 shrink-0"><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Глобальный Индекс Цен</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Ценообразование по спросу</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Омниканальный хаб</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Оптовый портал B2B</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• AI-мерчандайзинг</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Хаб Маркетплейсов</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Арбитраж Инвентаря</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• AI-ассистент гендиректора</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• BI-аналитика покупателей</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Панель KPI бренда</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Прогноз LTV & Оттока</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Виртуальные 3D-Витрины</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• AI-Локализация контента</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Рекламный кабинет 360°</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• AI-Подбор Размера</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Смарт-контракты</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Защита ИС (ДНК)</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• ESG-мониторинг</span><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Налоговый шлюз</span></div>))} </motion.div></div>
                <h2 className="text-xl md:text-3xl font-bold uppercase tracking-tight leading-tight">ЯДРО УПРАВЛЕНИЯ</h2>
                <p className="text-slate-300 text-sm font-medium border-l-2 border-indigo-500/50 pl-6 whitespace-nowrap">"Консолидация ресурсов и данных для доминирования на рынке."</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
