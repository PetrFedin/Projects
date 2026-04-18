'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Globe,
  ArrowRight,
  Shield,
  Store,
  Briefcase,
  Warehouse,
  ShoppingCart,
  Factory,
  Share2,
  Info,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  Settings2,
  Truck,
  Eye,
} from 'lucide-react';
import {
  ECOSYSTEM_TABS,
  ECOSYSTEM_ITEMS,
  ECOSYSTEM_FLOW_CONNECTIONS,
  SYNERGY_CONNECTIONS,
  ECOSYSTEM_GUIDE,
  type EcosystemTabId,
  type B2BRole,
} from '../_fixtures/b2b-data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUIState } from '@/providers/ui-state';
import { useAuth } from '@/providers/auth-provider';
import { Zap, HelpCircle, ChevronRight, X } from 'lucide-react';

const ROLE_CONFIG: Record<B2BRole, { label: string; icon: any; color: string; basePath: string }> =
  {
    admin: {
      label: 'Администратор',
      icon: Shield,
      color: 'text-accent-primary',
      basePath: '/admin',
    },
    brand: { label: 'Бренд', icon: Store, color: 'text-emerald-500', basePath: '/brand' },
    distributor: {
      label: 'Дистрибьютор',
      icon: Briefcase,
      color: 'text-blue-500',
      basePath: '/distributor',
    },
    manufacturer: {
      label: 'Производство',
      icon: Factory,
      color: 'text-orange-500',
      basePath: '/factory/production',
    },
    supplier: {
      label: 'Поставщик',
      icon: Warehouse,
      color: 'text-amber-500',
      basePath: '/factory/supplier',
    },
    shop: { label: 'Магазин', icon: ShoppingCart, color: 'text-rose-500', basePath: '/shop' },
  };

