'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type ShowroomSectionBannerProps = {
  viewRole: string;
  showroomTab: string;
};

/** Showroom promo banner — framer-motion в отдельном chunk от ShowroomSection shell. */
export function ShowroomSectionBanner({ viewRole, showroomTab }: ShowroomSectionBannerProps) {
  return (
    <Card className="bg-text-primary group/banner relative mt-6 flex min-h-[300px] w-full items-center overflow-hidden rounded-xl border-none shadow-2xl">
      <AnimatePresence>
        <motion.div
          key={showroomTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/banner:scale-105">
            <img
              src={
                showroomTab === 'all'
                  ? 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000'
                  : showroomTab === 'outlet'
                    ? 'https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=2000'
                    : showroomTab === 'kickstarter'
                      ? 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2000'
                      : showroomTab === 'new_collections'
                        ? 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000'
                        : 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=2000'
              }
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="from-text-primary via-text-primary/80 absolute inset-0 bg-gradient-to-r to-transparent" />
        </motion.div>
      </AnimatePresence>

      <CardContent className="relative z-10 w-full max-w-4xl space-y-4 p-4 text-white">
        <div className="group/marquee relative mb-4 overflow-hidden whitespace-nowrap border-y border-white/10 py-2">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            className="flex w-fit items-center gap-3"
          >
            {[1, 2].map((i) => (
              <div key={i} className="flex shrink-0 items-center gap-3">
                {showroomTab === 'outlet' ? (
                  <>
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">
                      • Специальные цены
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">
                      • Редкие модели
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">
                      • Доступ к архивам
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">
                      • Последний размер
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">
                      • Дизайнерский сток
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">
                      • Новинки
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">
                      • Хиты продаж
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">
                      • Премиальное качество
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">
                      • Эксклюзивные коллекции
                    </span>
                  </>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        <AnimatePresence>
          <motion.div
            key={showroomTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold uppercase leading-tight tracking-tight md:text-4xl">
              {showroomTab === 'all' && 'МАРКЕТРУМ'}
              {showroomTab === 'outlet' && 'АРХИВ'}
              {showroomTab === 'kickstarter' && 'КРАУДФАНДИНГ'}
              {showroomTab === '3d_fitting' && 'ЦИФРОВАЯ ПРИМЕРКА'}
            </h2>
            <p className="text-text-muted border-accent-primary/50 whitespace-nowrap border-l-2 pl-6 text-sm font-medium">
              {showroomTab === 'all' &&
                (viewRole === 'b2b'
                  ? '"Ваш надежный фундамент для стабильного развития"'
                  : '"Ваш идеальный образ начинается здесь: лучшие коллекции в цифровом формате"')}
              {showroomTab === 'outlet' &&
                '"Эксклюзивный доступ к коллекциям прошлых сезонов по специальным ценам"'}
              {showroomTab === 'kickstarter' &&
                (viewRole === 'b2b'
                  ? '"Умное производство и коллективный заказ"'
                  : '"Инвестируйте в уникальный стиль: поддержите запуск новинок по специальным ценам"')}
              {showroomTab === '3d_fitting' && '"Интерактивная визуализация товаров"'}
            </p>
            {viewRole !== 'b2b' && (
              <div className="flex pt-4">
                <Button asChild variant="cta" size="ctaLg" className="w-fit min-w-[200px]">
                  <Link
                    href={
                      showroomTab === 'all'
                        ? '/search'
                        : showroomTab === 'outlet'
                          ? '#showroom-scroll'
                          : showroomTab === 'kickstarter'
                            ? '/kickstarter'
                            : '/3d-viewer'
                    }
                    className="flex items-center gap-2"
                  >
                    {showroomTab === 'all' && 'Смотреть все'}
                    {showroomTab === 'outlet' && 'Смотреть все'}
                    {showroomTab === 'kickstarter' && 'Поддержать запуск'}
                    {showroomTab === '3d_fitting' && 'Начать экспертизу'}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
