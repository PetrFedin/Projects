"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, ArrowRight, Shield, Store, Briefcase, Warehouse, ShoppingCart, Factory } from "lucide-react";
import { CALENDAR_ITEMS, type B2BRole } from "../_fixtures/b2b-data";
import { CalendarQuickView } from "../../user/CalendarQuickView";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useUIState } from "@/providers/ui-state";

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
                <div className={cn("p-1.5 rounded-lg bg-white shadow-sm border border-slate-100 transition-all hover:scale-110 cursor-help", config.color)}>
                  <config.icon className="h-3 w-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-900 text-white border-none p-2 rounded-lg shadow-2xl">
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

  const getCalendarLink = (item: typeof CALENDAR_ITEMS[0]) => {
    const role = effectiveRole;
    const title = item.title;

    if (role === 'admin') {
      if (title.includes('Радар')) return '/admin/calendar';
      if (title.includes('Производ')) return '/admin/bpi-matrix';
      if (title.includes('Байер')) return '/admin/auctions';
      return '/admin/calendar';
    }

    if (role === 'brand') {
      if (title.includes('Радар')) return '/brand/calendar';
      if (title.includes('Производ')) return '/brand/production';
      if (title.includes('Байер')) return '/brand/b2b-orders';
      if (title.includes('Медиа')) return '/brand/media';
      return '/brand/calendar';
    }

    if (role === 'manufacturer' || role === 'supplier') {
      if (title.includes('Производ')) return '/factory/production';
      if (title.includes('Сорсинг')) return '/factory/materials';
      return '/factory/calendar';
    }

    if (role === 'distributor') {
      if (title.includes('Байер')) return '/distributor/orders';
      if (title.includes('Логист')) return '/distributor/matrix';
      return '/distributor/calendar';
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
      className="section-spacing bg-transparent relative"
    >
      <div className="container mx-auto px-4">
        <Card className="bg-white border-none rounded-xl shadow-2xl shadow-slate-200/50 relative border border-slate-100 overflow-hidden">
          <CardContent className="p-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-10">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-slate-200 text-slate-900 uppercase font-bold tracking-normal px-2 py-0.5"
                  >
                    CALENDAR_b2b
                  </Badge>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-slate-900 leading-tight">
                  ОПЕРАЦИОННЫЙ КАЛЕНДАРЬ
                </h2>
                <p className="text-slate-400 font-medium text-xs max-w-md">
                  Единая экосистема планирования и управления.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CalendarQuickView role={effectiveRole} />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const el = document.getElementById("rhythm-scroll-b2b");
                      if (el) el.scrollBy({ left: -320, behavior: "smooth" });
                    }}
                    className="text-slate-400 hover:text-slate-900 transition-colors p-1"
                  >
                    <ArrowRight className="h-5 w-5 rotate-180" />
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById("rhythm-scroll-b2b");
                      if (el) el.scrollBy({ left: 320, behavior: "smooth" });
                    }}
                    className="text-slate-400 hover:text-slate-900 transition-colors p-1"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative group/rhythm -mx-4 px-4 mb-6">
              <div
                id="rhythm-scroll-b2b"
                className="flex overflow-x-auto pb-3 gap-3 custom-scrollbar snap-x snap-mandatory scroll-smooth"
              >
                {CALENDAR_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-[280px] md:w-[320px] p-4 pb-3 rounded-3xl bg-slate-50 border border-slate-100 snap-start transition-all hover:border-slate-900/30 hover:shadow-xl hover:shadow-slate-200/50 flex flex-col group/card relative"
                  >
                    <div className="absolute top-4 right-4 z-20">
                      <RoleIcons roles={item.roles as B2BRole[]} />
                    </div>
                    <div className="space-y-1 mb-2">
                      <p className="text-[10px] font-bold uppercase text-indigo-600 tracking-wide">
                        {item.label}
                      </p>
                      <h4 className="text-base font-bold uppercase text-slate-900 leading-tight group-hover/card:text-indigo-600 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">
                      {item.desc}
                    </p>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-center">
                      {(() => {
                        const isAccessGranted = item.roles?.includes(effectiveRole);
                        return (
                          <Button 
                            asChild={isAccessGranted}
                            disabled={!isAccessGranted}
                            variant="ctaOutline"
                            size="ctaSm"
                            className={cn(
                              "w-[180px] mx-auto group/btn",
                              isAccessGranted
                                ? "bg-white text-slate-400 border-slate-200 group-hover/card:bg-black group-hover/card:text-white group-hover/card:border-black group-hover/card:button-glimmer group-hover/card:button-professional group-hover/card:shadow-xl"
                                : "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-50"
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

            <Card className="bg-slate-900 border-none rounded-xl relative min-h-[300px] flex items-center shadow-2xl group/banner overflow-hidden">
              <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/banner:scale-105 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000"
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
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Операционный радар</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Производственный план</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• График поставок</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Таймлайн коллекции</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Контрольные точки</span>
                      </div>
                    ))}
                  </motion.div>
                </div>
                <h2 className="text-xl md:text-3xl font-bold uppercase tracking-tight leading-tight">
                  УПРАВЛЕНИЕ И ПЛАНИРОВАНИЕ
                </h2>
                <p className="text-slate-300 text-sm font-medium border-l-2 border-slate-900/50 pl-6 whitespace-nowrap">
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
