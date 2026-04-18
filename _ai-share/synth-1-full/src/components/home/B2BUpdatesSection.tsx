'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BarChart3, Wallet, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { type B2BRole } from './_fixtures/b2b-data';

const b2bAds = [
  {
    id: 'update-1',
    badge: 'RETAIL_API_SYNC',
    title: 'Universal Retail API',
    description:
      'Мгновенная синхронизация с 1С, МойСклад, SAP и Shopify. Забудьте о ручном вводе остатков — Syntha OS станет «клеем» для всех ваших систем.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000',
    ctaText: 'Подключить системы',
    ctaLink: '/dashboard/commerce/api-hub',
    icon: Sparkles,
    status: 'Active: 1C / MoySklad',
  },
  {
    id: 'update-2',
    badge: 'PRODUCTION_ARCHIVE',
    title: 'Archive Hub Pro',
    description:
      '«Единый источник правды» для бренда и фабрики. Храните все версии ТЗ, лекал и сертификатов в одном защищенном цифровом архиве.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000',
    ctaText: 'Открыть архив',
    ctaLink: '/dashboard/production/archive',
    icon: Wallet,
    status: 'Single Source of Truth',
  },
  {
    id: 'update-3',
    badge: 'FINTECH_WALLET_BENEFITS',
    title: 'Wallet & Yield Hub',
    description:
      'Получайте кэшбэк и бонусы за ранние оплаты фабрикам через внутренний кошелек Syntha. Ваша финансовая выгода в каждом клике.',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1000',
    ctaText: 'Смотреть выгоду',
    ctaLink: '/dashboard/fintech/wallet',
    icon: BarChart3,
    status: 'Cashback & Yield Active',
  },
  {
    id: 'update-4',
    badge: 'AI_ASSORTMENT_STRATEGY',
    title: 'AI-Assortment Optimizer',
    description:
      'Система анализирует тренды региона и советует, что именно закупать. Минимум остатков — максимум прибыли на основе данных.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=1000',
    ctaText: 'Оптимизировать заказ',
    ctaLink: '/dashboard/commerce/ai-assortment',
    icon: TrendingUp,
    status: 'Strategic AI Advice',
  },
];

export function B2BUpdatesSection() {
  const { user } = useAuth();
  const { addB2bActivityLog } = useB2BState();

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

  const getUpdateLink = (ad: (typeof b2bAds)[0]) => {
    const role = effectiveRole;
    const title = ad.title;

    if (role === 'admin') {
      if (title.includes('Report') || title.includes('тест')) return '/admin/attributes';
      if (title.includes('Кредит')) return '/admin/billing';
      return '/admin/home';
    }

    if (role === 'brand') {
      if (title.includes('Retail')) return '/brand/showroom';
      if (title.includes('Archive')) return '/brand/production';
      if (title.includes('Wallet')) return '/brand/finance';
      if (title.includes('Optimizer')) return '/brand/analytics-360';
      return '/brand';
    }

    if (role === 'manufacturer' || role === 'supplier') {
      return '/factory';
    }

    if (role === 'distributor') {
      return '/distributor/analytics';
    }

    if (role === 'shop') {
      return '/shop/b2b/analytics';
    }

    return ad.ctaLink;
  };

  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const pairsCount = Math.ceil(b2bAds.length / 2);

  useEffect(() => {
    const adInterval = setInterval(() => {
      setCurrentPairIndex((prev) => (prev + 1) % pairsCount);
    }, 15000);
    return () => clearInterval(adInterval);
  }, [pairsCount]);

  const startIndex = currentPairIndex * 2;
  const activeAds = b2bAds.slice(startIndex, startIndex + 2);

  return (
    <section className="section-spacing bg-transparent pb-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <AnimatePresence mode="wait">
            {activeAds.map((ad, idx) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative"
              >
                <Card className="group/news relative flex min-h-[380px] items-center overflow-hidden rounded-xl border border-none border-white/5 bg-slate-900 shadow-2xl shadow-slate-200/50 transition-all">
                  <div className="absolute inset-0 z-0 overflow-hidden rounded-xl opacity-40 transition-transform duration-1000 group-hover/news:scale-105">
                    <img src={ad.imageUrl} className="h-full w-full object-cover" alt={ad.title} />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/60 to-transparent" />
                  </div>

                  <div className="relative z-10 flex h-full w-full flex-col space-y-6 p-3">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-600/20">
                          <ad.icon className="h-3.5 w-3.5 animate-pulse text-white" />
                        </div>
                        <Badge
                          variant="outline"
                          className="border-white/20 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                        >
                          {ad.badge}
                        </Badge>
                      </div>
                      <h2 className="text-base font-bold uppercase leading-none tracking-tight text-white">
                        {ad.title}
                      </h2>
                      <p className="max-w-sm text-sm font-medium leading-relaxed text-slate-300">
                        "{ad.description}"
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <Button
                        asChild
                        variant="cta"
                        size="ctaLg"
                        onClick={() => {
                          addB2bActivityLog({
                            type: 'view_product',
                            actor: { id: 'user-1', name: user?.name || 'User', type: 'retailer' },
                            target: { id: ad.id, name: ad.title, type: 'product' },
                            details: `Interacted with B2B update: ${ad.title}`,
                          });
                        }}
                        className="w-fit min-w-[200px] bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Link href={getUpdateLink(ad)}>
                          {ad.ctaText}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                      <div className="border-r-2 border-indigo-500/50 pr-4 text-right">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <p className="mb-1 text-[10px] font-bold uppercase leading-none tracking-wide text-indigo-400">
                                Status
                              </p>
                              <p className="cursor-help text-[10px] font-bold uppercase tabular-nums tracking-tight text-white">
                                {ad.status}
                              </p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            align="end"
                            className="z-[100] w-40 rounded-lg border border-white/10 bg-slate-900 p-2 text-right text-white shadow-2xl"
                          >
                            <p className="text-[10px] font-medium leading-tight">
                              Актуальный статус предложения.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          {Array.from({ length: pairsCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPairIndex(i)}
              className={cn(
                'rounded-full border border-slate-200 transition-all duration-500',
                currentPairIndex === i
                  ? 'h-2 w-8 bg-slate-900 shadow-md'
                  : 'h-2 w-2 bg-slate-200 hover:bg-slate-300'
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
