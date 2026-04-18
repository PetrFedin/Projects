'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Heart,
  Star,
  Share2,
  Eye,
  MousePointerClick,
  MessageSquare,
  ThumbsUp,
  ImageIcon,
  ArrowLeft,
  TrendingUp,
  BarChart3,
  Activity,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';

/** Mock данные для графиков */
const MOCK_FOLLOWERS = [
  11800, 12000, 12200, 12500, 12700, 12900, 13100, 13300, 13500, 13800, 14000, 14200, 14500, 14700,
  14900, 15100, 15200,
];
const MOCK_LIKES = [320, 380, 410, 450, 520, 580, 620, 680, 710, 750, 820, 890, 920, 950, 1020];
const MOCK_FAVORITES = [180, 195, 210, 225, 240, 255, 270, 285, 300, 320];
const MOCK_LOOKS = [45, 52, 58, 65, 72, 78, 85, 90, 95, 102];
const MOCK_CLICKS = [1250, 1380, 1520, 1680, 1850, 1920, 2100];

export default function BrandCustomerActivityPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6 pb-24">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/brand">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold uppercase">
              <Activity className="h-5 w-5" /> Активность клиентов
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Подписчики, лайки, избранное, образы, метрики вовлечённости с профилем бренда
            </p>
          </div>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'rounded px-3 py-1.5 text-[10px] font-bold uppercase',
                period === p
                  ? 'bg-white text-slate-900 shadow'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {p === '7d' ? '7 дней' : p === '30d' ? '30 дней' : '90 дней'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI карточки */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {[
          { label: 'Подписчики', value: '15 200', change: '+4.2%', icon: Users, color: 'indigo' },
          { label: 'Лайки', value: '1 020', change: '+12%', icon: Heart, color: 'rose' },
          { label: 'В избранное', value: '320', change: '+8%', icon: Star, color: 'amber' },
          {
            label: 'Образы созданы',
            value: '102',
            change: '+15%',
            icon: ImageIcon,
            color: 'emerald',
          },
          { label: 'Пересылки', value: '245', change: '+6%', icon: Share2, color: 'blue' },
          { label: 'Просмотры', value: '42.1K', change: '+9%', icon: Eye, color: 'slate' },
        ].map((k) => (
          <Card key={k.label} className="border-slate-200">
            <CardContent className="p-4">
              <div className="mb-1 flex items-center gap-2 text-slate-500">
                <k.icon className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{k.label}</span>
              </div>
              <p className="text-lg font-black text-slate-900">{k.value}</p>
              <p className="text-[10px] font-bold text-emerald-600">{k.change} за период</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engagement" className="gap-2">
            Вовлечённость
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2">
            Контент и товары
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            Социальная активность
          </TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" /> Динамика подписчиков
                </CardTitle>
                <CardDescription>Рост за выбранный период</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-32 items-end gap-0.5">
                  {MOCK_FOLLOWERS.map((v, i) => (
                    <div
                      key={i}
                      className="min-h-[4px] flex-1 rounded-t bg-indigo-500/80 hover:bg-indigo-500"
                      style={{
                        height: `${20 + (v / MOCK_FOLLOWERS[MOCK_FOLLOWERS.length - 1]) * 80}%`,
                      }}
                      title={`${v}`}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                  <span>{MOCK_FOLLOWERS[0].toLocaleString('ru-RU')}</span>
                  <span>{MOCK_FOLLOWERS[MOCK_FOLLOWERS.length - 1].toLocaleString('ru-RU')}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Heart className="h-4 w-4" /> Лайки и избранное
                </CardTitle>
                <CardDescription>Активность по дням</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-32 items-end gap-1">
                  {MOCK_LIKES.map((v, i) => (
                    <div
                      key={i}
                      className="min-h-[4px] flex-1 rounded-t bg-rose-500/80"
                      style={{ height: `${(v / 1020) * 100}%` }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded bg-rose-500" /> Лайки
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded bg-amber-500" /> В избранное
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MousePointerClick className="h-4 w-4" /> Клики и переходы
              </CardTitle>
              <CardDescription>
                Взаимодействие с товарами, медиа-контентом, профилем бренда
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: 'Клики на товары', value: '8 420', icon: MousePointerClick },
                  { label: 'Просмотры медиа', value: '24.5K', icon: ImageIcon },
                  { label: 'Переходы в каталог', value: '3 120', icon: BarChart3 },
                  { label: 'Клики на «Купить»', value: '1 840', icon: TrendingUp },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <m.icon className="mb-2 h-4 w-4 text-slate-400" />
                    <p className="text-[10px] font-bold uppercase text-slate-500">{m.label}</p>
                    <p className="text-lg font-black text-slate-900">{m.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Товары в контенте</CardTitle>
              <CardDescription>
                Использование товаров в образах, UGC, медиа — просмотры и клики
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Свитер оверсайз', views: 2450, likes: 89, inLooks: 34 },
                  { name: 'Брюки карго', views: 1890, likes: 72, inLooks: 28 },
                  { name: 'Куртка ветровка', views: 3200, likes: 145, inLooks: 52 },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3"
                  >
                    <span className="font-medium">{p.name}</span>
                    <div className="flex gap-4 text-sm text-slate-500">
                      <span>{p.views} просмотр.</span>
                      <span>{p.likes} лайков</span>
                      <span>{p.inLooks} в образах</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Комментарии и оценки
              </CardTitle>
              <CardDescription>Обратная связь, рейтинги, отзывы</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: 'Комментарии', value: '428' },
                  { label: 'Средний рейтинг', value: '4.8' },
                  { label: 'Ответы бренда', value: '312' },
                  { label: 'Отзывы с фото', value: '156' },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase text-slate-500">{m.label}</p>
                    <p className="text-lg font-black text-slate-900">{m.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/brand">Назад к профилю</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={ROUTES.brand.customers}>CRM и клиенты</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={ROUTES.brand.customerIntelligence}>Customer Intelligence</Link>
        </Button>
      </div>
    </div>
  );
}
