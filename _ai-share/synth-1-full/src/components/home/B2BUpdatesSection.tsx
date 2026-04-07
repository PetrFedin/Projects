"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BarChart3, Wallet, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useUIState } from "@/providers/ui-state";
import { useB2BState } from "@/providers/b2b-state";
import { type B2BRole } from "./_fixtures/b2b-data";

const b2bAds = [
  {
    id: "update-1",
    badge: "RETAIL_API_SYNC",
    title: "Universal Retail API",
    description: "Мгновенная синхронизация с 1С, МойСклад, SAP и Shopify. Забудьте о ручном вводе остатков — Syntha OS станет «клеем» для всех ваших систем.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000",
    ctaText: "Подключить системы",
    ctaLink: "/dashboard/commerce/api-hub",
    icon: Sparkles,
    status: "Active: 1C / MoySklad"
  },
  {
    id: "update-2",
    badge: "PRODUCTION_ARCHIVE",
    title: "Archive Hub Pro",
    description: "«Единый источник правды» для бренда и фабрики. Храните все версии ТЗ, лекал и сертификатов в одном защищенном цифровом архиве.",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000",
    ctaText: "Открыть архив",
    ctaLink: "/dashboard/production/archive",
    icon: Wallet,
    status: "Single Source of Truth"
  },
  {
    id: "update-3",
    badge: "FINTECH_WALLET_BENEFITS",
    title: "Wallet & Yield Hub",
    description: "Получайте кэшбэк и бонусы за ранние оплаты фабрикам через внутренний кошелек Syntha. Ваша финансовая выгода в каждом клике.",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1000",
    ctaText: "Смотреть выгоду",
    ctaLink: "/dashboard/fintech/wallet",
    icon: BarChart3,
    status: "Cashback & Yield Active"
  },
  {
    id: "update-4",
    badge: "AI_ASSORTMENT_STRATEGY",
    title: "AI-Assortment Optimizer",
    description: "Система анализирует тренды региона и советует, что именно закупать. Минимум остатков — максимум прибыли на основе данных.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=1000",
    ctaText: "Оптимизировать заказ",
    ctaLink: "/dashboard/commerce/ai-assortment",
    icon: TrendingUp,
    status: "Strategic AI Advice"
  }
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

  const getUpdateLink = (ad: typeof b2bAds[0]) => {
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
      setCurrentPairIndex(prev => (prev + 1) % pairsCount);
    }, 15000);
    return () => clearInterval(adInterval);
  }, [pairsCount]);

  const startIndex = currentPairIndex * 2;
  const activeAds = b2bAds.slice(startIndex, startIndex + 2);

  return (
    <section className="section-spacing bg-transparent pb-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                <Card className="bg-slate-900 border-none rounded-xl shadow-2xl shadow-slate-200/50 relative transition-all min-h-[380px] flex items-center border border-white/5 group/news overflow-hidden">
                  <div className="absolute inset-0 z-0 opacity-40 transition-transform duration-1000 group-hover/news:scale-105 rounded-xl overflow-hidden">
                    <img 
                      src={ad.imageUrl} 
                      className="w-full h-full object-cover"
                      alt={ad.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/60 to-transparent" />
                  </div>
                  
                  <div className="relative z-10 p-3 space-y-6 w-full flex flex-col h-full">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                          <ad.icon className="h-3.5 w-3.5 text-white animate-pulse" />
                        </div>
                        <Badge variant="outline" className="text-[10px] border-white/20 text-white bg-white/5 uppercase font-bold tracking-wide px-2 py-0.5">
                          {ad.badge}
                        </Badge>
                      </div>
                      <h2 className="text-base font-bold uppercase tracking-tight leading-none text-white">
                        {ad.title}
                      </h2>
                      <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-sm">
                        "{ad.description}"
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 mt-auto">
                      <Button 
                        asChild 
                        variant="cta"
                        size="ctaLg"
                        onClick={() => {
                          addB2bActivityLog({
                            type: 'view_product',
                            actor: { id: 'user-1', name: user?.name || 'User', type: 'retailer' },
                            target: { id: ad.id, name: ad.title, type: 'product' },
                            details: `Interacted with B2B update: ${ad.title}`
                          });
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 min-w-[200px] w-fit"
                      >
                        <Link href={getUpdateLink(ad)}>
                          {ad.ctaText}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                      <div className="text-right border-r-2 border-indigo-500/50 pr-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide leading-none mb-1">Status</p>
                              <p className="text-[10px] font-bold text-white uppercase tabular-nums tracking-tight cursor-help">{ad.status}</p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="end" className="bg-slate-900 text-white p-2 rounded-lg shadow-2xl border border-white/10 w-40 text-right z-[100]">
                            <p className="text-[10px] font-medium leading-tight">Актуальный статус предложения.</p>
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
        
        <div className="flex justify-center gap-3 mt-8">
          {Array.from({ length: pairsCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPairIndex(i)}
              className={cn(
                "rounded-full transition-all duration-500 border border-slate-200",
                currentPairIndex === i
                  ? "h-2 w-8 bg-slate-900 shadow-md"
                  : "h-2 w-2 bg-slate-200 hover:bg-slate-300"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
