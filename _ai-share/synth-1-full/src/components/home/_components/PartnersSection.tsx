"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, ArrowRight, ShieldCheck, Clock, Box, Cpu, Lock, PackageCheck, Truck, ShieldAlert, Shield, Store, Briefcase, Warehouse, ShoppingCart, Factory } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useUIState } from "@/providers/ui-state";
import { type B2BRole } from "../_fixtures/b2b-data";

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

const PARTNER_BADGES = [
  { id: 'verified', label: 'Верифицирован', icon: ShieldCheck, color: 'emerald', desc: 'Партнер прошел полную верификацию юридических и финансовых документов платформой.' },
  { id: 'net60', label: 'Net 60', icon: Clock, color: 'indigo', desc: 'Возможность работы с отсрочкой платежа до 60 дней для проверенных байеров.' },
  { id: 'lowmoq', label: 'Малый MOQ', icon: Box, color: 'orange', desc: 'Возможность заказа малых тиражей (от 10-50 единиц), идеально для тестов и дропов.' },
  { id: '3dready', label: '3D-Ready', icon: Cpu, color: 'cyan', desc: 'Партнер предоставляет цифровые двойники изделий и работает с CLO3D/Browzwear.' },
  { id: 'stock', label: 'Прямой сток', icon: PackageCheck, color: 'emerald', desc: 'Интеграция складских остатков в реальном времени через API платформы.' },
  { id: 'logistics', label: 'Дропшиппинг', icon: Truck, color: 'sky', desc: 'Поддержка прямой отгрузки конечному клиенту со склада производителя.' },
  { id: 'private', label: 'White Label', icon: Lock, color: 'slate', desc: 'Готовность к производству под частной маркой (Private Label) заказчика.' },
  { id: 'escrow', label: 'Эскроу', icon: ShieldAlert, color: 'rose', desc: 'Безопасные сделки через эскроу-сервис платформы: оплата после приемки ОТК.' },
];