export function EcosystemSection() {
  const { isFlowMapOpen, setIsFlowMapOpen, viewRole: globalRole } = useUIState();
  const { user } = useAuth();
  const [activeEcosystemTab, setActiveEcosystemTab] = useState<EcosystemTabId>('commerce');

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

  const [activeFlowRole, setActiveFlowRole] = useState<B2BRole | 'all'>('all');
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
      if (title.includes('Wallet')) return '/factory/production/finance';
      if (title.includes('Escrow')) return '/factory/production/finance';
      if (title.includes('Trend-to-Production')) return '/factory/production';
      if (title.includes('Sustainability')) return '/factory/production';
      if (title.includes('Customs Gateway')) return '/factory/production/inventory';
      if (tab === 'commerce') return '/factory/production/orders';
      return '/factory/production';
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

    return config.basePath || '/';
  };

  const groupedItems = useMemo(() => {
    const items = ECOSYSTEM_ITEMS[activeEcosystemTab] || [];
    const groups: Record<string, any[]> = { commerce: [], strategy: [], marketing: [], law: [] };

    items.forEach((item, idx) => {
      let flow = (item as any).flow;
      if (!flow) {
        if (idx < 5) flow = 'commerce';
        else if (idx < 10) flow = 'strategy';
        else if (idx < 15) flow = 'marketing';
        else flow = 'law';
      }
      if (groups[flow]) groups[flow].push({ ...item, originalIdx: idx });
    });
    return groups;
  }, [activeEcosystemTab]);

  const activeTabConnections = useMemo(() => {
    const items = ECOSYSTEM_ITEMS[activeEcosystemTab] || [];
    const itemsMap = new Map(
      items.map((it, idx) => {
        let flow = (it as any).flow;
        if (!flow) {
          if (idx < 5) flow = 'commerce';
          else if (idx < 10) flow = 'strategy';
          else if (idx < 15) flow = 'marketing';
          else flow = 'law';
        }
        return [it.title, { ...it, idx, flow }];
      })
    );

    const conns: any[] = [];
    Object.entries(ECOSYSTEM_FLOW_CONNECTIONS).forEach(([sourceTitle, targets]) => {
      const source = itemsMap.get(sourceTitle);
      if (!source) return;

      targets.forEach((t) => {
        const target = itemsMap.get(t.target);
        if (!target) return;

        if (activeFlowRole === 'all') {
          if (t.roles && t.roles.length > 0) return;
        } else {
          if (t.roles) {
            if (!t.roles.includes(activeFlowRole)) return;
          } else {
            const sourceItem = items.find((it) => it.title === sourceTitle);
            const targetItem = items.find((it) => it.title === t.target);
            if (
              !sourceItem?.roles?.includes(activeFlowRole) ||
              !targetItem?.roles?.includes(activeFlowRole)
            )
              return;
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
          targetIdx: target.idx,
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

      const hoveredEl = allElements.find(
        (el) => el.getAttribute('data-item-title') === hoveredItemId
      );
      if (!hoveredEl) return;
      const hRect = hoveredEl.getBoundingClientRect();

      const newConnections = activeTabConnections
        .map((conn) => {
          const isSourceHovered = hoveredItemId === conn.source;
          const isTargetHovered = hoveredItemId === conn.target;

          if (!isSourceHovered && !isTargetHovered) return null;

          const relatedTitle = isSourceHovered ? conn.target : conn.source;
          const relatedEl = allElements.find(
            (el) => el.getAttribute('data-item-title') === relatedTitle
          );

          if (!relatedEl) return null;

          const rRect = relatedEl.getBoundingClientRect();

          const hX_mid = hRect.left + hRect.width / 2 - containerRect.left;
          const hY_mid = hRect.top + hRect.height / 2 - containerRect.top;
          const rX_mid = rRect.left + rRect.width / 2 - containerRect.left;
          const rY_mid = rRect.top + rRect.height / 2 - containerRect.top;

          let x1, y1, x2, y2, d, midLabelX, midLabelY;

          // Горизонтальная связь: тот же поток и на одной визуальной линии
          const isHorizontal =
            conn.sourceFlow === conn.targetFlow && Math.abs(hY_mid - rY_mid) < 50;

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
            x1,
            y1,
            x2,
            y2,
            midLabelX,
            midLabelY,
            label: conn.label,
            desc: conn.desc,
            sourceTitle: conn.source,
            targetTitle: relatedTitle,
            isHighlighted: true,
            isIncoming: isTargetHovered,
          };
        })
        .filter(Boolean);

      setConnections(newConnections);
    };

    rafId = requestAnimationFrame(updateConnections);
    return () => cancelAnimationFrame(rafId);
  }, [hoveredItemId, activeEcosystemTab, activeTabConnections, isFlowMapOpen]);

  const flowConfig: Record<string, { title: string; icon: any; color: string; desc: string }> = {
    commerce: {
      title: 'Коммерция',
      icon: ShoppingCart,
      color: 'text-rose-500',
      desc: 'Управление продажами и стоком.',
    },
    strategy: {
      title: 'Стратегия',
      icon: Activity,
      color: 'text-accent-primary',
      desc: 'Интеллектуальное планирование.',
    },
    marketing: {
      title: 'Маркетинг',
      icon: Globe,
      color: 'text-emerald-500',
      desc: 'Продвижение и лояльность.',
    },
    law: {
      title: 'Безопасность',
      icon: Shield,
      color: 'text-amber-500',
      desc: 'Правовая защита и комплаенс.',
    },
  };

  return (
    <motion.section
      id="ECOSYSTEM_b2b"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="section-spacing relative bg-transparent"
    >
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <Card className="border-border-subtle relative rounded-xl border border-none bg-white shadow-2xl shadow-md">
          <CardContent className="p-3">
            <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="bg-text-primary flex h-8 w-8 items-center justify-center rounded-xl">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-border-default text-text-primary px-2 py-0.5 text-xs font-bold uppercase tracking-normal"
                  >
                    ECOSYSTEM_b2b
                  </Badge>
                </div>
                <h2 className="text-text-primary text-2xl font-bold uppercase leading-tight tracking-tight md:text-4xl">
                  ЦИФРОВАЯ ЭКОСИСТЕМА
                </h2>
                <p className="text-text-muted max-w-md text-xs font-medium">
                  Инструменты для масштабирования и управления бизнесом.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsFlowMapOpen('ecosystem')}
                        className="border-border-default hover:border-text-primary h-9 w-9 rounded-xl bg-white shadow-sm transition-all"
                      >
                        <Share2 className="text-accent-primary h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-text-primary rounded-lg border-none p-2 text-white shadow-2xl">
                      <p className="text-[10px] font-bold uppercase tracking-wide">
                        Карта процессов
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="border-border-subtle ml-1 flex items-center gap-2 border-l pl-3">
                  <button
                    onClick={() => {
                      const el = document.getElementById('ecosystem-scroll');
                      if (el) el.scrollBy({ left: -320, behavior: 'smooth' });
                    }}
                    className="text-text-muted hover:text-text-primary p-1 transition-colors"
                  >
                    <ArrowRight className="h-5 w-5 rotate-180" />
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('ecosystem-scroll');
                      if (el) el.scrollBy({ left: 320, behavior: 'smooth' });
                    }}
                    className="text-text-muted hover:text-text-primary p-1 transition-colors"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="custom-scrollbar no-scrollbar mb-6 flex snap-x gap-2 overflow-x-auto pb-2">
              <div className="bg-bg-surface2 border-border-subtle flex w-fit shrink-0 items-center gap-1.5 rounded-2xl border p-1">
                {ECOSYSTEM_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveEcosystemTab(tab.id)}
                    className={cn(
                      'btn-tab min-w-[140px] snap-start',
                      activeEcosystemTab === tab.id ? 'btn-tab-active' : 'btn-tab-inactive'
                    )}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="group/ecosystem relative -mx-4 mb-6 px-4">
              <div
                id="ecosystem-scroll"
                className="custom-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-3"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeEcosystemTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-3"
                  >
                    {ECOSYSTEM_ITEMS[activeEcosystemTab].map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-bg-surface2 border-border-subtle hover:border-text-primary/30 group/card relative flex w-[280px] flex-shrink-0 snap-start flex-col rounded-3xl border p-4 pb-3 transition-all hover:shadow-md hover:shadow-xl md:w-[320px]"
                      >
                        <div className="absolute right-4 top-4 z-20">
                          <div className="flex items-center gap-1.5">
                            {item.badge && (
                              <Badge
                                className={cn(
                                  'flex h-5 items-center border-none px-1.5 text-[7px] font-bold uppercase tracking-wide shadow-lg',
                                  item.badge === 'AI'
                                    ? 'bg-accent-primary text-white'
                                    : 'bg-rose-500 text-white'
                                )}
                              >
                                {item.badge}
                              </Badge>
                            )}
                            {(item.roles || ['admin']).map((role: B2BRole) => {
                              const config = ROLE_CONFIG[role as B2BRole];
                              if (!config) return null;
                              return (
                                <TooltipProvider key={role}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className={cn(
                                          'border-border-subtle rounded-lg border bg-white p-1.5 shadow-sm',
                                          config.color
                                        )}
                                      >
                                        <config.icon className="h-3 w-3" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-text-primary rounded-lg border-none p-2 text-white shadow-2xl">
                                      <p className="text-[10px] font-bold uppercase tracking-wide">
                                        {config.label}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })}
                          </div>
                        </div>
                        <div className="mb-2 space-y-1">
                          <p className="text-accent-primary text-[5.5px] font-bold uppercase tracking-wide opacity-60">
                            {item.label}
                          </p>
                          <h4 className="text-text-primary group-hover/card:text-accent-primary text-[10px] font-bold uppercase leading-none tracking-wide transition-colors">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-text-secondary mb-4 text-xs font-medium leading-relaxed">
                          {item.desc}
                        </p>
                        <div className="border-border-subtle mt-auto flex items-center justify-center border-t pt-4">
                          <Button
                            asChild
                            variant="ctaOutline"
                            size="ctaSm"
                            className="group/btn mx-auto w-[180px]"
                          >
                            <Link href={item.link}>
                              {item.action}
                              <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <Dialog
              open={isFlowMapOpen === 'ecosystem'}
              onOpenChange={(open) => setIsFlowMapOpen(open ? 'ecosystem' : null)}
            >
              <DialogContent className="bg-bg-surface2 z-[10000] flex max-h-[96vh] max-w-[98vw] flex-col overflow-hidden rounded-xl border-none p-0 shadow-[0_0_50px_rgba(0,0,0,0.1)]">
                <DialogHeader className="border-border-default/50 shrink-0 border-b bg-white p-4 pb-2">
                  <div className="flex w-full flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 rounded-2xl border p-2 shadow-sm">
                        <Share2 className="h-5 w-5" />
                      </div>
                      <div>
                        <DialogTitle className="text-text-primary text-sm font-semibold uppercase leading-none tracking-tight">
                          Карта сквозных процессов экосистемы
                        </DialogTitle>
                        <div className="mt-1.5 flex items-center gap-3">
                          <p className="text-text-muted text-[10px] font-bold uppercase leading-none tracking-wide">
                            Визуализация взаимодействия цифровых инструментов
                          </p>
                          <button
                            onClick={() => setActiveGuideStep(0)}
                            className="bg-accent-primary/10 text-accent-primary hover:bg-accent-primary border-accent-primary/20 group/guide flex items-center gap-1.5 rounded-full border px-2 py-0.5 shadow-sm transition-all hover:text-white"
                          >
                            <HelpCircle className="h-2.5 w-2.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wide">
                              Обучение
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                        <div className="bg-bg-surface2 border-border-default flex w-fit shrink-0 items-center gap-1 rounded-2xl border p-1">
                          {ECOSYSTEM_TABS.map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setActiveEcosystemTab(tab.id)}
                              className={cn(
                                'btn-tab px-4 py-1.5',
                                activeEcosystemTab === tab.id
                                  ? 'btn-tab-active'
                                  : 'btn-tab-inactive'
                              )}
                            >
                              {tab.title}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="bg-bg-surface2 border-border-default flex w-fit items-center gap-1.5 rounded-2xl border p-1">
                        <button
                          onClick={() => setActiveFlowRole('all')}
                          className={cn(
                            'btn-tab px-4 py-1.5',
                            activeFlowRole === 'all' ? 'btn-tab-active' : 'btn-tab-inactive'
                          )}
                        >
                          Все роли
                        </button>
                        {(Object.entries(ROLE_CONFIG) as [B2BRole, any][]).map(([role, config]) => (
                          <button
                            key={role}
                            onClick={() => setActiveFlowRole(role)}
                            className={cn(
                              'flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[10px] font-bold uppercase tracking-normal transition-all',
                              activeFlowRole === role
                                ? cn('border-border-default bg-white shadow-md', config.color)
                                : 'text-text-muted hover:text-text-secondary border-transparent hover:bg-white'
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

                <div
                  className="bg-bg-surface2/80 no-scrollbar relative flex-1 space-y-6 overflow-y-auto px-8 pb-10 pt-10"
                  ref={containerRef}
                >
                  <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full">
                    <defs>
                      <filter id="glow-eco" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <AnimatePresence>
                      {connections
                        .filter((conn) => conn.isHighlighted)
                        .map((conn, idx) => (
                          <g key={`${conn.sourceTitle}-${conn.targetTitle}-${idx}`}>
                            <motion.path
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 1, stroke: '#6366f1' }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.4, ease: 'easeInOut' }}
                              d={conn.d}
                              stroke="#6366f1"
                              strokeWidth="2.5"
                              fill="none"
                            />
                            <motion.circle r="3" fill="#6366f1" filter="url(#glow-eco)">
                              <animateMotion dur="2s" repeatCount="indefinite" path={conn.d} />
                            </motion.circle>
                          </g>
                        ))}
                    </AnimatePresence>
                  </svg>

                  <div className="pointer-events-none absolute inset-0 z-[60] h-full w-full">
                    <AnimatePresence>
                      {connections
                        .filter((c) => c.isHighlighted)
                        .map((conn, idx) => (
                          <motion.div
                            key={`label-${conn.sourceTitle}-${conn.targetTitle}-${idx}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute flex items-center justify-center"
                            style={{
                              left: conn.midLabelX,
                              top: conn.midLabelY,
                              width: 0,
                              height: 0,
                            }}
                          >
                            <div className="bg-accent-primary whitespace-nowrap rounded-full border border-white/20 px-2.5 py-1 text-[5.5px] font-bold uppercase text-white shadow-2xl">
                              {conn.label}
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>

                  {(Object.entries(flowConfig) as [string, any][]).map(([flowKey, config]) => {
                    const displayItems = groupedItems[flowKey] || [];
                    if (displayItems.length === 0) return null;
                    return (
                      <div
                        key={flowKey}
                        className={cn(
                          'relative transition-all duration-500',
                          activeGuideStep !== null &&
                            ECOSYSTEM_GUIDE[activeGuideStep]?.target !== `flow-${flowKey}` &&
                            'opacity-30 blur-[2px]'
                        )}
                        id={`flow-${flowKey}`}
                      >
                        <div className="mb-4 flex items-center gap-3">
                          <div
                            className={cn(
                              'border-border-default flex items-center gap-2 rounded-lg border bg-white px-2.5 py-1 shadow-sm',
                              config.color
                            )}
                          >
                            <config.icon className="h-3 w-3" />
                            <span className="text-[5.5px] font-bold uppercase tracking-wide">
                              {config.title}
                            </span>
                          </div>
                          <div className="bg-border-subtle h-px flex-1" />
                        </div>
                        <div className="flex flex-wrap gap-x-1.5 gap-y-6">
                          {displayItems.map((item, idx, array) => {
                            const isRoleActive =
                              activeFlowRole === 'all' ||
                              (item.roles && item.roles.includes(activeFlowRole));
                            const isHovered = hoveredItemId === item.title;
                            const itemConnections = activeTabConnections.filter(
                              (c) => c.source === item.title || c.target === item.title
                            );
                            const activeConnection = hoveredItemId
                              ? itemConnections.find(
                                  (c) => c.source === hoveredItemId || c.target === hoveredItemId
                                )
                              : null;
                            const isRelated = !!activeConnection;

                            return (
                              <div key={idx} className="contents">
                                {item.breakBefore && <div className="h-0 basis-full" />}
                                <div
                                  className={cn(
                                    'relative flex items-center transition-all duration-500',
                                    !isRoleActive &&
                                      !isRelated &&
                                      'scale-[0.98] opacity-20 grayscale',
                                    isRelated && 'scale-[1.02] opacity-100 grayscale-0'
                                  )}
                                >
                                  <div
                                    className={cn(
                                      'border-border-default group/card-inner hover:border-accent-primary/40 relative w-[170px] cursor-pointer rounded-2xl border bg-white p-2 shadow-sm transition-all hover:shadow-md',
                                      isHovered
                                        ? 'border-accent-primary z-40 shadow-xl'
                                        : isRelated
                                          ? 'animate-pulse-subtle border-accent-primary/40 z-20 shadow-lg'
                                          : 'z-10'
                                    )}
                                    onMouseEnter={() => setHoveredItemId(item.title)}
                                    onMouseLeave={() => setHoveredItemId(null)}
                                    onClick={() => (item.teaser ? setActiveTeaser(item) : null)}
                                    data-item-title={item.title}
                                  >
                                    <div className="mb-1.5 flex items-center gap-1.5">
                                      <div
                                        className={cn(
                                          'flex h-3.5 w-3.5 items-center justify-center rounded-md border border-current bg-white text-[5.5px] font-bold',
                                          isRoleActive ? config.color : 'text-text-muted'
                                        )}
                                      >
                                        {item.originalIdx + 1}
                                      </div>
                                      <span
                                        className={cn(
                                          'line-clamp-1 text-[5.5px] font-bold uppercase tracking-wide opacity-60',
                                          isRoleActive ? config.color : 'text-text-muted'
                                        )}
                                      >
                                        {item.label}
                                      </span>
                                      {isRoleActive && activeFlowRole !== 'all' && (
                                        <div className="ml-auto opacity-40">
                                          {(() => {
                                            const RoleIcon = ROLE_CONFIG[activeFlowRole].icon;
                                            return (
                                              <RoleIcon
                                                className={cn(
                                                  'h-2.5 w-2.5',
                                                  ROLE_CONFIG[activeFlowRole].color
                                                )}
                                              />
                                            );
                                          })()}
                                        </div>
                                      )}
                                    </div>
                                    {isRoleActive && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveTeaser(item);
                                              }}
                                              className="bg-bg-surface2 text-text-muted hover:bg-accent-primary border-border-subtle group/teaser absolute right-2 top-2 z-50 rounded-xl border p-1.5 shadow-sm transition-all hover:text-white"
                                            >
                                              <Eye className="h-2.5 w-2.5" />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-text-primary z-[15000] rounded-lg border-none p-2 text-white shadow-2xl">
                                            <p className="text-[10px] font-bold uppercase tracking-wide">
                                              Подробнее
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <h3
                                            className={cn(
                                              'mb-2 line-clamp-2 min-h-[20px] cursor-help pr-6 text-[10px] font-bold uppercase leading-none tracking-wide',
                                              isRoleActive ? 'text-text-primary' : 'text-text-muted'
                                            )}
                                          >
                                            {item.title}
                                          </h3>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-text-primary z-[15000] max-w-[240px] rounded-xl border-none p-3 text-white shadow-2xl">
                                          <p className="text-accent-primary mb-1 text-[10px] font-bold uppercase tracking-wide">
                                            {item.label}
                                          </p>
                                          <p className="text-xs font-medium leading-relaxed">
                                            {item.desc}
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <div className="mt-auto flex flex-wrap gap-1">
                                      {(item.roles || ['admin']).map((role: B2BRole) => {
                                        const config = ROLE_CONFIG[role as B2BRole];
                                        if (!config) return null;
                                        const isTargetRole = role === effectiveRole;
                                        return (
                                          <div
                                            key={role}
                                            className={cn(
                                              'bg-bg-surface2 border-border-subtle rounded border p-1',
                                              config.color,
                                              !isTargetRole && 'opacity-20 grayscale'
                                            )}
                                          >
                                            <config.icon className="h-2.5 w-2.5" />
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  {idx < array.length - 1 &&
                                    (() => {
                                      const nextItem = array[idx + 1];
                                      const horizontalConn = activeTabConnections.find(
                                        (c) =>
                                          (item.title === c.source &&
                                            nextItem.title === c.target) ||
                                          (item.title === c.target && nextItem.title === c.source)
                                      );
                                      const isExpansionActive =
                                        hoveredItemId &&
                                        horizontalConn &&
                                        (hoveredItemId === item.title ||
                                          hoveredItemId === nextItem.title);
                                      return (
                                        <div
                                          className={cn(
                                            'relative flex shrink-0 items-center justify-center transition-all duration-500',
                                            isExpansionActive ? 'w-[140px]' : 'mx-0 w-4'
                                          )}
                                        >
                                          {!isExpansionActive && (
                                            <ArrowRight className="text-text-muted h-2 w-2" />
                                          )}
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

                <div className="border-border-default shrink-0 border-t bg-white">
                  <div className="flex items-center justify-center gap-3 p-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1 w-1 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]" />
                      <span className="text-text-muted text-[6.5px] font-bold uppercase tracking-wide">
                        Цифровой ритейл
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="bg-accent-primary h-1 w-1 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.3)]" />
                      <span className="text-text-muted text-[6.5px] font-bold uppercase tracking-wide">
                        BI-аналитика
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                      <span className="text-text-muted text-[6.5px] font-bold uppercase tracking-wide">
                        Медиа-активы
                      </span>
                    </div>
                  </div>
                  <div className="bg-text-primary min-h-[100px] border-t border-white/10 p-4 transition-all duration-500">
                    <AnimatePresence mode="wait">
                      {hoveredItemId ? (
                        <motion.div
                          key={hoveredItemId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-col gap-3"
                        >
                          <div className="flex items-center gap-3" id="synergy-info">
                            <div className="bg-accent-primary/20 border-accent-primary/30 text-accent-primary flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                              <Info className="h-2.5 w-2.5" /> Экосистема: {hoveredItemId}
                            </div>
                            {SYNERGY_CONNECTIONS[hoveredItemId] && (
                              <div className="flex animate-pulse items-center gap-1.5 rounded border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-400">
                                <Zap className="h-2.5 w-2.5" /> Эффект Синергии
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {connections.some((c) => c.isHighlighted) ||
                            SYNERGY_CONNECTIONS[hoveredItemId] ? (
                              <>
                                {connections
                                  .filter((c) => c.isHighlighted)
                                  .map((c, i) => (
                                    <div
                                      key={i}
                                      className="group/mon-item hover:border-accent-primary/50 flex gap-3 border-l border-white/5 pl-3 transition-colors"
                                    >
                                      <div className="mt-1 shrink-0">
                                        {c.isIncoming ? (
                                          <ArrowDownLeft className="h-3 w-3 text-emerald-400" />
                                        ) : (
                                          <ArrowUpRight className="text-accent-primary h-3 w-3" />
                                        )}
                                      </div>
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[7px] font-bold uppercase tracking-tighter text-white">
                                            {c.label}
                                          </span>
                                          <span className="text-[6px] font-bold uppercase tracking-wide text-white/30">
                                            {c.isIncoming ? '← от ' : '→ к '} {c.targetTitle}
                                          </span>
                                        </div>
                                        <p className="text-text-muted max-w-sm text-[10px] font-medium leading-tight">
                                          {c.desc ||
                                            'Интеграция цифрового сервиса в общую архитектуру экосистемы.'}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                {SYNERGY_CONNECTIONS[hoveredItemId] && (
                                  <div className="group/mon-item col-span-2 flex gap-3 rounded-r-lg border-l border-amber-500/30 bg-amber-500/5 py-1 pl-3 transition-colors">
                                    <div className="mt-1 shrink-0">
                                      <Zap className="h-3 w-3 text-amber-400" />
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[7px] font-bold uppercase tracking-tighter text-amber-400">
                                          ⚡ {SYNERGY_CONNECTIONS[hoveredItemId].label}{' '}
                                          (Кросс-системная связь)
                                        </span>
                                        <span className="text-[6px] font-bold uppercase tracking-wide text-amber-400/40">
                                          → в Производственную Матрицу:{' '}
                                          {SYNERGY_CONNECTIONS[hoveredItemId].target}
                                        </span>
                                      </div>
                                      <p className="max-w-2xl text-[10px] font-medium leading-tight text-amber-200/70">
                                        {SYNERGY_CONNECTIONS[hoveredItemId].desc}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-text-secondary col-span-2 py-2 text-[10px] font-bold uppercase italic tracking-wider opacity-50">
                                Внешние кросс-потоковые связи для данного узла не обнаружены...
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          className="text-text-secondary flex h-full items-center justify-center py-4 text-[10px] font-medium uppercase tracking-wide"
                        >
                          Ожидание выбора узла экосистемы для анализа...
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <AnimatePresence>
                  {activeGuideStep !== null && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="pointer-events-none absolute inset-0 z-[20000] overflow-hidden"
                    >
                      <div className="bg-text-primary/40 absolute inset-0 backdrop-blur-[2px]" />
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <motion.div
                          initial={{ scale: 0.9, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          className="border-border-subtle pointer-events-auto relative w-full max-w-md rounded-xl border bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                        >
                          <button
                            onClick={() => setActiveGuideStep(null)}
                            className="hover:bg-bg-surface2 text-text-muted absolute right-6 top-4 rounded-full p-2 transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                          <div className="mb-6 flex items-center gap-3">
                            <div className="bg-accent-primary shadow-accent-primary/15 flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg">
                              <HelpCircle className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-accent-primary mb-0.5 text-[10px] font-bold uppercase tracking-wider">
                                Шаг {activeGuideStep + 1} из {ECOSYSTEM_GUIDE.length}
                              </p>
                              <h4 className="text-text-primary text-base font-semibold uppercase leading-none tracking-tight">
                                {ECOSYSTEM_GUIDE[activeGuideStep].title}
                              </h4>
                            </div>
                          </div>
                          <p className="text-text-secondary mb-8 text-sm font-medium leading-relaxed">
                            {ECOSYSTEM_GUIDE[activeGuideStep].desc}
                          </p>
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex gap-1.5">
                              {ECOSYSTEM_GUIDE.map((_, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    'h-1 rounded-full transition-all duration-500',
                                    i === activeGuideStep
                                      ? 'bg-accent-primary w-6'
                                      : 'bg-border-subtle w-1'
                                  )}
                                />
                              ))}
                            </div>
                            <div className="flex items-center gap-3">
                              {activeGuideStep > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setActiveGuideStep((prev) => (prev !== null ? prev - 1 : null))
                                  }
                                >
                                  Назад
                                </Button>
                              )}
                              <Button
                                variant="cta"
                                size="ctaSm"
                                onClick={() => {
                                  if (activeGuideStep < ECOSYSTEM_GUIDE.length - 1) {
                                    setActiveGuideStep((prev) => (prev !== null ? prev + 1 : null));
                                  } else {
                                    setActiveGuideStep(null);
                                  }
                                }}
                              >
                                {activeGuideStep === ECOSYSTEM_GUIDE.length - 1
                                  ? 'Завершить'
                                  : 'Далее'}
                                <ChevronRight className="ml-2 h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Dialog
                  open={!!activeTeaser}
                  onOpenChange={(open) => !open && setActiveTeaser(null)}
                >
                  <DialogContent className="z-[30000] max-w-3xl overflow-hidden rounded-xl border-none bg-white p-0 shadow-2xl">
                    {activeTeaser && (
                      <>
                        <DialogHeader className="sr-only">
                          <DialogTitle>{activeTeaser.title}</DialogTitle>
                        </DialogHeader>
                        <div className="flex h-full max-h-[80vh] flex-col md:flex-row">
                          <div className="bg-text-primary relative h-64 overflow-hidden md:h-auto md:w-1/2">
                            <img
                              src={activeTeaser.teaser.image}
                              alt={activeTeaser.title}
                              className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-overlay"
                            />
                            <div className="from-accent-primary/20 absolute inset-0 bg-gradient-to-br to-transparent" />
                            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
                              <div className="flex items-start justify-between">
                                <div className="rounded-xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
                                  <div className="mb-2 flex items-center gap-2">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                    <div className="h-1.5 w-12 rounded-full bg-white/30" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="h-1 w-20 rounded-full bg-white/20" />
                                    <div className="h-1 w-12 rounded-full bg-white/10" />
                                  </div>
                                </div>
                                <div className="bg-accent-primary/40 border-accent-primary/40 rounded border px-2 py-1 text-[7px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
                                  Модуль: ACTIVE
                                </div>
                              </div>
                              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl">
                                <div className="mb-3 flex items-end gap-1">
                                  {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                    <motion.div
                                      key={i}
                                      initial={{ height: 0 }}
                                      animate={{ height: `${h}%` }}
                                      transition={{ delay: i * 0.1, duration: 1 }}
                                      className="from-accent-primary flex-1 rounded-sm bg-gradient-to-t to-indigo-400"
                                      style={{ height: `${h}%`, minHeight: '4px' }}
                                    />
                                  ))}
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '75%' }}
                                    transition={{ duration: 2, delay: 0.5 }}
                                    className="bg-accent-primary/40 h-full"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="from-text-primary/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-white" />
                            <div className="absolute bottom-6 left-6 text-white md:hidden">
                              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider opacity-80">
                                {activeTeaser.label}
                              </p>
                              <h3 className="text-sm font-semibold uppercase leading-none tracking-tight">
                                {activeTeaser.title}
                              </h3>
                            </div>
                          </div>
                          <div className="flex flex-col justify-center p-4 md:w-1/2 md:p-3">
                            <div className="mb-6 hidden md:block">
                              <p className="text-accent-primary mb-2 text-[10px] font-bold uppercase tracking-wider">
                                {activeTeaser.label}
                              </p>
                              <h3 className="text-text-primary mb-2 text-base font-semibold uppercase leading-none tracking-tight">
                                {activeTeaser.title}
                              </h3>
                              <p className="text-text-muted text-xs font-bold uppercase tracking-wide">
                                {activeTeaser.teaser.subtitle}
                              </p>
                            </div>
                            <div className="mb-8 space-y-4">
                              {activeTeaser.teaser.features.map((feature: string, i: number) => (
                                <div key={i} className="flex items-start gap-3">
                                  <div className="bg-emerald mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  </div>
                                  <p className="text-text-secondary text-sm font-medium leading-snug">
                                    {feature}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div className="mt-auto flex items-center gap-2">
                              {(() => {
                                const isAccessGranted = activeTeaser.roles?.includes(effectiveRole);
                                return (
                                  <Button
                                    asChild={isAccessGranted}
                                    disabled={!isAccessGranted}
                                    variant="cta"
                                    size="ctaSm"
                                    className={cn(
                                      'flex-1',
                                      !isAccessGranted &&
                                        'bg-bg-surface2 text-text-muted border-border-default cursor-not-allowed opacity-50'
                                    )}
                                  >
                                    {isAccessGranted ? (
                                      <Link
                                        href={getRolePath(effectiveRole as B2BRole, activeTeaser)}
                                        onClick={() => setIsFlowMapOpen(null)}
                                      >
                                        Попробовать в кабинете
                                        <ArrowUpRight className="ml-2 h-3 w-3" />
                                      </Link>
                                    ) : (
                                      <div className="flex items-center justify-center gap-2">
                                        Команда не в доступе
                                        <Shield className="h-3 w-3" />
                                      </div>
                                    )}
                                  </Button>
                                );
                              })()}
                              <Button
                                variant="ctaOutline"
                                size="ctaSm"
                                onClick={() => setActiveTeaser(null)}
                              >
                                Закрыть
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </DialogContent>
            </Dialog>

            <Card className="bg-text-primary group/banner relative mt-6 flex min-h-[300px] items-center overflow-hidden rounded-xl border-none shadow-2xl">
              <div className="absolute inset-0 overflow-hidden rounded-xl opacity-50 transition-transform duration-1000 group-hover/banner:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="from-text-primary via-text-primary/80 absolute inset-0 bg-gradient-to-r to-transparent" />
              <CardContent className="relative z-10 max-w-4xl space-y-6 p-4 text-white">
                <div className="group/marquee relative mb-4 overflow-hidden whitespace-nowrap border-y border-white/10 py-2">
                  <motion.div
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
                    className="flex w-fit items-center gap-3"
                  >
                    {[1, 2].map((i) => (
                      <div key={i} className="flex shrink-0 items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Глобальный Индекс Цен
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Ценообразование по спросу
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Омниканальный хаб
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Оптовый портал B2B
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • AI-мерчандайзинг
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Хаб Маркетплейсов
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Арбитраж Инвентаря
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • AI-ассистент гендиректора
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • BI-аналитика покупателей
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Панель KPI бренда
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Прогноз LTV & Оттока
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Виртуальные 3D-Витрины
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • AI-Локализация контента
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Рекламный кабинет 360°
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • AI-Подбор Размера
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Смарт-контракты
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Защита ИС (ДНК)
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • ESG-мониторинг
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Налоговый шлюз
                        </span>
                      </div>
                    ))}{' '}
                  </motion.div>
                </div>
                <h2 className="text-xl font-bold uppercase leading-tight tracking-tight md:text-3xl">
                  ЯДРО УПРАВЛЕНИЯ
                </h2>
                <p className="text-text-muted border-accent-primary/50 whitespace-nowrap border-l-2 pl-6 text-sm font-medium">
                  "Консолидация ресурсов и данных для доминирования на рынке."
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
