'use client';

import React, { useState } from 'react';
import {
  RefreshCcw,
  Leaf,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Zap,
  Smartphone,
  Globe,
  ShieldCheck,
  History,
  Recycle,
  Trash2,
  Heart,
  Award,
  Sparkles,
  ChevronRight,
  Box,
  DollarSign,
  Gem,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import Link from 'next/link';

const MOCK_RETURNABLE = [
  {
    id: 'r1',
    name: 'Urban Tech Parka',
    purchased: 'Янв 2024',
    status: 'returnable',
    tokens: 4500,
    collateral: 12500,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200',
  },
  {
    id: 'r2',
    name: 'Graphite Trousers',
    purchased: 'Май 2024',
    status: 'returnable',
    tokens: 1200,
    collateral: 4800,
    image: 'https://images.unsplash.com/photo-1624372927054-66634eabb591?w=200',
  },
];

export function CircularHub() {
  const [activeTab, setActiveTab] = useState<'return' | 'tokens'>('return');

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
      <CardHeader className="bg-emerald-900 p-3 pb-4 text-white">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
              <Recycle className="h-6 w-6 text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                Circular Economy Hub
              </span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">
              Вторая жизнь вещей
            </CardTitle>
            <CardDescription className="font-medium text-emerald-100/60">
              Ваш гардероб — это актив. Управляйте ликвидностью через программы апсайклинга и
              залогового кредитования.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                Ликвидность гардероба
              </p>
              <h4 className="text-base font-black tabular-nums text-white">
                17,300 <span className="text-sm uppercase opacity-40">₽</span>
              </h4>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                Ваш баланс
              </p>
              <h4 className="text-base font-black tabular-nums text-white">
                8,450 <span className="text-sm uppercase opacity-40">Tokens</span>
              </h4>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-10 p-3 pt-10">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* Action Area */}
          <div className="space-y-4 lg:col-span-8">
            <div className="flex items-center justify-between">
              <h4 className="text-text-muted text-[11px] font-black uppercase tracking-widest">
                Вещи, готовые к возврату
              </h4>
              <Badge className="bg-bg-surface2 text-text-secondary border-none text-[8px] font-black uppercase">
                Основано на цифровом паспорте
              </Badge>
            </div>

            <div className="space-y-4">
              {MOCK_RETURNABLE.map((item) => (
                <div
                  key={item.id}
                  className="bg-bg-surface2 border-border-subtle group flex items-center justify-between rounded-xl border p-4 transition-all hover:bg-white hover:shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="border-border-subtle relative h-20 w-12 overflow-hidden rounded-2xl border shadow-sm">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 h-full w-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Recycle className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-text-primary text-sm font-black uppercase tracking-tight">
                        {item.name}
                      </h5>
                      <p className="text-text-muted text-[10px] font-bold uppercase tracking-tighter">
                        Куплено: {item.purchased}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge className="border-none bg-emerald-100 px-2 text-[8px] font-black uppercase text-emerald-700">
                          +{item.tokens} Tokens
                        </Badge>
                        <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 flex items-center gap-1.5 rounded border px-2 py-0.5 text-[8px] font-black">
                          <DollarSign className="h-2 w-2" />
                          <span>{item.collateral.toLocaleString('ru-RU')} ₽ залог</span>
                        </div>
                        <span className="text-text-muted text-[9px] font-bold uppercase">
                          Оценка AI: Good
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-border-subtle hover:bg-bg-surface2 h-12 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest"
                    >
                      Апсайклинг
                    </Button>
                    <Button className="h-12 rounded-2xl bg-emerald-900 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-emerald-800">
                      Сдать на переработку
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-text-primary relative flex items-center justify-between overflow-hidden rounded-xl p-4 text-white">
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <TrendingUp className="text-accent-primary h-32 w-32" />
              </div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="bg-accent-primary flex h-12 w-12 items-center justify-center rounded-3xl shadow-2xl">
                  <Gem className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-black uppercase tracking-tighter">
                    Wardrobe Credit Line
                  </h4>
                  <p className="text-xs font-medium text-white/60">
                    Ваш гардероб позволяет разблокировать лимит до{' '}
                    <span className="text-accent-primary font-black">45,000 ₽</span>.
                  </p>
                </div>
              </div>
              <Button
                className="text-text-primary relative z-10 h-12 rounded-xl bg-white px-6 text-[9px] font-black uppercase tracking-widest shadow-2xl"
                asChild
              >
                <Link href="/wallet">Активировать в кошельке</Link>
              </Button>
            </div>
          </div>

          {/* Stats & Info Sidebar */}
          <div className="space-y-4 lg:col-span-4">
            <div className="space-y-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-emerald-900">
                <Sparkles className="h-5 w-5" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">
                  Как это работает?
                </h4>
              </div>
              <div className="space-y-6">
                {[
                  {
                    step: '1',
                    title: 'Сканируйте бирку',
                    desc: 'Цифровой паспорт подтвердит состав и оригинальность.',
                  },
                  {
                    step: '2',
                    title: 'Выберите способ',
                    desc: 'Апсайклинг для вещей в хорошем состоянии или ресайкл.',
                  },
                  {
                    step: '3',
                    title: 'Получите выгоду',
                    desc: 'Токены Syntha эквивалентны рублям при покупке новых коллекций.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-white text-[10px] font-black text-emerald-600">
                      {item.step}
                    </span>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase leading-none text-emerald-900">
                        {item.title}
                      </p>
                      <p className="text-[9px] font-medium leading-relaxed text-emerald-700/70">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-border-subtle space-y-6 rounded-xl border bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h4 className="text-text-primary text-[11px] font-black uppercase tracking-widest">
                  Ближайшие боксы
                </h4>
                <Globe className="text-accent-primary h-4 w-4" />
              </div>
              <div className="space-y-4">
                <div className="bg-bg-surface2 border-border-subtle rounded-2xl border p-4">
                  <p className="text-text-primary text-[10px] font-black uppercase">
                    Syntha HQ Moscow
                  </p>
                  <p className="text-text-muted mt-1 text-[9px] font-bold uppercase">
                    Петровка, 12 • 1.2 км
                  </p>
                </div>
                <div className="bg-bg-surface2 border-border-subtle rounded-2xl border p-4 opacity-50">
                  <p className="text-text-primary text-[10px] font-black uppercase">ЦУМ (Box #4)</p>
                  <p className="text-text-muted mt-1 text-[9px] font-bold uppercase">
                    Кузнецкий Мост • 2.4 км
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-accent-primary hover:text-accent-primary w-full text-[9px] font-black uppercase"
              >
                Показать на карте
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
