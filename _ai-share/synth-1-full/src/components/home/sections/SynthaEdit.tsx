'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ARTICLES = [
  {
    id: 1,
    title: '5 способов носить оверсайз этой весной',
    category: 'AI_EDITORIAL',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80',
    excerpt:
      'От многослойности до игры контрастов: наш AI-стилист разобрал главные подиумные тренды и адаптировал их для вашего гардероба.',
    readTime: '4 мин',
  },
  {
    id: 2,
    title: 'Эстетика Old Money: тихая роскошь в цифровой среде',
    category: 'TREND_ANALYSIS',
    image: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?w=1200&q=80',
    excerpt:
      'Почему минимализм снова на пике и как составить идеальную капсулу, которая будет выглядеть дорого без лишних логотипов.',
    readTime: '6 мин',
  },
];

export function SynthaEdit() {
  return (
    <div className="w-full">
      <div className="mb-12 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-text-primary flex h-8 w-8 items-center justify-center rounded-xl">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
              className="border-border-default text-text-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
            >
              SYNTHA_EDIT_VOL_01
            </Badge>
          </div>
          <div className="space-y-1">
            <h2 className="text-text-primary text-sm font-bold uppercase leading-tight tracking-tight md:text-base">
              AI Editorial
            </h2>
            <p className="text-text-secondary max-w-xl text-sm italic">
              "Ваш персональный глянец, где каждая статья написана специально для вашего стиля."
            </p>
          </div>
        </div>
        <Button variant="ctaOutline" size="ctaLg">
          Читать все статьи <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {ARTICLES.map((article, idx) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="group relative aspect-[16/9] cursor-pointer overflow-hidden rounded-xl shadow-2xl md:aspect-square lg:aspect-video"
          >
            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
              <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
              <div className="from-text-primary via-text-primary/20 absolute inset-0 bg-gradient-to-t to-transparent" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-end space-y-4 p-4 text-white md:p-4">
              <div className="flex items-center gap-3">
                <Badge className="border-none bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase text-white backdrop-blur-md">
                  {article.category}
                </Badge>
                <span className="text-[9px] font-bold uppercase tracking-wide text-white/60">
                  • {article.readTime} Чтения
                </span>
              </div>

              <h3 className="max-w-lg text-base font-bold uppercase leading-[0.9] tracking-tight md:text-sm">
                {article.title}
              </h3>

              <p className="text-text-muted line-clamp-2 max-w-md translate-y-4 transform text-sm opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:text-sm">
                {article.excerpt}
              </p>

              <div className="flex items-center gap-3 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:scale-110">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Читать статью
                </span>
              </div>
            </div>

            <div className="absolute right-8 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
              <Sparkles className="text-accent-primary h-5 w-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Editorial Banner */}
      <div className="bg-text-primary group/ebanner relative flex min-h-[300px] w-full items-center overflow-hidden rounded-xl shadow-2xl">
        <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/ebanner:scale-105">
          <img
            src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000"
            alt="Editorial Banner"
            className="h-full w-full object-cover grayscale"
          />
        </div>
        <div className="from-text-primary via-text-primary/80 absolute inset-0 bg-gradient-to-r to-transparent" />
        <div className="relative z-10 max-w-4xl space-y-6 p-4 text-white">
          <div className="space-y-2">
            <Badge className="bg-accent-primary border-none px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
              NEW_EDITION_READY
            </Badge>
            <h2 className="text-sm font-bold uppercase leading-tight tracking-tight md:text-base">
              СТАНЬТЕ ЧАСТЬЮ
              <br />
              FASHION-ИСТОРИИ
            </h2>
          </div>
          <p className="text-text-muted border-accent-primary/50 max-w-2xl border-l-2 pl-6 text-sm font-medium">
            "Подпишитесь на персональный дайджест. ИИ проанализирует ваши предпочтения и составит
            еженедельный журнал только про ваш стиль."
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              variant="ctaOutline"
              size="ctaLg"
              className="hover:bg-bg-surface2 hover:border-border-subtle border-white bg-white text-black hover:text-black"
            >
              Подписаться на журнал <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
