'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Activity,
  ArrowRight,
  Shield,
  Store,
  Briefcase,
  Warehouse,
  ShoppingCart,
  Factory,
} from 'lucide-react';
import { CALENDAR_ITEMS, type B2BRole } from '../_fixtures/b2b-data';
import { CalendarQuickView } from '../../user/CalendarQuickView';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
<<<<<<< HEAD

const ROLE_CONFIG: Record<B2BRole, { label: string; icon: any; color: string }> = {
  admin: { label: 'Администратор', icon: Shield, color: 'text-indigo-500' },
=======
import { ROUTES } from '@/lib/routes';

const ROLE_CONFIG: Record<B2BRole, { label: string; icon: any; color: string }> = {
  admin: { label: 'Администратор', icon: Shield, color: 'text-accent-primary' },
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                    'cursor-help rounded-lg border border-slate-100 bg-white p-1.5 shadow-sm transition-all hover:scale-110',
=======
                    'border-border-subtle cursor-help rounded-lg border bg-white p-1.5 shadow-sm transition-all hover:scale-110',
>>>>>>> recover/cabinet-wip-from-stash
                    config.color
                  )}
                >
                  <config.icon className="h-3 w-3" />
                </div>
              </TooltipTrigger>
<<<<<<< HEAD
              <TooltipContent className="rounded-lg border-none bg-slate-900 p-2 text-white shadow-2xl">
=======
              <TooltipContent className="bg-text-primary rounded-lg border-none p-2 text-white shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
                <p className="text-[10px] font-bold uppercase tracking-wide">{config.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
}

export function RhythmSection() {
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

  const getCalendarLink = (item: (typeof CALENDAR_ITEMS)[0]) => {
    const role = effectiveRole;
    const title = item.title;

    if (role === 'admin') {
      if (title.includes('Радар')) return ROUTES.admin.calendar;
      if (title.includes('Производ')) return ROUTES.admin.bpiMatrix;
      if (title.includes('Байер')) return ROUTES.admin.auctions;
      return ROUTES.admin.calendar;
    }

    if (role === 'brand') {
      if (title.includes('Радар')) return '/brand/calendar';
      if (title.includes('Производ')) return '/brand/production';
      if (title.includes('Байер')) return '/brand/b2b-orders';
      if (title.includes('Медиа')) return '/brand/media';
      return '/brand/calendar';
    }

    if (role === 'manufacturer' || role === 'supplier') {
      if (title.includes('Производ')) return ROUTES.factory.production;
      if (title.includes('Сорсинг')) return ROUTES.factory.productionMaterials;
      return ROUTES.factory.productionCalendar;
    }

    if (role === 'distributor') {
      if (title.includes('Байер')) return ROUTES.distributor.orders;
      if (title.includes('Логист')) return ROUTES.distributor.matrix;
      return ROUTES.distributor.calendar;
    }

    if (role === 'shop') {
      if (title.includes('Байер')) return '/shop/b2b/calendar';
      return '/shop/calendar';
    }

    return item.link;
  };

  return (
    <motion.section
      id="CALENDAR_b2b"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="section-spacing relative bg-transparent"
    >
<<<<<<< HEAD
      <div className="container mx-auto px-4">
        <Card className="relative overflow-hidden rounded-xl border border-none border-slate-100 bg-white shadow-2xl shadow-slate-200/50">
=======
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <Card className="border-border-subtle relative overflow-hidden rounded-xl border border-none bg-white shadow-2xl shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
          <CardContent className="p-3">
            <div className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
<<<<<<< HEAD
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900">
=======
                  <div className="bg-text-primary flex h-8 w-8 items-center justify-center rounded-xl">
>>>>>>> recover/cabinet-wip-from-stash
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  <Badge
                    variant="outline"
<<<<<<< HEAD
                    className="border-slate-200 px-2 py-0.5 text-xs font-bold uppercase tracking-normal text-slate-900"
=======
                    className="border-border-default text-text-primary px-2 py-0.5 text-xs font-bold uppercase tracking-normal"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    CALENDAR_b2b
                  </Badge>
                </div>
<<<<<<< HEAD
                <h2 className="text-2xl font-bold uppercase leading-tight tracking-tight text-slate-900 md:text-4xl">
                  ОПЕРАЦИОННЫЙ КАЛЕНДАРЬ
                </h2>
                <p className="max-w-md text-xs font-medium text-slate-400">
=======
                <h2 className="text-text-primary text-2xl font-bold uppercase leading-tight tracking-tight md:text-4xl">
                  ОПЕРАЦИОННЫЙ КАЛЕНДАРЬ
                </h2>
                <p className="text-text-muted max-w-md text-xs font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                  Единая экосистема планирования и управления.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CalendarQuickView role={effectiveRole} />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const el = document.getElementById('rhythm-scroll-b2b');
                      if (el) el.scrollBy({ left: -320, behavior: 'smooth' });
                    }}
<<<<<<< HEAD
                    className="p-1 text-slate-400 transition-colors hover:text-slate-900"
