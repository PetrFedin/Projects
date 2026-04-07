'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ARTICLES = [
  {
    id: 1,
    title: "5 способов носить оверсайз этой весной",
    category: "AI_EDITORIAL",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80",
    excerpt: "От многослойности до игры контрастов: наш AI-стилист разобрал главные подиумные тренды и адаптировал их для вашего гардероба.",
    readTime: "4 мин"
  },
  {
    id: 2,
    title: "Эстетика Old Money: тихая роскошь в цифровой среде",
    category: "TREND_ANALYSIS",
    image: "https://images.unsplash.com/photo-1445205170230-053b830c6050?w=1200&q=80",
    excerpt: "Почему минимализм снова на пике и как составить идеальную капсулу, которая будет выглядеть дорого без лишних логотипов.",
    readTime: "6 мин"
  }
];

export function SynthaEdit() {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="text-[9px] border-slate-200 text-slate-900 uppercase font-bold tracking-wide px-2 py-0.5">
              SYNTHA_EDIT_VOL_01
            </Badge>
          </div>
          <div className="space-y-1">
            <h2 className="text-sm md:text-base font-bold uppercase tracking-tight text-slate-900 leading-tight">
              AI Editorial
            </h2>
            <p className="text-slate-500 text-sm max-w-xl italic">
              "Ваш персональный глянец, где каждая статья написана специально для вашего стиля."
            </p>
          </div>
        </div>
        <Button variant="ctaOutline" size="ctaLg">
          Читать все статьи <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-12">
        {ARTICLES.map((article, idx) => (
          <motion.div 
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="group cursor-pointer relative aspect-[16/9] md:aspect-square lg:aspect-video rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            </div>

            <div className="absolute inset-0 p-4 md:p-4 flex flex-col justify-end text-white space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-white/20 backdrop-blur-md text-white border-none text-[10px] font-bold uppercase px-2.5 py-1">
                  {article.category}
                </Badge>
                <span className="text-[9px] font-bold text-white/60 uppercase tracking-wide">• {article.readTime} Чтения</span>
              </div>
              
              <h3 className="text-base md:text-sm font-bold uppercase tracking-tight leading-[0.9] max-w-lg">
                {article.title}
              </h3>
              
              <p className="text-slate-300 text-sm md:text-sm max-w-md line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                {article.excerpt}
              </p>

              <div className="pt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Читать статью</span>
              </div>
            </div>

            <div className="absolute top-4 right-8 h-12 w-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Editorial Banner */}
      <div className="bg-slate-900 rounded-xl overflow-hidden relative min-h-[300px] flex items-center shadow-2xl group/ebanner w-full">
        <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/ebanner:scale-105">
          <img 
            src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000" 
            alt="Editorial Banner" 
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        <div className="relative z-10 p-4 space-y-6 max-w-4xl text-white">
          <div className="space-y-2">
            <Badge className="bg-indigo-500 text-white border-none font-bold text-[9px] uppercase px-3 py-1 tracking-wide">
              NEW_EDITION_READY
            </Badge>
            <h2 className="text-sm md:text-base font-bold uppercase tracking-tight leading-tight">
              СТАНЬТЕ ЧАСТЬЮ<br/>FASHION-ИСТОРИИ
            </h2>
          </div>
          <p className="text-slate-300 text-sm font-medium border-l-2 border-indigo-500/50 pl-6 max-w-2xl">
            "Подпишитесь на персональный дайджест. ИИ проанализирует ваши предпочтения и составит еженедельный журнал только про ваш стиль."
          </p>
          <div className="pt-4 flex gap-3">
            <Button variant="ctaOutline" size="ctaLg" className="bg-white text-black border-white hover:bg-slate-100 hover:text-black hover:border-slate-100">
              Подписаться на журнал <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
