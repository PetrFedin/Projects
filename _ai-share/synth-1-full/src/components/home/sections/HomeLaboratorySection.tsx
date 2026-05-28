'use client';

import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const KickstarterSection = dynamic(() => import('@/components/kickstarter-section'), {
  ssr: false,
});
const PrivateAccess = dynamic(
  () =>
    import('@/components/home/sections/PrivateAccess').then((m) => ({ default: m.PrivateAccess })),
  { ssr: false }
);

/** Лаборатория B2C — framer-motion + Kickstarter/PrivateAccess в отдельном chunk. */
export function HomeLaboratorySection() {
  const [laboratoryTab, setLaboratoryTab] = useState<'laboratory' | 'private'>('laboratory');
  return (
    <section id="LABORATORY_b2c" className="section-spacing relative scroll-mt-24 bg-transparent">
      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
        <Card className="border-border-subtle relative overflow-hidden rounded-xl border border-none bg-white shadow-2xl shadow-md">
          <CardContent className="relative z-10 p-4">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-bg-surface2 flex h-8 w-8 items-center justify-center rounded-xl">
                    <Zap className="h-4 w-4 text-black" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-border-default text-text-primary px-2 py-0.5 text-xs font-semibold uppercase tracking-wide"
                  >
                    {laboratoryTab === 'laboratory' ? 'LABORATORY_B2C' : 'PRIVATE_ACCESS'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h2 className="text-text-primary text-2xl font-bold uppercase leading-tight tracking-tight md:text-4xl">
                    {laboratoryTab === 'laboratory' ? 'ЛАБОРАТОРИЯ' : 'ЭКСКЛЮЗИВ'}
                  </h2>
                  <p className="text-text-secondary max-w-xl text-sm">
                    {laboratoryTab === 'laboratory'
                      ? 'Площадка для реализации самых смелых fashion-идей.'
                      : 'Закрытый доступ к прототипам и лимитированным сериям.'}
                  </p>
                </div>

                <div className="bg-bg-surface2 border-border-subtle flex w-fit items-center gap-1.5 rounded-2xl border p-1">
                  {[
                    { id: 'laboratory', title: 'Лаборатория' },
                    { id: 'private', title: 'Эксклюзив' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setLaboratoryTab(tab.id as 'laboratory' | 'private')}
                      className={cn(
                        'btn-tab min-w-[140px] snap-start',
                        laboratoryTab === tab.id ? 'btn-tab-active' : 'btn-tab-inactive'
                      )}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="text-text-muted hover:text-text-primary p-1 transition-colors"
                  onClick={() =>
                    document
                      .getElementById(
                        laboratoryTab === 'laboratory'
                          ? 'laboratory-scroll'
                          : 'private-access-scroll'
                      )
                      ?.scrollBy({ left: -400, behavior: 'smooth' })
                  }
                >
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <button
                  type="button"
                  className="text-text-muted hover:text-text-primary p-1 transition-colors"
                  onClick={() =>
                    document
                      .getElementById(
                        laboratoryTab === 'laboratory'
                          ? 'laboratory-scroll'
                          : 'private-access-scroll'
                      )
                      ?.scrollBy({ left: 400, behavior: 'smooth' })
                  }
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {laboratoryTab === 'laboratory' ? (
                <motion.div
                  key="laboratory"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <KickstarterSection />
                </motion.div>
              ) : (
                <motion.div
                  key="private"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <PrivateAccess />
                </motion.div>
              )}
            </AnimatePresence>

            <Card className="bg-text-primary group/banner relative mt-12 flex min-h-[300px] w-full items-center overflow-hidden rounded-xl border-none shadow-2xl">
              <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/banner:scale-105">
                <img
                  src={
                    laboratoryTab === 'laboratory'
                      ? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000'
                      : 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000'
                  }
                  alt="Laboratory Banner"
                  className="h-full w-full object-cover grayscale"
                />
              </div>
              <div className="from-text-primary via-text-primary/80 absolute inset-0 bg-gradient-to-r to-transparent" />
              <CardContent className="relative z-10 w-full max-w-4xl space-y-4 p-4 text-left text-white">
                <div className="group/marquee relative mb-4 overflow-hidden whitespace-nowrap border-y border-white/10 py-2">
                  <motion.div
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                    className="flex w-fit items-center gap-3"
                  >
                    {[1, 2].map((i) => (
                      <div key={i} className="flex shrink-0 items-center gap-3">
                        {laboratoryTab === 'laboratory' ? (
                          <>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                              • Краудфандинг
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                              • Предзаказ
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                              • Лимитированный тираж
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                              • Дизайн-лаборатория
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                              • Прототип
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                              • Эксклюзивный доступ
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                              • VIP Прототипы
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                              • Style Icon Only
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                              • Private Drop
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                              • Ранний доступ
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold uppercase leading-tight tracking-tight md:text-3xl">
                    {laboratoryTab === 'laboratory' ? 'КРАУДФАНДИНГ' : 'ПРОВЕРИТЬ МОЙ СТАТУС'}
                  </h2>
                  <p className="text-text-muted border-accent-primary/50 border-l-2 pl-6 text-sm font-medium">
                    {laboratoryTab === 'laboratory'
                      ? '"Площадка для реализации самых смелых fashion-идей."'
                      : '"Пользователи с уровнем лояльности \'Style Icon\' получают доступ к дропам на 48 часов раньше всех."'}
                  </p>
                  <div className="flex pt-4">
                    <Button asChild variant="cta" size="ctaLg" className="w-fit min-w-[200px]">
                      <Link
                        href={laboratoryTab === 'laboratory' ? '/kickstarter' : '/loyalty'}
                        className="flex items-center gap-2"
                      >
                        {laboratoryTab === 'laboratory' ? 'Все проекты' : 'Повысить статус'}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
