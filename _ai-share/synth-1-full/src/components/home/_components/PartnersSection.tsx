'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Users,
  ArrowRight,
  ShieldCheck,
  Clock,
  Box,
  Cpu,
  Lock,
  PackageCheck,
  Truck,
  ShieldAlert,
  Shield,
  Store,
  Briefcase,
  Warehouse,
  ShoppingCart,
  Factory,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { type B2BRole } from '../_fixtures/b2b-data';

const ROLE_CONFIG: Record<B2BRole, { label: string; icon: any; color: string }> = {
  admin: { label: 'Администратор', icon: Shield, color: 'text-indigo-500' },
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
                    'cursor-help rounded-lg border border-slate-100 bg-white p-1.5 shadow-sm transition-all hover:scale-110',
                    config.color
                  )}
                >
                  <config.icon className="h-3 w-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="rounded-lg border-none bg-slate-900 p-2 text-white shadow-2xl">
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
  {
    id: 'verified',
    label: 'Верифицирован',
    icon: ShieldCheck,
    color: 'emerald',
    desc: 'Партнер прошел полную верификацию юридических и финансовых документов платформой.',
  },
  {
    id: 'net60',
    label: 'Отсрочка 60 дней',
    icon: Clock,
    color: 'indigo',
    desc: 'Возможность работы с отсрочкой платежа до 60 дней для проверенных байеров.',
  },
  {
    id: 'lowmoq',
    label: 'Малый MOQ',
    icon: Box,
    color: 'orange',
    desc: 'Возможность заказа малых тиражей (от 10-50 единиц), идеально для тестов и дропов.',
  },
  {
    id: '3dready',
    label: '3D-Ready',
    icon: Cpu,
    color: 'cyan',
    desc: 'Партнер предоставляет цифровые двойники изделий и работает с CLO3D/Browzwear.',
  },
  {
    id: 'stock',
    label: 'Прямой сток',
    icon: PackageCheck,
    color: 'emerald',
    desc: 'Интеграция складских остатков в реальном времени через API платформы.',
  },
  {
    id: 'logistics',
    label: 'Дропшиппинг',
    icon: Truck,
    color: 'sky',
    desc: 'Поддержка прямой отгрузки конечному клиенту со склада производителя.',
  },
  {
    id: 'private',
    label: 'White Label',
    icon: Lock,
    color: 'slate',
    desc: 'Готовность к производству под частной маркой (Private Label) заказчика.',
  },
  {
    id: 'escrow',
    label: 'Эскроу',
    icon: ShieldAlert,
    color: 'rose',
    desc: 'Безопасные сделки через эскроу-сервис платформы: оплата после приемки ОТК.',
  },
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
      className="section-spacing relative bg-transparent"
    >
      <div className="container mx-auto px-4">
        <Card className="relative overflow-hidden rounded-xl border border-none border-slate-100 bg-white shadow-2xl shadow-slate-200/50">
          <CardContent className="p-3">
            <div className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-slate-200 px-2 py-0.5 text-xs font-bold uppercase tracking-normal text-slate-900"
                  >
                    PARTNERS_b2b
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold uppercase leading-tight tracking-tight text-slate-900 md:text-4xl">
                  ПАРТНЕРЫ
                </h2>
                <p className="max-w-md text-xs font-medium text-slate-400">
                  Сквозная интеграция производственных цепочек и операционный контроль.
                </p>
                <TooltipProvider>
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {PARTNER_BADGES.map((badge) => (
                      <Tooltip key={badge.id}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              'flex min-w-[85px] cursor-help items-center justify-center gap-1 rounded-full border px-2 py-0.5 transition-all hover:scale-105',
                              badge.color === 'emerald' &&
                                'border-emerald-500/20 bg-emerald-500/10 text-emerald-600',
                              badge.color === 'indigo' &&
                                'border-indigo-500/20 bg-indigo-500/10 text-indigo-600',
                              badge.color === 'amber' &&
                                'border-amber-500/20 bg-amber-500/10 text-amber-600',
                              badge.color === 'teal' &&
                                'border-teal-500/20 bg-teal-500/10 text-teal-600',
                              badge.color === 'rose' &&
                                'border-rose-500/20 bg-rose-500/10 text-rose-600',
                              badge.color === 'blue' &&
                                'border-blue-500/20 bg-blue-500/10 text-blue-600',
                              badge.color === 'yellow' &&
                                'border-yellow-500/20 bg-yellow-500/10 text-yellow-600',
                              badge.color === 'violet' &&
                                'border-violet-500/20 bg-violet-500/10 text-violet-600',
                              badge.color === 'orange' &&
                                'border-orange-500/20 bg-orange-500/10 text-orange-600',
                              badge.color === 'pink' &&
                                'border-pink-500/20 bg-pink-500/10 text-pink-600',
                              badge.color === 'cyan' &&
                                'border-cyan-500/20 bg-cyan-500/10 text-cyan-600',
                              badge.color === 'slate' &&
                                'border-slate-500/20 bg-slate-500/10 text-slate-600',
                              badge.color === 'lime' &&
                                'border-lime-500/20 bg-lime-500/10 text-lime-600',
                              badge.color === 'sky' &&
                                'border-sky-500/20 bg-sky-500/10 text-sky-600'
                            )}
                          >
                            <badge.icon className="h-2.5 w-2.5 shrink-0" />
                            <span className="whitespace-nowrap text-[7px] font-bold uppercase">
                              {badge.label}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] rounded-xl border-none bg-slate-900 p-3 text-white shadow-2xl">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <badge.icon className={cn('h-3 w-3', `text-${badge.color}-400`)} />
                              <p className="text-[10px] font-bold uppercase tracking-wide">
                                {badge.label}
                              </p>
                            </div>
                            <p className="text-[10px] font-medium leading-relaxed text-slate-300">
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
                    const el = document.getElementById('partners-scroll-b2b');
                    if (el) el.scrollBy({ left: -320, behavior: 'smooth' });
                  }}
                  className="p-1 text-slate-400 transition-colors hover:text-slate-900"
                >
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('partners-scroll-b2b');
                    if (el) el.scrollBy({ left: 320, behavior: 'smooth' });
                  }}
                  className="p-1 text-slate-400 transition-colors hover:text-slate-900"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="group/partners relative -mx-4 mb-6 px-4">
              <div
                id="partners-scroll-b2b"
                className="custom-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-3"
              >
                {[
                  {
                    label: 'Бизнес',
                    title: 'Бренды и Дизайнеры',
                    desc: 'Организация полного цикла бизнеса: от идеи и разработки до глобального управления продажами и масштабированием.',
                    docs: 12,
                    verified: true,
                    roles: ['admin', 'brand', 'manufacturer', 'distributor', 'shop', 'supplier'],
                  },
                  {
                    label: 'Производство',
                    title: 'Швейные фабрики',
                    desc: 'Ключевой элемент цифровой цепочки поставок: прозрачное выполнение заказов и бесшовная интеграция в экосистему бренда.',
                    docs: 8,
                    verified: true,
                    roles: ['admin', 'brand', 'manufacturer', 'supplier'],
                  },
                  {
                    label: 'Сырье',
                    title: 'Поставщики сырья',
                    desc: 'Прямая интеграция в цикл планирования: от раннего бронирования тканей до автоматического контроля остатков.',
                    docs: 15,
                    verified: true,
                    roles: ['admin', 'brand', 'manufacturer', 'supplier'],
                  },
                  {
                    label: 'Ритейл',
                    title: 'Дистрибуция и Ритейл',
                    desc: 'Профессиональные каналы сбыта: от крупных дистрибьюторов до концепт-сторов, обеспечивающие глобальный охват.',
                    docs: 6,
                    verified: true,
                    roles: ['admin', 'brand', 'distributor', 'shop'],
                  },
                  {
                    label: 'Логистика',
                    title: 'Логисты и Хабы',
                    desc: 'Комплексная логистика внутри РФ и СНГ: от управления хабами до полной прозрачности «последней мили» и фулфилмента.',
                    docs: 4,
                    verified: false,
                    roles: ['admin', 'brand', 'distributor', 'shop'],
                  },
                  {
                    label: 'Финансы',
                    title: 'Финансовая среда',
                    desc: 'Банковские инструменты для бизнеса: B2B-эквайринг, факторинг, кредитные продукты, страхование сделок и инвест-сопровождение.',
                    docs: 9,
                    verified: true,
                    roles: ['admin', 'brand', 'manufacturer', 'distributor', 'shop', 'supplier'],
                  },
                  {
                    label: 'Медиа',
                    title: 'Медиа и Контент',
                    desc: 'Профессиональные фотостудии и продакшн-хабы для создания визуального контента, 3D-моделей и рекламных кампаний.',
                    docs: 11,
                    verified: true,
                    roles: ['admin', 'brand'],
                  },
                  {
                    label: 'Сервис',
                    title: 'Сервисные компании',
                    desc: 'Экспертное сопровождение на каждом этапе жизненного цикла: юристы, консалтинг, IT-решения и стратегический маркетинг.',
                    docs: 7,
                    verified: false,
                    roles: ['admin', 'brand', 'manufacturer', 'distributor', 'shop', 'supplier'],
                  },
                ].map((partner, idx) => (
                  <div
                    key={idx}
                    className="group/partner relative flex w-[280px] flex-shrink-0 snap-start flex-col rounded-3xl border border-slate-100 bg-slate-50 p-4 pb-3 transition-all hover:border-slate-900/30 hover:shadow-xl hover:shadow-slate-200/50 md:w-[320px]"
                  >
                    <div className="absolute right-4 top-4 z-20">
                      <RoleIcons roles={partner.roles as B2BRole[]} />
                    </div>
                    <div className="mb-2 space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-600">
                        {partner.label}
                      </p>
                      <h4 className="text-base font-bold uppercase leading-tight text-slate-900 transition-colors group-hover/partner:text-indigo-600">
                        {partner.title}
                      </h4>
                    </div>
                    <p className="mb-4 text-xs font-medium leading-relaxed text-slate-500">
                      {partner.desc}
                    </p>
                    <div className="mt-auto flex items-center justify-center border-t border-slate-100 pt-4">
                      {(() => {
                        const isAccessGranted = partner.roles?.includes(effectiveRole);
                        return (
                          <Button
                            asChild={isAccessGranted}
                            disabled={!isAccessGranted}
                            variant="ctaOutline"
                            size="ctaSm"
                            className={cn(
                              'group/btn mx-auto h-9 w-[180px] border',
                              isAccessGranted
                                ? 'group-hover/partner:button-glimmer group-hover/partner:button-professional border-slate-200 bg-white text-slate-400 group-hover/partner:border-black group-hover/partner:bg-black group-hover/partner:text-white group-hover/partner:shadow-xl'
                                : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300 opacity-50'
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

            <Card className="group/banner relative flex min-h-[300px] items-center overflow-hidden rounded-xl border-none bg-slate-900 shadow-2xl">
              <div className="absolute inset-0 overflow-hidden rounded-xl opacity-40 transition-transform duration-1000 group-hover/banner:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2000"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
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
                          • Бренды и Дизайнеры
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Производство и Цеха
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Поставщики сырья
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Ритейл-партнеры
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Логистика и Хабы
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Финтех-провайдеры и Банки
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • ИТ-Интеграторы
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Таможенные брокеры
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Маркетинговые агентства
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Текстильные агентства
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Байеры и Стилисты
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Фотостудии и Продакшн
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          • Лаборатории качества
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </div>
                <h2 className="text-xl font-bold uppercase leading-tight tracking-tight md:text-3xl">
                  БИЗНЕС-АЛЬЯНС
                </h2>
                <p className="whitespace-nowrap border-l-2 border-indigo-500/50 pl-6 text-sm font-medium text-slate-300">
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