=======
                    className="text-text-muted hover:text-text-primary p-1 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    <ArrowRight className="h-5 w-5 rotate-180" />
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('rhythm-scroll-b2b');
                      if (el) el.scrollBy({ left: 320, behavior: 'smooth' });
                    }}
<<<<<<< HEAD
                    className="p-1 text-slate-400 transition-colors hover:text-slate-900"
=======
                    className="text-text-muted hover:text-text-primary p-1 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="group/rhythm relative -mx-4 mb-6 px-4">
              <div
                id="rhythm-scroll-b2b"
                className="custom-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-3"
              >
                {CALENDAR_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
<<<<<<< HEAD
                    className="group/card relative flex w-[280px] flex-shrink-0 snap-start flex-col rounded-3xl border border-slate-100 bg-slate-50 p-4 pb-3 transition-all hover:border-slate-900/30 hover:shadow-xl hover:shadow-slate-200/50 md:w-[320px]"
=======
                    className="bg-bg-surface2 border-border-subtle hover:border-text-primary/30 group/card relative flex w-[280px] flex-shrink-0 snap-start flex-col rounded-3xl border p-4 pb-3 transition-all hover:shadow-md hover:shadow-xl md:w-[320px]"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    <div className="absolute right-4 top-4 z-20">
                      <RoleIcons roles={item.roles as B2BRole[]} />
                    </div>
                    <div className="mb-2 space-y-1">
<<<<<<< HEAD
                      <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-600">
                        {item.label}
                      </p>
                      <h4 className="text-base font-bold uppercase leading-tight text-slate-900 transition-colors group-hover/card:text-indigo-600">
                        {item.title}
                      </h4>
                    </div>
                    <p className="mb-3 text-xs font-medium leading-relaxed text-slate-500">
                      {item.desc}
                    </p>
                    <div className="mt-auto flex items-center justify-center border-t border-slate-100 pt-4">
=======
                      <p className="text-accent-primary text-[10px] font-bold uppercase tracking-wide">
                        {item.label}
                      </p>
                      <h4 className="text-text-primary group-hover/card:text-accent-primary text-base font-bold uppercase leading-tight transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-text-secondary mb-3 text-xs font-medium leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="border-border-subtle mt-auto flex items-center justify-center border-t pt-4">
>>>>>>> recover/cabinet-wip-from-stash
                      {(() => {
                        const isAccessGranted = item.roles?.includes(effectiveRole);
                        return (
                          <Button
                            asChild={isAccessGranted}
                            disabled={!isAccessGranted}
                            variant="ctaOutline"
                            size="ctaSm"
                            className={cn(
                              'group/btn mx-auto w-[180px]',
                              isAccessGranted
<<<<<<< HEAD
                                ? 'group-hover/card:button-glimmer group-hover/card:button-professional border-slate-200 bg-white text-slate-400 group-hover/card:border-black group-hover/card:bg-black group-hover/card:text-white group-hover/card:shadow-xl'
                                : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300 opacity-50'
=======
                                ? 'text-text-muted border-border-default group-hover/card:button-glimmer group-hover/card:button-professional bg-white group-hover/card:border-black group-hover/card:bg-black group-hover/card:text-white group-hover/card:shadow-xl'
                                : 'bg-bg-surface2 text-text-muted border-border-default cursor-not-allowed opacity-50'
>>>>>>> recover/cabinet-wip-from-stash
                            )}
                          >
                            {isAccessGranted ? (
                              <Link href={getCalendarLink(item)}>
                                {item.action}
                                <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                              </Link>
                            ) : (
                              <span>Нет доступа</span>
                            )}
                          </Button>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

<<<<<<< HEAD
            <Card className="group/banner relative flex min-h-[300px] items-center overflow-hidden rounded-xl border-none bg-slate-900 shadow-2xl">
=======
            <Card className="bg-text-primary group/banner relative flex min-h-[300px] items-center overflow-hidden rounded-xl border-none shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
              <div className="absolute inset-0 overflow-hidden rounded-xl opacity-40 transition-transform duration-1000 group-hover/banner:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000"
                  className="h-full w-full object-cover"
                />
              </div>
<<<<<<< HEAD
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
=======
              <div className="from-text-primary via-text-primary/80 absolute inset-0 bg-gradient-to-r to-transparent" />
>>>>>>> recover/cabinet-wip-from-stash
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
                          • Операционный радар
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Производственный план
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • График поставок
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Таймлайн коллекции
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Контрольные точки
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </div>
                <h2 className="text-xl font-bold uppercase leading-tight tracking-tight md:text-3xl">
                  УПРАВЛЕНИЕ И ПЛАНИРОВАНИЕ
                </h2>
<<<<<<< HEAD
                <p className="whitespace-nowrap border-l-2 border-slate-900/50 pl-6 text-sm font-medium text-slate-300">
=======
                <p className="text-text-muted border-text-primary/50 whitespace-nowrap border-l-2 pl-6 text-sm font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                  "Прозрачная синхронизация операционных задач в реальном времени."
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
