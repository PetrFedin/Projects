'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUIState } from '@/providers/ui-state';
import { useAuth } from '@/providers/auth-provider';

const heroAds = [
  {
    id: 'syntha-os',
    type: 'system',
    title: 'Syntha',
    subtitle: 'ИНТЕЛЛЕКТ СТИЛЯ',
    description: 'Интеллектуальная цифровая платформа для персонального стиля и шопинга.',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000',
    ctaText: 'К покупкам',
    ctaLink: '/search',
    isPaid: false,
  },
  {
    id: 'try-on',
    type: 'feature',
    title: 'VIRTUAL TRY-ON',
    subtitle: 'ЦИФРОВАЯ ПРИМЕРКА',
    description:
      'Примерьте коллекцию на свой 3D-аватар (XS-XXL) прямо сейчас. Идеальная посадка еще до покупки.',
    imageUrl: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=2000',
    ctaText: 'Попробовать',
    ctaLink: '/search',
    brandName: 'Syntha Tech',
    isPaid: true,
  },
  {
    id: 'ad-1',
    type: 'product',
    title: 'ШЕРСТЯНОЕ ПАЛЬТО',
    subtitle: 'ЛИМИТИРОВАННАЯ СЕРИЯ',
    description: 'Зимняя коллекция из премиальной шерсти. Безупречный крой и технологичное тепло.',
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=2000',
    ctaText: 'Купить сейчас',
    ctaLink: '/products/oversize-wool-coat',
    brandName: 'Syntha Premium',
    isPaid: true,
  },
];

const heroAdsB2B = [
  {
    id: 'syntha-os',
    type: 'system',
    title: 'SYNTHA OS 4.0',
    subtitle: 'GLOBAL B2B STANDARDS',
    description:
      'Интеллектуальная экосистема уровня JOOR и NuORDER: от виртуальных шоурумов до IoT-контроля фабрик.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000',
    ctaText: 'Панель управления',
    ctaLink: '/brand/dashboard',
    isPaid: false,
  },
  {
    id: 'b2b-fintech',
    type: 'role',
    title: 'FINTECH & ESCROW',
    subtitle: 'БЕЗОПАСНЫЕ ГЛОБАЛЬНЫЕ СДЕЛКИ',
    description:
      'Встроенный факторинг, эскроу-счета и Syntha Wallet. Ваша финансовая безопасность в каждой транзакции.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2000',
    ctaText: 'Управление финансами',
    ctaLink: '/brand/finance',
    isPaid: true,
  },
  {
    id: 'b2b-production-archive',
    type: 'role',
    title: 'PRODUCTION HUB',
    subtitle: 'ЦИФРОВОЙ АРХИВ И IoT',
    description:
      'Единое хранилище ТЗ, лекал и сертификатов для всех ваших фабрик с Live-мониторингом линий.',
    imageUrl: 'https://images.unsplash.com/photo-1558444479-c8f02e62156e?q=80&w=2000',
    ctaText: 'Контроль производства',
    ctaLink: '/factory/production',
    isPaid: true,
  },
  {
    id: 'b2b-commerce',
    type: 'role',
    title: 'COMMERCE 360',
    subtitle: 'VIRTUAL SHOWROOM & VMI',
    description:
      'Презентуйте коллекции в 3D и автоматически пополняйте стоки ритейлеров через Universal Retail API.',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000',
    ctaText: 'Открыть шоурум',
    ctaLink: '/brand/showroom',
    isPaid: true,
  },
];

export function AdvertisingSection() {
  const { viewRole } = useUIState();
  const { user } = useAuth();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const activeAds = viewRole === 'b2b' ? heroAdsB2B : heroAds;
  const currentAd = activeAds[currentAdIndex] || activeAds[0];

  useEffect(() => {
    const adInterval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % activeAds.length);
    }, 15000);
    return () => clearInterval(adInterval);
  }, [activeAds.length]);

  useEffect(() => {
    setCurrentAdIndex(0);
  }, [viewRole]);

  return (
    <section className="group/section relative overflow-hidden bg-white pb-3 pt-6">
      <div className="container relative mx-auto px-4">
        <div className="group/card relative flex h-[500px] items-center overflow-hidden rounded-xl border border-slate-100 bg-[#fcfcfc] shadow-2xl shadow-slate-200/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAdIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-0"
            >
              <img
                src={currentAd.imageUrl}
                alt={currentAd.title}
                className="duration-[30s] h-full w-full object-cover transition-transform group-hover/card:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 w-full max-w-full py-8 pl-6 pr-6 sm:py-10 sm:pl-10 sm:pr-8 md:py-12 md:pl-16 md:pr-12">
            <div className="max-w-4xl space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {viewRole === 'b2b' && (
                    <div className="flex items-center gap-2 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/20">
                      B2B
                    </div>
                  )}
                  {currentAd.subtitle && (
                    <span className="text-xs font-medium uppercase tracking-wider text-white/60 md:text-sm">
                      {currentAd.subtitle}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <h1
                    className={cn(
                      'text-3xl font-bold leading-[0.9] tracking-tight text-white md:text-5xl',
                      currentAd.type === 'system' ? '' : 'uppercase'
                    )}
                  >
                    {currentAd.title}
                  </h1>
                </div>
              </div>

              <div className="flex min-h-[80px] flex-col justify-center">
                {currentAd.description && (
                  <p className="max-w-2xl border-l-2 border-indigo-500/50 pl-6 text-sm font-medium leading-relaxed text-slate-300">
                    "{currentAd.description}"
                  </p>
                )}
              </div>

              <div className="flex pt-4">
                <Button asChild variant="cta" size="ctaLg" className="w-fit min-w-[200px]">
                  <Link
                    href={
                      currentAd.ctaText === 'Панель управления'
                        ? user?.roles?.includes('admin')
                          ? '/admin/home'
                          : user?.roles?.includes('brand')
                            ? '/brand'
                            : user?.roles?.includes('shop')
                              ? '/shop/b2b'
                              : user?.roles?.includes('distributor')
                                ? '/distributor'
                                : user?.roles?.includes('manufacturer')
                                  ? '/factory'
                                  : user?.roles?.includes('supplier')
                                    ? '/factory'
                                    : '/brand'
                        : currentAd.id === 'b2b-fintech'
                          ? '/brand/finance'
                          : currentAd.id === 'b2b-production-archive'
                            ? '/factory/production'
                            : currentAd.id === 'b2b-commerce'
                              ? '/brand/showroom'
                              : currentAd.id === 'b2b-distributors'
                                ? '/distributor'
                                : currentAd.id === 'b2b-suppliers'
                                  ? '/factory/materials'
                                  : currentAd.id === 'b2b-production'
                                    ? '/factory/production'
                                    : currentAd.ctaLink
                    }
                    className="flex items-center gap-2"
                  >
                    {currentAd.ctaText}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 z-20 flex max-w-[min(100%,calc(100%-1rem))] flex-col items-end gap-2 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8">
            <div className="flex items-center gap-3">
              {activeAds.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentAdIndex(i)}
                  className={cn(
                    'rounded-full border border-white/10 transition-all duration-500',
                    currentAdIndex === i
                      ? 'h-3 w-3 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                      : 'h-2 w-2 bg-white/30 hover:bg-white/50'
                  )}
                />
              ))}
            </div>
            <div className="flex cursor-default items-center gap-2 opacity-40 transition-opacity hover:opacity-100">
              <div className="h-1 w-1 animate-pulse rounded-full bg-white" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-white">
                {viewRole === 'b2b' ? 'ENTERPRISE_CORE_v4.0' : 'HERO_ENGINE_v2.8'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