export function PartnersSection() {
  const { user } = useAuth();
  const { setGlobalCategory } = useUIState();

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

  const getPartnerLink = (partnerTitle: string) => {
    const role = effectiveRole;
    
    if (role === 'admin') {
      if (partnerTitle.includes('Бренд')) return '/admin/brands';
      if (partnerTitle.includes('фабрик')) return '/admin/bpi-matrix';
      if (partnerTitle.includes('Сырье')) return '/admin/attributes';
      if (partnerTitle.includes('Ритейл')) return '/admin/users';
      if (partnerTitle.includes('Финанс')) return '/admin/billing';
      return '/admin/home';
    }

    if (role === 'brand') {
      if (partnerTitle.includes('фабрик')) return '/brand/factories';
      if (partnerTitle.includes('Сырье')) return '/brand/materials';
      if (partnerTitle.includes('Ритейл')) return '/brand/retailers';
      if (partnerTitle.includes('Логист')) return '/brand/inventory';
      if (partnerTitle.includes('Медиа')) return '/brand/media';
      return '/brand';
    }

    if (role === 'manufacturer' || role === 'supplier') {
      if (partnerTitle.includes('Бренд')) return '/factory/brands';
      if (partnerTitle.includes('Сырье')) return '/factory/materials';
      if (partnerTitle.includes('Финанс')) return '/factory/finance';
      return '/factory';
    }

    if (role === 'distributor') {
      if (partnerTitle.includes('Бренд')) return '/distributor/brands';
      if (partnerTitle.includes('Ритейл')) return '/distributor/retailers';
      return '/distributor';
    }

    if (role === 'shop') {
      if (partnerTitle.includes('Бренд')) return '/shop/b2b/partners';
      if (partnerTitle.includes('Логист')) return '/shop/inventory';
      return '/shop';
    }

    return '/';
  };

  return (
    <motion.section
      id="PARTNERS_b2b"
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
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-slate-200 text-slate-900 uppercase font-bold tracking-normal px-2 py-0.5"
                  >
                    PARTNERS_b2b
                  </Badge>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-slate-900 leading-tight">
                  ПАРТНЕРЫ
                </h2>
                <p className="text-slate-400 font-medium text-xs max-w-md">
                  Сквозная интеграция производственных цепочек и операционный контроль.
                </p>
                <TooltipProvider>
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {PARTNER_BADGES.map((badge) => (
                      <Tooltip key={badge.id}>
                        <TooltipTrigger asChild>
                          <div className={cn(
                            "flex items-center justify-center gap-1 px-2 py-0.5 rounded-full border transition-all cursor-help hover:scale-105 min-w-[85px]",
                            badge.color === 'emerald' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-600",
                            badge.color === 'indigo' && "bg-indigo-500/10 border-indigo-500/20 text-indigo-600",
                            badge.color === 'amber' && "bg-amber-500/10 border-amber-500/20 text-amber-600",
                            badge.color === 'teal' && "bg-teal-500/10 border-teal-500/20 text-teal-600",
                            badge.color === 'rose' && "bg-rose-500/10 border-rose-500/20 text-rose-600",
                            badge.color === 'blue' && "bg-blue-500/10 border-blue-500/20 text-blue-600",
                            badge.color === 'yellow' && "bg-yellow-500/10 border-yellow-500/20 text-yellow-600",
                            badge.color === 'violet' && "bg-violet-500/10 border-violet-500/20 text-violet-600",
                            badge.color === 'orange' && "bg-orange-500/10 border-orange-500/20 text-orange-600",
                            badge.color === 'pink' && "bg-pink-500/10 border-pink-500/20 text-pink-600",
                            badge.color === 'cyan' && "bg-cyan-500/10 border-cyan-500/20 text-cyan-600",
                            badge.color === 'slate' && "bg-slate-500/10 border-slate-500/20 text-slate-600",
                            badge.color === 'lime' && "bg-lime-500/10 border-lime-500/20 text-lime-600",
                            badge.color === 'sky' && "bg-sky-500/10 border-sky-500/20 text-sky-600",
                          )}>
                            <badge.icon className="h-2.5 w-2.5 shrink-0" />
                            <span className="text-[7px] font-bold uppercase whitespace-nowrap">{badge.label}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 text-white border-none p-3 rounded-xl max-w-[200px] shadow-2xl">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <badge.icon className={cn("h-3 w-3", `text-${badge.color}-400`)} />
                              <p className="text-[10px] font-bold uppercase tracking-wide">{badge.label}</p>
                            </div>
                            <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
                              {badge.desc}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const el = document.getElementById("partners-scroll-b2b");
                    if (el) el.scrollBy({ left: -320, behavior: "smooth" });
                  }}
                  className="text-slate-400 hover:text-slate-900 transition-colors p-1"
                >
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("partners-scroll-b2b");
                    if (el) el.scrollBy({ left: 320, behavior: "smooth" });
                  }}
                  className="text-slate-400 hover:text-slate-900 transition-colors p-1"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative group/partners -mx-4 px-4 mb-6">
              <div
                id="partners-scroll-b2b"
                className="flex overflow-x-auto pb-3 gap-3 custom-scrollbar snap-x snap-mandatory scroll-smooth"
              >
                {[
                  {
                    label: "Бизнес",
                    title: "Бренды и Дизайнеры",
                    desc: "Организация полного цикла бизнеса: от идеи и разработки до глобального управления продажами и масштабированием.",
                    docs: 12,
                    verified: true,
                    roles: ["admin", "brand", "manufacturer", "distributor", "shop", "supplier"]
                  },
                  {
                    label: "Производство",
                    title: "Швейные фабрики",
                    desc: "Ключевой элемент цифровой цепочки поставок: прозрачное выполнение заказов и бесшовная интеграция в экосистему бренда.",
                    docs: 8,
                    verified: true,
                    roles: ["admin", "brand", "manufacturer", "supplier"]
                  },
                  {
                    label: "Сырье",
                    title: "Поставщики сырья",
                    desc: "Прямая интеграция в цикл планирования: от раннего бронирования тканей до автоматического контроля остатков.",
                    docs: 15,
                    verified: true,
                    roles: ["admin", "brand", "manufacturer", "supplier"]
                  },
                  {
                    label: "Ритейл",
                    title: "Дистрибуция и Ритейл",
                    desc: "Профессиональные каналы сбыта: от крупных дистрибьюторов до концепт-сторов, обеспечивающие глобальный охват.",
                    docs: 6,
                    verified: true,
                    roles: ["admin", "brand", "distributor", "shop"]
                  },
                  {
                    label: "Логистика",
                    title: "Логисты и Хабы",
                    desc: "Комплексная логистика внутри РФ и СНГ: от управления хабами до полной прозрачности «последней мили» и фулфилмента.",
                    docs: 4,
                    verified: false,
                    roles: ["admin", "brand", "distributor", "shop"]
                  },
                  {
                    label: "Финансы",
                    title: "Финансовая среда",
                    desc: "Банковские инструменты для бизнеса: B2B-эквайринг, факторинг, кредитные продукты, страхование сделок и инвест-сопровождение.",
                    docs: 9,
                    verified: true,
                    roles: ["admin", "brand", "manufacturer", "distributor", "shop", "supplier"]
                  },
                  {
                    label: "Медиа",
                    title: "Медиа и Контент",
                    desc: "Профессиональные фотостудии и продакшн-хабы для создания визуального контента, 3D-моделей и рекламных кампаний.",
                    docs: 11,
                    verified: true,
                    roles: ["admin", "brand"]
                  },
                  {
                    label: "Сервис",
                    title: "Сервисные компании",
                    desc: "Экспертное сопровождение на каждом этапе жизненного цикла: юристы, консалтинг, IT-решения и стратегический маркетинг.",
                    docs: 7,
                    verified: false,
                    roles: ["admin", "brand", "manufacturer", "distributor", "shop", "supplier"]
                  },
                ].map((partner, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-[280px] md:w-[320px] p-4 pb-3 rounded-3xl bg-slate-50 border border-slate-100 snap-start transition-all hover:border-slate-900/30 hover:shadow-xl hover:shadow-slate-200/50 flex flex-col group/partner relative"
                  >
                    <div className="absolute top-4 right-4 z-20">
                      <RoleIcons roles={partner.roles as B2BRole[]} />
                    </div>
                    <div className="space-y-1 mb-2">
                      <p className="text-[10px] font-bold uppercase text-indigo-600 tracking-wide">
                        {partner.label}
                      </p>
                      <h4 className="text-base font-bold uppercase text-slate-900 leading-tight group-hover/partner:text-indigo-600 transition-colors">
                        {partner.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                      {partner.desc}
                    </p>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-center">
                      {(() => {
                        const isAccessGranted = partner.roles?.includes(effectiveRole);
                        return (
                          <Button 
                            asChild={isAccessGranted}
                            disabled={!isAccessGranted}
                            variant="ctaOutline"
                            size="ctaSm"
                            className={cn(
                              "w-[180px] mx-auto border h-9 group/btn",
                              isAccessGranted
                                ? "bg-white text-slate-400 border-slate-200 group-hover/partner:bg-black group-hover/partner:text-white group-hover/partner:border-black group-hover/partner:button-glimmer group-hover/partner:button-professional group-hover/partner:shadow-xl"
                                : "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-50"
                            )}
                          >
                            {isAccessGranted ? (
                              <Link href={getPartnerLink(partner.title)}>
                                Открыть профиль
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
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2000"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
              <CardContent className="relative z-10 p-4 space-y-6 max-w-4xl text-white">
                <div className="overflow-hidden whitespace-nowrap mb-4 py-2 border-y border-white/10 relative group/marquee">
                  <motion.div 
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
                    className="flex items-center gap-3 w-fit"
                  >
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-3 shrink-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Бренды и Дизайнеры</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Производство и Цеха</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Поставщики сырья</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Ритейл-партнеры</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Логистика и Хабы</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Финтех-провайдеры и Банки</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• ИТ-Интеграторы</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Таможенные брокеры</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Маркетинговые агентства</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Текстильные агентства</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Байеры и Стилисты</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Фотостудии и Продакшн</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">• Лаборатории качества</span>
                      </div>
                    ))}
                  </motion.div>
                </div>
                <h2 className="text-xl md:text-3xl font-bold uppercase tracking-tight leading-tight">
                  БИЗНЕС-АЛЬЯНС
                </h2>
                <p className="text-slate-300 text-sm font-medium border-l-2 border-indigo-500/50 pl-6 whitespace-nowrap">
                  "Интеллектуальная среда для поиска и реализации стратегических союзов."
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
